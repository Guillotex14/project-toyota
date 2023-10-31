import { Request, Response, response } from "express";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import sellers from "../schemas/Sellers.schema";
import mechanics from "../schemas/Mechanics.schema";
import imgUser from "../schemas/imgUser.schema";
import notifications from "../schemas/notifications.schema";
import { sendEmail } from "../../nodemailer";
import bcrypt from "bcrypt";
import { deleteImageUser, uploadImageUser } from "../../cloudinaryMetods";
import Jwt from "../helpers/generar-jwt";
import ConcesionariesSchema from "../schemas/Concesionaries.schema";
import VehiclesSchema from "../schemas/Vehicles.schema";

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
          let concesionary: any = await ConcesionariesSchema.findOne({
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

  const { id } = req.query;

  // const vehicle = await VehiclesSchema.aggregate([
  //   {
  //     $match: {
  //       _id: id
  //       }
  //   },

  //   {
  //     $lookup: {
  //       from: "sellers",
  //       localField: "id_seller",
  //       foreignField: "_id",
  //       as: "seller",
  //     },
  //   },
  //   {
  //     $unwind: "$seller",
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "seller.id_user",
  //       foreignField: "_id",
  //       as: "user",
  //     },
  //   },
  //   {
  //     $unwind: "$user",
  //   },
  //   {
  //     $lookup: {
  //       from: "concesionaries",
  //       localField: "seller.id_concesionary",
  //       foreignField: "_id",
  //       as: "concesionary",
  //     },
  //   },
  //   {
  //     $unwind: "$concesionary",
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       model: 1,
  //       year: 1,
  //       id_seller: 1,
  //       seller: "$seller.fullName",
  //       user: "$user.email",
  //       concesionary: "$concesionary.name",
  //     },
  //   },
  // ]);

  const vehicle = await VehiclesSchema.findOne({_id: id});

  // const mailOptions = {
  //   from: 'Servicio de notificaciones',
  //   to: 'jefersonmujica@gmail.com',
  //   subject: 'Notificacion de prueba',
  //   html: `
  //       <div>
  //       <p>Tienes el siguiente vehículo para generar la ficha técnica</p>
  //       </div>
  //       <div class="div-table" style="width: 100%;">
  //       <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
  //           <div style=" display: table-row;border: 1px solid #000;">
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle?.model}</div>
  //           </div>
  //           <div style=" display: table-row;border: 1px solid #000;">
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle?.year}</div>
  //           </div>
  //           <div style=" display: table-row;border: 1px solid #000;">
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle?.plate}</div>
  //           </div>
  //           <div style=" display: table-row;border: 1px solid #000;">
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
  //             vehicle?.id_seller
  //           }</div>
  //           </div>
  //           <div style=" display: table-row;border: 1px solid #000;">
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
  //             vehicle?.concesionary
  //           }</div>
  //           </div>
  //           <div style=" display: table-row;border: 1px solid #000;">
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
  //           <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
  //             vehicle?.city
  //           }</div>
  //           </div>
  //       </div>
  //       </div>`,
  // }

  // const responseMail = await sendEmail(mailOptions);

  // res.json(responseMail);

}

export default authController;
