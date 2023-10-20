import { Request, Response } from "express";
import { ResponseModel } from "../models/Response";
import moment from "moment";
import jwt from "../helpers/generar-jwt";
import sharp from "sharp";
import bcrypt from "bcrypt";
import concesionary from "../schemas/Concesionaries.schema";

import vehicles from "../schemas/Vehicles.schema";
import mechanics from "../schemas/Mechanics.schema";
import sellers from "../schemas/Sellers.schema";
import users from "../schemas/Users.schema";
import mechanicalsFiles from "../schemas/mechanicalsFiles.schema";
import notifications from "../schemas/notifications.schema";
import ImgVehicle from "../schemas/ImgVehicle.schema";
import { sendEmail } from "../../nodemailer";
import brands from "../schemas/brands.schema";
import modelVehicle from "../schemas/modelVehicle.schema";
import { deleteImageVehicle, uploadImageVehicle } from "../../cloudinaryMetods";
import imgUserSchema from "../schemas/imgUser.schema";
import ZonesSchema from "../schemas/Zones.schema";

const sellerController: any = {};

sellerController.addVehicle = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  let emailmechanic: any = "";
  let infoSeller: any = {};
  let dateNow = moment().format("YYYY-MM-DD");

  const {
    model,
    brand,
    year,
    displacement,
    km,
    engine_model,
    titles,
    fuel,
    transmission,
    traction,
    city,
    dealer,
    concesionary,
    traction_control,
    performance,
    comfort,
    technology,
    id_seller,
    id_mechanic,
    type_vehicle,
    images,
    vin,
    vehicle_plate,
  } = req.body;

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const newVehicle = new vehicles({
    model,
    year,
    brand,
    displacement,
    km,
    engine_model,
    titles,
    fuel,
    transmission,
    traction,
    city,
    dealer,
    concesionary,
    traction_control,
    performance,
    comfort,
    technology,
    mechanicalFile: false,
    sold: false,
    date_create: dateNow,
    price: null,
    id_seller,
    id_mechanic,
    id_seller_buyer: null,
    type_vehicle,
    vin,
    plate: vehicle_plate,
  });

  await newVehicle.save();

  const mec = await mechanics.findOne({ _id: id_mechanic });
  emailmechanic = await users.findOne({ _id: mec?.id_user });

  infoSeller = await sellers.findOne({ _id: id_seller });

  if (images) {
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imgResize = await desgloseImg(images[i].image);

        const filename = await uploadImageVehicle(imgResize);

        const imgVehi = new ImgVehicle({
          img: filename.secure_url,
          id_vehicle: newVehicle._id,
          public_id: filename.public_id,
        });
        await imgVehi.save();
      }
    }
  }

  const mailOptions = {
    from: "Toyousado",
    to: emailmechanic,
    subject: "Revisión de vehículo",
    html: `
        <div>
        <p>Tienes el siguiente vehículo para generar la ficha técnica</p>
        </div>
        <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${model}</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${year}</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle_plate}</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              infoSeller!.fullName
            }</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              infoSeller!.concesionary
            }</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              infoSeller!.city
            }</div>
            </div>
        </div>
        </div>`,
  };

  const dataVehicle = {
    model: model,
    year: year,
    plate: vehicle_plate,
    fullName: infoSeller!.fullName,
    concesionary: infoSeller!.concesionary,
    city: infoSeller!.city,
    title: "Tienes el siguiente vehículo para generar la ficha técnica",
  };

  await sendEmail(mailOptions);

  sendNotificationMechanic(id_mechanic, dataVehicle, "Revisión de vehículo");

  reponseJson.code = 200;
  reponseJson.message = "Vehículo agregado exitosamente";
  reponseJson.status = true;
  reponseJson.data = "";

  res.json(reponseJson);
};

