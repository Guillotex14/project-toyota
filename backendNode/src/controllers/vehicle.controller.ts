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

const vehicleController: any = {};

vehicleController.insert = async (req: Request, res: Response) => {
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

  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
  reponseJson.data = data;

  res.json(reponseJson);
};

vehicleController.update = async (req: Request, res: Response) => {
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

  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
  reponseJson.data = data;

  res.json(reponseJson);
};

vehicleController.all = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);
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

export default vehicleController;
