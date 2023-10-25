import { Request, Response } from "express";
import { ResponseModel } from "../models/Response";
import jwt from "../helpers/generar-jwt";
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
  console.log(data);
  const brand = await brands.findOne({ _id: data._id });
  console.log(brand)
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

  let decode = await jwt.getAuthorization(token, ["admin","seller","mechanic"]);
  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const data = req.query;
  let brand: any;
  if (data._id) {
    brand = await brands.findOne({ _id: data._id });
  } else if (data.name) {
    brand = await brands.findOne({ name: data.name });
  }

  reponseJson.code = 200;
  reponseJson.message = "Marca encontrada con exito";
  reponseJson.data = brand;
  reponseJson.status = true;
  return res.json(reponseJson);
};

brandController.all = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["admin","seller","mechanic"]);
  let data: any = req.query;

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
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
  let list = await brands.aggregate([
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

brandController.allPaginator = async (req: Request, res: Response) => {
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
        { name: { $regex: ".*" + data.s + ".*",$options: "i" } },
      ],
    };

    project = {
      _id: "$_id",
      name: 1,
    };

    let sendata: any = {};

  let list = await brands.aggregate([
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
    count = await brands.aggregate([
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

  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
  reponseJson.data = sendata;

  res.json(reponseJson);
};

export default brandController;