sellerController.addImgVehicle = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  const { id_vehicle, image } = req.body;
  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const filename = await uploadImageVehicle(image);

  const newImage = new ImgVehicle({
    img: filename.secure_url,
    id_vehicle: id_vehicle,
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

sellerController.deleteImgVehicle = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { public_id } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const delImag = await deleteImageVehicle(public_id);

  const delImg = await ImgVehicle.findOneAndDelete({ public_id: public_id });

  if (delImg) {
    reponseJson.code = 200;
    reponseJson.message = "Imagen eliminada exitosamente";
    reponseJson.status = true;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "No se pudo eliminar la imagen";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

sellerController.updateImgVehicle = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_vehicle, image, public_id } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const delImg = await ImgVehicle.findOneAndDelete({ public_id: public_id });

  const delImag = await deleteImageVehicle(public_id);

  if (delImg) {
    let filename = await uploadImageVehicle(image);

    const newImage = new ImgVehicle({
      img: filename.secure_url,
      id_vehicle: id_vehicle,
      public_id: filename.public_id,
    });
    await newImage.save();

    const arrayImages = await ImgVehicle.find({ id_vehicle: id_vehicle });

    let data = {
      images: arrayImages,
      imgEdit: newImage,
    };

    reponseJson.code = 200;
    reponseJson.message = "Imagen actualizada exitosamente";
    reponseJson.data = data;
    reponseJson.status = true;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "No se pudo actualizar la imagen";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

sellerController.updateVehicle = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller"]);
  const { data } = req.body;

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const vehicleUpdated = await vehicles.findByIdAndUpdate(data._id, data);

  if (vehicleUpdated) {
    reponseJson.code = 200;
    reponseJson.status = true;
    reponseJson.message = "Vehículo actualizado correctamente";
    reponseJson.data = vehicleUpdated;
  } else {
    reponseJson.code = 400;
    reponseJson.status = false;
    reponseJson.message = "No se pudo actualizar el vehículo";
  }

  res.json(reponseJson);
};

sellerController.allVehicles = async (req: Request, res: Response) => {
  //aqui declaramos las respuestas
  const reponseJson: ResponseModel = new ResponseModel();
  let query: any = {};
  //aqui declaramos las variables que vamos a recibir
  const {
    minYear,
    maxYear,
    minKm,
    maxKm,
    minPrice,
    maxPrice,
    brand,
    model,
    ubication,
    type_vehicle,
  } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  //aqui creamos las condiciones para el filtro de los vehículos y las querys

  if (minYear === 0 && maxYear === 0) {
    query.year = { $gte: 0 };
  } else if (minYear !== 0 && maxYear === 0) {
    query.year = { $gte: minYear };
  } else if (minYear === 0 && maxYear !== 0) {
    query.year = { $lte: maxYear };
  } else {
    query.year = { $gte: minYear, $lte: maxYear };
  }

  if (minKm === 0 && maxKm === 0) {
    query.km = { $gte: 0 };
  } else if (minKm !== 0 && maxKm === 0) {
    query.km = { $gte: minKm };
  } else if (minKm === 0 && maxKm !== 0) {
    query.km = { $lte: maxKm };
  } else {
    query.km = { $gte: minKm, $lte: maxKm };
  }

  if (minPrice === 0 && maxPrice === 0) {
    query.price = { $gte: 0, $ne: null };
  } else if (minPrice !== 0 && maxPrice === 0) {
    query.price = { $gte: minPrice, $ne: null };
  } else if (minPrice === 0 && maxPrice !== 0) {
    query.price = { $lte: maxPrice, $ne: null };
  } else {
    query.price = { $gte: minPrice, $lte: maxPrice };
  }

  query.city = { $regex: ubication, $options: "i" };
  query.brand = { $regex: brand, $options: "i" };
  query.model = { $regex: model, $options: "i" };
  query.type_vehicle = { $regex: type_vehicle, $options: "i" };
  query.mechanicalFile = true;
  query.sold = false;
  // query.id_seller_buyer = null;

  const vehiclesFiltered = await vehicles.find(query).sort({ date_create: -1 });
  if (vehiclesFiltered) {
    let arrayVehicles: any[] = [];

    for (let i = 0; i < vehiclesFiltered.length; i++) {
      let data = {
        name_new_owner: vehiclesFiltered[i].name_new_owner,
        dni_new_owner: vehiclesFiltered[i].dni_new_owner,
        phone_new_owner: vehiclesFiltered[i].phone_new_owner,
        email_new_owner: vehiclesFiltered[i].email_new_owner,
        price_ofert: vehiclesFiltered[i].price_ofert,
        final_price_sold: vehiclesFiltered[i].final_price_sold,
        _id: vehiclesFiltered[i]._id,
        model: vehiclesFiltered[i].model,
        brand: vehiclesFiltered[i].brand,
        year: vehiclesFiltered[i].year,
        displacement: vehiclesFiltered[i].displacement,
        km: vehiclesFiltered[i].km,
        engine_model: vehiclesFiltered[i].engine_model,
        titles: vehiclesFiltered[i].titles,
        fuel: vehiclesFiltered[i].fuel,
        transmission: vehiclesFiltered[i].transmission,
        city: vehiclesFiltered[i].city,
        dealer: vehiclesFiltered[i].dealer,
        concesionary: vehiclesFiltered[i].concesionary,
        traction_control: vehiclesFiltered[i].traction_control,
        performance: vehiclesFiltered[i].performance,
        comfort: vehiclesFiltered[i].comfort,
        technology: vehiclesFiltered[i].technology,
        id_seller: vehiclesFiltered[i].id_seller,
        id_mechanic: vehiclesFiltered[i].id_mechanic,
        __v: vehiclesFiltered[i].__v,
        price: vehiclesFiltered[i].price,
        mechanicalFile: vehiclesFiltered[i].mechanicalFile,
        id_seller_buyer: vehiclesFiltered[i].id_seller_buyer,
        sold: vehiclesFiltered[i].sold,
        type_vehicle: vehiclesFiltered[i].type_vehicle,
        traction: vehiclesFiltered[i].traction,
        date_sell: vehiclesFiltered[i].date_sell,
        date_create: vehiclesFiltered[i].date_create,
        plate: vehiclesFiltered[i].plate,
        vin: vehiclesFiltered[i].vin,
        image: (await ImgVehicle.findOne({
          id_vehicle: vehiclesFiltered[i]._id,
        }))
          ? await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id })
          : "",
      };
      arrayVehicles.push(data);
    }

    reponseJson.code = 200;
    reponseJson.message = "vehículos encontrados exitosamente";
    reponseJson.status = true;
    reponseJson.data = arrayVehicles;
  } else {
    reponseJson.code = 400;
    reponseJson.message =
      "no se encontraron vehículos con los filtros seleccionados";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

sellerController.myVehicles = async (req: Request, res: Response) => {
  const jsonRes: ResponseModel = new ResponseModel();
  let arrayVehicles: any[] = [];
  let query: any = {};
  //aqui declaramos las variables que vamos a recibir
  const {
    minYear,
    maxYear,
    minKm,
    maxKm,
    minPrice,
    maxPrice,
    brand,
    model,
    ubication,
    type_vehicle,
    id_seller,
  } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    jsonRes.code = jwt.code;
    jsonRes.message = jwt.message;
    jsonRes.status = false;
    jsonRes.data = null;
    return res.json(jsonRes);
  }
  //aqui creamos las condiciones para el filtro de los vehículos y las querys

  if (minYear === 0 && maxYear === 0) {
    query.year = { $gte: 0 };
  } else if (minYear !== 0 && maxYear === 0) {
    query.year = { $gte: minYear };
  } else if (minYear === 0 && maxYear !== 0) {
    query.year = { $lte: maxYear };
  } else {
    query.year = { $gte: minYear, $lte: maxYear };
  }

  if (minKm === 0 && maxKm === 0) {
    query.km = { $gte: 0 };
  } else if (minKm !== 0 && maxKm === 0) {
    query.km = { $gte: minKm };
  } else if (minKm === 0 && maxKm !== 0) {
    query.km = { $lte: maxKm };
  } else {
    query.km = { $gte: minKm, $lte: maxKm };
  }

  if (minPrice === 0 && maxPrice === 0) {
    query.price = { $exists: true };
  } else if (minPrice !== 0 && maxPrice === 0) {
    query.price = { $gte: minPrice, $ne: null };
  } else if (minPrice === 0 && maxPrice !== 0) {
    query.price = { $lte: maxPrice, $ne: null };
  } else {
    query.price = { $gte: minPrice, $lte: maxPrice };
  }

  query.city = { $regex: ubication, $options: "i" };
  query.brand = { $regex: brand, $options: "i" };
  query.model = { $regex: model, $options: "i" };
  query.type_vehicle = { $regex: type_vehicle, $options: "i" };

  query.id_seller = id_seller;

  const vehiclesFiltered = await vehicles.find(query).sort({ date_create: -1 });

  if (vehiclesFiltered) {
    for (let i = 0; i < vehiclesFiltered.length; i++) {
      let data = {
        name_new_owner: vehiclesFiltered[i].name_new_owner,
        dni_new_owner: vehiclesFiltered[i].dni_new_owner,
        phone_new_owner: vehiclesFiltered[i].phone_new_owner,
        email_new_owner: vehiclesFiltered[i].email_new_owner,
        price_ofert: vehiclesFiltered[i].price_ofert,
        final_price_sold: vehiclesFiltered[i].final_price_sold,
        _id: vehiclesFiltered[i]._id,
        model: vehiclesFiltered[i].model,
        brand: vehiclesFiltered[i].brand,
        year: vehiclesFiltered[i].year,
        displacement: vehiclesFiltered[i].displacement,
        km: vehiclesFiltered[i].km,
        engine_model: vehiclesFiltered[i].engine_model,
        titles: vehiclesFiltered[i].titles,
        fuel: vehiclesFiltered[i].fuel,
        transmission: vehiclesFiltered[i].transmission,
        city: vehiclesFiltered[i].city,
        dealer: vehiclesFiltered[i].dealer,
        concesionary: vehiclesFiltered[i].concesionary,
        traction_control: vehiclesFiltered[i].traction_control,
        performance: vehiclesFiltered[i].performance,
        comfort: vehiclesFiltered[i].comfort,
        technology: vehiclesFiltered[i].technology,
        id_seller: vehiclesFiltered[i].id_seller,
        id_mechanic: vehiclesFiltered[i].id_mechanic,
        price: vehiclesFiltered[i].price,
        mechanicalFile: vehiclesFiltered[i].mechanicalFile,
        id_seller_buyer: vehiclesFiltered[i].id_seller_buyer,
        sold: vehiclesFiltered[i].sold,
        type_vehicle: vehiclesFiltered[i].type_vehicle,
        traction: vehiclesFiltered[i].traction,
        date_sell: vehiclesFiltered[i].date_sell,
        date_create: vehiclesFiltered[i].date_create,
        plate: vehiclesFiltered[i].plate,
        vin: vehiclesFiltered[i].vin,
        dispatched: vehiclesFiltered[i].dispatched,
        images: (await ImgVehicle.findOne({
          id_vehicle: vehiclesFiltered[i]._id,
        }))
          ? await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id })
          : "",
      };

      arrayVehicles.push(data);
    }

    jsonRes.code = 200;
    jsonRes.message = "Vehicleos encontrados";
    jsonRes.status = true;
    jsonRes.data = arrayVehicles;
  } else {
    jsonRes.code = 400;
    jsonRes.message = "No se encontraron vehículos";
    jsonRes.status = false;
  }

  res.json(jsonRes);
};

