import { Request, Response } from 'express';
import { ResponseModel } from '../models/Response';
import moment from 'moment';
import jwt from "../helpers/generar-jwt";
import sharp from "sharp";

import vehicles from '../schemas/Vehicles.schema';
import mechanics from '../schemas/Mechanics.schema';
import sellers from '../schemas/Sellers.schema';
import users from '../schemas/Users.schema';
import mechanicalsFiles from '../schemas/mechanicalsFiles.schema';
import notifications from '../schemas/notifications.schema';
import ImgVehicle from '../schemas/ImgVehicle.schema';
import { sendEmail } from '../../nodemailer';
import brands from '../schemas/brands.schema';
import modelVehicle from '../schemas/modelVehicle.schema';
import { deleteImageVehicle, uploadImageVehicle } from '../../cloudinaryMetods';


const sellerController: any = {};

sellerController.addVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
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

    const mec = await mechanics.findOne({ _id: id_mechanic })
    emailmechanic = await users.findOne({_id: mec?.id_user})
    
    
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
        html:`
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
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller!.fullName}</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller!.concesionary}</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller!.city}</div>
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
        title: "Tienes el siguiente vehículo para generar la ficha técnica"
    }

    await sendEmail(mailOptions);

    sendNotificationMechanic(id_mechanic, dataVehicle, "Revisión de vehículo");

    reponseJson.code = 200;
    reponseJson.message = "Vehículo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";

    res.json(reponseJson);
}

sellerController.addImgVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
}

sellerController.deleteImgVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { public_id } = req.body; 
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
}

sellerController.updateImgVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_vehicle, image, public_id } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

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
}

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
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

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
    id_seller
    } = req.body;

    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
    query.price = {$exists: true} ;
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

    const vehiclesFiltered = await vehicles
    .find(query)
    .sort({ date_create: -1 });


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
            images: await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id })
            ? await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id })
            : "",
        };

        arrayVehicles.push(data);
    }

        jsonRes.code = 200;
        jsonRes.message = "Vehicleos encontrados";
        jsonRes.status = true;
        jsonRes.data = arrayVehicles;
    }else{
        jsonRes.code = 400;
        jsonRes.message = "No se encontraron vehículos";
        jsonRes.status = false;
    }

    res.json(jsonRes);
}

sellerController.vehicleById = async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();

    const { id } = req.body;

    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

sellerController.mechanicalFileByIdVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id_vehicle } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
}

sellerController.allBrands = async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();

    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin"]);

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
}

sellerController.allModels = async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();

    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
}

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
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle!.model}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle!.year}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle!.plate}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller!.fullName}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller!.concesionary}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller!.city}</div>
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
        title: "Tienes una oferta de compra para:"
    }

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
}

sellerController.approveBuyVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const date_sell = moment().format("YYYY-MM-DD");
    const { id_vehicle } = req.body;

    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

sellerController.rejectBuyVehicle = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id_vehicle } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

sellerController.getNotifications = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id_user } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

sellerController.updateNotification = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id } = req.body;

    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
}

sellerController.notificationById = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
}

sellerController.countNotifications = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id_user } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

sellerController.dispatchedCar = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id, final_price_sold } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

sellerController.repost = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);

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
}

sellerController.autocompleteModels = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { search } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller","admin" ]);
    
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
}

const desgloseImg = async (image: any) => {
    let posr = image.split(";base64").pop();
    let imgBuff = Buffer.from(posr, "base64");

    const resize = await sharp(imgBuff).resize(300, 250).toBuffer().then((data) => {
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

export default sellerController;
