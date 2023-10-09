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
import SellersSchema from "../schemas/Sellers.schema";

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

  if (!data.type_user || data.type_user == "") {
    reponseJson.code = 400;
    reponseJson.message = "typo de usuario para crear requerido";
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

  if (!data.type_user || data.type_user == "") {
    reponseJson.code = 400;
    reponseJson.message = "typo de usuario para editar requerido";
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const user = await Users.findOne({ _id: data.id_user });
  let message = "";
  if (user) {
    if (decode.type_user == "admin") {
      if (data.type_user == "admin") {
        await addOrUpdateAdmin(data);
        message = `El usuario administrador fue modificado con exito`;
      } else if (data.type_user == "mechanic") {
        await addOrUpdateMechanic(data);
        message = `El usuario tecnico fue modificado con exito`;
      } else if (data.type_user == "seller") {
        await addOrUpdateSeller(data);
        message = `El usuario vendedor fue modificado con exito`;
      } else {
        message = `El usuario no se encuentra en ese rol`;
      }
      reponseJson.status = true;
      reponseJson.data = data;
    } else if (decode.type_user == "seller") {
      await addOrUpdateMechanic(data);
      message = `El usuario tecnico fue modificado con exito`;
      reponseJson.status = true;
      reponseJson.data = data;
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
  const token: any = req.header("Authorization");

  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);
  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  const data = req.body;

  const user = await Users.findOne({ _id: data.id_user });
  if (user) {
    if (user.type_user == "admin") {
      const ress = await Users.findOneAndDelete({ _id: user._id });
    } else if (user.type_user == "seller") {
      const userSeller = await sellers.findOneAndDelete({ id_user: user._id });
      const ress = await Users.findOneAndDelete({ _id: user._id });
    } else if (user.type_user == "mechanic") {
      const usermechanic = await mechanics.findOneAndDelete({
        id_user: user._id,
      });
      const ress = await Users.findOneAndDelete({ _id: user._id });
    } else {
      reponseJson.code = 400;
      reponseJson.message = "Tipo de usuario indefinido";
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
  } else {
    reponseJson.code = 400;
    reponseJson.message = "Usuario no encontrado";
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  reponseJson.code = 200;
  reponseJson.message = "Usuario borrado con exito";
  reponseJson.status = true;
  return res.json(reponseJson);
};

userController.get = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");

  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);
  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  const data = req.query;
  let sendata: any = {};
  let user: any;

  
  if (data.id_user) {
    user = await Users.findOne({ _id: data.id_user });
  } else if (data.email) {
    user = await Users.findOne({ email: data.email });
  }
  if (user) {
    sendata = {
      id_user: user?._id,
      email: user?.email,
      username: user?.username,
      type_user: user?.type_user,
    };
    if (user.type_user == "admin") {
      let ress = await Users.findOne({ _id: user._id });
      sendata = {
        id_user: ress?._id,
        email: ress?.email,
        username: ress?.username,
        type_user: ress?.type_user,
      };
    } else if (user.type_user == "seller") {
      let userSeller = await sellers.findOne({ id_user: user._id });
      sendata = {
        ...sendata,
        id_seller: userSeller?._id,
        fullName: userSeller?.fullName,
        city: userSeller?.city,
        concesionary: userSeller?.concesionary,
        date_created: userSeller?.date_created,
        phone: userSeller?.phone,
      };
    } else if (user.type_user == "mechanic") {
      let usermechanic = await mechanics.findOne({ id_user: user._id });
      sendata = {
        ...sendata,
        id_mechanic: usermechanic?._id,
        fullName: usermechanic?.fullName,
        city: usermechanic?.city,
        concesionary: usermechanic?.concesionary,
        date_created: usermechanic?.date_created,
        phone: usermechanic?.phone,
      };
    } else {
      reponseJson.code = 400;
      reponseJson.message = "Tipo de usuario indefinido";
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
  } else {
    reponseJson.code = 400;
    reponseJson.message = "Usuario no encontrado";
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  reponseJson.code = 200;
  reponseJson.message = "Usuario encontrado con exito";
  reponseJson.data = sendata;
  reponseJson.status = true;
  return res.json(reponseJson);
};

userController.all = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");

  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);
  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  let data: any = req.query;

  if (!data) {
    data = {
      s: "",
      pos: 0,
      lim: 10,
      type_user: "admin",
    };
  }
  let type_user_table = "admin";

  let sendata: any = {};
  let user: any;
  let search: any;
  let project: any;

  if (data.type_user == "seller") {
    type_user_table = "sellers";
    search = {
      $or: [
        { _id: { $regex: ".*" + data.s + ".*" } },
        { email: { $regex: ".*" + data.s + ".*" } },
        { username: { $regex: ".*" + data.s + ".*" } },
        { type_user: { $regex: ".*" + data.s + ".*" } },
        { "sellers._id": { $regex: ".*" + data.s + ".*" } },
        { "sellers.fullName": { $regex: ".*" + data.s + ".*" } },
        { "sellers.city": { $regex: ".*" + data.s + ".*" } },
        { "sellers.concesionary": { $regex: ".*" + data.s + ".*" } },
        { "sellers.date_created": { $regex: ".*" + data.s + ".*" } },
        { "sellers.phone": { $regex: ".*" + data.s + ".*" } },
      ],
      type_user: data.type_user,
    };

    project = {
      _id: "$_id",
      email: 1,
      username: 1,
      type_user: 1,
      "sellers._id": 1,
      "sellers.fullName": 1,
      "sellers.city": 1,
      "sellers.concesionary": 1,
      "sellers.date_created": 1,
      "sellers.phone": 1,
    };
  } else if (data.type_user == "mechanic") {
    type_user_table = "mechanics";
    search = {
      $or: [
        { _id: { $regex: ".*" + data.s + ".*" } },
        { email: { $regex: ".*" + data.s + ".*" } },
        { username: { $regex: ".*" + data.s + ".*" } },
        { type_user: { $regex: ".*" + data.s + ".*" } },

        { "mechanics._id": { $regex: ".*" + data.s + ".*" } },
        { "mechanics.fullName": { $regex: ".*" + data.s + ".*" } },
        { "mechanics.city": { $regex: ".*" + data.s + ".*" } },
        { "mechanics.concesionary": { $regex: ".*" + data.s + ".*" } },
        { "mechanics.date_created": { $regex: ".*" + data.s + ".*" } },
        { "mechanics.phone": { $regex: ".*" + data.s + ".*" } },
      ],
      type_user: data.type_user,
    };

    project = {
      _id: "$_id",
      email: 1,
      username: 1,
      type_user: 1,
      "mechanics._id": 2,
      "mechanics.fullName": 2,
      "mechanics.city": 2,
      "mechanics.concesionary": 2,
      "mechanics.date_created": 2,
      "mechanics.phone": 2,
    };
  } else if (data.type_user == "admin") {
    type_user_table = "users";

    search = {
      $or: [
        { _id: { $regex: ".*" + data.s + ".*" } },
        { email: { $regex: ".*" + data.s + ".*" } },
        { username: { $regex: ".*" + data.s + ".*" } },
        { type_user: { $regex: ".*" + data.s + ".*" } },
      ],
      type_user: data.type_user,
    };

    project = {
      _id: "$_id",
      email: 1,
      username: 1,
      type_user: 1,
    };
  }

  if (data.type_user == "admin") {
    let list = await Users.aggregate([
      {
        $match: search,
      },
      {
        $skip: parseInt(data.lim) * parseInt(data.pos),
      },
      {
        $limit: parseInt(data.lim),
      },

      {
        $project: project,
      },
    ]);

    sendata.rows = list;
    let count: any;

    if (list.length > 0) {
      count = await Users.aggregate([
        {
          $match: search,
        },
        {
          $count: "totalCount",
        },
      ]);
      reponseJson.code = 200;
      reponseJson.message = "Usuario encontrado con exito";
      reponseJson.status = true;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "sin resultado";
      reponseJson.status = true;
    }

    let totalItems = 0;
    if (count) {
      totalItems = count[0].totalCount;
    }
    let totalPages = Math.ceil(totalItems / data.lim);

    sendata.count = totalItems;
    sendata.pages = totalPages;
  } else {
    let list = await Users.aggregate([
      {
        $match: search,
      },
      {
        $lookup: {
          from: type_user_table,
          localField: "_id",
          foreignField: "id_user",
          as: type_user_table,
        },
      },
      {
        $unwind: `$${type_user_table}`,
      },
      {
        $skip: parseInt(data.lim) * parseInt(data.pos),
      },
      {
        $limit: parseInt(data.lim),
      },

      {
        $project: project,
      },
    ]);

    sendata.rows = list;
    let count: any;

    if (list.length > 0) {
      count = await Users.aggregate([
        {
          $match: search,
        },
        {
          $lookup: {
            from: type_user_table,
            localField: "_id",
            foreignField: "id_user",
            as: type_user_table,
          },
        },
        {
          $unwind: `$${type_user_table}`,
        },
        {
          $count: "totalCount",
        },
      ]);
      reponseJson.code = 200;
      reponseJson.message = "Usuario encontrado con exito";
      reponseJson.status = true;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "sin resultado";
      reponseJson.status = true;
    }

    let totalItems = 0;
    if (count) {
      totalItems = count[0].totalCount;
    }
    let totalPages = Math.ceil(totalItems / data.lim);

    sendata.count = totalItems;
    sendata.pages = totalPages;
  }

  reponseJson.data = sendata;
  return res.json(reponseJson);
};

userController.allMechanic = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);

  let mechanicsArray: any[] = [];

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const search = {
    type_user: "mechanic",
  };

  const query = await Users.aggregate([
    {
      $match: search,
    },
    {
      $lookup: {
        from: "mechanics",
        localField: "_id",
        foreignField: "id_user",
        as: "infoUser",
      },
    },
    { $sort: { date_created: -1 } },
  ]);

  if (query) {
    mechanicsArray = query.map((mech: any) => {
      let mecha = {
        _id: mech._id,
      };

      mechanicsArray.push(mecha);
    });

    reponseJson.code = 200;
    reponseJson.message = "Lista de mecanicos";
    reponseJson.status = true;
    reponseJson.data = query;
  } else {
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
  }

  return res.json(reponseJson);
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
