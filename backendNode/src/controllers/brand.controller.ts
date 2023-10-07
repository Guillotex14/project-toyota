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
import brands from "../schemas/brands.schema";

const brandController: any = {};

brandController.insertUpdate = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin"]);
  const data = req.body;

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  if (data._id) {
    const brand = { _id: data._id };
    await brands.findOneAndUpdate(brand, data);

    reponseJson.code = 200;
    reponseJson.message = "Marca " + data.name + " actualizado con exito";
    reponseJson.status = true;
    reponseJson.data = data;
  } else {
    const exist = await brands.findOne({ name: data.name });

    if (exist) {
      reponseJson.code = 400;
      reponseJson.message = "La marca " + data.name + "  ya existe";
      reponseJson.status = false;
    } else {
      const newBrand = new brands({ name: data.name });

      await newBrand.save();

      if (newBrand) {
        data._id = newBrand._id;
        reponseJson.code = 200;
        reponseJson.message = "Marca " + data.name + " agregada exitosamente";
        reponseJson.status = true;
        reponseJson.data = "";
      } else {
        reponseJson.code = 400;
        reponseJson.message = "Error al agregar la marca" + data.name;
        reponseJson.status = false;
      }
    }
  }

  res.json(reponseJson);
};

brandController.delete = async (req: Request, res: Response) => {
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
  const data = req.body;

  const brand = await brands.findOne({ _id: data._id });
  if (brand) {
    const ress = await brands.findOneAndDelete({ _id: data._id });

  } else {
    reponseJson.code = 400;
    reponseJson.message = "Marca no encontrado";
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  reponseJson.code = 200;
  reponseJson.message = "Marca borrada con exito";
  reponseJson.status = true;
  return res.json(reponseJson);
};

brandController.get = async (req: Request, res: Response) => {
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

  reponseJson.code = 200;
  reponseJson.message = "Usuario encontrado con exito";
  reponseJson.data = null;
  reponseJson.status = true;
  return res.json(reponseJson);
};

brandController.all = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin"]);
  let data: any = req.query;

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
  reponseJson.data = data;

  res.json(reponseJson);
};

export default brandController;
