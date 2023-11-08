import { Request, Response } from "express";
import jwt from "../helpers/generar-jwt";
import bcrypt from "bcrypt";
import moment from "moment";
import mongoose from "mongoose";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import sellers from "../schemas/Sellers.schema";
import mechanics from "../schemas/Mechanics.schema";
import imgUser from "../schemas/imgUser.schema";
import { sendEmail } from "../../nodemailer";
import notifications from "../schemas/notifications.schema";
import concesionariesSchema from "../schemas/Concesionaries.schema";

const userController: any = {};

userController.insert = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, [
    "admin",
    "seller",
    "admin_concesionary",
  ]);
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
  let newUser: any = {};
  if (!user) {
    if (
      decode.type_user == "admin" ||
      decode.type_user == "admin_concesionary"
    ) {

      if (data.type_user == "admin") {

        newUser = await addOrUpdateUser(data);
        message = `El usuario administrador fue creado con exito`;
      } else if (data.type_user == "admin_concesionary") {  // admin creando un admin_concesionary
        let concesionario: any = await concesionariesSchema.findOne({
          _id: data.id_concesionary,
        });
        data.concesionary = concesionario.name;
        data.id_concesionary = concesionario._id;
        newUser = await addOrUpdateUser(data);
        message = `El usuario administrador de concesionario fue creado con exito`;
      }


      if (data.type_user == "mechanic") {
        if (decode.type_user == "admin_concesionary") { //admin_concesionary creando un usuario mechanic y asigandole su concesionario correspondiente
          let concesionario: any = await concesionariesSchema.findOne({
            _id: decode.id_concesionary,
          });
          data.concesionary = concesionario.name;
          data.id_concesionary = concesionario._id;
        }
        newUser = await addOrUpdateMechanic(data);
        message = `El usuario tecnico fue creado con exito`;
      }

      if (data.type_user == "seller") {
        if (decode.type_user == "admin_concesionary") { //admin_concesionary creando un usuario seller y asigandole su concesionario correspondiente
          let concesionario: any = await concesionariesSchema.findOne({
            _id: decode.id_concesionary,
          });
          data.concesionary = concesionario.name;
          data.id_concesionary = concesionario._id;
        }
        newUser = await addOrUpdateSeller(data);
        message = `El usuario vendedor fue creado con exito`;
      }

      data.id_user = newUser.id_user;
      if (newUser) {
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

    } else if (decode.type_user == "seller") {

      let newUser = await addOrUpdateMechanic(data);

      if (newUser) {
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
  let decode = await jwt.getAuthorization(token, [
    "admin",
    "seller",
    "admin_concesionary",
  ]);
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
    if (decode.type_user == "admin" || decode.type_user == "admin_concesionary") {
      if (data.type_user == "admin") {
        message = `El usuario administrador fue modificado con exito`;
        await addOrUpdateUser(data);
      } else if (data.type_user == "admin_concesionary") { // admin modificando un admin_concesionary
        message = `El usuario administrador de concesionario fue modificado con exito`;
        let concesionario: any = await concesionariesSchema.findOne({
          _id: data.id_concesionary,
        });
        data.concesionary = concesionario.name;
        data.id_concesionary = concesionario._id;
        await addOrUpdateUser(data);
      } else if (data.type_user == "mechanic") {
        if (decode.type_user == "admin_concesionary") { //admin_concesionary modificando un usuario mechanic y asigandole su concesionario correspondiente
          let concesionario: any = await concesionariesSchema.findOne({
            _id: decode.id_concesionary,
          });
          data.concesionary = concesionario.name;
          data.id_concesionary = concesionario._id;
        }
        await addOrUpdateMechanic(data);
        message = `El usuario tecnico fue modificado con exito`;
      } else if (data.type_user == "seller") {
        if (decode.type_user == "admin_concesionary") { //admin_concesionary modificando un usuario mechanic y asigandole su concesionario correspondiente
          let concesionario: any = await concesionariesSchema.findOne({
            _id: decode.id_concesionary,
          });
          data.concesionary = concesionario.name;
          data.id_concesionary = concesionario._id;
        }
        await addOrUpdateSeller(data);
        message = `El usuario vendedor fue modificado con exito`;
      } else {
        message = `El usuario no se encuentra en ese rol`;
      }

      await addOrUpdateUser(data);
      reponseJson.status = true;
      reponseJson.data = data;
    } else if (decode.type_user == "seller") {
      
      if (data.type_user == "mechanic") {
        message = `El usuario tecnico fue modificado con exito`;
        await addOrUpdateMechanic(data);
      } else {
        message = `No tiene permiso de modificar/agregar otro rol de usuario`;
        reponseJson.code = 400;
        reponseJson.status = false;
        return res.json(reponseJson);
      }
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
  return res.json(reponseJson);
};

userController.delete = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");

  let decode = await jwt.getAuthorization(token, [
    "admin",
    "seller",
    "admin_concesionary",
  ]);
  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  let data = req.body;
  data = {
    ...data,
    status: 0,
  };
  const user = await Users.findOne({ _id: data.id_user });

  if (user) {
    let userDetele = await deleteUser(data);
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

  let decode = await jwt.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
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
  let seller: any;
  let mechanic: any;

  if (data.id_user) {
    user = await Users.findOne({ _id: data.id_user });
  } else if (data.email) {
    user = await Users.findOne({ email: data.email });
  }
  const userImg = await imgUser.findOne({ id_user: user._id });

  if (user) {
    sendata = {
      id_user: user?._id,
      email: user?.email,
      username: user?.username,
      type_user: user?.type_user,
      img: userImg ? userImg : null,
    };
    if (user.type_user == "seller") {
      seller = await sellers.findOne({ id_user: user._id });
      sendata = {
        ...sendata,
        seller,
      };
    } else if (user.type_user == "mechanic") {
      mechanic = await mechanics.findOne({ id_user: user._id });
      sendata = {
        ...sendata,
        mechanic,
      };
    }else if(user.type_user == "admin_concesionary") {
      let concesionary: any = await concesionariesSchema.findOne({
        _id: user.id_concesionary,
      });
      sendata = {
        ...sendata,
        id_concesionary: user?.id_concesionary ? user?.id_concesionary : null,
        concesionary
      }
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
  let decode = await jwt.getAuthorization(token, ["admin", "admin_concesionary"]);
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

  if (data.type_user == "seller") {
    type_user_table = "sellers";
  } else if (data.type_user == "mechanic") {
    type_user_table = "mechanics";
  } else if (
    data.type_user == "admin_concesionary" ||
    data.type_user == "admin"
  ) {
    type_user_table = "users";
  }

  let sendata: any = {};
  let search: any;
  let project: any;
  search = {
    $or: [
      { email: { $regex: data.s, $options: "i" } },
      { username: { $regex: data.s, $options: "i" } },
      { type_user: { $regex: data.s, $options: "i" } },
      {
        [`${type_user_table}.fullName`]: {
          $regex: ".*" + data.s + ".*",
          $options: "i",
        },
      },
      {
        [`${type_user_table}.city`]: {
          $regex: ".*" + data.s + ".*",
          $options: "i",
        },
      },
      {
        [`${type_user_table}.concesionary`]: {
          $regex: ".*" + data.s + ".*",
          $options: "i",
        },
      },
      {
        [`${type_user_table}.date_created`]: {
          $regex: ".*" + data.s + ".*",
          $options: "i",
        },
      },
      {
        [`${type_user_table}.phone`]: {
          $regex: ".*" + data.s + ".*",
          $options: "i",
        },
      },
    ],
    type_user: data.type_user,
  };

  if (decode.type_user == "admin_concesionary") { // cuando el usuario admin_concesionary consulta
    let concesionary: any = await concesionariesSchema.findOne({
      _id: decode.id_concesionary,
    });
    search = {
      ...search,
      [`${type_user_table}.concesionary`]: {
        $regex: ".*" + concesionary.name + ".*",
        $options: "i",
      }
    }
  }

  project = {
    id_user: "$_id",
    email: 1,
    username: 1,
    type_user: 1,
    [`${type_user_table}._id`]: 1,
    [`${type_user_table}.fullName`]: 1,
    [`${type_user_table}.city`]: 1,
    [`${type_user_table}.concesionary`]: 1,
    [`${type_user_table}.date_created`]: 1,
    [`${type_user_table}.phone`]: 1,
  };

  let list = await Users.aggregate([
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
      $match: search,
    },
    { $project: project },
    {
      $skip: parseInt(data.lim) * parseInt(data.pos),
    },
    {
      $limit: parseInt(data.lim),
    },
  ]);

  if (type_user_table == "users") {
    search = {
      $or: [
        { email: { $regex: data.s, $options: "i" } },
        { username: { $regex: data.s, $options: "i" } },
        { type_user: { $regex: data.s, $options: "i" } },
      ],
      type_user: data.type_user,
      status: 1
    };

    project = {
      id_user: "$_id",
      email: 1,
      username: 1,
      type_user: 1,
      id_concesionary: 1,
      concesionary: {
        name: 1,
        state: 1,
      },
    };

    list = await Users.aggregate([
      {
        $lookup: {
          from: "concesionaries",
          localField: "id_concesionary",
          foreignField: "_id",
          as: "concesionary",
        }
      },
      {
        $unwind: `$concesionary`,
      },
      {
        $match: search,
      },
      { $project: project },
      {
        $skip: parseInt(data.lim) * parseInt(data.pos),
      },
      {
        $limit: parseInt(data.lim),
      },
    ]);
  }

  let count: any;

  if (list.length > 0) {
    sendata.rows = list;

    for (let i = 0; i < sendata.rows.length; i++) {
      const element = sendata.rows[i];
      const userImg = await imgUser.findOne({ id_user: element.id_user });
      element.img = userImg ? userImg : null;
    }
    count = await Users.aggregate([
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
        $match: search,
      },
      { $project: project },
      {
        $count: "totalCount",
      },
    ]);

    if (type_user_table == "users") {
      count = await Users.aggregate([
        {
          $match: search,
        },
        { $project: project },
        {
          $count: "totalCount",
        },
      ]);
    }

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

  reponseJson.data = sendata;
  return res.json(reponseJson);
};

userController.allMechanic = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);

  let mechanicsArray: any[] = [];

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  let search: any = {
    type_user: "mechanic",
  };

  if (decode.type_user == "admin_concesionary") {
    let concesionario: any = await concesionariesSchema.findOne({
      _id: decode.id_concesionary,
    });
    search.concesionary = concesionario.name;
  }


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

userController.getNotifications = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  let data: any = req.query;
  let search: any;
  let project: any;
  let sendData: any = {};
  let count: any;
  let totalItems = 0;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, [
    "seller",
    "admin",
    "admin_concesionary",
    "mechanic",
  ]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  
  if (!data) {
    data = {
      pos: 0,
      lim: 10,
    };
  }

  search = {
    id_user: new mongoose.Types.ObjectId(data?.id_user),
  };

  project = {
    _id: "$_id",
    id_user: 1,
    title: 1,
    message: 1,
    date: 1,
    data: 1,
    status: 1,
  };

  let list = await notifications.aggregate([
    {
      $match: search,
    },
    {
      $skip: parseInt(data.lim) * parseInt(data.pos),
    },
    {
      $limit: parseInt(data.lim),
    },
    { $project: project },
    {
      $sort: { date: -1 },
    }
  ]);

  sendData.rows = list;

  if (list.length > 0) {

    count = await notifications.aggregate([
      {
        $match: search,
      },
      {
        $count: "totalCount",
      },
    ]);

    reponseJson.code = 200;
    reponseJson.message = "notificaciones obtenidas exitosamente";
    reponseJson.status = true;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no se encontraron notificaciones";
    reponseJson.status = false;
  }

  if (count) {
    totalItems = count[0].totalCount;
  }

  let totalPages = Math.ceil(totalItems / data.lim);

  sendData.count = totalItems;
  sendData.pages = totalPages;

  reponseJson.data = sendData;

  res.json(reponseJson);

  // if (decode == false) {
  //   reponseJson.code = jwt.code;
  //   reponseJson.message = jwt.message;
  //   reponseJson.status = false;
  //   reponseJson.data = null;
  //   return res.json(reponseJson);
  // }
  // console.log(id_user)
  // const notificationsUser = await notifications
  //   .find({ id_user: id_user, status: false })
  //   .sort({ date: -1 });

  // if (notificationsUser) {
  //   reponseJson.code = 200;
  //   reponseJson.message = "notificaciones obtenidas exitosamente";
  //   reponseJson.status = true;
  //   reponseJson.data = notificationsUser;
  // } else {
  //   reponseJson.code = 400;
  //   reponseJson.message = "no se encontraron notificaciones";
  //   reponseJson.status = false;
  // }

  // res.json(reponseJson);
};

userController.updateNotification = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, [
    "seller",
    "admin",
    "admin_concesionary",
    "mechanic",
  ]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const notificationsUser = await notifications.findByIdAndUpdate(id, {
    status: true,
  });

  if (notificationsUser) {
    reponseJson.code = 200;
    reponseJson.message = "notificacion actualizada exitosamente";
    reponseJson.status = true;
    reponseJson.data = notificationsUser;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "error al actualizar notificacion";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

userController.notificationById = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, [
    "seller",
    "admin",
    "mechanic",
    "admin_concesionary"
  ]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const notificationsUser = await notifications.findById(id);

  if (notificationsUser) {
    reponseJson.code = 200;
    reponseJson.message = "notificacion encontrada exitosamente";
    reponseJson.status = true;
    reponseJson.data = notificationsUser;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no se encontro notificacion";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

userController.countNotifications = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id_user } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, [
    "seller",
    "admin",
    "mechanic",
    "admin_concesionary"
  ]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const countNotifies = await notifications.countDocuments({
    id_user: id_user,
    status: false,
  });

  if (countNotifies) {
    reponseJson.code = 200;
    reponseJson.message = "conteo de notificaciones exitoso";
    reponseJson.status = true;
    reponseJson.data = countNotifies;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no se encontro notificacion";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

async function addOrUpdateUser(data: any) {
  if (data.id_user) {
    const user = { _id: data.id_user };
    if (data.password != "") {
      const hash = await bcrypt.hash(data.password, 12);
      data.password = hash;
      await Users.findOneAndUpdate(user, data);
    } else {
      let userUpdate: any = {
        email: data.email,
        username: data.username,
        type_user: data.type_user,
      };
      if (data.type_user == "admin_concesionary") {
        userUpdate.id_concesionary = data.id_concesionary;
      }
      await Users.findOneAndUpdate(user, userUpdate);
    }
  } else {
    const date_created = moment().format("YYYY-MM-DD");

    const hash = await bcrypt.hash(data.password, 12);
    let _user: any = {
      email: data.email,
      password: hash,
      username: data.username,
      type_user: data.type_user,
      date_created: date_created,
      status: 1,
    };
    if (data.type_user == "admin_concesionary") {
      _user.id_concesionary = data.id_concesionary;
    }
    const newUser = new Users(_user);

    await newUser.save();

    data.id_user = newUser._id;
  }
  return data;
}

async function addOrUpdateMechanic(data: any) {
  if (data.id_user) {
    const user = { _id: data.id_user };
    if (data.password != "") {
      const hash = await bcrypt.hash(data.password, 12);
      data.password = hash;
      await Users.findOneAndUpdate(user, data);
    } else {
      const userUpdate = {
        email: data.email,
        username: data.username,
        type_user: data.type_user,
      };
      const mechanicUpdate = {
        fullName: data.fullName,
        city: data.city,
        concesionary: data.concesionary,
        id_concesionary: data.id_concesionary ? data.id_concesionary : null,
        phone: data.phone,
      };
      const query: any = await mechanics.findOne({ id_user: user._id });
      let mechanic = { _id: query._id };
      await Users.findOneAndUpdate(user, userUpdate);
      await mechanics.findOneAndUpdate(mechanic, mechanicUpdate);
    }
  } else {
    const date_created = moment().format("YYYY-MM-DD");

    const hash = await bcrypt.hash(data.password, 12);
    const newUser = new Users({
      email: data.email,
      password: hash,
      username: data.username,
      type_user: data.type_user,
      date_created: date_created,
      status: 1,
    });

    await newUser.save();

    data.id_user = newUser._id;

    const newMechanic = new mechanics({
      fullName: data.fullName,
      city: data.city,
      concesionary: data.concesionary,
      id_concesionary: data.id_concesionary ? data.id_concesionary : null,
      date_created: date_created,
      phone: data.phone,
      id_user: data.id_user,
      status: 1,
    });

    await newMechanic.save();
    data.id_mechanic = newMechanic._id;
  }
  return data;
}

async function addOrUpdateSeller(data: any) {
  if (data.id_user) {
    const user = { _id: data.id_user };
    if (data.password != "") {
      const hash = await bcrypt.hash(data.password, 12);
      data.password = hash;
      await Users.findOneAndUpdate(user, data);
    } else {
      const userUpdate = {
        email: data.email,
        username: data.username,
        type_user: data.type_user,
      };
      const sellerUpdate = {
        fullName: data.fullName,
        city: data.city,
        concesionary: data.concesionary,
        phone: data.phone,
      };
      const query: any = await sellers.findOne({ id_user: user._id });
      let seller = { _id: query._id };
      await Users.findOneAndUpdate(user, userUpdate);
      await sellers.findOneAndUpdate(seller, sellerUpdate);
    }
  } else {
    const date_created = moment().format("YYYY-MM-DD");

    const hash = await bcrypt.hash(data.password, 12);
    const newUser = new Users({
      email: data.email,
      password: hash,
      username: data.username,
      type_user: data.type_user,
      date_created: date_created,
      status: 1,
    });

    await newUser.save();

    data.id_user = newUser._id;

    const newSeller = new sellers({
      fullName: data.fullName,
      city: data.city,
      concesionary: data.concesionary,
      id_concesionary: data.id_concesionary ? data.id_concesionary : null,
      date_created: date_created,
      phone: data.phone,
      id_user: data.id_user,
      status: 1,
    });

    await newSeller.save();
    data.id_seller = newSeller._id;
  }
  return data;
}

async function deleteUser(data: any) {
  if (data.id_user) {
    const user = { _id: data.id_user };
    const userUpdate = { status: data.status };
    await Users.findOneAndUpdate(user, userUpdate);
  }
  return data;
}

export default userController;