sellerController.vehicleById = async (req: Request, res: Response) => {
  const jsonRes: ResponseModel = new ResponseModel();

  const { id } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    jsonRes.code = jwt.code;
    jsonRes.message = jwt.message;
    jsonRes.status = false;
    jsonRes.data = null;
    return res.json(jsonRes);
  }

  const infoVehicle = await vehicles.findOne({ _id: id });

  const imgsVehichle = await ImgVehicle.find({ id_vehicle: id });

  const mechanicalFile = await mechanicalsFiles.findOne({ id_vehicle: id });

  if (infoVehicle) {
    let data = {
      _id: infoVehicle._id,
      model: infoVehicle.model,
      brand: infoVehicle.brand,
      year: infoVehicle.year,
      displacement: infoVehicle.displacement,
      km: infoVehicle.km,
      engine_model: infoVehicle.engine_model,
      titles: infoVehicle.titles,
      fuel: infoVehicle.fuel,
      transmission: infoVehicle.transmission,
      city: infoVehicle.city,
      dealer: infoVehicle.dealer,
      concesionary: infoVehicle.concesionary,
      traction_control: infoVehicle.traction_control,
      performance: infoVehicle.performance,
      price: infoVehicle.price,
      comfort: infoVehicle.comfort,
      technology: infoVehicle.technology,
      mechanicalFile: infoVehicle.mechanicalFile,
      sold: infoVehicle.sold,
      type_vehicle: infoVehicle.type_vehicle,
      id_seller: infoVehicle.id_seller,
      id_mechanic: infoVehicle.id_mechanic,
      id_seller_buyer: infoVehicle.id_seller_buyer,
      traction: infoVehicle.traction,
      date_create: infoVehicle.date_create,
      plate: infoVehicle.plate,
      vin: infoVehicle.vin,
      price_ofert: infoVehicle.price_ofert,
      final_price_sold: infoVehicle.final_price_sold,
      general_condition: mechanicalFile!
        ? mechanicalFile.general_condition
        : "",
      images: imgsVehichle ? imgsVehichle : [],
    };

    jsonRes.code = 200;
    jsonRes.message = "success";
    jsonRes.status = true;
    jsonRes.data = data;
  } else {
    jsonRes.code = 400;
    jsonRes.message = "No se pudo obtener la información del vehículo";
    jsonRes.status = false;
  }

  res.json(jsonRes);
};

sellerController.mechanicalFileByIdVehicle = async (
  req: Request,
  res: Response
) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id_vehicle } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const mecFile = await mechanicalsFiles.findOne({ id_vehicle: id_vehicle });
  if (mecFile) {
    reponseJson.code = 200;
    reponseJson.status = true;
    reponseJson.message = "Ficha mecánica encontrada";
    reponseJson.data = mecFile;
  } else {
    reponseJson.code = 400;
    reponseJson.status = false;
    reponseJson.message = "No se encontro la ficha mecánica";
  }

  res.json(reponseJson);
};

sellerController.approveBuyVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const date_sell = moment().format("YYYY-MM-DD");
    const { id_vehicle } = req.body;
  
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  
    if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
  
    const infoVehicle = await vehicles.findById(id_vehicle);
  
    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
      price_ofert: infoVehicle!.price_ofert,
      date_sell: date_sell,
      final_price_sold: infoVehicle!.price_ofert,
      sold: false,
    });
  
    const infoBuyer = await sellers.findById(vehicle!.id_seller_buyer);
  
    const userbuyer = await users.findById(infoBuyer!.id_user);
  
    const infoSeller = await sellers.findById(vehicle!.id_seller);
  
    const userSeller = await users.findById(infoSeller!.id_user);
  
    if (vehicle) {
      reponseJson.code = 200;
      reponseJson.message = "aprobacion de oferta exitosa";
      reponseJson.status = true;
      reponseJson.data = vehicle;
  
      const mailOptions = {
        from: "Toyousado Notifications",
        to: userbuyer!.email,
        subject: "Oferta de vehículo aprobada",
        text: `Tu oferta del vehículo ${vehicle!.model} del concesionario ${
          vehicle!.concesionary
        } ha sido aceptada, para mas información comunicate con el vendedor al correo ${
          userSeller!.email
        } o al número telefono ${infoSeller!.phone}`,
      };
  
      await sendEmail(mailOptions);
  
      sendNotification(
        userbuyer!._id.toString(),
        mailOptions.text,
        mailOptions.subject
      );
    } else {
      reponseJson.code = 400;
      reponseJson.message = "error al aprobar la oferta";
      reponseJson.status = false;
    }
  
    res.json(reponseJson);
  };
  
