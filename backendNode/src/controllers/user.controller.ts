import { Request, Response } from "express";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import sellers from "../schemas/Sellers.schema";
import mechanics from "../schemas/Mechanics.schema";
import imgUser from "../schemas/imgUser.schema";
import bcrypt from "bcrypt";
import { deleteImageUser, uploadImageUser } from "../../cloudinaryMetods";
import jwt from "../helpers/generar-jwt";
import moment from "moment";
import { sendEmail } from "../../nodemailer";

const userController: any = {};

userController.insert = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);
  const data = req.body;

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const user = await Users.findOne({ email: data.email });
  let message = "";

  if (!user) {
    if (decode.type_user == "admin") {
      if (data.type_user == "admin") {
        let new_admin = await addOrUpdateAdmin(data);
        data.id_user = new_admin.id_user;
        message = `El usuario administrador fue creado con exito`;
      }

      if (data.type_user == "mechanic") {
        let newMechanic = await addOrUpdateMechanic(data);

        data.id_user = newMechanic.id_user;
        data.id_mechanic = newMechanic.id_mechanic;

        if (newMechanic) {
          const mailOptions = {
            from: "Toyousado",
            to: data.email,
            subject: "Bienvenido",
            text:
              "Bienvenido a Toyousado, tu usuario es: " +
              data.email +
              " y tu contraseña es: " +
              data.password +
              "",
          };

          await sendEmail(mailOptions);
        }
        message = `El usuario tecnico fue creado con exito`;
      }

      if (data.type_user == "seller") {
        let newSeller = await addOrUpdateSeller(data);
        data.id_user = newSeller.id_user;
        data.id_seller = newSeller.id_seller;

        message = `El usuario vendedor fue creado con exito`;
      }
    } else if (decode.type_user == "seller") {
      let newMechanic = await addOrUpdateMechanic(data);

      data.id_user = newMechanic.id_user;
      data.id_mechanic = newMechanic.id_mechanic;

      if (newMechanic) {
        const mailOptions = {
          from: "Toyousado",
          to: data.email,
          subject: "Bienvenido",
          text:
            "Bienvenido a Toyousado, tu usuario es: " +
            data.email +
            " y tu contraseña es: " +
            data.password +
            "",
        };

        await sendEmail(mailOptions);
      }
      message = `El usuario tecnico fue creado con exito`;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "Usuario sin perimiso";
      reponseJson.status = false;
    }

    reponseJson.code = 200;
    reponseJson.message = message;
    reponseJson.status = true;
    reponseJson.data = data;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "Usuario existente";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

userController.update = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);
  const data = req.body;
  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  if (!data.id_user || data.id_user == "") {
    reponseJson.code = 400;
    reponseJson.message = "id_user requerido";
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const user = await Users.findOne({ _id: data.id_user });
  let message = "";

  if (user) {
    if (decode.type_user == "admin") {
      if (data.type_user == user.type_user) {
        await addOrUpdateAdmin(data);
        message = `El usuario administrador fue modificado con exito`;
      } else if (data.type_user == user.type_user) {
        await addOrUpdateMechanic(data);
        message = `El usuario tecnico fue modificado con exito`;
      } else if (data.type_user == user.type_user) {
        await addOrUpdateSeller(data);
        message = `El usuario vendedor fue modificado con exito`;
      } else {
        message = `El usuario no se encuentra en ese rol`;
      }
      reponseJson.status = data;
    } else if (decode.type_user == "seller") {
      await addOrUpdateMechanic(data);
      message = `El usuario tecnico fue modificado con exito`;
      reponseJson.status = data;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "Usuario sin perimiso";
      reponseJson.status = false;
    }
    reponseJson.code = 200;
    reponseJson.message = message;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "Usuario no existente";
    reponseJson.status = false;
  }
  res.json(reponseJson);
};

userController.delete = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  reponseJson.code = 200;
      reponseJson.message = "";
      reponseJson.status = true;
};

userController.get = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
};

userController.all = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
};

async function addOrUpdateAdmin(data: any) {
  if (data.id_user) {
    const user = { _id: data.id_user };
    if (data.password != "") {
      const hash = await bcrypt.hash(data.password, 12);
      data.password = hash;
      await Users.findOneAndUpdate(user, data);
    } else {
      const userUpdate = { email: data.email, username: data.username };
      await Users.findOneAndUpdate(user, userUpdate);
    }
  } else {
    const hash = await bcrypt.hash(data.password, 12);
    const newUser = new Users({
      email: data.email,
      password: hash,
      username: data.username,
      type_user: "admin",
    });
    await newUser.save();
    data.id_user = newUser._id;
  }
  return data;
}

async function addOrUpdateSeller(data: any) {
  if (data.id_user) {
    const seller = { _id: data.id_seller };
    const user = { _id: data.id_user };
    if (data.password != "") {
      const hash = await bcrypt.hash(data.password, 12);
      data.password = hash;
      await Users.findOneAndUpdate(user, data);
    } else {
      const userUpdate = { email: data.email, username: data.username };
      await Users.findOneAndUpdate(user, userUpdate);
    }

    await sellers.findOneAndUpdate(seller, data);
  } else {
    const date_created = moment().format("YYYY-MM-DD");

    const hash = await bcrypt.hash(data.password, 12);
    const newUser = new Users({
      email: data.email,
      password: hash,
      username: data.username,
      type_user: "seller",
    });
    const newSeller = new sellers({
      fullName: data.fullName,
      city: data.city,
      concesionary: data.concesionary,
      date_created: date_created,
      phone: data.phone,
    });

    await newUser.save();

    newSeller.id_user = newUser._id;
    await newSeller.save();

    data.id_user = newUser._id;
    data.id_seller = newSeller._id;
  }
  return data;
}

async function addOrUpdateMechanic(data: any) {
  if (data.id_user) {
    const mechanic = { _id: data.id_mechanic };
    const user = { _id: data.id_user };

    if (data.password != "") {
      const hash = await bcrypt.hash(data.password, 12);
      data.password = hash;
      await Users.findOneAndUpdate(user, data);
    } else {
      const userUpdate = { email: data.email, username: data.username };
      await Users.findOneAndUpdate(user, userUpdate);
    }

    await mechanics.findOneAndUpdate(mechanic, data);
  } else {
    const date_created = moment().format("YYYY-MM-DD");

    const hash = await bcrypt.hash(data.password, 12);

    const newUser = new Users({
      email: data.email,
      password: hash,
      username: data.username,
      type_user: "mechanic",
    });

    const newMechanic = new mechanics({
      fullName: data.fullName,
      city: data.city,
      concesionary: data.concesionary,
      date_created: date_created,
    });

    await newUser.save();
    newMechanic.id_user = newUser._id;

    await newMechanic.save();

    data.id_user = newUser._id;
    data.id_mechanic = newMechanic._id;
  }
  return data;
}

export default userController;
