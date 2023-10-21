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
const Sellers_schema_2 = __importDefault(require("../schemas/Sellers.schema"));
const Vehicles_schema_1 = __importDefault(require("../schemas/Vehicles.schema"));
const notifications_schema_1 = __importDefault(require("../schemas/notifications.schema"));
const sharp_1 = __importDefault(require("sharp"));
const Vehicles_schema_2 = __importDefault(require("../schemas/Vehicles.schema"));
const mechanicalsFiles_schema_1 = __importDefault(require("../schemas/mechanicalsFiles.schema"));
const ImgVehicle_schema_1 = __importDefault(require("../schemas/ImgVehicle.schema"));
const cloudinaryMetods_1 = require("../../cloudinaryMetods");
const global = __importStar(require("../global"));
const vehicleController = {};
vehicleController.addVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    let emailmechanic = "";
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    const { model, brand, year, displacement, km, engine_model, titles, fuel, transmission, traction, city, dealer, concesionary, traction_control, performance, comfort, technology, id_seller, id_mechanic, type_vehicle, images, vin, vehicle_plate, } = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
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
    yield newVehicle.save();
    const mec = yield Mechanics_schema_1.default.findOne({ _id: id_mechanic });
    emailmechanic = yield Users_schema_1.default.findOne({ _id: mec === null || mec === void 0 ? void 0 : mec.id_user });
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
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller.fullName}</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller.concesionary}</div>
            </div>
            <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller.city}</div>
            </div>
        </div>
        </div>`,
    };
    const dataVehicle = {
        model: model,
        year: year,
        plate: vehicle_plate,
        fullName: infoSeller.fullName,
        concesionary: infoSeller.concesionary,
        city: infoSeller.city,
        title: "Tienes el siguiente vehículo para generar la ficha técnica",
    };
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    sendNotificationMechanic(id_mechanic, dataVehicle, "Revisión de vehículo");
    reponseJson.code = 200;
    reponseJson.message = "Vehículo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
});
vehicleController.addImgVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
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
    //aqui declaramos las respuestas
    const reponseJson = new Response_1.ResponseModel();
    let query = {};
    //aqui declaramos las variables que vamos a recibir
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
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
    // query.id_seller_buyer = null;
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
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, id_seller, } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        jsonRes.code = generar_jwt_1.default.code;
        jsonRes.message = generar_jwt_1.default.message;
        jsonRes.status = false;
        jsonRes.data = null;
        return res.json(jsonRes);
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
    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    query.id_seller = id_seller;
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        jsonRes.code = generar_jwt_1.default.code;
        jsonRes.message = generar_jwt_1.default.message;
        jsonRes.status = false;
        jsonRes.data = null;
        return res.json(jsonRes);
    }
    const infoVehicle = yield Vehicles_schema_2.default.findOne({ _id: id });
    const imgsVehichle = yield ImgVehicle_schema_1.default.find({ id_vehicle: id });
    const mechanicalFile = yield mechanicalsFiles_schema_1.default.findOne({ id_vehicle: id });
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
            general_condition: mechanicalFile
                ? mechanicalFile.general_condition
                : "",
            images: imgsVehichle ? imgsVehichle : [],
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const mecFile = yield mechanicalsFiles_schema_1.default.findOne({ id_vehicle: id_vehicle });
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
vehicleController.dispatchedCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id, final_price_sold } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
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
vehicleController.filterGraphySale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
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
            last = new Date(anioActual, rangArrayMonth.length - 1);
            lastDayLasyMont = getLastDayOfMonth(anioActual, rangArrayMonth.length - 1);
            lastMonth = new Date(anioActual, rangArrayMonth.length - 1, lastDayLasyMont.getDate());
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
        mongQuery = Object.assign(Object.assign({}, mongQuery), { model: { $regex: data.modelCar, $options: "i" } });
    }
    let user = null;
    if (decode.type_user == "seller") {
        user = yield Users_schema_1.default.findOne({ _id: decode.id });
        if (user) {
            mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: user.concesionary, $options: "i" } });
        }
        else {
            if (data.concesionary) {
                mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: data.concesionary, $options: "i" } });
            }
        }
    }
    let sendData = [];
    let chartData = {};
    let datos = {};
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
                labels: labels,
                datasets: [
                    Object.assign(Object.assign({}, optionset), { data: total }),
                ],
            };
        }
        else {
            const labels = sendData.map((dato) => dato.mes);
            let nameArray = [];
            for (let i = 0; i < labels.length; i++) {
                nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
            }
            const total = sendData.map((dato) => dato.total);
            datos = {
                labels: nameArray,
                datasets: [
                    Object.assign(Object.assign({}, optionset), { data: total }),
                ],
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
        console.log(conditionGroup);
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
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
        mongQuery = Object.assign(Object.assign({}, mongQuery), { model: { $regex: modelCar, $options: "i" } });
        otherMong = Object.assign(Object.assign({}, otherMong), { model: { $regex: modelCar, $options: "i" } });
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
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
        mongQuery = Object.assign(Object.assign({}, mongQuery), { model: { $regex: modelCar, $options: "i" } });
        otherMong = Object.assign(Object.assign({}, otherMong), { model: { $regex: modelCar, $options: "i" } });
    }
    if (concesionary) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
    }
    let seller = null;
    let user = null;
    if (id_user) {
        seller = yield Sellers_schema_2.default.findOne({ id_user: id_user });
        user = yield Users_schema_1.default.findOne({ _id: id_user });
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
    console.log(datos);
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
    let sendUser = yield Users_schema_1.default.findOne({ _id: id_user });
    if (sendUser) {
        const mailOptions = {
            from: "Toyousado",
            to: sendUser.email,
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
    }
    const fs = require("fs");
    // ...
    // fs.unlinkSync(filePath);
    workbook.xlsx
        .writeBuffer()
        .then((buffer) => __awaiter(void 0, void 0, void 0, function* () {
        // Convertir el buffer en base64
        const base64 = buffer.toString("base64");
        // Crear un objeto de respuesta con el archivo base64
        const datos = {
            fileName: now.getTime() + ".xlsx",
            path: sendUrl,
            base64Data: "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
                base64,
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
    }))
        .catch((error) => {
        console.log("Error al generar el archivo Excel:", error);
    });
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = data;
    res.json(reponseJson);
});
vehicleController.myVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    let arrayVehicles = [];
    let query = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, id_seller, } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    if (decode == false) {
        jsonRes.code = generar_jwt_1.default.code;
        jsonRes.message = generar_jwt_1.default.message;
        jsonRes.status = false;
        jsonRes.data = null;
        return res.json(jsonRes);
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
    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    query.id_seller = id_seller;
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
vehicleController.mechanicalFileByIdVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const mecFile = yield mechanicalsFiles_schema_1.default.findOne({ id_vehicle: id_vehicle });
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
    for (const semana in semanas) {
        result.push({ semana: "Semana " + Number(semana), total: semanas[semana] });
    }
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
    const nextMonth = month + 1;
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
exports.default = vehicleController;
//# sourceMappingURL=vehicle.controller.js.map