sellerController.rejectBuyVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id_vehicle } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  
    if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
  
    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
      id_seller_buyer: null,
      sold: false,
      price_ofert: null,
      date_sell: null,
      name_new_owner: null,
      dni_new_owner: null,
      phone_new_owner: null,
      email_new_owner: null,
    });
  
    const infoBuyer = await sellers.findById(vehicle!.id_seller_buyer);
  
    const userbuyer = await users.findById(infoBuyer!.id_user);
  
    const infoSeller = await sellers.findById(vehicle!.id_seller);
  
    const userSeller = await users.findById(infoSeller!.id_user);
  
    if (vehicle) {
      reponseJson.code = 200;
      reponseJson.message = "oferta rechazada exitosamente";
      reponseJson.status = true;
      reponseJson.data = vehicle;
  
      const mailOptions = {
        from: "Toyousado Notifications",
        to: userbuyer!.email,
        subject: "Compra de vehículo rechazada",
        text: `Tu compra del vehículo ${vehicle!.model} del concesionario ${
          vehicle!.concesionary
        } fue rechazada, para más información comunicaté con el vendedor al correo ${
          userSeller!.email
        } o al número de teléfono ${infoSeller!.phone}`,
      };
  
      await sendEmail(mailOptions);
  
      sendNotification(
        userbuyer!._id.toString(),
        mailOptions.text,
        mailOptions.subject
      );
    } else {
      reponseJson.code = 400;
      reponseJson.message = "error al rechazar la oferta";
      reponseJson.status = false;
    }
  
    res.json(reponseJson);
  };

  sellerController.dispatchedCar = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id, final_price_sold } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  
    if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
  
    const vehiclesFiltered = await vehicles.findOneAndUpdate(
      { _id: id },
      { sold: true, price: final_price_sold, dispatched: true }
    );
  
    if (vehiclesFiltered) {
      reponseJson.code = 200;
      reponseJson.message = "vehículo entregado exitosamente";
      reponseJson.status = true;
      reponseJson.data = vehiclesFiltered;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "erroe al entregar vehículo";
      reponseJson.status = false;
    }
  
    res.json(reponseJson);
  };
  
  sellerController.repost = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  
    if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
  
    const vehiclesFiltered = await vehicles.findOneAndUpdate(
      { _id: id },
      {
        sold: false,
        price_ofert: null,
        final_price_sold: null,
        name_new_owner: null,
        dni_new_owner: null,
        phone_new_owner: null,
        email_new_owner: null,
        date_sell: null,
        id_seller_buyer: null,
      }
    );
  
    if (vehiclesFiltered) {
      reponseJson.code = 200;
      reponseJson.message = "vehículo publicado exitosamente";
      reponseJson.status = true;
      reponseJson.data = vehiclesFiltered;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "erroe al publicar vehículo";
      reponseJson.status = false;
    }
  
    res.json(reponseJson);
  };

  sellerController.getVehicleByType = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  
    if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
    const { type_vehicle } = req.body;
  
    const arrayVehicles = await vehicles.find({
      type_vehicle: type_vehicle,
      mechanicalFile: true,
      sold: false,
      id_seller_buyer: null,
    });
  
    if (arrayVehicles) {
      reponseJson.code = 200;
      reponseJson.message = "vehículos encontrados exitosamente";
      reponseJson.status = true;
      reponseJson.data = arrayVehicles;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "no se encontraron vehículos";
      reponseJson.status = false;
    }
  
    res.json(reponseJson);
  };
  
  sellerController.filterVehiclesWithMongo = async (
    req: Request,
    res: Response
  ) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  
    if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
    let query: any = {};
    //aqui declaramos las variables que vamos a recibir
    const {
      minYear,
      maxYear,
      minKm,
      maxKm,
      minPrice,
      maxPrice,
      brand,
      model,
      ubication,
      type_vehicle,
    } = req.body;
  
    //aqui creamos las condiciones para el filtro de los vehículos y las querys
  
    if (minYear === 0 && maxYear === 0) {
      query.year = { $gte: 0 };
    } else if (minYear !== 0 && maxYear === 0) {
      query.year = { $gte: minYear };
    } else if (minYear === 0 && maxYear !== 0) {
      query.year = { $lte: maxYear };
    } else {
      query.year = { $gte: minYear, $lte: maxYear };
    }
  
    if (minKm === 0 && maxKm === 0) {
      query.km = { $gte: 0 };
    } else if (minKm !== 0 && maxKm === 0) {
      query.km = { $gte: minKm };
    } else if (minKm === 0 && maxKm !== 0) {
      query.km = { $lte: maxKm };
    } else {
      query.km = { $gte: minKm, $lte: maxKm };
    }
  
    if (minPrice === 0 && maxPrice === 0) {
      query.price = { $gte: 0, $ne: null };
    } else if (minPrice !== 0 && maxPrice === 0) {
      query.price = { $gte: minPrice, $ne: null };
    } else if (minPrice === 0 && maxPrice !== 0) {
      query.price = { $lte: maxPrice, $ne: null };
    } else {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }
  
    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    query.mechanicalFile = true;
    query.sold = false;
    // query.id_seller_buyer = null;
  
    const vehiclesFiltered = await vehicles
      .find(query)
      .sort({ date_create: -1 });
    if (vehiclesFiltered) {
      let arrayVehicles: any[] = [];
  
      for (let i = 0; i < vehiclesFiltered.length; i++) {
        let data = {
          name_new_owner: vehiclesFiltered[i].name_new_owner,
          dni_new_owner: vehiclesFiltered[i].dni_new_owner,
          phone_new_owner: vehiclesFiltered[i].phone_new_owner,
          email_new_owner: vehiclesFiltered[i].email_new_owner,
          price_ofert: vehiclesFiltered[i].price_ofert,
          final_price_sold: vehiclesFiltered[i].final_price_sold,
          _id: vehiclesFiltered[i]._id,
          model: vehiclesFiltered[i].model,
          brand: vehiclesFiltered[i].brand,
          year: vehiclesFiltered[i].year,
          displacement: vehiclesFiltered[i].displacement,
          km: vehiclesFiltered[i].km,
          engine_model: vehiclesFiltered[i].engine_model,
          titles: vehiclesFiltered[i].titles,
          fuel: vehiclesFiltered[i].fuel,
          transmission: vehiclesFiltered[i].transmission,
          city: vehiclesFiltered[i].city,
          dealer: vehiclesFiltered[i].dealer,
          concesionary: vehiclesFiltered[i].concesionary,
          traction_control: vehiclesFiltered[i].traction_control,
          performance: vehiclesFiltered[i].performance,
          comfort: vehiclesFiltered[i].comfort,
          technology: vehiclesFiltered[i].technology,
          id_seller: vehiclesFiltered[i].id_seller,
          id_mechanic: vehiclesFiltered[i].id_mechanic,
          __v: vehiclesFiltered[i].__v,
          price: vehiclesFiltered[i].price,
          mechanicalFile: vehiclesFiltered[i].mechanicalFile,
          id_seller_buyer: vehiclesFiltered[i].id_seller_buyer,
          sold: vehiclesFiltered[i].sold,
          type_vehicle: vehiclesFiltered[i].type_vehicle,
          traction: vehiclesFiltered[i].traction,
          date_sell: vehiclesFiltered[i].date_sell,
          date_create: vehiclesFiltered[i].date_create,
          plate: vehiclesFiltered[i].plate,
          vin: vehiclesFiltered[i].vin,
          image: await ImgVehicle.findOne({
            id_vehicle: vehiclesFiltered[i]._id,
          })
            ? await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id })
            : "",
        };
        arrayVehicles.push(data);
      }
  
      reponseJson.code = 200;
      reponseJson.message = "vehículos encontrados exitosamente";
      reponseJson.status = true;
      reponseJson.data = arrayVehicles;
    } else {
      reponseJson.code = 400;
      reponseJson.message =
        "no se encontraron vehículos con los filtros seleccionados";
      reponseJson.status = false;
    }
  
    res.json(reponseJson);
  
  };
  
  sellerController.filterGraphySell = async (req: Request, res: Response) => {
      const reponseJson: ResponseModel = new ResponseModel();
      const token: any = req.header("Authorization");
      let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
    
      if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
      }
     
      let {
        month,
        yearSold,
        rangMonths,
        yearCar,
        brandCar,
        modelCar,
        id_user,
        concesionary,
      }: any = req.query;
    
      let now = new Date();
      let anioActual = now.getFullYear();
      let monthActual = (now.getMonth()+1);
      if (yearSold) {
        anioActual = yearSold;
      }
    
      if (!month) {
        month = monthActual;
      }
    
      if (!rangMonths) {
        rangMonths = 1;
      } //
    
      let firtsMonth = new Date(anioActual, month - 1, 1);
      let last = new Date(anioActual, 11);
      let lastDayLasyMont = getLastDayOfMonth(anioActual, 11);
      let lastMonth = new Date(anioActual, 11, lastDayLasyMont.getDate());
      let rangArrayMonth: any[] = [];
    
      if (rangMonths < 12) {
        rangArrayMonth = getMonthRange(month, rangMonths);
    
        firtsMonth = new Date(anioActual, month - 1, 1);
    
        if (rangArrayMonth.length > 1) {
          last = new Date(anioActual, rangArrayMonth.length - 1);
          lastDayLasyMont = getLastDayOfMonth(
            anioActual,
            rangArrayMonth.length - 1
          );
          lastMonth = new Date(
            anioActual,
            rangArrayMonth.length - 1,
            lastDayLasyMont.getDate()
          );
        } else {
          last = new Date(anioActual, month - 1);
          lastDayLasyMont = getLastDayOfMonth(anioActual, month - 1);
          lastMonth = new Date(anioActual, month - 1, lastDayLasyMont.getDate());
        }
      }
    
      let from = `${firtsMonth.getFullYear()}-${
        firtsMonth.getMonth() + 1 < 10
          ? "0" + (firtsMonth.getMonth() + 1)
          : firtsMonth.getMonth() + 1
      }-${
        firtsMonth.getDate() < 10
          ? "0" + firtsMonth.getDate()
          : firtsMonth.getDate()
      }`;
    
      let to = `${lastMonth.getFullYear()}-${
        lastMonth.getMonth() + 1 < 10
          ? "0" + (lastMonth.getMonth() + 1)
          : lastMonth.getMonth() + 1
      }-${
        lastMonth.getDate() < 10 ? "0" + lastMonth.getDate() : lastMonth.getDate()
      }`;
      let mongQuery: any = {
        date_sell: {
          $gte: from, // Filtrar documentos a partir del 1 de enero del año
          $lte: to, // Filtrar documentos hasta el 31 de diciembre del año
        },
        sold: true, // Campo de búsqueda adicional
        dispatched: true, // Campo de búsqueda adicional
      };
    
      if (yearCar) {
        mongQuery = {
          ...mongQuery,
          year: parseInt(yearCar),
        };
      }
    
      if (brandCar) {
        mongQuery = {
          ...mongQuery,
          brand: { $regex: brandCar, $options: "i" },
        };
      }
    
      if (modelCar) {
        mongQuery = {
          ...mongQuery,
          model: { $regex: modelCar, $options: "i" },
        };
      }
    
      let seller: any = null;
      let user: any = null;
    
      if (id_user) {
        seller = await sellers.findOne({ id_user: id_user });
        user = await users.findOne({ _id: id_user });
        if (seller && user.type_user != "admin") {
          mongQuery = {
            ...mongQuery,
            concesionary: { $regex: seller.concesionary, $options: "i" },
          };
        } else {
          if (concesionary) {
            mongQuery = {
              ...mongQuery,
              concesionary: { $regex: concesionary, $options: "i" },
            };
          }
        }
      }
    
      const vehiclesFiltered = await vehicles.aggregate([
        {
          $match: mongQuery,
        },
        {
          $group: {
            _id: "$date_sell",
            monto: { $sum: "$price" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    
      let sendData = [];
    
      sendData = getMonthlyTotals(vehiclesFiltered);
    
      let datos: any = {};
      let cantMonth = calcularMeses(from, to);
    
      if (cantMonth == 1 || sendData.length == 1) {
        let groupByWeek = [];
        let groupByOneMonth = [];
    
        groupByWeek = agruparPorSemana(sendData);
    
        groupByOneMonth = agruparPorWeek(groupByWeek);
    
        const labels = groupByOneMonth.map((item) => item.semana);
        const montos = groupByOneMonth.map((item) => item.monto);
        datos = {
          labels: labels, // Meses en el eje x
          datasets: [
            {
              label: "Montos Mensuales",
              data: montos, // Montos en el eje y
            },
          ],
        };
      } else {
        const labels = sendData.map((dato) => dato._id);
    
        let nameArray = [];
        for (let i = 0; i < labels.length; i++) {
          nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
        }
    
        const montos = sendData.map((dato) => dato.monto);
    
        datos = {
          labels: nameArray, // Meses en el eje x
          datasets: [
            {
              label: "Montos Mensuales",
              data: montos, // Montos en el eje y
            },
          ],
          // vehicles:cards,
        };
      }
    
      if (datos) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = datos;
      } else {
        reponseJson.code = 200;
        reponseJson.message = "sin resultado";
        reponseJson.status = false;
      }
    
      res.json(reponseJson);
    };
  
  sellerController.listVehiclesSell = async (req: Request, res: Response) => { 
      const reponseJson: ResponseModel = new ResponseModel();
      
      const token: any = req.header("Authorization");
      let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
    
      if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
      }
      
      let {
        dateTo,
        dateFrom,
        yearCar,
        brandCar,
        modelCar,
        concesionary,
        id_user,
      }: any = req.query;
      let now = new Date();
    
      let from_at = `${now.getFullYear()}-01-01`;
      let to_at = `${now.getFullYear()}-12-31`;
    
      let mongQuery: any = {
        sold: true, // Campo de búsqueda adicional
        dispatched: true,
        date_sell: {
          $gte: from_at,
          $lte: to_at,
        },
      };
    
      let otherMong:any = {
        sold: true, // Campo de búsqueda adicional
        dispatched: true,
        date_sell: {
          $gte: from_at,
          $lte: to_at,
        },
      };
    
      if (dateFrom && dateTo) {
        let from = new Date(dateFrom).toISOString().substr(0, 10);
        let to = new Date(dateTo).toISOString().substr(0, 10);
    
        mongQuery = {
          ...mongQuery,
          date_sell: {
            $gte: from,
            $lte: to,
          },
        };
        otherMong={
          ...otherMong,
          date_sell: {
            $gte: from,
            $lte: to,
          },
        }
      }
    
      if (yearCar) {
        mongQuery = {
          ...mongQuery,
          year: parseInt(yearCar),
        };
        otherMong={
          ...otherMong,
          year: parseInt(yearCar),
    
        }
    
      }
    
      if (brandCar) {
        mongQuery = {
          ...mongQuery,
          brand: { $regex: brandCar, $options: "i" },
        };
        otherMong={
          ...otherMong,
          brand: { $regex: brandCar, $options: "i" },
    
    
        }
      }
    
      if (modelCar) {
        mongQuery = {
          ...mongQuery,
          model: { $regex: modelCar, $options: "i" },
        };
        otherMong={
          ...otherMong,
          model: { $regex: modelCar, $options: "i" },
        }
      }
    
      if (concesionary) {
        mongQuery = {
          ...mongQuery,
          concesionary: { $regex: concesionary, $options: "i" },
        };
      }
      
      // let seller: any = null;
      let user: any = null;
        user = await users.findOne({ _id: id_user });
    
      // if (id_user) {
      //   seller = await Sellers.findOne({ id_user: id_user });
      //   if (seller && user.type_user != "admin") {
      //     mongQuery = {
      //       ...mongQuery,
      //       concesionary: { $regex: seller.concesionary, $options: "i" },
      //     };
      //   } else {
      //     if (concesionary) {
      //       mongQuery = {
      //         ...mongQuery,
      //         concesionary: { $regex: concesionary, $options: "i" },
      //       };
      //     }
      //   }
      // }
    
    
      const cardsgroupmodel = await vehicles.aggregate([
        {
          $match: mongQuery,
        },
        {
          $group: {
            _id: "$model",
            minPrice: { $min: "$price" },
            avgPrice: { $avg: "$price" },
            maxPrice: { $max: "$price" },
            vehicles: { $push: "$$ROOT" },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
    
    
      const cardsgroupNacional = await vehicles.aggregate([
        {
          $match: otherMong,
        },
        {
          $group: {
            _id: "$model",
            minPriceGlobal: { $min: "$price" },
            avgPriceGlobal: { $avg: "$price" },
            maxPriceGlobal: { $max: "$price" },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
    
      
      for (let i = 0; i < cardsgroupmodel.length; i++) {
    
          for (let j = 0; j < cardsgroupmodel[i].vehicles.length; j++) {
            cardsgroupmodel[i].vehicles[j].imgVehicle = null;
            let imgvehicles = await ImgVehicle.findOne({ id_vehicle: cardsgroupmodel[i].vehicles[j]._id });
            cardsgroupmodel[i].vehicles[j].imgVehicle = imgvehicles;
            
          }
        
        cardsgroupNacional.forEach((model: any) => {
          if (cardsgroupmodel[i]._id == model._id) {
            cardsgroupmodel[i] = {
              ...cardsgroupmodel[i],
              minPriceGlobal: model.minPriceGlobal,
              avgPriceGlobal: model.avgPriceGlobal,
              maxPriceGlobal: model.maxPriceGlobal,
            };
          }
        });
      }
    
      let otherQuery = {
        ...mongQuery,
        mechanicalFile: true,
      };
      let countMechanicaFile: any[] = [];
    
        countMechanicaFile = await vehicles.aggregate([
          {
            $match: otherQuery,
          },
          {
            $lookup: {
              from: "mechanicalfiles",
              localField: "_id",
              foreignField: "id_vehicle",
              as: "mechanicalfiles",
            },
          },
          {
            $unwind: {
              path: "$mechanicalfiles",
            },
          },
          {
            $match: {
              "mechanicalfiles.general_condition": {
                $in: ["bueno", "malo", "regular", "excelente"],
              },
            },
          },
          {
            $group: {
              _id: "$mechanicalfiles.general_condition",
              count: { $sum: 1 },
            },
          },
        ]);
    
      let datos: any = {};
      datos = {
        grupocard: cardsgroupmodel,
        mechanicaFiles: countMechanicaFile,
      };
    
      if (datos) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = datos;
      } else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
      }
      res.json(reponseJson);
    };
  

// -------brand------

sellerController.allBrands = async (req: Request, res: Response) => {
  const jsonResponse: ResponseModel = new ResponseModel();

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    jsonResponse.code = jwt.code;
    jsonResponse.message = jwt.message;
    jsonResponse.status = false;
    jsonResponse.data = null;
    return res.json(jsonResponse);
  }

  const brand = await brands.find();

  if (brand) {
    jsonResponse.code = 200;
    jsonResponse.message = "marcas encontradas";
    jsonResponse.status = true;
    jsonResponse.data = brand;
  } else {
    jsonResponse.code = 400;
    jsonResponse.message = "no se encontraron marcas";
    jsonResponse.status = false;
  }

  res.json(jsonResponse);
};


// -----model-----

sellerController.allModels = async (req: Request, res: Response) => {
  const jsonResponse: ResponseModel = new ResponseModel();

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    jsonResponse.code = jwt.code;
    jsonResponse.message = jwt.message;
    jsonResponse.status = false;
    jsonResponse.data = null;
    return res.json(jsonResponse);
  }

  const model = await modelVehicle.find();

  if (model) {
    jsonResponse.code = 200;
    jsonResponse.message = "todos los modelos";
    jsonResponse.status = true;
    jsonResponse.data = model;
  } else {
    jsonResponse.code = 400;
    jsonResponse.message = "no hay modelos";
    jsonResponse.status = false;
  }

  res.json(jsonResponse);
};
sellerController.autocompleteModels = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { search } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  
    if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
    }
  
    const vehiclesFiltered = await modelVehicle.find({
      model: { $regex: search, $options: "i" },
    });
  
    if (vehiclesFiltered) {
      reponseJson.code = 200;
      reponseJson.message = "success";
      reponseJson.status = true;
      reponseJson.data = vehiclesFiltered;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "no existe";
      reponseJson.status = false;
    }
  
    res.json(reponseJson);
  };

// -----ventas------

sellerController.buyVehicle = async (req: Request, res: Response) => {
  const responseJson: ResponseModel = new ResponseModel();
  const date_sell = moment().format("YYYY-MM-DD");
  const {
    id_vehicle,
    id_seller,
    name_new_owner,
    dni_new_owner,
    phone_new_owner,
    email_new_owner,
    price_ofert,
  } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    responseJson.code = jwt.code;
    responseJson.message = jwt.message;
    responseJson.status = false;
    responseJson.data = null;
    return res.json(responseJson);
  }

  // const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
  //   id_seller_buyer: id_seller,
  //   name_new_owner: name_new_owner,
  //   dni_new_owner: dni_new_owner,
  //   phone_new_owner: phone_new_owner,
  //   email_new_owner: email_new_owner,
  //   price_ofert: price_ofert,
  // });

  // const sameIdSeller = await vehicles.findById(id_vehicle);

  // if (sameIdSeller!.id_seller?.toString() === id_seller) {
  //   console.log('soy el comprador')
  //   const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
  //     id_seller_buyer: id_seller,
  //     name_new_owner: name_new_owner,
  //     dni_new_owner: dni_new_owner,
  //     phone_new_owner: phone_new_owner,
  //     email_new_owner: email_new_owner,
  //     price_ofert: price_ofert,
  //     price: price_ofert,
  //     sold: true,
  //     date_sell: date_sell,
  //     final_price_sold: price_ofert,
  //     dispatched: true,
  //   });

  //   if (vehicle) {
  //     responseJson.code = 200;
  //     responseJson.message = "vehículo comprado exitosamente";
  //     responseJson.status = true;
  //     responseJson.data = vehicle;
  //   } else {
  //     responseJson.code = 400;
  //     responseJson.message = "no se pudo comprar el vehículo";
  //     responseJson.status = false;
  //   }
  // } else {

  const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
    id_seller_buyer: id_seller,
    name_new_owner: name_new_owner,
    dni_new_owner: dni_new_owner,
    phone_new_owner: phone_new_owner,
    email_new_owner: email_new_owner,
    price_ofert: price_ofert,
    date_sell: date_sell,
    sold: false,
  });

  const getVehicle = await vehicles.findById(id_vehicle);

  const infoBuyer = await sellers.findById(id_seller);

  const infoSeller = await sellers.findById(getVehicle!.id_seller);

  const email = await users.findById(infoSeller!.id_user);

  const emailBuyer = await users.findById(infoBuyer!.id_user);

  const mailOptions = {
    from: "Toyousado Notifications",
    to: email!.email,
    subject: "Oferta de vehículo",
    html: `<div>
        <p>Tienes una oferta de compra para:</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              getVehicle!.model
            }</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              getVehicle!.year
            }</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              getVehicle!.plate
            }</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              infoSeller!.fullName
            }</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              infoSeller!.concesionary
            }</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
              infoSeller!.city
            }</div>
        </div>
        </div>
        </div>`,
  };

  const dataVehicle = {
    model: getVehicle!.model,
    year: getVehicle!.year,
    plate: getVehicle!.plate,
    fullName: infoSeller!.fullName,
    concesionary: infoSeller!.concesionary,
    city: infoSeller!.city,
    title: "Tienes una oferta de compra para:",
  };

  await sendEmail(mailOptions);

  sendNotification(
    infoSeller!._id.toString(),
    dataVehicle,
    "Oferta de vehículo"
  );

  responseJson.code = 200;
  responseJson.message =
    "Compra realizada, esperar confirmación o rechazo del vendedor";
  responseJson.status = true;
  // }

  res.json(responseJson);
};



// ----notificaciones----

sellerController.getNotifications = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id_user } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

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

