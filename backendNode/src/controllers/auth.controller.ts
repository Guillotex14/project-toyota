import { Request, Response, response } from "express";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import sellers from "../schemas/Sellers.schema";
import mechanics from "../schemas/Mechanics.schema";
import imgUser from "../schemas/imgUser.schema";
import { sendEmail } from "../../nodemailer";
import bcrypt from "bcrypt";
import { deleteImageUser, uploadImageUser } from "../../cloudinaryMetods";
import Jwt from "../helpers/generar-jwt";
import concesionariesSchema from "../schemas/Concesionaries.schema";
import * as global from "../global";

const authController: any = {};

authController.login = async (req: Request, res: Response) => {
  const jsonRes = new ResponseModel();

  const { email, password } = req.body;

  const user = await Users.findOne({ email: email });

  if (user) {
    jsonRes.code = 200;
    jsonRes.message = "login success";
    jsonRes.status = true;
    const hash = bcrypt.compareSync(password, user.password!);
    const userImg = await imgUser.findOne({ id_user: user._id! });

    if (hash) {
      if (user.type_user === "seller") {
        const seller = await sellers.findOne({ id_user: user._id! });

        const infoSeller = {
          id: user._id!,
          id_sell: seller!._id,
          fullName: seller!.fullName,
          city: seller!.city,
          concesionary: seller!.concesionary,
          email: user.email!,
          username: user.username!,
          type_user: user.type_user!,
          img: userImg ? userImg : null,
        };

        jsonRes.data = infoSeller;
      } else if (user.type_user === "mechanic") {
        const mechanic = await mechanics.findOne({ id_user: user._id! });
        const infoMechanic = {
          id: user._id!,
          id_mechanic: mechanic!._id,
          fullName: mechanic!.fullName,
          city: mechanic!.city,
          concesionary: mechanic!.concesionary,
          email: user.email!,
          username: user.username!,
          type_user: user.type_user!,
          img: userImg ? userImg : null,
        };

        jsonRes.data = infoMechanic;
      } else {
        let admin: any = {
          id: user._id,
          email: user.email,
          username: user.username,
          type_user: user.type_user,
          img: userImg ? userImg : null,
        };
        if (user.type_user == "admin_concesionary") {
          let concesionary: any = await concesionariesSchema.findOne({
            _id: user.id_concesionary,
          });
          admin.id_concesionary = user.id_concesionary;
          admin.concesionary = concesionary.name;
        }
        jsonRes.data = admin;
      }

      let token = Jwt.generateToken(jsonRes.data);
      jsonRes.data.token = token;
    } else {
      jsonRes.code = 400;
      jsonRes.message = "Contraseña incorrecta";
      jsonRes.status = false;
    }
  } else {
    jsonRes.code = 400;
    jsonRes.message = "Ususario no registrado";
    jsonRes.status = false;
  }

  res.json(jsonRes);
};

authController.addImgProfile = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_user, image } = req.body;

  const filename = await uploadImageUser(image);

  const newImage = new imgUser({
    img: filename.secure_url,
    id_user: id_user,
    public_id: filename.public_id,
  });

  await newImage.save();

  if (newImage) {
    reponseJson.code = 200;
    reponseJson.message = "Imagen agregada exitosamente";
    reponseJson.status = true;
    reponseJson.data = newImage;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "No se pudo agregar la imagen";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

authController.updateImgProfile = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_user, image, public_id } = req.body;

  const delImg = await deleteImageUser(public_id);

  const delImgdb = await imgUser.findOneAndDelete({ public_id: public_id });

  if (delImg.result == "ok") {
    const filename = await uploadImageUser(image);

    const newImage = new imgUser({
      img: filename.secure_url,
      id_user: id_user,
      public_id: filename.public_id,
    });

    if (newImage) {
      reponseJson.message = "Imagen actualizada exitosamente";
      reponseJson.status = true;
      reponseJson.data = newImage;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "No se pudo actualizar la imagen";
      reponseJson.status = false;
    }
  } else {
    reponseJson.code = 400;
    reponseJson.message = "No se pudo eliminar la imagen";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

authController.sendMail = async (req: Request, res: Response) => {
  const jsonRes = new ResponseModel();

  // const { id } = req.query;

  // const template = templatesMails("ofertByCar");

  // console.log(template);

  // const mailOptions = {
  //   from: 'Servicio de notificaciones',
  //   to: 'jefersonmujica@gmail.com',
  //   subject: 'Notificacion de prueba',
  //   html: template,
  // }

  // const responseMail = await sendEmail(mailOptions);

  res.json(global.urlBase);

}

export default authController;
