import { Request, Response } from "express";
import { ResponseModel } from "../models/Response";
import jwt from "../helpers/generar-jwt";
import models from "../schemas/modelVehicle.schema";

const modelVehiclesController: any = {};

modelVehiclesController.all = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin","seller","mechanic"]);
  let data: any = req.query;

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  if (!data) {
    data = {
      s: "",
    };
  }

  let search: any;
  let project: any;
    search = {
      $or: [
        { _id: { $regex: ".*" + data.s + ".*",$options: "i" } },
        { name: { $regex: ".*" + data.s + ".*",$options: "i" } },
      ],
    };

    project = {
      _id: "$_id",
      name: 1,
    };
  let list = await models.aggregate([
    {
      $match: search,
    },
    {
      $project: project,
    },
  ]);

  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
  reponseJson.data = list;

  res.json(reponseJson);
};

modelVehiclesController.allPaginator = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin","seller","mechanic"]);
  let data: any = req.query;

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  if (!data) {
    data = {
      s: "",
      pos: 0,
      lim: 10,
    };
  }

  let search: any;
  let project: any;
    search = {
      $or: [
        { _id: { $regex: ".*" + data.s + ".*",$options: "i" } },
        { model: { $regex: ".*" + data.s + ".*",$options: "i" } },
        { type_vehicle: { $regex: ".*" + data.s + ".*",$options: "i" } },
        { brand: { $regex: ".*" + data.s + ".*",$options: "i" } },
      ],
    };

    project = {
      _id: "$_id",
      model: 1,
      type_vehicle: 1,
      brand: 1
    };

    let sendata: any = {};

  let list = await models.aggregate([
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
    count = await models.aggregate([
      {
        $match: search,
      },
      {
        $count: "totalCount",
      },
    ]);
    reponseJson.code = 200;
    reponseJson.message = "Lista de modelos de vehiculos";
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

  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
  reponseJson.data = sendata;

  res.json(reponseJson);
};

modelVehiclesController.updateModel = async (req: Request, res: Response) =>{

  const reponseJson: ResponseModel = new ResponseModel();
  const data = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const update = await models.findByIdAndUpdate(data._id,data);
    
  if  (update) {
    reponseJson.code = 200;
    reponseJson.message = "Modélo actualizado correctamente";
    reponseJson.status = true;
    reponseJson.data = update;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "Error al actualizar modélo de vehiculo";
    reponseJson.status = false;
    reponseJson.data = [];
  }

  res.json(reponseJson)
}

modelVehiclesController.deleteModel = async (req: Request, res: Response) =>{

  const reponseJson: ResponseModel = new ResponseModel();
  const data = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin", "seller"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const update = await models.findByIdAndDelete(data._id);
    
  if  (update) {
    reponseJson.code = 200;
    reponseJson.message = "Modélo Eliminado correctamente";
    reponseJson.status = true;
    reponseJson.data = update;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "Error al eliminar modélo de vehiculo";
    reponseJson.status = false;
    reponseJson.data = [];
  }

  res.json(reponseJson)
}

export default modelVehiclesController;