sellerController.updateNotification = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

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

sellerController.notificationById = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

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

sellerController.countNotifications = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id_user } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

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







// -----tecnico mecanico---

sellerController.addMechanic = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  const date_created = moment().format("YYYY-MM-DD");
  const { email, password, username, fullName, city, concesionary } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const exist = await users.findOne({ email: email });

  if (exist) {
    reponseJson.code = 400;
    reponseJson.message = "El usuario se encuentra registrado";
    reponseJson.status = false;
    reponseJson.data = "";
  } else {
    const newUser = new users({
      email,
      password: hash,
      username,
      type_user: "mechanic",
    });

    const newMechanic = new mechanics({
      fullName,
      city,
      concesionary,
      date_created,
    });

    await newUser.save();

    if (newUser) {
      newMechanic.id_user = newUser._id;
    }

    await newMechanic.save();

    if (newMechanic && newUser) {
      const mailOptions = {
        from: "Toyousado",
        to: email,
        subject: "Bienvenido",
        text:
          "Bienvenido a Toyousado, tu usuario es: " +
          email +
          " y tu contraseña es: " +
          password +
          "",
      };

      await sendEmail(mailOptions);

      reponseJson.code = 200;
      reponseJson.message = "Técnico agregado exitosamente";
      reponseJson.status = true;
      reponseJson.data = "";
    } else {
      reponseJson.code = 400;
      reponseJson.message = "Error al agregar técnico";
      reponseJson.status = false;
      reponseJson.data = "";
    }
  }

  res.json(reponseJson);
};


