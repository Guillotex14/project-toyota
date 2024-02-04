"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("../models/Response");
const Users_schema_1 = __importDefault(require("../schemas/Users.schema"));
const Sellers_schema_1 = __importDefault(require("../schemas/Sellers.schema"));
const Mechanics_schema_1 = __importDefault(require("../schemas/Mechanics.schema"));
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const moment_1 = __importDefault(require("moment"));
const nodemailer_1 = require("../../nodemailer");
const Vehicles_schema_1 = __importDefault(require("../schemas/Vehicles.schema"));
const notifications_schema_1 = __importDefault(require("../schemas/notifications.schema"));
const sharp_1 = __importDefault(require("sharp"));
const Vehicles_schema_2 = __importDefault(require("../schemas/Vehicles.schema"));
const mechanicalFiles_schema_1 = __importDefault(require("../schemas/mechanicalFiles.schema"));
const ImgVehicle_schema_1 = __importDefault(require("../schemas/ImgVehicle.schema"));
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const axios_1 = __importDefault(require("axios"));
const cloudinaryMetods_1 = require("../../cloudinaryMetods");
const global = __importStar(require("../global"));
const mongoose_1 = __importDefault(require("mongoose"));
const Concesionaries_schema_1 = __importDefault(require("../schemas/Concesionaries.schema"));
const templates_mails_1 = require("../templates/mails/templates.mails");
const reportsMechanicalsFiles_schema_1 = __importDefault(require("../schemas/reportsMechanicalsFiles.schema"));
const templates_notifications_1 = require("../templates/notifications/templates.notifications");
const vehicleController = {};
vehicleController.addVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "admin_concesionary"]);
    let emailmechanic = "";
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    const { model, brand, year, displacement, km, engine_model, titles, fuel, transmission, traction, city, concesionary, traction_control, performance, comfort, technology, id_seller, id_mechanic, type_vehicle, images, vin, vehicle_plate, imgs_documents, concesionary_maintenance, certified, general_condition } = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let documents = [];
    if (imgs_documents.length > 0) {
        for (let i = 0; i < imgs_documents.length; i++) {
            // const imgResize = await desgloseImg(imgs_documents[i].image);
            const filename = yield (0, cloudinaryMetods_1.uploadDocuments)(imgs_documents[i].image);
            let data = {
                img: filename.secure_url,
                public_id: filename.public_id,
                name: imgs_documents[i].name,
            };
            documents.push(data);
        }
    }
    const newVehicle = new Vehicles_schema_2.default({
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
        concesionary_maintenance,
        certified,
        general_condition,
    });
    yield newVehicle.save();
    const mec = yield Mechanics_schema_1.default.findOne({ _id: id_mechanic });
    emailmechanic = yield Users_schema_1.default.findOne({ _id: mec.id_user });
    infoSeller = yield Sellers_schema_1.default.findOne({ _id: id_seller });
    if (images) {
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const imgResize = yield desgloseImg(images[i].image);
                const filename = yield (0, cloudinaryMetods_1.uploadImageVehicle)(imgResize);
                const imgVehi = new ImgVehicle_schema_1.default({
                    img: filename.secure_url,
                    id_vehicle: newVehicle._id,
                    public_id: filename.public_id,
                });
                yield imgVehi.save();
            }
        }
    }
    updateImgDocsVehicle(newVehicle._id.toString(), documents);
    const dataVehicle = {
        model: model,
        year: year,
        plate: vehicle_plate,
        fullName: infoSeller.fullName,
        concesionary: infoSeller.concesionary,
        city: infoSeller.city,
        title: "Tienes el siguiente vehículo para generar la ficha técnica",
        link: `${newVehicle._id}`
    };
    const template = (0, templates_mails_1.templatesMails)("newInspect", dataVehicle);
    const mailOptions = {
        from: "Toyousado",
        to: emailmechanic.email,
        subject: "Revisión de vehículo",
        html: template,
    };
    sendNotificationMechanic(id_mechanic, dataVehicle, "Revisión de vehículo");
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    const datasend = Vehicles_schema_2.default.findById(newVehicle._id);
    reponseJson.code = 200;
    reponseJson.message = "Vehículo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
});
vehicleController.addImgVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "admin_concesionary"]);
    const { id_vehicle, image } = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const filename = yield (0, cloudinaryMetods_1.uploadImageVehicle)(image);
    const newImage = new ImgVehicle_schema_1.default({
        img: filename.secure_url,
        id_vehicle: id_vehicle,
        public_id: filename.public_id,
    });
    yield newImage.save();
    if (newImage) {
        reponseJson.code = 200;
        reponseJson.message = "Imagen agregada exitosamente";
        reponseJson.status = true;
        reponseJson.data = newImage;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo agregar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.deleteImgVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { public_id } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const delImag = yield (0, cloudinaryMetods_1.deleteImageVehicle)(public_id);
    const delImg = yield ImgVehicle_schema_1.default.findOneAndDelete({ public_id: public_id });
    if (delImg) {
        reponseJson.code = 200;
        reponseJson.message = "Imagen eliminada exitosamente";
        reponseJson.status = true;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo eliminar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.updateImgVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle, image, public_id } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const delImg = yield ImgVehicle_schema_1.default.findOneAndDelete({ public_id: public_id });
    const delImag = yield (0, cloudinaryMetods_1.deleteImageVehicle)(public_id);
    if (delImg) {
        let filename = yield (0, cloudinaryMetods_1.uploadImageVehicle)(image);
        const newImage = new ImgVehicle_schema_1.default({
            img: filename.secure_url,
            id_vehicle: id_vehicle,
            public_id: filename.public_id,
        });
        yield newImage.save();
        const arrayImages = yield ImgVehicle_schema_1.default.find({ id_vehicle: id_vehicle });
        let data = {
            images: arrayImages,
            imgEdit: newImage,
        };
        reponseJson.code = 200;
        reponseJson.message = "Imagen actualizada exitosamente";
        reponseJson.data = data;
        reponseJson.status = true;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo actualizar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.addImgDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "admin_concesionary"]);
    const { id_vehicle, image } = req.body;
    console.log(image);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const filename = yield (0, cloudinaryMetods_1.uploadDocuments)(image.image);
    console.log(filename);
    const document = {
        img: filename.secure_url,
        public_id: filename.public_id,
        name: image.name,
    };
    console.log(document);
    let vehicle = yield Vehicles_schema_2.default.findById(id_vehicle);
    if (vehicle) {
        vehicle.imgs_documentation.push(document);
        vehicle.save();
    }
    console.log(vehicle);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "Imagen agregada exitosamente";
        reponseJson.status = true;
        reponseJson.data = document;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo agregar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.deleteImgDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { public_id, vehicle_id } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "admin_concesionary"]);
    let imgs_documentation = [];
    let index = 0;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const delImag = yield (0, cloudinaryMetods_1.deleteImageVehicle)(public_id);
    const delImg = yield Vehicles_schema_2.default.findByIdAndUpdate(vehicle_id, {
        $pull: { imgs_documentation: { public_id: public_id } },
    });
    if (delImg) {
        reponseJson.code = 200;
        reponseJson.message = "Imagen eliminada exitosamente";
        reponseJson.status = true;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo eliminar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.updateImgDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle, image, public_id } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const delImg = yield Vehicles_schema_2.default.findByIdAndUpdate(id_vehicle, {
        $pull: { imgs_documentation: { public_id: public_id } },
    });
    const delImag = yield (0, cloudinaryMetods_1.deleteImageVehicle)(public_id);
    if (delImg) {
        let filename = yield (0, cloudinaryMetods_1.uploadDocuments)(image.image);
        const document = {
            img: filename.secure_url,
            public_id: filename.public_id,
            name: image.name,
        };
        let vehicle = yield Vehicles_schema_2.default.findById(id_vehicle);
        if (vehicle) {
            vehicle.imgs_documentation.push(document);
            vehicle.save();
        }
        if (vehicle) {
            reponseJson.code = 200;
            reponseJson.message = "Imagen actualizada exitosamente";
            reponseJson.status = true;
            reponseJson.data = document;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "No se pudo actualizar la imagen";
            reponseJson.status = false;
        }
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo actualizar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller"]);
    const { data } = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const vehicleUpdated = yield Vehicles_schema_2.default.findByIdAndUpdate(data._id, data);
    if (vehicleUpdated) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Vehículo actualizado correctamente";
        reponseJson.data = vehicleUpdated;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo actualizar el vehículo";
    }
    res.json(reponseJson);
});
vehicleController.allVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let query = {};
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "admin_concesionary",
        "mechanic",
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, } = req.body;
    //aqui creamos las condiciones para el filtro de los vehículos y las querys
    if (minYear === 0 && maxYear === 0) {
        query.year = { $gte: 0 };
    }
    else if (minYear !== 0 && maxYear === 0) {
        query.year = { $gte: minYear };
    }
    else if (minYear === 0 && maxYear !== 0) {
        query.year = { $lte: maxYear };
    }
    else {
        query.year = { $gte: minYear, $lte: maxYear };
    }
    if (minKm === 0 && maxKm === 0) {
        query.km = { $gte: 0 };
    }
    else if (minKm !== 0 && maxKm === 0) {
        query.km = { $gte: minKm };
    }
    else if (minKm === 0 && maxKm !== 0) {
        query.km = { $lte: maxKm };
    }
    else {
        query.km = { $gte: minKm, $lte: maxKm };
    }
    if (minPrice === 0 && maxPrice === 0) {
        query.price = { $gte: 0, $ne: null };
    }
    else if (minPrice !== 0 && maxPrice === 0) {
        query.price = { $gte: minPrice, $ne: null };
    }
    else if (minPrice === 0 && maxPrice !== 0) {
        query.price = { $lte: maxPrice, $ne: null };
    }
    else {
        query.price = { $gte: minPrice, $lte: maxPrice };
    }
    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    query.mechanicalFile = true;
    query.sold = false;
    query.id_seller_buyer = null;
    if (decode.type_user == "mechanic") {
        query.id_mechanic = decode.id_mechanic;
    }
    else if (decode.type_user == "seller") {
        query.id_seller = decode.id_seller;
    }
    if (decode.type_user == "admin_concesionary") {
        query.concesionary = decode.concesionary;
    }
    const vehiclesFiltered = yield Vehicles_schema_2.default.find(query).sort({ date_create: -1 });
    if (vehiclesFiltered) {
        let arrayVehicles = [];
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
                image: (yield ImgVehicle_schema_1.default.findOne({
                    id_vehicle: vehiclesFiltered[i]._id,
                }))
                    ? yield ImgVehicle_schema_1.default.findOne({ id_vehicle: vehiclesFiltered[i]._id })
                    : "",
            };
            arrayVehicles.push(data);
        }
        reponseJson.code = 200;
        reponseJson.message = "vehículos encontrados exitosamente";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message =
            "no se encontraron vehículos con los filtros seleccionados";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.myVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    let arrayVehicles = [];
    let query = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "admin_concesionary",
        "mechanic",
    ]);
    if (decode == false) {
        jsonRes.code = generar_jwt_1.default.code;
        jsonRes.message = generar_jwt_1.default.message;
        jsonRes.status = false;
        jsonRes.data = null;
        return res.json(jsonRes);
    }
    if (decode.type_user === "mechanic") {
        query.id_mechanic = decode.id_mechanic;
        query.mechanicalFile = true;
    }
    else if (decode.type_user === "seller") {
        query.id_seller = decode.id_sell;
    }
    //aqui creamos las condiciones para el filtro de los vehículos y las querys
    if (minYear === 0 && maxYear === 0) {
        query.year = { $gte: 0 };
    }
    else if (minYear !== 0 && maxYear === 0) {
        query.year = { $gte: minYear };
    }
    else if (minYear === 0 && maxYear !== 0) {
        query.year = { $lte: maxYear };
    }
    else {
        query.year = { $gte: minYear, $lte: maxYear };
    }
    if (minKm === 0 && maxKm === 0) {
        query.km = { $gte: 0 };
    }
    else if (minKm !== 0 && maxKm === 0) {
        query.km = { $gte: minKm };
    }
    else if (minKm === 0 && maxKm !== 0) {
        query.km = { $lte: maxKm };
    }
    else {
        query.km = { $gte: minKm, $lte: maxKm };
    }
    if (decode.type_user == "seller") {
        if (minPrice === 0 && maxPrice === 0) {
            query.price = { $exists: true };
        }
        else if (minPrice !== 0 && maxPrice === 0) {
            query.price = { $gte: minPrice, $ne: null };
        }
        else if (minPrice === 0 && maxPrice !== 0) {
            query.price = { $lte: maxPrice, $ne: null };
        }
        else {
            query.price = { $gte: minPrice, $lte: maxPrice };
        }
    }
    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    const vehiclesFiltered = yield Vehicles_schema_2.default.find(query).sort({ date_create: -1 });
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
                images: (yield ImgVehicle_schema_1.default.findOne({
                    id_vehicle: vehiclesFiltered[i]._id,
                }))
                    ? yield ImgVehicle_schema_1.default.findOne({ id_vehicle: vehiclesFiltered[i]._id })
                    : "",
            };
            arrayVehicles.push(data);
        }
        jsonRes.code = 200;
        jsonRes.message = "Vehicleos encontrados";
        jsonRes.status = true;
        jsonRes.data = arrayVehicles;
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "No se encontraron vehículos";
        jsonRes.status = false;
    }
    res.json(jsonRes);
});
vehicleController.vehicleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "mechanic",
        "admin_concesionary",
    ]);
    if (decode == false) {
        jsonRes.code = generar_jwt_1.default.code;
        jsonRes.message = generar_jwt_1.default.message;
        jsonRes.status = false;
        jsonRes.data = null;
        return res.json(jsonRes);
    }
    const infoVehicle = yield Vehicles_schema_2.default.findOne({ _id: id });
    const imgsVehichle = yield ImgVehicle_schema_1.default.find({ id_vehicle: id });
    const mechanicalFile = yield mechanicalFiles_schema_1.default.findOne({ id_vehicle: id });
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
            concesionary_maintenance: infoVehicle.concesionary_maintenance,
            certified: infoVehicle.certified,
            general_condition: mechanicalFile
                ? mechanicalFile.general_condition
                : "",
            images: imgsVehichle ? imgsVehichle : [],
            imgs_documentation: infoVehicle.imgs_documentation
                ? infoVehicle.imgs_documentation
                : [],
        };
        jsonRes.code = 200;
        jsonRes.message = "success";
        jsonRes.status = true;
        jsonRes.data = data;
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "No se pudo obtener la información del vehículo";
        jsonRes.status = false;
    }
    res.json(jsonRes);
});
vehicleController.mechanicalFileByIdVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "mechanic",
        "seller",
        "admin",
        "admin_concesionary",
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    //realizamos un aggregate con la tabla de fichas mecanicas y la tabla de vehiculo para obtener el valor de ofert en la tabla vehiculos
    const mecFile = yield mechanicalFiles_schema_1.default.aggregate([
        {
            $match: {
                id_vehicle: new mongoose_1.default.Types.ObjectId(id_vehicle),
            },
        },
        {
            $lookup: {
                from: "vehicles",
                localField: "id_vehicle",
                foreignField: "_id",
                as: "vehicle",
            },
        },
        {
            $lookup: {
                from: "mechanics",
                localField: "id_mechanic",
                foreignField: "_id",
                as: "mechanic",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "mechanic.id_user",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$vehicle" },
        { $unwind: "$mechanic" },
        { $unwind: "$user" },
        {
            $project: {
                _id: 1,
                id_vehicle: 1,
                id_mechanic: 1,
                certificate: 1,
                steering_wheel: 1,
                pedals: 1,
                gauges_dashboard_lights: 1,
                transmission_shift_lever: 1,
                brake_lever: 1,
                accessories: 1,
                internal_upholstery: 1,
                courtesy_lights: 1,
                windshield: 1,
                window_glass_operation: 1,
                door_locks_handles: 1,
                operation_manual_electric_mirrors: 1,
                seat_belts: 1,
                front_bumpers: 1,
                front_grill: 1,
                headlights_low_beams_cocuyos: 1,
                fog_lights: 1,
                bonnet: 1,
                engine_ignition: 1,
                engine_noises: 1,
                general_condition_fluids: 1,
                fluid_reservoirs: 1,
                spark_plugs_coils_general_condition: 1,
                air_filter: 1,
                transmission_belts: 1,
                appearance_hoses_caps_seals_connections: 1,
                battery_condition_terminal_tightness_corrosion: 1,
                fluid_leak: 1,
                general_engine_compression_condition: 1,
                stabilizer_bars: 1,
                bearings: 1,
                joints_dust_covers: 1,
                shock_absorbers: 1,
                spirals: 1,
                upper_lower_plateaus: 1,
                stumps: 1,
                terminal_blocks: 1,
                brakes: 1,
                cardan_transmission_shaft: 1,
                engine_transmission_oil_leaks: 1,
                hydraulic_oil_leak_steering_box: 1,
                excessive_rust_on_frame_compact: 1,
                exhaust_pipe: 1,
                doors: 1,
                stop: 1,
                fuel_pump_door: 1,
                trunk_door: 1,
                trunk_interior: 1,
                replacement_rubber_tool_set: 1,
                complete_emblems: 1,
                bodywork: 1,
                paint: 1,
                tire_condition: 1,
                wheel_ornaments: 1,
                general_condition: 1,
                dealer_maintenance: 1,
                created_at: 1,
                vehicle: {
                    price_ofert: 1
                },
                mechanic: {
                    fullName: 1,
                },
            },
        }
    ]);
    if (mecFile) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecánica encontrada";
        reponseJson.data = mecFile[0];
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro la ficha mecánica";
    }
    res.json(reponseJson);
});
vehicleController.dispatchedCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id, final_price_sold } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const vehiclesFiltered = yield Vehicles_schema_2.default.findOneAndUpdate({ _id: id }, { sold: true, price: final_price_sold, dispatched: true });
    if (vehiclesFiltered) {
        reponseJson.code = 200;
        reponseJson.message = "vehículo entregado exitosamente";
        reponseJson.status = true;
        reponseJson.data = vehiclesFiltered;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "erroe al entregar vehículo";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.repost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const vehiclesFiltered = yield Vehicles_schema_2.default.findOneAndUpdate({ _id: id }, {
        sold: false,
        price_ofert: null,
        final_price_sold: null,
        name_new_owner: null,
        dni_new_owner: null,
        phone_new_owner: null,
        email_new_owner: null,
        date_sell: null,
        id_seller_buyer: null,
    });
    if (vehiclesFiltered) {
        reponseJson.code = 200;
        reponseJson.message = "vehículo publicado exitosamente";
        reponseJson.status = true;
        reponseJson.data = vehiclesFiltered;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "erroe al publicar vehículo";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.getVehicleByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "admin_concesionary",
        "mechanic",
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const { type_vehicle } = req.body;
    const arrayVehicles = yield Vehicles_schema_2.default.find({
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
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron vehículos";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.filterVehiclesWithMongo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "admin_concesionary",
        "mechanic",
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let query = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, } = req.body;
    //aqui creamos las condiciones para el filtro de los vehículos y las querys
    if (minYear === 0 && maxYear === 0) {
        query.year = { $gte: 0 };
    }
    else if (minYear !== 0 && maxYear === 0) {
        query.year = { $gte: minYear };
    }
    else if (minYear === 0 && maxYear !== 0) {
        query.year = { $lte: maxYear };
    }
    else {
        query.year = { $gte: minYear, $lte: maxYear };
    }
    if (minKm === 0 && maxKm === 0) {
        query.km = { $gte: 0 };
    }
    else if (minKm !== 0 && maxKm === 0) {
        query.km = { $gte: minKm };
    }
    else if (minKm === 0 && maxKm !== 0) {
        query.km = { $lte: maxKm };
    }
    else {
        query.km = { $gte: minKm, $lte: maxKm };
    }
    if (minPrice === 0 && maxPrice === 0) {
        query.price = { $gte: 0, $ne: null };
    }
    else if (minPrice !== 0 && maxPrice === 0) {
        query.price = { $gte: minPrice, $ne: null };
    }
    else if (minPrice === 0 && maxPrice !== 0) {
        query.price = { $lte: maxPrice, $ne: null };
    }
    else {
        query.price = { $gte: minPrice, $lte: maxPrice };
    }
    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    query.mechanicalFile = true;
    query.sold = false;
    // query.id_seller_buyer = null;
    const vehiclesFiltered = yield Vehicles_schema_2.default.find(query).sort({ date_create: -1 });
    if (vehiclesFiltered) {
        let arrayVehicles = [];
        for (let i = 0; i < vehiclesFiltered.length; i++) {
            const mechanicalFile = yield mechanicalFiles_schema_1.default.findOne({
                id_vehicle: vehiclesFiltered[i]._id,
            });
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
                concesionary_maintenance: vehiclesFiltered[i].concesionary_maintenance,
                general_condition: mechanicalFile ? mechanicalFile.general_condition : 0,
                image: (yield ImgVehicle_schema_1.default.findOne({
                    id_vehicle: vehiclesFiltered[i]._id,
                }))
                    ? yield ImgVehicle_schema_1.default.findOne({ id_vehicle: vehiclesFiltered[i]._id })
                    : "",
            };
            arrayVehicles.push(data);
        }
        reponseJson.code = 200;
        reponseJson.message = "vehículos encontrados exitosamente";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message =
            "no se encontraron vehículos con los filtros seleccionados";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.filterGraphySale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
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
    let rangArrayMonth = [];
    if (data.rangMonths < 12) {
        rangArrayMonth = getMonthRange(data.month, data.rangMonths);
        firtsMonth = new Date(anioActual, data.month - 1, 1);
        if (rangArrayMonth.length > 1) {
            last = new Date(anioActual, (rangArrayMonth[rangArrayMonth.length - 1].index - 1));
            lastDayLasyMont = getLastDayOfMonth(anioActual, (rangArrayMonth[rangArrayMonth.length - 1].index - 1));
            lastMonth = new Date(anioActual, (rangArrayMonth[rangArrayMonth.length - 1].index - 1), lastDayLasyMont.getDate());
        }
        else {
            last = new Date(anioActual, data.month - 1);
            lastDayLasyMont = getLastDayOfMonth(anioActual, data.month - 1);
            lastMonth = new Date(anioActual, data.month - 1, lastDayLasyMont.getDate());
        }
    }
    let from = `${firtsMonth.getFullYear()}-${firtsMonth.getMonth() + 1 < 10
        ? "0" + (firtsMonth.getMonth() + 1)
        : firtsMonth.getMonth() + 1}-${firtsMonth.getDate() < 10
        ? "0" + firtsMonth.getDate()
        : firtsMonth.getDate()}`;
    let to = `${lastMonth.getFullYear()}-${lastMonth.getMonth() + 1 < 10
        ? "0" + (lastMonth.getMonth() + 1)
        : lastMonth.getMonth() + 1}-${lastMonth.getDate() < 10 ? "0" + lastMonth.getDate() : lastMonth.getDate()}`;
    let mongQuery = {
        date_sell: {
            $gte: from,
            $lte: to, // Filtrar documentos hasta el 31 de diciembre del año
        },
        sold: true,
        dispatched: true, // Campo de búsqueda adicional
    };
    if (data.yearCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { year: parseInt(data.yearCar) });
    }
    if (data.brandCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { brand: { $regex: data.brandCar, $options: "i" } });
    }
    if (data.modelCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { model: data.modelCar.replace("%20", " ") });
    }
    let user = null;
    let sendData = [];
    let chartData = {};
    let datos = {};
    let optionset = {
        label: "Cantidad de autos vendidos mensuales",
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
        const vehiclesFiltered = yield Vehicles_schema_1.default.aggregate([
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
        let listCars = yield Vehicles_schema_1.default.aggregate([
            {
                $match: mongQuery,
            }
        ]);
        for (let j = 0; j < listCars.length; j++) {
            listCars[j].imgVehicle = null;
            let imgvehicles = yield ImgVehicle_schema_1.default.findOne({
                id_vehicle: listCars[j]._id,
            });
            listCars[j].imgVehicle = imgvehicles;
        }
        // sendData = getQuantityTotals(vehiclesFiltered);
        let cantMonth = calcularMeses(from, to);
        if (cantMonth == 1 || sendData.length == 1) {
            let groupByWeek = [];
            let groupByOneMonth = [];
            groupByWeek = agruparPorSemana(vehiclesFiltered);
            groupByOneMonth = agruparPorWeek(groupByWeek);
            const labels = groupByOneMonth.map((item) => item.semana);
            const total = groupByOneMonth.map((item) => item.total);
            datos = {
                labels: labels,
                datasets: [
                    Object.assign(Object.assign({}, optionset), { data: total }),
                ],
                list: listCars
            };
        }
        else {
            const labels = vehiclesFiltered.map((dato) => dato.mes);
            let nameArray = [];
            for (let i = 0; i < labels.length; i++) {
                nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
            }
            nameArray = orderMonths(nameArray);
            console.log(nameArray);
            const total = vehiclesFiltered.map((dato) => dato.total);
            datos = {
                labels: nameArray,
                datasets: [
                    Object.assign(Object.assign({}, optionset), { data: total }),
                ],
                list: listCars
            };
        }
    }
    else {
        let conditionGroup = {
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
        }
        else if (data.triple_m == "mid") {
            conditionGroup = {
                _id: "$date_sell",
                // maxAmount: { $literal: 0 },
                avgAmount: { $avg: "$price" },
                // minAmount: { $literal: 0 },
            };
        }
        else if (data.triple_m == "min") {
            conditionGroup = {
                _id: "$date_sell",
                // maxAmount: { $literal: 0 },
                // avgAmount: { $literal: 0 },
                minAmount: { $min: "$price" },
            };
        }
        else if (data.triple_m == "all") {
            conditionGroup = {
                _id: "$date_sell",
                minAmount: { $min: "$price" },
                avgAmount: { $avg: "$price" },
                maxAmount: { $max: "$price" },
            };
        }
        const cardsgroupmodel = yield Vehicles_schema_1.default.aggregate([
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
        let listCars = yield Vehicles_schema_1.default.aggregate([
            {
                $match: mongQuery,
            }
        ]);
        for (let j = 0; j < listCars.length; j++) {
            listCars[j].imgVehicle = null;
            let imgvehicles = yield ImgVehicle_schema_1.default.findOne({
                id_vehicle: listCars[j]._id,
            });
            listCars[j].imgVehicle = imgvehicles;
        }
        const result = groupAndSumByMonth(cardsgroupmodel);
        var labels = [];
        var minData = [];
        var avgData = [];
        var maxData = [];
        result.forEach(function (item) {
            labels.push(getNameMonth(item.month)); // Agregar el mes como etiqueta
            minData.push(item.minAmount); // Agregar el monto mínimo
            avgData.push(item.avgAmount); // Agregar el monto promedio
            maxData.push(item.maxAmount); // Agregar el monto máximo
        });
        let arrayMount = [];
        if (data.triple_m == "max") {
            arrayMount = [
                {
                    label: "Monto Máximo",
                    data: maxData,
                    borderColor: "red",
                    fill: false,
                }
            ];
        }
        else if (data.triple_m == "mid") {
            arrayMount = [
                {
                    label: "Monto Promedio",
                    data: avgData,
                    borderColor: "green",
                    fill: false,
                }
            ];
        }
        else if (data.triple_m == "min") {
            arrayMount = [
                {
                    label: "Monto Mínimo",
                    data: minData,
                    borderColor: "blue",
                    fill: false,
                }
            ];
        }
        else if (data.triple_m == "all") {
            arrayMount = [
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
                }
            ];
        }
        chartData = {
            labels: labels,
            datasets: arrayMount,
            list: listCars
        };
        datos = chartData;
    }
    if (datos) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = datos;
    }
    else {
        reponseJson.code = 200;
        reponseJson.message = "sin resultado";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.listVehiclesSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let { dateTo, dateFrom, yearCar, brandCar, modelCar, concesionary, id_user, } = req.query;
    let now = new Date();
    let from_at = `${now.getFullYear()}-01-01`;
    let to_at = `${now.getFullYear()}-12-31`;
    let mongQuery = {
        sold: true,
        dispatched: true,
        date_sell: {
            $gte: from_at,
            $lte: to_at,
        },
    };
    let otherMong = {
        sold: true,
        dispatched: true,
        date_sell: {
            $gte: from_at,
            $lte: to_at,
        },
    };
    if (dateFrom && dateTo) {
        let from = new Date(dateFrom).toISOString().substr(0, 10);
        let to = new Date(dateTo).toISOString().substr(0, 10);
        mongQuery = Object.assign(Object.assign({}, mongQuery), { date_sell: {
                $gte: from,
                $lte: to,
            } });
        otherMong = Object.assign(Object.assign({}, otherMong), { date_sell: {
                $gte: from,
                $lte: to,
            } });
    }
    if (yearCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { year: parseInt(yearCar) });
        otherMong = Object.assign(Object.assign({}, otherMong), { year: parseInt(yearCar) });
    }
    if (brandCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { brand: { $regex: brandCar, $options: "i" } });
        otherMong = Object.assign(Object.assign({}, otherMong), { brand: { $regex: brandCar, $options: "i" } });
    }
    if (modelCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { model: modelCar.replace("%20", " ") });
        otherMong = Object.assign(Object.assign({}, otherMong), { model: modelCar.replace("%20", " ") });
    }
    if (concesionary) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
    }
    // let seller: any = null;
    let user = null;
    user = yield Users_schema_1.default.findOne({ _id: id_user });
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
    // if (decode.type_user == "admin_concesionary") {
    //   let concesionary: any = await ConcesionariesSchema.findOne({ _id: decode.id_concesionary })
    //   mongQuery = {
    //     ...mongQuery,
    //     concesionary: { $regex: concesionary.name, $options: "i" },
    //   };
    // }
    // if (decode.type_user == "seller") {
    //   // let concesionary:any=await ConcesionariesSchema.findOne({_id:decode.id_concesionary})
    //   mongQuery = {
    //     ...mongQuery,
    //     concesionary: { $regex: decode.concesionary, $options: "i" },
    //   };
    // }
    const cardsgroupmodel = yield Vehicles_schema_2.default.aggregate([
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
    const cardsgroupNacional = yield Vehicles_schema_2.default.aggregate([
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
            let imgvehicles = yield ImgVehicle_schema_1.default.findOne({
                id_vehicle: cardsgroupmodel[i].vehicles[j]._id,
            });
            cardsgroupmodel[i].vehicles[j].imgVehicle = imgvehicles;
        }
        cardsgroupNacional.forEach((model) => {
            if (cardsgroupmodel[i]._id == model._id) {
                cardsgroupmodel[i] = Object.assign(Object.assign({}, cardsgroupmodel[i]), { minPriceGlobal: model.minPriceGlobal, avgPriceGlobal: model.avgPriceGlobal, maxPriceGlobal: model.maxPriceGlobal });
            }
        });
    }
    let otherQuery = Object.assign(Object.assign({}, mongQuery), { mechanicalFile: true });
    let countMechanicaFile = [];
    countMechanicaFile = yield Vehicles_schema_2.default.aggregate([
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
    let datos = {};
    datos = {
        grupocard: cardsgroupmodel,
        mechanicaFiles: countMechanicaFile,
    };
    if (datos) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = datos;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.exportExcell = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let { dateTo, dateFrom, yearCar, brandCar, modelCar, concesionary, id_user, } = req.query;
    const ExcelJS = require("exceljs");
    let now = new Date();
    let from_at = `${now.getFullYear()}-01-01`;
    let to_at = `${now.getFullYear()}-12-31`;
    let mongQuery = {
        sold: true,
        dispatched: true,
        date_sell: {
            $gte: from_at,
            $lte: to_at,
        },
    };
    let otherMong = {
        sold: true,
        dispatched: true,
        date_sell: {
            $gte: from_at,
            $lte: to_at,
        },
    };
    if (dateFrom && dateTo) {
        let from = new Date(dateFrom).toISOString().substr(0, 10);
        let to = new Date(dateTo).toISOString().substr(0, 10);
        mongQuery = Object.assign(Object.assign({}, mongQuery), { date_sell: {
                $gte: from,
                $lte: to,
            } });
        otherMong = Object.assign(Object.assign({}, otherMong), { date_sell: {
                $gte: from,
                $lte: to,
            } });
    }
    if (yearCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { year: parseInt(yearCar) });
        otherMong = Object.assign(Object.assign({}, otherMong), { year: parseInt(yearCar) });
    }
    if (brandCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { brand: { $regex: brandCar, $options: "i" } });
        otherMong = Object.assign(Object.assign({}, otherMong), { brand: { $regex: brandCar, $options: "i" } });
    }
    if (modelCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { model: modelCar.replace("%20", " ") });
        otherMong = Object.assign(Object.assign({}, otherMong), { model: modelCar.replace("%20", " ") });
    }
    if (concesionary) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
    }
    let seller = null;
    let user = null;
    if (decode.type_user == "admin_concesionary") {
        let concesionary = yield Concesionaries_schema_1.default.findOne({ _id: decode.id_concesionary });
        mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: concesionary.name, $options: "i" } });
    }
    if (decode.type_user == "seller") {
        // let concesionary:any=await ConcesionariesSchema.findOne({_id:decode.id_concesionary})
        mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: decode.concesionary, $options: "i" } });
    }
    let cardsgroupmodel = [];
    cardsgroupmodel = yield Vehicles_schema_2.default.aggregate([
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
    const cardsgroupNacional = yield Vehicles_schema_2.default.aggregate([
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
        cardsgroupNacional.forEach((model) => {
            if (cardsgroupmodel[i]._id == model._id) {
                cardsgroupmodel[i] = Object.assign(Object.assign({}, cardsgroupmodel[i]), { minPriceGlobal: model.minPriceGlobal, avgPriceGlobal: model.avgPriceGlobal, maxPriceGlobal: model.maxPriceGlobal });
            }
        });
    }
    let datos = {};
    datos = {
        grupocard: cardsgroupmodel,
    };
    // Crear un nuevo archivo Excel
    const workbook = new ExcelJS.Workbook();
    // Establecer el estilo para el encabezado
    const headerStyle = {
        font: { bold: true },
    };
    // Establecer el estilo para el pie de página
    const footerStyle = {
        font: { bold: true, color: { argb: "FFFFFFFF" } },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF000000" } }, // Fondo negro
    };
    datos.grupocard.forEach((grupo) => {
        const worksheet = workbook.addWorksheet(grupo._id);
        // Agregar los encabezados de las columnas
        let columns = [];
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
        grupo.vehicles.forEach((vehiculo) => {
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
    crearCarpetaSiNoExiste('./public/pdf');
    const filePath = "./public/pdf/" + fileName;
    const sendUrl = global.urlBase + "public/pdf/" + fileName;
    workbook.xlsx
        .writeFile(filePath)
        .then(() => {
        // Envía la ruta del archivo al frontend para su descarga
        // (esto dependerá de cómo implementes la comunicación con tu aplicación Ionic)
        console.log("Archivo Excel generado:", filePath);
    })
        .catch((error) => {
        console.log("Error al generar el archivo Excel:", error);
    });
    const mailOptions = {
        from: "Toyousado",
        to: decode.email,
        subject: "Exportar excell",
        text: "puede descargar el excell " + fileName,
        attachments: [
            {
                filename: fileName,
                path: sendUrl, // ruta completa del archivo a adjuntar
            },
        ],
    };
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    // ...
    // fs.unlinkSync(filePath);
    let sendadta = {};
    workbook.xlsx
        .writeBuffer()
        .then((buffer) => __awaiter(void 0, void 0, void 0, function* () {
        // Convertir el buffer en base64
        const base64 = buffer.toString("base64");
        // Crear un objeto de respuesta con el archivo base64
        sendadta = {
            fileName: now.getTime() + ".xlsx",
            path: sendUrl,
            base64Data: "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
                base64,
        };
        if (datos) {
            reponseJson.code = 200;
            reponseJson.message = "success";
            reponseJson.status = true;
            reponseJson.data = sendadta;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "no existe";
            reponseJson.status = false;
        }
        res.json(reponseJson);
    }))
        .catch((error) => {
        if (datos) {
            reponseJson.code = 200;
            reponseJson.message = "success";
            reponseJson.status = true;
            reponseJson.data = sendadta;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "no existe";
            reponseJson.status = false;
        }
        res.json(reponseJson);
    });
});
vehicleController.applyCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const mechanicalFile = yield mechanicalFiles_schema_1.default.findOne({ id_vehicle: data.id });
    let auxCertificate = false;
    if (mechanicalFile) {
        if (mechanicalFile.general_condition === "excelente" || mechanicalFile.general_condition > "96") {
            auxCertificate = true;
            reponseJson.code = 200;
            reponseJson.status = true;
            reponseJson.message = "Certificado aprobado";
        }
        else {
            auxCertificate = false;
            reponseJson.code = 200;
            reponseJson.status = false;
            reponseJson.message = "Certificado no aprobado";
        }
    }
    const vehicleUpdated = yield mechanicalFiles_schema_1.default.findByIdAndUpdate(mechanicalFile._id, {
        certificate: auxCertificate,
    });
    const mechanicalFileAux = yield mechanicalFiles_schema_1.default.findOne({ id_vehicle: data.id });
    reponseJson.data = mechanicalFileAux.certificate;
    res.json(reponseJson);
});
vehicleController.generatePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const data = req.query;
    const token = req.header("Authorization"); //....sadas
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "mechanic", "admin", "admin_concesionary"]);
    if (decode == false) {
        jsonRes.code = generar_jwt_1.default.code;
        jsonRes.message = generar_jwt_1.default.message;
        jsonRes.status = false;
        jsonRes.data = null;
        return res.json(jsonRes);
    }
    const infoVehicle = yield Vehicles_schema_2.default.findOne({ _id: data.id });
    const imgsVehichle = yield ImgVehicle_schema_1.default.find({ id_vehicle: data.id });
    if (infoVehicle) {
        const mechanicalFile = yield mechanicalFiles_schema_1.default.findOne({ id_vehicle: infoVehicle._id });
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
            dataSheet: mechanicalFile,
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
            concesionary_maintenance: infoVehicle.concesionary_maintenance,
            general_condition: mechanicalFile
                ? mechanicalFile.general_condition
                : "",
            images: imgsVehichle ? imgsVehichle : [],
            imgs_documentation: infoVehicle.imgs_documentation
                ? infoVehicle.imgs_documentation
                : [],
        };
        let img64 = "";
        if (data.images) {
            img64 = yield getImageAsBase64(data.images[0].img);
        }
        let now = new Date();
        // const fileName = now.getTime() + ".pdf";
        let sendData = {
            model: data.model,
            brand: data.brand,
            year: data.year,
            km: data.km,
            img: img64,
            displacement: data.displacement,
            fuel: data.fuel,
            titles: data.titles,
            plate: data.plate,
            transmission: data.transmission,
            traction: data.traction,
            city: data.city,
            concesionary: data.concesionary,
            price: data.price,
            traction_control: data.traction_control,
            technology: data.technology,
            performance: data.performance,
            comfort: data.comfort,
            certificate: data.dataSheet.certificate,
            concesionary_maintenance: data.concesionary_maintenance ? data.concesionary_maintenance : "false",
            general_condition: data.general_condition,
            general_condition_end: "",
        };
        if (sendData.general_condition === "excelente" || sendData.general_condition > "96") {
            sendData.general_condition_end = `excelente`;
        }
        else if (sendData.general_condition === "bueno" || (sendData.general_condition >= "86" && sendData.general_condition < "96")) {
            sendData.general_condition_end = `bueno`;
        }
        else if (sendData.general_condition === "regular" || (sendData.general_condition >= "76" && sendData.general_condition < "86")) {
            sendData.general_condition_end = `regular`;
        }
        else if (sendData.general_condition === "malo" || sendData.general_condition > "76") {
            sendData.general_condition_end = `malo`;
        }
        if (sendData.certificate) {
            sendData.certificateStr = "si";
        }
        else {
            sendData.certificateStr = "no";
        }
        try {
            const puppeteer = require('puppeteer');
            const html = yield ejs_1.default.renderFile('./src/views/template.ejs', sendData);
            const browser = yield puppeteer.launch({ args: ['--no-sandbox'] });
            const page = yield browser.newPage();
            yield page.goto('https://developer.chrome.com/');
            yield page.setContent(html);
            const pdfBuffer = yield page.pdf({
                format: 'Letter',
                printBackground: true,
                landscape: false
            });
            //
            yield browser.close();
            const fileBuffer = pdfBuffer;
            const base64Data = 'data:application/pdf;base64,' + fileBuffer.toString('base64');
            const fileName = yield (0, cloudinaryMetods_1.uploadPdf)(base64Data);
            // jsonRes.data=base64Data;//
            jsonRes.data = fileName.secure_url;
            jsonRes.code = 200;
            jsonRes.message = "";
            jsonRes.status = true;
        }
        catch (error) {
            console.log(error);
            jsonRes.code = 400;
            jsonRes.message = "error de dependencia";
            jsonRes.status = false;
        }
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "No se pudo obtener la información del vehículo";
        jsonRes.status = false;
    }
    res.json(jsonRes);
});
vehicleController.generatePdfFichaTecnica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const data = req.query;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "mechanic", "admin", "admin_concesionary"]);
    if (decode == false) {
        jsonRes.code = generar_jwt_1.default.code;
        jsonRes.message = generar_jwt_1.default.message;
        jsonRes.status = false;
        jsonRes.data = null;
        return res.json(jsonRes);
    }
    const mecFile = yield mechanicalFiles_schema_1.default.aggregate([
        {
            $match: {
                id_vehicle: new mongoose_1.default.Types.ObjectId(data.id_vehicle),
            },
        },
        {
            $lookup: {
                from: "vehicles",
                localField: "id_vehicle",
                foreignField: "_id",
                as: "vehicle",
            },
        },
        {
            $lookup: {
                from: "mechanics",
                localField: "id_mechanic",
                foreignField: "_id",
                as: "mechanic",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "mechanic.id_user",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$vehicle" },
        { $unwind: "$mechanic" },
        { $unwind: "$user" },
        {
            $project: {
                _id: 1,
                id_vehicle: 1,
                id_mechanic: 1,
                certificate: 1,
                steering_wheel: 1,
                pedals: 1,
                gauges_dashboard_lights: 1,
                transmission_shift_lever: 1,
                brake_lever: 1,
                accessories: 1,
                internal_upholstery: 1,
                courtesy_lights: 1,
                windshield: 1,
                window_glass_operation: 1,
                door_locks_handles: 1,
                operation_manual_electric_mirrors: 1,
                seat_belts: 1,
                front_bumpers: 1,
                front_grill: 1,
                headlights_low_beams_cocuyos: 1,
                fog_lights: 1,
                bonnet: 1,
                engine_ignition: 1,
                engine_noises: 1,
                general_condition_fluids: 1,
                fluid_reservoirs: 1,
                spark_plugs_coils_general_condition: 1,
                air_filter: 1,
                transmission_belts: 1,
                appearance_hoses_caps_seals_connections: 1,
                battery_condition_terminal_tightness_corrosion: 1,
                fluid_leak: 1,
                general_engine_compression_condition: 1,
                stabilizer_bars: 1,
                bearings: 1,
                joints_dust_covers: 1,
                shock_absorbers: 1,
                spirals: 1,
                upper_lower_plateaus: 1,
                stumps: 1,
                terminal_blocks: 1,
                brakes: 1,
                cardan_transmission_shaft: 1,
                engine_transmission_oil_leaks: 1,
                hydraulic_oil_leak_steering_box: 1,
                excessive_rust_on_frame_compact: 1,
                exhaust_pipe: 1,
                doors: 1,
                stop: 1,
                fuel_pump_door: 1,
                trunk_door: 1,
                trunk_interior: 1,
                replacement_rubber_tool_set: 1,
                complete_emblems: 1,
                bodywork: 1,
                paint: 1,
                tire_condition: 1,
                wheel_ornaments: 1,
                general_condition: 1,
                dealer_maintenance: 1,
                created_at: 1,
                vehicle: {
                    price_ofert: 1,
                    branch: 1
                },
                mechanic: {
                    fullName: 1,
                },
            },
        }
    ]);
    if (mecFile[0].certificate) {
        mecFile[0].certificateStr = "si";
    }
    else {
        mecFile[0].certificateStr = "no";
    }
    if (mecFile) {
        try {
            const puppeteer = require('puppeteer');
            const html = yield ejs_1.default.renderFile('./src/views/templateFichaMecanicaNew.ejs', mecFile[0]);
            const browser = yield puppeteer.launch({ args: ['--no-sandbox'] });
            const page = yield browser.newPage();
            yield page.goto('https://developer.chrome.com/');
            yield page.setContent(html);
            const pdfBuffer = yield page.pdf({
                format: 'Letter',
                printBackground: true,
                landscape: false
            });
            //
            yield browser.close();
            const fileBuffer = pdfBuffer;
            const base64Data = 'data:application/pdf;base64,' + fileBuffer.toString('base64');
            const fileName = yield (0, cloudinaryMetods_1.uploadPdf)(base64Data);
            const vehicle = yield Vehicles_schema_2.default.findOne({ _id: data.id_vehicle });
            const dataEmail = {
                model: vehicle.model,
                year: vehicle.year,
                city: vehicle.city,
                fullname: decode.fullName,
                url: fileName.secure_url,
            };
            const template = (0, templates_mails_1.templatesMails)("mechanicalFile", dataEmail);
            //armamos el mailoptions para enviar el pdf y link de descarga
            const mailOptions = {
                from: "Toyousado",
                to: decode.email,
                subject: "Ficha técnica",
                html: `<div>
        <p>Hola ${dataEmail.fullname}</p>
        <p>
            A traves de este correo adjuntamos la ficha tecnica del vehiculo ${dataEmail.model} año ${dataEmail.year} ubicado en ${dataEmail.city}, si no se visualiza el archivo adjunto puedes visualizarlo dando click en el siguiente enlace:
        </p>
    
        <div style="display: block;">
            <div style="width: 300px;margin: auto;">
                <p>
                    <a 
                    href="${dataEmail.url}" 
                    style="box-sizing: border-box;
                    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
                    border-radius: 4px;
                    color: #fff;
                    display: inline-block;
                    overflow: hidden;
                    text-decoration: none;
                    background-color: #EB0A1E;
                    border-bottom: 8px solid #EB0A1E;
                    border-left: 18px solid #EB0A1E;
                    border-right: 18px solid #EB0A1E;
                    border-top: 8px solid #EB0A1E;"
                    >Ver ficha técnica</a>
                </p>
            </div>
        </div>
    
    </div>`,
                //aqui adjuntamos el pdf creado
                attachments: [
                    {
                        filename: "Ficha técnica.pdf",
                        path: fileName.secure_url, // ruta completa del archivo a adjuntares
                    },
                ],
            };
            yield (0, nodemailer_1.sendEmail)(mailOptions);
            // jsonRes.data=base64Data;//
            jsonRes.data = fileName.secure_url;
            jsonRes.code = 200;
            jsonRes.message = "";
            jsonRes.status = true;
        }
        catch (error) {
            console.log(error);
            jsonRes.code = 400;
            jsonRes.message = "error de dependencia";
            jsonRes.status = false;
        }
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "No se pudo obtener la información del vehículo";
        jsonRes.status = false;
    }
    res.json(jsonRes);
});
vehicleController.inspections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_mechanic } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["mechanic"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const vehiclesList = yield Vehicles_schema_2.default
        .find({ id_mechanic: id_mechanic, mechanicalFile: false })
        .sort({ date_create: -1 });
    if (vehiclesList.length > 0) {
        let arrayInpecciones = [];
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
                image: (yield ImgVehicle_schema_1.default.findOne({ id_vehicle: vehiclesList[i]._id }))
                    ? yield ImgVehicle_schema_1.default.findOne({ id_vehicle: vehiclesList[i]._id })
                    : "",
            };
            arrayInpecciones.push(data);
        }
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Inspecciones encontradas";
        reponseJson.data = arrayInpecciones;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontraron inspecciones";
    }
    res.json(reponseJson);
});
vehicleController.countInspections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_mechanic } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["mechanic"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const vehiclesList = yield Vehicles_schema_2.default.countDocuments({
        id_mechanic: id_mechanic,
        mechanicalFile: false,
    });
    reponseJson.code = 200;
    reponseJson.status = true;
    reponseJson.message = "Cantidad de vehículos";
    reponseJson.data = vehiclesList;
    res.json(reponseJson);
});
vehicleController.addMechanicalFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["mechanic"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let mailSeller = "";
    let infoMechanic = {};
    let nameSeller = "";
    let conceSeller = "";
    let citySeller = "";
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    const { steering_wheel, pedals, gauges_dashboard_lights, transmission_shift_lever, brake_lever, accessories, internal_upholstery, courtesy_lights, windshield, window_glass_operation, door_locks_handles, operation_manual_electric_mirrors, seat_belts, front_bumpers, front_grill, headlights_low_beams_cocuyos, fog_lights, bonnet, engine_ignition, engine_noises, fluid_reservoirs, spark_plugs_coils_general_condition, air_filter, transmission_belts, appearance_hoses_caps_seals_connections, battery_condition_terminal_tightness_corrosion, fluid_leak, general_engine_compression_condition, stabilizer_bars, bearings, joints_dust_covers, shock_absorbers, spirals, upper_lower_plateaus, stumps, terminal_blocks, brakes, cardan_transmission_shaft, engine_transmission_oil_leaks, hydraulic_oil_leak_steering_box, excessive_rust_on_frame_compact, exhaust_pipe, doors, stop, fuel_pump_door, trunk_door, trunk_interior, replacement_rubber_tool_set, complete_emblems, bodywork, paint, tire_condition, wheel_ornaments, general_condition_fluids, dealer_maintenance, general_condition, id_vehicle, id_mechanic, } = req.body;
    const newMechanicFile = new mechanicalFiles_schema_1.default({
        steering_wheel,
        pedals,
        gauges_dashboard_lights,
        transmission_shift_lever,
        brake_lever,
        accessories,
        internal_upholstery,
        courtesy_lights,
        windshield,
        window_glass_operation,
        door_locks_handles,
        operation_manual_electric_mirrors,
        seat_belts,
        front_bumpers,
        front_grill,
        headlights_low_beams_cocuyos,
        fog_lights,
        bonnet,
        engine_ignition,
        engine_noises,
        fluid_reservoirs,
        spark_plugs_coils_general_condition,
        air_filter,
        transmission_belts,
        appearance_hoses_caps_seals_connections,
        battery_condition_terminal_tightness_corrosion,
        fluid_leak,
        general_engine_compression_condition,
        stabilizer_bars,
        bearings,
        joints_dust_covers,
        shock_absorbers,
        spirals,
        upper_lower_plateaus,
        stumps,
        terminal_blocks,
        brakes,
        cardan_transmission_shaft,
        engine_transmission_oil_leaks,
        hydraulic_oil_leak_steering_box,
        excessive_rust_on_frame_compact,
        exhaust_pipe,
        doors,
        stop,
        fuel_pump_door,
        trunk_door,
        trunk_interior,
        replacement_rubber_tool_set,
        complete_emblems,
        bodywork,
        paint,
        tire_condition,
        wheel_ornaments,
        general_condition_fluids,
        dealer_maintenance,
        general_condition,
        id_vehicle,
        id_mechanic,
        created_at: dateNow,
    });
    const newMechanicFileSaved = yield newMechanicFile.save();
    let now = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    const newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1.default({
        campos_anteriores: null,
        campos_actualizados: null,
        type: "Nueva ficha mecanica",
        comment: "",
        id_mechanic_file: newMechanicFile._id,
        id_user: decode.id,
        date: now
    });
    yield newReportMechanicsFiles.save();
    const vehicleUpdated = yield Vehicles_schema_2.default.findByIdAndUpdate(id_vehicle, {
        mechanicalFile: true,
    });
    if (newMechanicFileSaved) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecánica creada correctamente";
        reponseJson.data = newMechanicFileSaved;
        //obteniendo el correo del vendedor
        const vehicle = yield Vehicles_schema_2.default.findOne({ _id: id_vehicle });
        if (vehicle) {
            const seller = yield Sellers_schema_1.default.findOne({ _id: vehicle.id_seller });
            if (seller) {
                nameSeller = seller.fullName;
                conceSeller = seller.concesionary;
                citySeller = seller.city;
                const user = yield Users_schema_1.default.findOne({ _id: seller.id_user });
                if (user) {
                    mailSeller = user.email;
                }
            }
        }
        //obteniendo la informacion del tecnico
        const mechanic = yield Mechanics_schema_1.default.findOne({ _id: id_mechanic });
        if (mechanic) {
            infoMechanic.fullname = mechanic.fullName;
            infoMechanic.concesionary = mechanic.concesionary;
            infoMechanic.city = mechanic.city;
        }
        const mailOptions = {
            from: "Toyousado Notifications",
            to: mailSeller,
            subject: "Ficha mecánica creada",
            html: `<div>
          <p>Ficha técnica creada exitosamente para:</p>
          </div>
          <div class="div-table" style="width: 100%;">
              <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle.model}</div>
              </div>
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle.year}</div>
              </div>
              <div style=" display: table-row;border: 1px solid #000;">
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
                  <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle.plate}</div>
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
            model: vehicle.model,
            year: vehicle.year,
            plate: vehicle.plate ? vehicle.plate : "",
            fullName: nameSeller,
            concesionary: conceSeller,
            city: citySeller,
            title: "Ficha técnica creada exitosamente para:",
            link: `${vehicle._id}`
        };
        yield (0, nodemailer_1.sendEmail)(mailOptions);
        sendNotification((_a = vehicle.id_seller) === null || _a === void 0 ? void 0 : _a.toString(), dataVehicle, "Ficha técnica creada");
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo crear la Ficha técnica";
    }
    res.json(reponseJson);
});
vehicleController.updateMechanicalFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["mechanic"]);
    const { data } = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let now = (0, moment_1.default)().format("YYYY-MM-DD");
    let dataFile = {
        campos_anteriores: null,
        campos_actualizados: null,
        type: "Modificación de ficha mecanica",
        comment: "",
        id_mechanic_file: data._id,
        id_user: decode.id,
        date: now
    };
    const oldFicha = yield mechanicalFiles_schema_1.default.findOne({ _id: data._id });
    if (data.general_condition === "excelente" || data.general_condition > "96") {
        data.certificate = true;
    }
    const update = yield mechanicalFiles_schema_1.default.findByIdAndUpdate(data._id, data);
    const updateFicha = yield mechanicalFiles_schema_1.default.findOne({ _id: data._id });
    dataFile.campos_actualizados = setCamposActualizados(oldFicha, updateFicha);
    dataFile.campos_anteriores = setCamposAnteriores(oldFicha, updateFicha);
    const newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1.default(dataFile);
    yield newReportMechanicsFiles.save();
    if (update) {
        reponseJson.code = 200;
        reponseJson.message = "Ficha mecánica actualizada exitosamente";
        reponseJson.status = true;
        reponseJson.data = null;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Error al actualizar Ficha mecánica";
        reponseJson.status = false;
        reponseJson.data = null;
    }
    return res.json(reponseJson);
});
vehicleController.getMechanicFileByIdVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["mechanic"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const mecFile = yield mechanicalFiles_schema_1.default.findOne({ id_vehicle: id_vehicle });
    if (mecFile) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecánica encontrada";
        reponseJson.data = mecFile;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro la ficha mecánica";
    }
    res.json(reponseJson);
});
vehicleController.ofertInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const id = req.query;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "mechanic"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const vehicle = yield Vehicles_schema_2.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(String(id === null || id === void 0 ? void 0 : id.id)),
            },
        },
        {
            $lookup: {
                from: "sellers",
                localField: "id_seller_buyer",
                foreignField: "_id",
                as: "seller",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "seller.id_user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$seller",
        },
        {
            $unwind: "$user",
        },
        {
            $project: {
                price_ofert: 1,
                seller: {
                    fullName: 1,
                    phone: 1,
                    city: 1,
                    concesionary: 1,
                },
                user: {
                    email: 1,
                },
            },
        },
    ]);
    console.log("vehicle", vehicle);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Información de la oferta";
        reponseJson.data = vehicle[0];
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro el vehículo";
    }
    res.json(reponseJson);
});
vehicleController.myOfferts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let data = req.query;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller"]);
    let query = {};
    let search;
    let project;
    let count;
    let sendData = {};
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        return res.json(reponseJson);
    }
    if (!data) {
        data = {
            s: "",
            lim: 10,
            pos: 0,
            minYear: 0,
            maxYear: 0,
            minPrice: 0,
            maxPrice: 0,
            minKm: 0,
            maxKm: 0,
            model: "",
            brand: "",
        };
    }
    if (data.minPrice === '0' && data.maxPrice === '0') {
        query.price = { $gte: 0 };
    }
    else if (data.minPrice !== '0' && data.maxPrice === '0') {
        query.price = { $gte: parseInt(data.minPrice) };
    }
    else if (data.minPrice === '0' && data.maxPrice !== '0') {
        query.price = { $lte: parseInt(data.maxPrice) };
    }
    else {
        query.price = { $gte: parseInt(data.minPrice), $lte: parseInt(data.maxPrice) };
    }
    if (data.minYear === '0' && data.maxYear === '0') {
        query.year = { $gte: 0 };
    }
    else if (data.minYear !== '0' && data.maxYear === '0') {
        query.year = { $gte: parseInt(data.minYear) };
    }
    else if (data.minYear === '0' && data.maxYear !== '0') {
        query.year = { $lte: parseInt(data.maxYear) };
    }
    else {
        query.year = { $gte: parseInt(data.minYear), $lte: parseInt(data.maxYear) };
    }
    if (data.minKm === '0' && data.maxKm === '0') {
        query.km = { $gte: 0 };
    }
    else if (data.minKm !== '0' && data.maxKm === '0') {
        query.km = { $gte: parseInt(data.minKm) };
    }
    else if (data.minKm === '0' && data.maxKm !== '0') {
        query.km = { $lte: parseInt(data.maxKm) };
    }
    else {
        query.km = { $gte: parseInt(data.minKm), $lte: parseInt(data.maxKm) };
    }
    query.brand = { $regex: data.brand, $options: "i" };
    query.model = { $regex: data.model, $options: "i" };
    query.sold = false;
    query.price_ofert = { $gte: 0, $ne: null };
    query.mechanicalFile = true;
    project = {
        model: 1,
        brand: 1,
        year: 1,
        displacement: 1,
        km: 1,
        engine_model: 1,
        titles: 1,
        fuel: 1,
        transmission: 1,
        traction: 1,
        city: 1,
        dealer: 1,
        concesionary: 1,
        traction_control: 1,
        performance: 1,
        price: 1,
        comfort: 1,
        technology: 1,
        date_create: 1,
        type_vehicle: 1,
        vin: 1,
        plate: 1,
        mechanicalFile: 1,
        sold: 1,
        dispatched: 1,
        date_sell: 1,
        price_ofert: 1,
        final_price_sold: 1,
        concesionary_maintenance: 1
    };
    let list = yield Vehicles_schema_2.default.aggregate([
        {
            $match: query,
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
    sendData.rows = list;
    if (list.length > 0) {
        count = yield Vehicles_schema_2.default.aggregate([
            {
                $match: query
            },
            {
                $count: "totalCount"
            }
        ]);
        reponseJson.code = 200;
        reponseJson.message = "Lista de modelos de vehiculos";
        reponseJson.status = true;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "sin resultado";
        reponseJson.status = true;
    }
    let totalItems = 0;
    if (count) {
        totalItems = count[0].totalCount;
    }
    let totalPages = Math.ceil(totalItems / data.lim);
    sendData.count = totalItems;
    sendData.pages = totalPages;
    reponseJson.code = 200;
    reponseJson.message = "Lista de ofertas";
    reponseJson.status = true;
    reponseJson.data = sendData;
    res.json(reponseJson);
});
vehicleController.addRerportMechanicalFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let data = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "mechanic", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        return res.json(reponseJson);
    }
    let now = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    const newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1.default({
        campos_anteriores: null,
        campos_actualizados: null,
        type: "Normal",
        comment: data.comment,
        id_mechanic_file: data.id_mechanic_file,
        id_user: decode.id,
        date: now
    });
    yield newReportMechanicsFiles.save();
    data.id = newReportMechanicsFiles._id;
    reponseJson.code = 200;
    reponseJson.message = "nuevo reporte";
    reponseJson.status = true;
    reponseJson.data = data;
    res.json(reponseJson);
});
vehicleController.commentRerportMechanicalFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let data = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "mechanic", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        return res.json(reponseJson);
    }
    let now = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    if (data.id) {
        yield reportsMechanicalsFiles_schema_1.default.findByIdAndUpdate(data.id, {
            comment: data.comment + ". Fecha: " + now
        });
    }
    else {
        const newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1.default({
            campos_anteriores: null,
            campos_actualizados: null,
            type: "Comentario",
            comment: data.comment,
            id_mechanic_file: data.id_mechanic_file,
            id_user: decode.id,
            date: now
        });
        yield newReportMechanicsFiles.save();
    }
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = null;
    res.json(reponseJson);
});
vehicleController.acceptUpdateMechanicalFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let data = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "mechanic", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        return res.json(reponseJson);
    }
    let now = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    if (data.accept == "Si" || data.accept == "si") {
        const newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1.default({
            campos_anteriores: null,
            campos_actualizados: null,
            type: "Aceptar modificacion de ficha mecanica",
            comment: "",
            id_mechanic_file: data.id_mechanic_file,
            id_user: decode.id,
            date: now
        });
        yield newReportMechanicsFiles.save();
    }
    else {
        const newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1.default({
            campos_anteriores: null,
            campos_actualizados: null,
            type: "Cancelar modificacion de ficha mecanica",
            comment: "",
            id_mechanic_file: data.id_mechanic_file,
            id_user: decode.id,
            date: now
        });
        yield newReportMechanicsFiles.save();
    }
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = null;
    res.json(reponseJson);
});
vehicleController.allRerportMechanicalFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.query;
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin", "mechanic", "admin_concesionary"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        return res.json(reponseJson);
    }
    let reports = yield reportsMechanicalsFiles_schema_1.default.find({ id_mechanic_file: data.id }).sort({ date: -1 });
    for (let i = 0; i < reports.length; i++) {
        reports[i].user = {};
        let user = yield Users_schema_1.default.findOne({ _id: reports[i].id_user });
        reports[i] = Object.assign(Object.assign({}, reports[i]._doc), { user: user });
    }
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = reports;
    res.json(reponseJson);
});
vehicleController.add_request_models_brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller"]);
    let data = req.body;
    let emailmechanic = {};
    let emailAdmin = {};
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    let documents = [];
    infoSeller = yield Sellers_schema_1.default.findOne({ _id: decode.id_sell });
    let infoConsecionary = yield Concesionaries_schema_1.default.findOne({ name: infoSeller.concesionary });
    emailmechanic = yield Users_schema_1.default.findOne({ id_concesionary: infoConsecionary._id });
    emailAdmin = yield Users_schema_1.default.findOne({ type_user: "admin" });
    const dataVehicle = {
        model: data.model,
        brand: data.brand,
        type_vehicle: data.type_vehicle,
        fullName: infoSeller.fullName,
        concesionary: infoSeller.concesionary,
        city: infoSeller.city,
        title: !data.model && !data.type_vehicle ? "Solicitud de añadir marca" : "Solicitud de añadir modelo",
    };
    const template = (0, templates_notifications_1.templatesNotifies)("add_request_models_brands", data);
    const mailOptions = {
        from: "Toyousado",
        to: emailmechanic.email ? emailmechanic.email : emailAdmin.email,
        subject: !data.model && !data.type_vehicle ? "Solicitud de añadir marca" : "Solicitud de añadir modelo",
        html: template,
    };
    yield sendNotificationAdmin(emailmechanic._id ? emailmechanic._id : emailAdmin._id, dataVehicle, !data.model && !data.type_vehicle ? "Solicitud de añadir marca" : "Solicitud de añadir modelo");
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = template;
    res.json(reponseJson);
});
vehicleController.approve_request_models_brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin_concesionary"]);
    let emailmechanic = "";
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    let documents = [];
    let data = req.body;
    infoSeller = yield Sellers_schema_1.default.findOne({ _id: decode.id_sell });
    let infoConsecionary = yield Concesionaries_schema_1.default.findOne({ _id: decode.id_concesionary });
    emailmechanic = yield Users_schema_1.default.findOne({ id_concesionary: infoConsecionary._id });
    const template = (0, templates_notifications_1.templatesNotifies)("approve_request_models_brands", data);
    const mailOptions = {
        from: "Toyousado",
        to: emailmechanic.email,
        subject: "Revisión de vehículo",
        html: template,
    };
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = template;
    return reponseJson;
});
vehicleController.success_request_models_brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin_concesionary"]);
    let emailmechanic = "";
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    let documents = [];
    let data = req.body;
    const template = (0, templates_notifications_1.templatesNotifies)("success_request_models_brands", data);
    const mailOptions = {
        from: "Toyousado",
        to: emailmechanic.email,
        subject: "Revisión de vehículo",
        html: template,
    };
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = template;
    return reponseJson;
});
vehicleController.cancel_request_models_brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin_concesionary"]);
    let emailmechanic = "";
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    let documents = [];
    let data = req.body;
    const template = (0, templates_notifications_1.templatesNotifies)("cancel_request_models_brands", data);
    const mailOptions = {
        from: "Toyousado",
        to: emailmechanic.email,
        subject: "Revisión de vehículo",
        html: template,
    };
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = template;
    return reponseJson;
});
function generateBase64(pdfPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileStream = fs_1.default.createReadStream(pdfPath);
        console.log("fileStream", fileStream);
        const chunks = [];
        console.log("chunks", chunks);
        return new Promise((resolve, reject) => {
            fileStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            fileStream.on('end', () => {
                const fileBuffer = Buffer.concat(chunks);
                const base64String = fileBuffer.toString('base64');
                resolve(base64String);
            });
            fileStream.on('error', (error) => {
                reject(error);
            });
        });
    });
}
const setCamposActualizados = (oldFicha, update) => {
    let campos = {};
    for (const key in update) {
        if (oldFicha[key] !== update[key]) {
            campos[key] = update[key];
        }
    }
    return campos;
};
const setCamposAnteriores = (oldFicha, update) => {
    let campos = {};
    for (const key in oldFicha) {
        if (oldFicha[key] !== update[key]) {
            campos[key] = oldFicha[key];
        }
    }
    return campos;
};
const crearCarpetaSiNoExiste = (nombreCarpeta) => {
    if (!fs_1.default.existsSync(nombreCarpeta)) {
        fs_1.default.mkdirSync(nombreCarpeta);
        console.log(`Carpeta "${nombreCarpeta}" creada exitosamente`);
    }
    else {
        console.log(`La carpeta "${nombreCarpeta}" ya existe`);
    }
};
function getImageAsBase64(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url, {
                responseType: 'arraybuffer'
            });
            if (response.status === 200) {
                const contentType = response.headers['content-type'];
                const base64Image = Buffer.from(response.data, 'binary').toString('base64');
                const dataURI = `data:${contentType};base64,${base64Image}`;
                return dataURI;
            }
            else {
                throw new Error('Failed to fetch image from the URL');
            }
        }
        catch (error) {
            throw new Error('Error fetching the image: ' + error.message);
        }
    });
}
const desgloseImg = (image) => __awaiter(void 0, void 0, void 0, function* () {
    let posr = image.split(";base64").pop();
    let imgBuff = Buffer.from(posr, "base64");
    const resize = yield (0, sharp_1.default)(imgBuff)
        .resize(300, 250)
        .toBuffer()
        .then((data) => {
        return data;
    })
        .catch((err) => {
        console.log("error", err);
        return "";
    });
    return "data:image/jpeg;base64," + resize.toString("base64");
});
const sendNotificationMechanic = (id_mechanic, data, title) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield Mechanics_schema_1.default.findOne({ _id: id_mechanic });
    if (userInfo) {
        const notify = new notifications_schema_1.default({
            id_user: userInfo.id_user,
            title: title,
            data: data,
            date: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
            status: false,
        });
        yield notify.save();
    }
});
function groupAndSumByMonth(data) {
    const result = {};
    data.forEach((item) => {
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
    return Object.entries(result).map(([key, value]) => ({
        month: key,
        minAmount: value.minAmount,
        avgAmount: value.avgAmount,
        maxAmount: value.maxAmount,
    }));
}
function getQuantityTotals(data) {
    const quantityTotals = [];
    for (let i = 0; i < data.length; i++) {
        const document = data[i];
        const mes = document.mes.substring(0, 7); // Extrae el año y mes de la fecha
        if (quantityTotals[mes]) {
            quantityTotals[mes] += document.total; // Si el mes ya existe en el objeto, acumula el canitdad
        }
        else {
            quantityTotals[mes] = document.total; // Si el mes no existe en el objeto, crea la propiedad y asigna el cantidad
        }
    }
    const result = [];
    for (const mes in quantityTotals) {
        result.push({ mes: mes + "-01", total: quantityTotals[mes] }); // Convierte el objeto en un array
    }
    return result;
}
const calcularMeses = (fechaInicial, fechaFinal) => {
    const inicio = new Date(fechaInicial);
    const fin = new Date(fechaFinal);
    const diferenciaMeses = (fin.getFullYear() - inicio.getFullYear()) * 12 +
        (fin.getMonth() - inicio.getMonth());
    return diferenciaMeses;
};
const agruparPorSemana = (datos) => {
    const semanas = [];
    for (const dato of datos) {
        const fecha = new Date(dato.mes);
        const semana = getWeekNumber(fecha);
        if (semanas[semana]) {
            semanas[semana] += dato.total;
        }
        else {
            semanas[semana] = dato.total;
        }
    }
    const result = [];
    for (const semana in semanas) {
        result.push({ semana: Number(semana), total: semanas[semana] });
    }
    return result;
};
const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil(((date - onejan) / 86400000 + onejan.getDay()) / 7);
    return week;
};
const agruparPorWeek = (datos) => {
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
    result.push({ semana: "Semana " + Number(1), total: semanas[1] ? semanas[1] : 0 });
    result.push({ semana: "Semana " + Number(2), total: semanas[2] ? semanas[2] : 0 });
    result.push({ semana: "Semana " + Number(3), total: semanas[3] ? semanas[3] : 0 });
    result.push({ semana: "Semana " + Number(4), total: semanas[4] ? semanas[4] : 0 });
    // for (const semana in semanas) {
    //   result.push({ semana: "Semana " + Number(semana), total: semanas[semana] });
    // }
    return result;
};
function getMonthRange(startMonth, rangeMonths) {
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
    const endMonthIndex = Math.min(startMonthIndex + parseInt(rangeMonths) - 1, 11);
    const monthRange = months.slice(startMonthIndex, endMonthIndex + 1);
    return monthRange;
}
function getLastDayOfMonth(year, month) {
    // Ajustar el mes para que sea el siguiente
    const nextMonth = parseInt(month + 1);
    // Crear una nueva fecha con el primer día del mes siguiente
    const firstDayOfNextMonth = new Date(year, nextMonth, 1);
    // Restar un día para obtener el último día del mes actual
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 24 * 60 * 60 * 1000);
    return lastDayOfMonth;
}
const getNameMonth = (date) => {
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
const orderMonths = (requiredMonths) => {
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
    const filteredMonths = months.filter((mes) => requiredMonths.includes(mes.month));
    filteredMonths.sort((a, b) => a.index - b.index);
    return filteredMonths.map((mes) => mes.month);
};
const llenarFechasFaltantes = (arr, mesInicial, rango) => {
    const fechasFaltantes = [];
    let rango_for = (parseInt(mesInicial) + parseInt(rango)) > 12 ? 12 : (parseInt(mesInicial) + parseInt(rango));
    for (let i = mesInicial; i <= rango_for; i++) {
        const fecha = `2023-${i.toString().padStart(2, '0')}-01`;
        fechasFaltantes.push(fecha);
    }
    const resultado = [];
    if (arr.length === 0) {
        for (const fecha of fechasFaltantes) {
            resultado.push({ mes: fecha, total: 0 });
        }
    }
    else {
        for (const fecha of fechasFaltantes) {
            const encontrado = arr.find(item => item.mes === fecha);
            if (encontrado) {
                resultado.push(encontrado);
            }
            else {
                resultado.push({ mes: fecha, total: 0 });
            }
        }
        // Agregar elementos restantes del arreglo original
        for (const elemento of arr) {
            if (!fechasFaltantes.includes(elemento.mes)) {
                resultado.push(elemento);
            }
        }
    }
    return resultado;
};
const sendNotification = (id_seller, data, title) => __awaiter(void 0, void 0, void 0, function* () {
    // const jsonRes: ResponseModel = new ResponseModel();
    const userInfo = yield Sellers_schema_1.default.findOne({ _id: id_seller });
    if (userInfo) {
        const notify = new notifications_schema_1.default({
            id_user: userInfo.id_user,
            title: title,
            data: data,
            date: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
            status: false,
        });
        yield notify.save();
    }
});
const sendNotificationAdmin = (id, data, title) => __awaiter(void 0, void 0, void 0, function* () {
    const notify = new notifications_schema_1.default({
        id_user: id,
        title: title,
        data: data,
        date: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
        status: false,
    });
    yield notify.save();
});
const updateImgDocsVehicle = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    //buscamos el vehiculo y actulizamos el campo img_documentation
    console.log(data);
    const vehicle = yield Vehicles_schema_2.default.findOne({ _id: id });
    if (vehicle) {
        vehicle.imgs_documentation = data;
        yield vehicle.save();
    }
    const vehicleFound = yield Vehicles_schema_2.default.findOne({ _id: id });
    console.log(vehicleFound);
});
exports.default = vehicleController;
//# sourceMappingURL=vehicle.controller.js.map