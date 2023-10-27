import { Request, Response } from "express";
import jwt from "../helpers/generar-jwt";
import bcrypt from "bcrypt";
import moment from "moment";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import sellers from "../schemas/Sellers.schema";
import mechanics from "../schemas/Mechanics.schema";
import imgUser from "../schemas/imgUser.schema";
import { sendEmail } from "../../nodemailer";
import notifications from "../schemas/notifications.schema";

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
        message = `El usuario administrador fue creado con exito`;
      }
      if (data.type_user == "mechanic") {
        message = `El usuario tecnico fue creado con exito`;
      }
      if (data.type_user == "seller") {
        message = `El usuario vendedor fue creado con exito`;
      }
      let newUser = await addOrUpdateUser(data);
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
      let newUser = await addOrUpdateUser(data);

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

userController.modificarUsuario = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  let user = await Users.find();

  for (let i = 0; i < user.length; i++) {
    let element = user[i];

    if (element.type_user == "admin") {
      let admin = await sellers.findOne({ id_user: element._id });
      let data = {
        fullName: null,
        city: null,
        concesionary: null,
        date_created: null,
        phone: null,
        status: 1,
      };
      await Users.findOneAndUpdate({ _id: element._id }, data);
    }
    if (element.type_user == "seller") {
      let seller = await sellers.findOne({ id_user: element._id });
      // let data = {
      //   fullName: seller?.fullName,
      //   city: seller?.city,
      //   concesionary: seller?.concesionary,
      //   date_created: seller?.date_created ? seller?.date_created : null,
      //   phone: seller?.phone ? seller?.phone : null,
      //   status: 1,
      // };
      let data = {
        fullName: null,
        city: null,
        concesionary: null,
        date_created: null,
        phone: null,
        status: 1,
      };
      await Users.findOneAndUpdate({ _id: element._id }, data);
    }

    if (element.type_user == "mechanic") {
      let mechanic = await mechanics.findOne({ id_user: element._id });
      // let data = {
      //   fullName: mechanic?.fullName,
      //   city: mechanic?.city,
      //   concesionary: mechanic?.concesionary,
      //   date_created: mechanic?.date_created ? mechanic?.date_created : null,
      //   phone: mechanic?.phone ? mechanic?.phone : null,
      //   status: 1,
      // };
      let data = {
        fullName: null,
        city: null,
        concesionary: null,
        date_created: null,
        phone: null,
        status: 1,
      };
      await Users.findOneAndUpdate({ _id: element._id }, data);
    }
  }
  let otherUser = await Users.find();

  reponseJson.code = 400;
  reponseJson.message = "id_user requerido";
  reponseJson.status = false;
  reponseJson.data = otherUser;
  return res.json(reponseJson);
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
        message = `El usuario administrador fue modificado con exito`;
      } else if (data.type_user == "mechanic") {
        message = `El usuario tecnico fue modificado con exito`;
      } else if (data.type_user == "seller") {
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
        await addOrUpdateUser(data);
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

  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);
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
  const userImg = await imgUser.findOne({id_user: user._id});
  

  if (user) {
    sendata = {
      id_user: user?._id,
      email: user?.email,
      username: user?.username,
      type_user: user?.type_user,
      fullName: user?.fullName,
      city: user?.city,
      concesionary: user?.concesionary,
      date_created: user?.date_created,
      phone: user?.phone,
      status: user?.status,
      img: userImg ? userImg : null
    };
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
  let decode = await jwt.getAuthorization(token, ["admin"]);
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

  if (data.type_user=="seller") {
    type_user_table="sellers";
  }else if (data.type_user=="mechanic") {
    type_user_table="mechanics";
    
  }else if (data.type_user=="admin_concesionary" || data.type_user=="admin") {
    type_user_table="users";
  }

  let sendata: any = {};
  let search: any;
  let project: any;
  search = {
    $or: [
      { email: { $regex: data.s, $options: 'i' } },
      { username: { $regex: data.s, $options: 'i' } },
      { type_user: { $regex: data.s, $options: 'i' } },
      { [`${type_user_table}.fullName`]: { $regex: ".*" + data.s + ".*", $options: 'i' } },
      { [`${type_user_table}.city`]: { $regex: ".*" + data.s + ".*", $options: 'i' } },
      { [`${type_user_table}.concesionary`]: { $regex: ".*" + data.s + ".*", $options: 'i' } },
      { [`${type_user_table}.date_created`]: { $regex: ".*" + data.s + ".*", $options: 'i' } },
      { [`${type_user_table}.date_created`]: { $regex: ".*" + data.s + ".*", $options: 'i' } }
    ],
  };

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
    [`${type_user_table}.date_created`]: 1
  };

  if (data.type_user != "all") {
    search = {
      ...search,
      type_user: data.type_user,
    };
  }

  let list = await Users.aggregate([
    {
      $lookup:{ from: type_user_table, localField: "_id", foreignField: "id_user", as: type_user_table }
    },
    {
      $unwind: `$${type_user_table}`
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

  let count: any;
  
  if (list.length > 0) {
    sendata.rows = list;

    for (let i = 0; i < sendata.rows.length; i++) {
      
      const element = sendata.rows[i];
      const userImg = await imgUser.findOne({id_user: element.id_user});
      element.img= userImg ? userImg : null;
    }

    count = await Users.aggregate([
      {
        $lookup:{ from: type_user_table, localField: "_id", foreignField: "id_user", as: type_user_table }
      },
      {
        $unwind: `$${type_user_table}`
      },
      {
        $match: search,
      },
      { $project: project },
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

userController.getNotifications = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id_user } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin", "mechanic"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const notificationsUser = await notifications
    .find({ id_user: id_user, status: false })
    .sort({ date: -1 });

  if (notificationsUser) {
    reponseJson.code = 200;
    reponseJson.message = "notificaciones obtenidas exitosamente";
    reponseJson.status = true;
    reponseJson.data = notificationsUser;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no se encontraron notificaciones";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

userController.updateNotification = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin", "mechanic"]);

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
  let decode = await jwt.getAuthorization(token, ["seller", "admin", "mechanic"]);

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
  let decode = await jwt.getAuthorization(token, ["seller", "admin", "mechanic"]);

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
      const userUpdate = {
        email: data.email,
        username: data.username,
        type_user: data.type_user,
        fullName: data.fullName,
        city: data.city,
        concesionary: data.concesionary,
        phone: data.phone,
      };
      await Users.findOneAndUpdate(user, userUpdate);
    }
  } else {
    const date_created = moment().format("YYYY-MM-DD");

    const hash = await bcrypt.hash(data.password, 12);
    const newUser = new Users({
      email: data.email,
      password: hash,
      username: data.username,
      type_user: data.type_user,
      fullName: data.fullName,
      city: data.city,
      concesionary: data.concesionary,
      date_created: date_created,
      phone: data.phone,
      status: 1,
    });

    await newUser.save();

    data.id_user = newUser._id;
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