sellerController.allMechanics = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  let arrayMechanics: any[] = [];
  let infoMechanic: any[] = [];

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const ress = await users.find({ type_user: "mechanic" })
    .then(async (res: any) => {
      if (res) {
        reponseJson.code = 200;
        reponseJson.message = "Técnicos encontrados";
        reponseJson.status = true;

        for (let i = 0; i < res.length; i++) {
          await mechanics
            .find({ id_user: res[i]._id })
            .then((res2: any) => {
              if (res2) {
                res2.forEach((element: any) => {
                  infoMechanic.push(element);
                });
              } else {
                infoMechanic = [];
                return res2;
              }
            })
            .catch((err: any) => {
              console.log(err);
            });
        }

        for (let j = 0; j < res.length; j++) {
          for (let k = 0; k < infoMechanic.length; k++) {
            if (res[j]._id.toString() === infoMechanic[k].id_user.toString()) {
              let mechanic = {
                id: res[j]._id,
                id_mechanic: infoMechanic[k]._id,
                fullName: infoMechanic[k].fullName,
                city: infoMechanic[k].city,
                concesionary: infoMechanic[k].concesionary,
                email: res[j].email,
                username: res[j].username,
                type_user: res[j].type_user,
                image: (await imgUserSchema.findOne({ id_user: res[j]._id }))
                  ? await imgUserSchema.findOne({ id_user: res[j]._id })
                  : "",
              };
              arrayMechanics.push(mechanic);
            }
          }
        }

        reponseJson.data = arrayMechanics;
        return reponseJson;
      } else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron técnicos";
        reponseJson.status = false;
        return reponseJson;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });

  res.json(ress);
};


