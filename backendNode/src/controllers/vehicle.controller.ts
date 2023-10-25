import { Request, Response } from "express";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import sellers from "../schemas/Sellers.schema";
import mechanics from "../schemas/Mechanics.schema";
import jwt from "../helpers/generar-jwt";
import moment from "moment";
import { sendEmail } from "../../nodemailer";
import Sellers from "../schemas/Sellers.schema";
import Vehicles from "../schemas/Vehicles.schema";
import notifications from "../schemas/notifications.schema";
import sharp from "sharp";
import vehicles from "../schemas/Vehicles.schema";
import mechanicalsFiles from "../schemas/mechanicalsFiles.schema";
import ImgVehicle from "../schemas/ImgVehicle.schema";
import { deleteImageVehicle, uploadDocuments, uploadImageVehicle } from "../../cloudinaryMetods";
import * as global from "../global";

const vehicleController: any = {};

vehicleController.addVehicle = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  let emailmechanic: any = "";
  let infoSeller: any = {};
  let dateNow = moment().format("YYYY-MM-DD");
  let documents: any[] = [];

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
    imgs_documents
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
  emailmechanic = await Users.findOne({ _id: mec?.id_user });

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

  if (imgs_documents) {
    if (imgs_documents.length > 0) {
      for (let i = 0; i < imgs_documents.length; i++) {
        const imgResize = await desgloseImg(imgs_documents[i].image);

        const filename = await uploadDocuments(imgResize);

        let data = {
          img: filename.secure_url,
          public_id: filename.public_id,
        };

        documents.push(data);
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

vehicleController.addImgVehicle = async (req: Request, res: Response) => {
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

vehicleController.deleteImgVehicle = async (req: Request, res: Response) => {
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

vehicleController.updateImgVehicle = async (req: Request, res: Response) => {
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

vehicleController.updateVehicle = async (req: Request, res: Response) => {
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

vehicleController.allVehicles = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  let query: any = {};

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin","mechanic"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle} = req.body;
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
  query.id_seller_buyer = null;
  
  if (decode.type_user=="mechanic") {
    query.id_mechanic=decode.id_mechanic
  }else if(decode.type_user=="seller"){
    query.id_seller = decode.id_seller;
  }

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

vehicleController.myVehicles = async (req: Request, res: Response) => {
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
    type_vehicle
  } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller","admin","mechanic"]);
  console.log(decode)

  if (decode == false) {
    jsonRes.code = jwt.code;
    jsonRes.message = jwt.message;
    jsonRes.status = false;
    jsonRes.data = null;
    return res.json(jsonRes);
  }


  if (decode.type_user=="mechanic") {
    query.id_mechanic=decode.id_mechanic
  }else if(decode.type_user=="seller"){
    query.id_seller = decode.id_seller;
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

vehicleController.vehicleById = async (req: Request, res: Response) => {
  const jsonRes: ResponseModel = new ResponseModel();

  const { id } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin","mechanic"]);

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
      imgs_documentation: infoVehicle.imgs_documentation ? infoVehicle.imgs_documentation : [],
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

vehicleController.mechanicalFileByIdVehicle = async (
  req: Request,
  res: Response
) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id_vehicle } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["mechanic", "seller", "admin" ]);

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

vehicleController.dispatchedCar = async (req: Request, res: Response) => {
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

vehicleController.repost = async (req: Request, res: Response) => {
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

vehicleController.getVehicleByType = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin","mechanic"]);

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

vehicleController.filterVehiclesWithMongo = async (
  req: Request,
  res: Response
) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin","mechanic"]);

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

vehicleController.filterGraphySale = async (req: Request, res: Response) => {
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

  let now = new Date();
  let anioActual = now.getFullYear();
  let monthActual = now.getMonth() + 1;
  if (data.yearSold) {
    anioActual = data.yearSold;
  }

  if (!data.month) {
    data.month = monthActual;
  }

  if (!data.rangMonths) {
    data.rangMonths = 1;
  } //

  let firtsMonth = new Date(anioActual, data.month - 1, 1);
  let last = new Date(anioActual, 11);
  let lastDayLasyMont = getLastDayOfMonth(anioActual, 11);
  let lastMonth = new Date(anioActual, 11, lastDayLasyMont.getDate());
  let rangArrayMonth: any[] = [];

  if (data.rangMonths < 12) {
    rangArrayMonth = getMonthRange(data.month, data.rangMonths);

    firtsMonth = new Date(anioActual, data.month - 1, 1);

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
      last = new Date(anioActual, data.month - 1);
      lastDayLasyMont = getLastDayOfMonth(anioActual, data.month - 1);
      lastMonth = new Date(
        anioActual,
        data.month - 1,
        lastDayLasyMont.getDate()
      );
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

  if (data.yearCar) {
    mongQuery = {
      ...mongQuery,
      year: parseInt(data.yearCar),
    };
  }

  if (data.brandCar) {
    mongQuery = {
      ...mongQuery,
      brand: { $regex: data.brandCar, $options: "i" },
    };
  }

  if (data.modelCar) {
    mongQuery = {
      ...mongQuery,
      model: { $regex: data.modelCar, $options: "i" },
    };
  }

  let user: any = null;

  if (decode.type_user == "seller") {
    user = await Users.findOne({ _id: decode.id });
    if (user) {
      mongQuery = {
        ...mongQuery,
        concesionary: { $regex: user.concesionary, $options: "i" },
      };
    } else {
      if (data.concesionary) {
        mongQuery = {
          ...mongQuery,
          concesionary: { $regex: data.concesionary, $options: "i" },
        };
      }
    }
  }

  let sendData: any = [];
  let chartData: any = {};

  let datos: any = {};

  let optionset = {
    label: "Cantidad de autos vendido Mensuales",
    fill: false,
    backgroundColor: "rgba(75,192,192,0.4)",
    borderColor: "rgba(75,192,192,1)",
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: "rgba(75,192,192,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(75,192,192,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    spanGaps: false,
    data: {}, // Montos en el eje y
  };

  if (!data.triple_m) {
    const vehiclesFiltered = await Vehicles.aggregate([
      {
        $match: mongQuery,
      },
      {
        $group: {
          _id: "$date_sell",
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          mes: "$_id",
          total: 1,
          _id: 0,
        },
      },
      { $sort: { _id: 1 } },
    ]);
    sendData = getQuantityTotals(vehiclesFiltered);

    let cantMonth = calcularMeses(from, to);

    if (cantMonth == 1 || sendData.length == 1) {
      let groupByWeek = [];
      let groupByOneMonth = [];

      groupByWeek = agruparPorSemana(sendData);

      groupByOneMonth = agruparPorWeek(groupByWeek);

      const labels = groupByOneMonth.map((item) => item.semana);
      const total = groupByOneMonth.map((item) => item.total);
      datos = {
        labels: labels, // Meses en el eje x
        datasets: [
          {
            ...optionset,
            data: total, // total en el eje y
          },
        ],
      };
    } else {
      const labels = sendData.map((dato: any) => dato.mes);
      let nameArray = [];
      for (let i = 0; i < labels.length; i++) {
        nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
      }

      const total = sendData.map((dato: any) => dato.total);

      datos = {
        labels: nameArray,
        datasets: [
          {
            ...optionset,
            data: total,
          },
        ],
      };
    }
  } else {
    let conditionGroup: any = {
      _id: "$date_sell",
      minAmount: { $min: "$price" },
      avgAmount: { $avg: "$price" },
      maxAmount: { $max: "$price" },
    };

    if (data.triple_m == "max") {
      conditionGroup = {
        _id: "$date_sell",
        maxAmount: { $max: "$price" },
        // avgAmount: { $literal: 0 },
        // minAmount: { $literal: 0 },
      };
    } else if (data.triple_m == "mid") {
      conditionGroup = {
        _id: "$date_sell",
        // maxAmount: { $literal: 0 },
        avgAmount: { $avg: "$price" },
        // minAmount: { $literal: 0 },
      };
    } else if (data.triple_m == "min") {
      conditionGroup = {
        _id: "$date_sell",
        // maxAmount: { $literal: 0 },
        // avgAmount: { $literal: 0 },
        minAmount: { $min: "$price" },
      };
    } else if (data.triple_m == "all") {
      conditionGroup = {
        _id: "$date_sell",
        minAmount: { $min: "$price" },
        avgAmount: { $avg: "$price" },
        maxAmount: { $max: "$price" },
      };
    }

    console.log(conditionGroup);
    const cardsgroupmodel = await Vehicles.aggregate([
      {
        $match: mongQuery,
      },
      {
        $group: conditionGroup,
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const result = groupAndSumByMonth(cardsgroupmodel);

    var labels: any = [];
    var minData: any = [];
    var avgData: any = [];
    var maxData: any = [];

    result.forEach(function (item) {
      labels.push(getNameMonth(item.month)); // Agregar el mes como etiqueta
      minData.push(item.minAmount); // Agregar el monto mínimo
      avgData.push(item.avgAmount); // Agregar el monto promedio
      maxData.push(item.maxAmount); // Agregar el monto máximo
    });

    chartData = {
      labels: labels,
      datasets: [
        {
          label: "Monto Mínimo",
          data: minData,
          borderColor: "blue",
          fill: false,
        },
        {
          label: "Monto Promedio",
          data: avgData,
          borderColor: "green",
          fill: false,
        },
        {
          label: "Monto Máximo",
          data: maxData,
          borderColor: "red",
          fill: false,
        },
      ],
    };

    datos = chartData;
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

vehicleController.listVehiclesSale = async (req: Request, res: Response) => {
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

  let otherMong: any = {
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
    otherMong = {
      ...otherMong,
      date_sell: {
        $gte: from,
        $lte: to,
      },
    };
  }

  if (yearCar) {
    mongQuery = {
      ...mongQuery,
      year: parseInt(yearCar),
    };
    otherMong = {
      ...otherMong,
      year: parseInt(yearCar),
    };
  }

  if (brandCar) {
    mongQuery = {
      ...mongQuery,
      brand: { $regex: brandCar, $options: "i" },
    };
    otherMong = {
      ...otherMong,
      brand: { $regex: brandCar, $options: "i" },
    };
  }

  if (modelCar) {
    mongQuery = {
      ...mongQuery,
      model: { $regex: modelCar, $options: "i" },
    };
    otherMong = {
      ...otherMong,
      model: { $regex: modelCar, $options: "i" },
    };
  }

  if (concesionary) {
    mongQuery = {
      ...mongQuery,
      concesionary: { $regex: concesionary, $options: "i" },
    };
  }

  // let seller: any = null;
  let user: any = null;
  user = await Users.findOne({ _id: id_user });

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
      let imgvehicles = await ImgVehicle.findOne({
        id_vehicle: cardsgroupmodel[i].vehicles[j]._id,
      });
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

vehicleController.exportExcell = async (req: Request, res: Response) => {
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
  let {
    dateTo,
    dateFrom,
    yearCar,
    brandCar,
    modelCar,
    concesionary,
    id_user,
  }: any = req.query;
  const ExcelJS = require("exceljs");
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

  let otherMong: any = {
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

    otherMong = {
      ...otherMong,
      date_sell: {
        $gte: from,
        $lte: to,
      },
    };
  }

  if (yearCar) {
    mongQuery = {
      ...mongQuery,
      year: parseInt(yearCar),
    };
    otherMong = {
      ...otherMong,
      year: parseInt(yearCar),
    };
  }

  if (brandCar) {
    mongQuery = {
      ...mongQuery,
      brand: { $regex: brandCar, $options: "i" },
    };
    otherMong = {
      ...otherMong,
      brand: { $regex: brandCar, $options: "i" },
    };
  }

  if (modelCar) {
    mongQuery = {
      ...mongQuery,
      model: { $regex: modelCar, $options: "i" },
    };
    otherMong = {
      ...otherMong,
      model: { $regex: modelCar, $options: "i" },
    };
  }
  if (concesionary) {
    mongQuery = {
      ...mongQuery,
      concesionary: { $regex: concesionary, $options: "i" },
    };
  }

  let seller: any = null;
  let user: any = null;
  if (id_user) {
    seller = await Sellers.findOne({ id_user: id_user });
    user = await Users.findOne({ _id: id_user });
    // if (seller && user.type_user != "admin") {
    //   mongQuery = {
    //     ...mongQuery,
    //     concesionary: { $regex: seller.concesionary, $options: "i" },
    //   };
    // } else {
    //   if (concesionary) {
    //     mongQuery = {
    //       ...mongQuery,
    //       concesionary: { $regex: concesionary, $options: "i" },
    //     };
    //   }
    // }
  }

  let cardsgroupmodel: any[] = [];

  cardsgroupmodel = await vehicles.aggregate([
    {
      $match: mongQuery,
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
      $unwind: "$mechanicalfiles",
    },
    {
      $group: {
        _id: "$model",
        minPrice: { $min: "$price" },
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        statusMalo: {
          $sum: {
            $cond: [
              { $eq: ["$mechanicalfiles.general_condition", "malo"] },
              1,
              0,
            ],
          },
        },
        statusRegular: {
          $sum: {
            $cond: [
              { $eq: ["$mechanicalfiles.general_condition", "regular"] },
              1,
              0,
            ],
          },
        },
        statusBueno: {
          $sum: {
            $cond: [
              { $eq: ["$mechanicalfiles.general_condition", "bueno"] },
              1,
              0,
            ],
          },
        },
        statusExcelente: {
          $sum: {
            $cond: [
              { $eq: ["$mechanicalfiles.general_condition", "excelente"] },
              1,
              0,
            ],
          },
        },
        vehicles: {
          $push: {
            $mergeObjects: [
              "$$ROOT",
              { general_condition: "$mechanicalfiles.general_condition" },
            ],
          },
        },
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

  let datos: any = {};
  datos = {
    grupocard: cardsgroupmodel,
  };
  console.log(datos);

  // Crear un nuevo archivo Excel
  const workbook = new ExcelJS.Workbook();

  // Establecer el estilo para el encabezado
  const headerStyle = {
    font: { bold: true },
  };

  // Establecer el estilo para el pie de página
  const footerStyle = {
    font: { bold: true, color: { argb: "FFFFFFFF" } }, // Texto en blanco
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF000000" } }, // Fondo negro
  };

  datos.grupocard.forEach((grupo: any) => {
    const worksheet = workbook.addWorksheet(grupo._id);

    // Agregar los encabezados de las columnas
    let columns: any[] = [];
    columns = [
      { header: "Modelo", key: "modelo", width: 15, style: headerStyle },
      { header: "Marca", key: "marca", width: 15, style: headerStyle },
      { header: "Año", key: "anhio", width: 15, style: headerStyle },
      { header: "Precio", key: "precio", width: 15, style: headerStyle },
      {
        header: "Ficha mecánica",
        key: "ficha_mécanica",
        width: 15,
        style: headerStyle,
      },
      { header: "Fecha", key: "fecha", width: 15, style: headerStyle },
      {
        header: "Fecha de venta",
        key: "fecha_venta",
        width: 15,
        style: headerStyle,
      },
      {
        header: "Desplazamiento",
        key: "desplazamiento",
        width: 15,
        style: headerStyle,
      },
      { header: "KM", key: "km", width: 15, style: headerStyle },
      {
        header: "Modelo de motor",
        key: "modelo_motor",
        width: 15,
        style: headerStyle,
      },
      { header: "Titulo", key: "titulo", width: 15, style: headerStyle },
      {
        header: "Combustible",
        key: "combustible",
        width: 15,
        style: headerStyle,
      },
      {
        header: "Transmisión",
        key: "transmision",
        width: 15,
        style: headerStyle,
      },
      { header: "Ciudad", key: "ciudad", width: 15, style: headerStyle },
      {
        header: "Concesionario",
        key: "concesionario",
        width: 30,
        style: headerStyle,
      },
      {
        header: "Control de tracción",
        key: "control_traccion",
        width: 30,
        style: headerStyle,
      },
      {
        header: "Tipo de vehiculo",
        key: "tipo_de_vehiculo",
        width: 30,
        style: headerStyle,
      },
      { header: "Tracción", key: "traccion", width: 15, style: headerStyle },
      { header: "Lamina", key: "lamina", width: 15, style: headerStyle },
      { header: "Vino", key: "vino", width: 15, style: headerStyle },
    ];

    worksheet.columns = columns;

    // Agregar los datos de los vehículos del grupo
    grupo.vehicles.forEach((vehiculo: any) => {
      let dataRow = {
        modelo: vehiculo.model,
        marca: vehiculo.brand,
        anhio: vehiculo.year,
        precio: vehiculo.price,
        ficha_mécanica: vehiculo.general_condition,
        fecha: vehiculo.date_create,
        fecha_venta: vehiculo.date_sell,
        desplazamiento: vehiculo.displacement,
        km: vehiculo.km,
        modelo_motor: vehiculo.engine_model,
        titulo: vehiculo.titles,
        combustible: vehiculo.fuel,
        transmision: vehiculo.transmission,
        ciudad: vehiculo.city,
        concesionario: vehiculo.concesionary,
        control_traccion: vehiculo.traction,
        tipo_de_vehiculo: vehiculo.type_vehicle,
        traccion: vehiculo.traction,
        lamina: vehiculo.plate,
        vino: vehiculo.vin,
      };

      worksheet.addRow(dataRow);
    });

    // Separar las secciones de los datos
    worksheet.addRow({}); // Línea vacía
    worksheet.addRow({}); // Línea vacía

    // Agregar las secciones del mínimo, medio y máximo precio
    worksheet.addRow({
      modelo: "Mínimo Precio",
      precio: grupo.minPrice,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Promedio Precio",
      precio: grupo.avgPrice,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Máximo Precio",
      precio: grupo.maxPrice,
      style: footerStyle,
    });

    // Separar las secciones de los datos
    worksheet.addRow({}); // Línea vacía
    worksheet.addRow({}); // Línea vacía

    // Agregar las secciones del mínimo, medio y máximo precio
    worksheet.addRow({
      modelo: "Mínimo Precio Global",
      precio: grupo.minPriceGlobal,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Promedio Precio Global",
      precio: grupo.avgPriceGlobal,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Máximo Precio Global",
      precio: grupo.maxPriceGlobal,
      style: footerStyle,
    });

    worksheet.addRow({}); // Línea vacía
    worksheet.addRow({}); // Línea vacía

    // Agregar las secciones del mínimo, medio y máximo precio
    worksheet.addRow({
      modelo: "Condición general - Malo",
      precio: grupo.statusMalo,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Condición general - Regular",
      precio: grupo.statusRegular,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Condición general - Bueno",
      precio: grupo.statusBueno,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Condición general - Excelente",
      precio: grupo.statusExcelente,
      style: footerStyle,
    });
  });

  const fileName = now.getTime() + ".xlsx";
  const filePath = "./public/pdf/" + fileName;
  const sendUrl = global.urlBase + "public/pdf/" + fileName;

  workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      // Envía la ruta del archivo al frontend para su descarga
      // (esto dependerá de cómo implementes la comunicación con tu aplicación Ionic)
      console.log("Archivo Excel generado:", filePath);
    })
    .catch((error: any) => {
      console.log("Error al generar el archivo Excel:", error);
    });
  let sendUser: any = await Users.findOne({ _id: id_user });
  if (sendUser) {
    const mailOptions = {
      from: "Toyousado",
      to: sendUser.email,
      subject: "Exportar excell",
      text: "puede descargar el excell " + fileName,
      attachments: [
        {
          filename: fileName, // nombre del archivo adjunto
          path: sendUrl, // ruta completa del archivo a adjuntar
        },
      ],
    };
    await sendEmail(mailOptions);
  }

  const fs = require("fs");

  // ...

  // fs.unlinkSync(filePath);

  workbook.xlsx
    .writeBuffer()
    .then(async (buffer: any) => {
      // Convertir el buffer en base64
      const base64 = buffer.toString("base64");

      // Crear un objeto de respuesta con el archivo base64
      const datos = {
        fileName: now.getTime() + ".xlsx",
        path: sendUrl,
        base64Data:
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
          base64,
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
    })
    .catch((error: any) => {
      console.log("Error al generar el archivo Excel:", error);
    });

  reponseJson.code = 200;
  reponseJson.message = "";
  reponseJson.status = true;
  reponseJson.data = data;

  res.json(reponseJson);
};

vehicleController.inspections = async (req: Request, res: Response) => {
  const reponseJson:ResponseModel = new ResponseModel();
  const {id_mechanic} = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["mechanic"]);

  if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
  }

  const vehiclesList = await vehicles.find({id_mechanic: id_mechanic, mechanicalFile: false}).sort({date_create: -1});
  if(vehiclesList.length > 0){

      let arrayInpecciones: any[] = [];

      for (let i = 0; i < vehiclesList.length; i++) {
          let data = {
              name_new_owner: vehiclesList[i].name_new_owner,
              dni_new_owner: vehiclesList[i].dni_new_owner,
              phone_new_owner: vehiclesList[i].phone_new_owner,
              email_new_owner: vehiclesList[i].email_new_owner,
              price_ofert: vehiclesList[i].price_ofert,
              final_price_sold: vehiclesList[i].final_price_sold,
              _id: vehiclesList[i]._id,
              model: vehiclesList[i].model,
              brand: vehiclesList[i].brand,
              year: vehiclesList[i].year,
              displacement: vehiclesList[i].displacement,
              km: vehiclesList[i].km,
              engine_model: vehiclesList[i].engine_model,
              titles: vehiclesList[i].titles,
              fuel: vehiclesList[i].fuel,
              transmission: vehiclesList[i].transmission,
              city: vehiclesList[i].city,
              dealer: vehiclesList[i].dealer,
              concesionary: vehiclesList[i].concesionary,
              traction_control: vehiclesList[i].traction_control,
              performance: vehiclesList[i].performance,
              comfort: vehiclesList[i].comfort,
              technology: vehiclesList[i].technology,
              id_seller: vehiclesList[i].id_seller,
              id_mechanic: vehiclesList[i].id_mechanic,
              __v: vehiclesList[i].__v,
              price: vehiclesList[i].price,
              mechanicalFile: vehiclesList[i].mechanicalFile,
              id_seller_buyer: vehiclesList[i].id_seller_buyer,
              sold: vehiclesList[i].sold,
              type_vehicle: vehiclesList[i].type_vehicle,
              traction: vehiclesList[i].traction,
              date_sell: vehiclesList[i].date_sell,
              date_create: vehiclesList[i].date_create,
              plate: vehiclesList[i].plate,
              vin: vehiclesList[i].vin,
              image: await ImgVehicle.findOne({ id_vehicle: vehiclesList[i]._id }) ? await ImgVehicle.findOne({ id_vehicle: vehiclesList[i]._id }) : "",
          }
          arrayInpecciones.push(data);
      }

      reponseJson.code = 200;
      reponseJson.status = true;
      reponseJson.message = "Inspecciones encontradas";
      reponseJson.data = arrayInpecciones;
  }else{
      reponseJson.code = 400;
      reponseJson.status = false;
      reponseJson.message = "No se encontraron inspecciones";
  }

  res.json(reponseJson);
}

vehicleController.countInspections = async (req: Request, res: Response) => {
  const reponseJson:ResponseModel = new ResponseModel();
  const {id_mechanic} = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["mechanic"]);

  if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
  }

  const vehiclesList = await vehicles.countDocuments({id_mechanic: id_mechanic, mechanicalFile: false});

  reponseJson.code = 200;
  reponseJson.status = true;
  reponseJson.message = "Cantidad de vehículos";
  reponseJson.data = vehiclesList;
  
  res.json(reponseJson);

}

vehicleController.addMechanicalFile = async (req: Request, res: Response) => {
  const reponseJson:ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["mechanic"]);
  
  if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
  }

  let mailSeller: any = "";
  let infoMechanic:any = {};
  let nameSeller: string = ""
  let conceSeller: string = ""
  let citySeller: string = ""
  let dateNow = moment().format('YYYY-MM-DD');

  const {
      part_emblems_complete,
      wiper_shower_brushes_windshield,
      hits,
      scratches,
      paint_condition,
      bugle_accessories,
      air_conditioning_system,
      radio_player,
      courtesy_lights,
      upholstery_condition,
      gts,
      board_lights,
      tire_pressure,
      tire_life,
      battery_status_terminals,
      transmitter_belts,
      motor_oil,
      engine_coolant_container,
      radiator_status,
      exhaust_pipe_bracket,
      fuel_tank_cover_pipes_hoses_connections,
      distribution_mail,
      spark_plugs_air_filter_fuel_filter_anti_pollen_filter,
      fuel_system,
      parking_break,
      brake_bands_drums,
      brake_pads_discs,
      brake_pipes_hoses,
      master_cylinder,
      brake_fluid,
      bushings_plateaus,
      stumps,
      terminals,
      stabilizer_bar,
      bearings,
      tripoids_rubbe_bands,
      shock_absorbers_coils,
      dealer_maintenance,
      headlights_lights,
      general_condition,
      id_vehicle,
      id_mechanic,
      odometer,
      engine_start,
      windshields_glass,
      hits_scratches,
      spark_plugs,
      injectors,
      fuel_filter_anti_pollen_filter,
      engine_noises,
      hits_scratches_sides,
      paint_condition_sides,
      trunk_hatch,
      spare_tire,
      hits_scratches_trunk,
      paint_condition_trunk,
      headlights_lights_trunk,
      fuel_tank_cover,
      pipes_hoses_connections,
      brake_discs,
  } = req.body;

  const newMechanicFile = new mechanicalsFiles({
      part_emblems_complete,
      wiper_shower_brushes_windshield,
      hits,
      scratches,
      paint_condition,
      bugle_accessories,
      air_conditioning_system,
      radio_player,
      courtesy_lights,
      upholstery_condition,
      gts,
      board_lights,
      tire_pressure,
      tire_life,
      battery_status_terminals,
      transmitter_belts,
      motor_oil,
      engine_coolant_container,
      radiator_status,
      exhaust_pipe_bracket,
      fuel_tank_cover_pipes_hoses_connections,
      distribution_mail,
      spark_plugs_air_filter_fuel_filter_anti_pollen_filter,
      fuel_system,
      parking_break,
      brake_bands_drums,
      brake_pads_discs,
      brake_pipes_hoses,
      master_cylinder,
      brake_fluid,
      bushings_plateaus,
      stumps,
      terminals,
      stabilizer_bar,
      bearings,
      tripoids_rubbe_bands,
      shock_absorbers_coils,
      dealer_maintenance,
      headlights_lights,
      general_condition,
      odometer,
      engine_start,
      windshields_glass,
      hits_scratches,
      spark_plugs,
      injectors,
      fuel_filter_anti_pollen_filter,
      engine_noises,
      hits_scratches_sides,
      paint_condition_sides,
      trunk_hatch,
      spare_tire,
      hits_scratches_trunk,
      paint_condition_trunk,
      headlights_lights_trunk,
      fuel_tank_cover,
      pipes_hoses_connections,
      brake_discs,
      date_create: dateNow,
      id_vehicle,
      id_mechanic
  });

  const newMechanicFileSaved = await newMechanicFile.save();

  const vehicleUpdated = await vehicles.findByIdAndUpdate(id_vehicle,{mechanicalFile: true});

  if(newMechanicFileSaved){
      reponseJson.code = 200;
      reponseJson.status = true;
      reponseJson.message = "Ficha mecánica creada correctamente";
      reponseJson.data = newMechanicFileSaved;

      //obteniendo el correo del vendedor
      const vehicle = await vehicles.findOne({_id: id_vehicle});

      if(vehicle){
          const seller = await sellers.findOne({_id: vehicle.id_seller});
          if(seller){
              nameSeller = seller!.fullName!;
              conceSeller = seller!.concesionary!;
              citySeller = seller!.city!;
              const user = await Users.findOne({_id: seller.id_user})
              if(user){
                  mailSeller = user.email!;
              }
          }
      }
      //obteniendo la informacion del tecnico
      const mechanic = await mechanics.findOne({_id: id_mechanic});

      if(mechanic){
          infoMechanic.fullname = mechanic.fullName;
          infoMechanic.concesionary = mechanic.concesionary;
          infoMechanic.city = mechanic.city;
      }

      const mailOptions = {
          from: 'Toyousado Notifications',
          to: mailSeller,
          subject: 'Ficha mecánica creada',
          html: `<div>
          <p>Ficha técnica creada exitosamente para:</p>
          </div>
          <div class="div-table" style="width: 100%;">
              <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle!.model}</div>
              </div>
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle!.year}</div>
              </div>
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle!.plate}</div>
              </div>
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${nameSeller}</div>
              </div>
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${conceSeller}</div>
              </div>
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${citySeller}</div>
              </div>
              </div>
          </div>`,
      };
      
      const dataVehicle = {
          model: vehicle!.model,
          year: vehicle!.year,
          plate: vehicle!.plate ? vehicle!.plate : "",
          fullName: nameSeller,
          concesionary: conceSeller,
          city: citySeller,
          title: "Ficha técnica creada exitosamente para:"
      }
      
      await sendEmail(mailOptions);

      sendNotification(vehicle!.id_seller?.toString()!, dataVehicle, "Ficha técnica creada");

  }else{
      reponseJson.code = 400;
      reponseJson.status = false;
      reponseJson.message = "No se pudo crear la Ficha técnica";
  }

  res.json(reponseJson);
}

vehicleController.updateMechanicalFile = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["mechanic"]);
  const {data} = req.body;

  if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
  }

  const update = await mechanicalsFiles.findByIdAndUpdate(data._id, data);

  if (update) {
      reponseJson.code = 200;
      reponseJson.message = "Ficha mecánica actualizada exitosamente";
      reponseJson.status = true;
      reponseJson.data = null;
  } else {
      reponseJson.code = 400;
      reponseJson.message = "Error al actualizar Ficha mecánica";
      reponseJson.status = false;
      reponseJson.data = null;
  }

  return res.json(reponseJson);
};

vehicleController.getMechanicFileByIdVehicle = async (req: Request, res: Response) => {
  const reponseJson:ResponseModel = new ResponseModel();
  const {id_vehicle} = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["mechanic"]);
  
  if (decode == false) {
      reponseJson.code = jwt.code;
      reponseJson.message = jwt.message;
      reponseJson.status = false;
      reponseJson.data = null;
      return res.json(reponseJson);
  }

  const mecFile = await mechanicalsFiles.findOne({id_vehicle: id_vehicle});
  if(mecFile){
      reponseJson.code = 200;
      reponseJson.status = true;
      reponseJson.message = "Ficha mecánica encontrada";
      reponseJson.data = mecFile;
  }else{
      reponseJson.code = 400;
      reponseJson.status = false;
      reponseJson.message = "No se encontro la ficha mecánica";
  }

  res.json(reponseJson);
}


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

function groupAndSumByMonth(data: any) {
  const result: any = {};

  data.forEach((item: any) => {
    const dateParts = item._id.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const monthKey = `${year}-${month}`;

    if (!result[monthKey]) {
      result[monthKey] = {
        minAmount: 0,
        avgAmount: 0,
        maxAmount: 0,
      };
    }

    result[monthKey].minAmount += item.minAmount ? item.minAmount : 0;
    result[monthKey].avgAmount += item.avgAmount ? item.avgAmount : 0;
    result[monthKey].maxAmount += item.maxAmount ? item.maxAmount : 0;
  });

  return Object.entries(result).map(([key, value]: any) => ({
    month: key,
    minAmount: value.minAmount,
    avgAmount: value.avgAmount,
    maxAmount: value.maxAmount,
  }));
}

function getQuantityTotals(data: any) {
  const quantityTotals: any = [];
  for (let i = 0; i < data.length; i++) {
    const document = data[i];
    const mes = document.mes.substring(0, 7); // Extrae el año y mes de la fecha
    if (quantityTotals[mes]) {
      quantityTotals[mes] += document.total; // Si el mes ya existe en el objeto, acumula el canitdad
    } else {
      quantityTotals[mes] = document.total; // Si el mes no existe en el objeto, crea la propiedad y asigna el cantidad
    }
  }
  const result = [];
  for (const mes in quantityTotals) {
    result.push({ mes: mes + "-01", total: quantityTotals[mes] }); // Convierte el objeto en un array
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
    const fecha = new Date(dato.mes);
    const semana = getWeekNumber(fecha);
    if (semanas[semana]) {
      semanas[semana] += dato.total;
    } else {
      semanas[semana] = dato.total;
    }
  }

  const result = [];
  for (const semana in semanas) {
    result.push({ semana: Number(semana), total: semanas[semana] });
  }

  return result;
};

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
    semanas[contador] += dato.total;
    contador++;
  }

  const result = [];
  for (const semana in semanas) {
    result.push({ semana: "Semana " + Number(semana), total: semanas[semana] });
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

export default vehicleController;