sellerController.mechanicByConcesionary = async (
  req: Request,
  res: Response
) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  const { concesionary } = req.body;
  let arrayMechanics: any[] = [];

  const mecByConcesionary = await mechanics.find({
    concesionary: concesionary,
  });

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

    if (mecByConcesionary) {
      for (let i = 0; i < mecByConcesionary.length; i++) {
        let mechanic = {
          _id: mecByConcesionary[i]._id,
          fullName: mecByConcesionary[i].fullName,
          city: mecByConcesionary[i].city,
          concesionary: mecByConcesionary[i].concesionary,
          id_user: mecByConcesionary[i].id_user,
          date_create: mecByConcesionary[i].date_created,
          image: (await imgUserSchema.findOne({
            id_user: mecByConcesionary[i].id_user,
          }))
            ? await imgUserSchema.findOne({ id_user: mecByConcesionary[i].id_user })
            : "",
        };
        arrayMechanics.push(mechanic);
      }

      reponseJson.code = 200;
      reponseJson.message = "Técnicos encontrados";
      reponseJson.status = true;
      reponseJson.data = arrayMechanics;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "no se encontraron Técnicos";
      reponseJson.status = false;
    }

    res.json(reponseJson);
}


// ------zonas-----
sellerController.allZones = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }
  const ress = await ZonesSchema
    .find()
    .then((res: any) => {
      if (res) {
        reponseJson.code = 200;
        reponseJson.message = "zonas encontradas";
        reponseJson.status = true;
        reponseJson.data = res;
        return reponseJson;
      } else if (!res) {
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron zonas";
        reponseJson.status = false;
        return reponseJson;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
  res.json(ress);
};

// ----concesionario----

sellerController.allConcesionaries = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { search } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const ress = await concesionary
    .find()
    .then(async (res: any) => {
      console.log(res);
      if (res) {
        reponseJson.code = 200;
        reponseJson.message = "concesionarias encontradas";
        reponseJson.status = true;
        reponseJson.data = res;
        return reponseJson;
      } else if (!res) {
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron concesionarias";
        reponseJson.status = false;
        return reponseJson;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });

  res.json(ress);
};




const desgloseImg = async (image: any) => {
  let posr = image.split(";base64").pop();
  let imgBuff = Buffer.from(posr, "base64");

  const resize = await sharp(imgBuff)
    .resize(300, 250)
    .toBuffer()
    .then((data) => {
      return data;
    })
    .catch((err: any) => {
      console.log("error", err);
      return "";
    });

  return "data:image/jpeg;base64," + resize.toString("base64");
};

const sendNotification = async (
  id_seller: string,
  data: any,
  title: string
) => {
  // const jsonRes: ResponseModel = new ResponseModel();

  const userInfo = await sellers.findOne({ _id: id_seller });

  if (userInfo) {
    const notify = new notifications({
      id_user: userInfo.id_user,
      title: title,
      data: data,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      status: false,
    });

    await notify.save();
  }
};

const sendNotificationMechanic = async (
  id_mechanic: string,
  data: any,
  title: string
) => {
  const userInfo = await mechanics.findOne({ _id: id_mechanic });

  if (userInfo) {
    const notify = new notifications({
      id_user: userInfo.id_user,
      title: title,
      data: data,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      status: false,
    });

    await notify.save();
  }
};

function getMonthlyTotals(data: any) {
  const monthlyTotals: any = [];
  for (let i = 0; i < data.length; i++) {
    const document = data[i];
    const month = document._id.substring(0, 7); // Extrae el año y mes de la fecha
    if (monthlyTotals[month]) {
      monthlyTotals[month] += document.monto; // Si el mes ya existe en el objeto, acumula el monto
    } else {
      monthlyTotals[month] = document.monto; // Si el mes no existe en el objeto, crea la propiedad y asigna el monto
    }
  }
  const result = [];
  for (const month in monthlyTotals) {
    result.push({ _id: month + "-01", monto: monthlyTotals[month] }); // Convierte el objeto en un array
  }
  return result;
}

const calcularMeses = (fechaInicial: any, fechaFinal: any) => {
  const inicio = new Date(fechaInicial);
  const fin = new Date(fechaFinal);

  const diferenciaMeses =
    (fin.getFullYear() - inicio.getFullYear()) * 12 +
    (fin.getMonth() - inicio.getMonth());

  return diferenciaMeses;
};

const agruparPorSemana = (datos: any) => {
  const semanas = [];

  for (const dato of datos) {
    const fecha = new Date(dato._id);
    const semana = getWeekNumber(fecha);
    if (semanas[semana]) {
      semanas[semana] += dato.monto;
    } else {
      semanas[semana] = dato.monto;
    }
  }

  const result = [];
  for (const semana in semanas) {
    result.push({ semana: Number(semana), monto: semanas[semana] });
  }

  return result;
};

// Función para obtener el número de semana de una fecha
const getWeekNumber = (date: any) => {
  const onejan: any = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil(((date - onejan) / 86400000 + onejan.getDay()) / 7);
  return week;
};

const agruparPorWeek = (datos: any) => {
  const semanas = [];
  let contador = 1;

  for (const dato of datos) {
    if (!semanas[contador]) {
      semanas[contador] = 0;
    }
    semanas[contador] += dato.monto;
    contador++;
  }

  const result = [];
  for (const semana in semanas) {
    result.push({ semana: Number(semana), monto: semanas[semana] });
  }

  return result;
};

function getMonthRange(startMonth: any, rangeMonths: any) {
  const months = [
    { month: "Enero", index: 1 },
    { month: "Febrero", index: 2 },
    { month: "Marzo", index: 3 },
    { month: "Abril", index: 4 },
    { month: "Mayo", index: 5 },
    { month: "Junio", index: 6 },
    { month: "Julio", index: 7 },
    { month: "Agosto", index: 8 },
    { month: "Septiembre", index: 9 },
    { month: "Octubre", index: 10 },
    { month: "Noviembre", index: 11 },
    { month: "Diciembre", index: 12 },
  ];

  const startMonthIndex = startMonth - 1;
  const endMonthIndex = Math.min(
    startMonthIndex + parseInt(rangeMonths) - 1,
    11
  );
  const monthRange = months.slice(startMonthIndex, endMonthIndex + 1);
  return monthRange;
}

function getLastDayOfMonth(year: any, month: any) {
  // Ajustar el mes para que sea el siguiente
  const nextMonth = month + 1;

  // Crear una nueva fecha con el primer día del mes siguiente
  const firstDayOfNextMonth = new Date(year, nextMonth, 1);

  // Restar un día para obtener el último día del mes actual
  const lastDayOfMonth = new Date(
    firstDayOfNextMonth.getTime() - 24 * 60 * 60 * 1000
  );

  return lastDayOfMonth;
}

const getNameMonth = (date: any) => {
  const partsDate = date.split("-");
  const months = [
    { month: "Enero", index: 1 },
    { month: "Febrero", index: 2 },
    { month: "Marzo", index: 3 },
    { month: "Abril", index: 4 },
    { month: "Mayo", index: 5 },
    { month: "Junio", index: 6 },
    { month: "Julio", index: 7 },
    { month: "Agosto", index: 8 },
    { month: "Septiembre", index: 9 },
    { month: "Octubre", index: 10 },
    { month: "Noviembre", index: 11 },
    { month: "Diciembre", index: 12 },
  ];

  return months.filter((mes) => mes.index === parseInt(partsDate[1]))[0].month;
};

export default sellerController;
