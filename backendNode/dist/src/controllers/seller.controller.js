"use strict";
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
const moment_1 = __importDefault(require("moment"));
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const sharp_1 = __importDefault(require("sharp"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Concesionaries_schema_1 = __importDefault(require("../schemas/Concesionaries.schema"));
const Vehicles_schema_1 = __importDefault(require("../schemas/Vehicles.schema"));
const Mechanics_schema_1 = __importDefault(require("../schemas/Mechanics.schema"));
const Sellers_schema_1 = __importDefault(require("../schemas/Sellers.schema"));
const Users_schema_1 = __importDefault(require("../schemas/Users.schema"));
const mechanicalsFiles_schema_1 = __importDefault(require("../schemas/mechanicalsFiles.schema"));
const notifications_schema_1 = __importDefault(require("../schemas/notifications.schema"));
const ImgVehicle_schema_1 = __importDefault(require("../schemas/ImgVehicle.schema"));
const nodemailer_1 = require("../../nodemailer");
const brands_schema_1 = __importDefault(require("../schemas/brands.schema"));
const modelVehicle_schema_1 = __importDefault(require("../schemas/modelVehicle.schema"));
const cloudinaryMetods_1 = require("../../cloudinaryMetods");
const imgUser_schema_1 = __importDefault(require("../schemas/imgUser.schema"));
const Zones_schema_1 = __importDefault(require("../schemas/Zones.schema"));
const sellerController = {};
sellerController.addVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    let emailmechanic = "";
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    let documents = [];
    const { model, brand, year, displacement, km, engine_model, titles, fuel, transmission, traction, city, dealer, concesionary, traction_control, performance, comfort, technology, id_seller, id_mechanic, type_vehicle, images, vin, vehicle_plate, imgs_documents } = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const newVehicle = new Vehicles_schema_1.default({
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
    if (imgs_documents) {
        if (imgs_documents.length > 0) {
            for (let i = 0; i < imgs_documents.length; i++) {
                const imgResize = yield desgloseImg(imgs_documents[i].image);
                const filename = yield (0, cloudinaryMetods_1.uploadDocuments)(imgResize);
                let data = {
                    img: filename.secure_url,
                    public_id: filename.public_id
                };
                documents.push(data);
            }
        }
    }
    yield Vehicles_schema_1.default.findOneAndUpdate({ _id: newVehicle._id }, { imgs_documentation: documents });
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
sellerController.addImgVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
sellerController.deleteImgVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
sellerController.updateImgVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
sellerController.updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const vehicleUpdated = yield Vehicles_schema_1.default.findByIdAndUpdate(data._id, data);
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
sellerController.allVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //aqui declaramos las respuestas
    const reponseJson = new Response_1.ResponseModel();
    let query = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
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
    const vehiclesFiltered = yield Vehicles_schema_1.default.find(query).sort({ date_create: -1 });
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
sellerController.myVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const vehiclesFiltered = yield Vehicles_schema_1.default.find(query).sort({ date_create: -1 });
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
sellerController.vehicleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const infoVehicle = yield Vehicles_schema_1.default.findOne({ _id: id });
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
sellerController.mechanicalFileByIdVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
sellerController.approveBuyVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const date_sell = (0, moment_1.default)().format("YYYY-MM-DD");
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
    const infoVehicle = yield Vehicles_schema_1.default.findById(id_vehicle);
    const vehicle = yield Vehicles_schema_1.default.findByIdAndUpdate(id_vehicle, {
        price_ofert: infoVehicle.price_ofert,
        date_sell: date_sell,
        final_price_sold: infoVehicle.price_ofert,
        sold: false,
    });
    const infoBuyer = yield Sellers_schema_1.default.findById(vehicle.id_seller_buyer);
    const userbuyer = yield Users_schema_1.default.findById(infoBuyer.id_user);
    const infoSeller = yield Sellers_schema_1.default.findById(vehicle.id_seller);
    const userSeller = yield Users_schema_1.default.findById(infoSeller.id_user);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "aprobacion de oferta exitosa";
        reponseJson.status = true;
        reponseJson.data = vehicle;
        const mailOptions = {
            from: "Toyousado Notifications",
            to: userbuyer.email,
            subject: "Oferta de vehículo aprobada",
            text: `Tu oferta del vehículo ${vehicle.model} del concesionario ${vehicle.concesionary} ha sido aceptada, para mas información comunicate con el vendedor al correo ${userSeller.email} o al número telefono ${infoSeller.phone}`,
        };
        yield (0, nodemailer_1.sendEmail)(mailOptions);
        sendNotification(userbuyer._id.toString(), mailOptions.text, mailOptions.subject);
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "error al aprobar la oferta";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
sellerController.rejectBuyVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const vehicle = yield Vehicles_schema_1.default.findByIdAndUpdate(id_vehicle, {
        id_seller_buyer: null,
        sold: false,
        price_ofert: null,
        date_sell: null,
        name_new_owner: null,
        dni_new_owner: null,
        phone_new_owner: null,
        email_new_owner: null,
    });
    const infoBuyer = yield Sellers_schema_1.default.findById(vehicle.id_seller_buyer);
    const userbuyer = yield Users_schema_1.default.findById(infoBuyer.id_user);
    const infoSeller = yield Sellers_schema_1.default.findById(vehicle.id_seller);
    const userSeller = yield Users_schema_1.default.findById(infoSeller.id_user);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "oferta rechazada exitosamente";
        reponseJson.status = true;
        reponseJson.data = vehicle;
        const mailOptions = {
            from: "Toyousado Notifications",
            to: userbuyer.email,
            subject: "Compra de vehículo rechazada",
            text: `Tu compra del vehículo ${vehicle.model} del concesionario ${vehicle.concesionary} fue rechazada, para más información comunicaté con el vendedor al correo ${userSeller.email} o al número de teléfono ${infoSeller.phone}`,
        };
        yield (0, nodemailer_1.sendEmail)(mailOptions);
        sendNotification(userbuyer._id.toString(), mailOptions.text, mailOptions.subject);
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "error al rechazar la oferta";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
sellerController.dispatchedCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const vehiclesFiltered = yield Vehicles_schema_1.default.findOneAndUpdate({ _id: id }, { sold: true, price: final_price_sold, dispatched: true });
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
sellerController.repost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const vehiclesFiltered = yield Vehicles_schema_1.default.findOneAndUpdate({ _id: id }, {
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
sellerController.getVehicleByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const arrayVehicles = yield Vehicles_schema_1.default.find({
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
sellerController.filterVehiclesWithMongo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const vehiclesFiltered = yield Vehicles_schema_1.default
        .find(query)
        .sort({ date_create: -1 });
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
sellerController.filterGraphySell = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    let { month, yearSold, rangMonths, yearCar, brandCar, modelCar, id_user, concesionary, } = req.query;
    let now = new Date();
    let anioActual = now.getFullYear();
    let monthActual = (now.getMonth() + 1);
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
    let rangArrayMonth = [];
    if (rangMonths < 12) {
        rangArrayMonth = getMonthRange(month, rangMonths);
        firtsMonth = new Date(anioActual, month - 1, 1);
        if (rangArrayMonth.length > 1) {
            last = new Date(anioActual, rangArrayMonth.length - 1);
            lastDayLasyMont = getLastDayOfMonth(anioActual, rangArrayMonth.length - 1);
            lastMonth = new Date(anioActual, rangArrayMonth.length - 1, lastDayLasyMont.getDate());
        }
        else {
            last = new Date(anioActual, month - 1);
            lastDayLasyMont = getLastDayOfMonth(anioActual, month - 1);
            lastMonth = new Date(anioActual, month - 1, lastDayLasyMont.getDate());
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
    if (yearCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { year: parseInt(yearCar) });
    }
    if (brandCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { brand: { $regex: brandCar, $options: "i" } });
    }
    if (modelCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { model: { $regex: modelCar, $options: "i" } });
    }
    let seller = null;
    let user = null;
    if (id_user) {
        seller = yield Sellers_schema_1.default.findOne({ id_user: id_user });
        user = yield Users_schema_1.default.findOne({ _id: id_user });
        if (seller && user.type_user != "admin") {
            mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: seller.concesionary, $options: "i" } });
        }
        else {
            if (concesionary) {
                mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
            }
        }
    }
    const vehiclesFiltered = yield Vehicles_schema_1.default.aggregate([
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
    let datos = {};
    let cantMonth = calcularMeses(from, to);
    if (cantMonth == 1 || sendData.length == 1) {
        let groupByWeek = [];
        let groupByOneMonth = [];
        groupByWeek = agruparPorSemana(sendData);
        groupByOneMonth = agruparPorWeek(groupByWeek);
        const labels = groupByOneMonth.map((item) => item.semana);
        const montos = groupByOneMonth.map((item) => item.monto);
        datos = {
            labels: labels,
            datasets: [
                {
                    label: "Montos Mensuales",
                    data: montos, // Montos en el eje y
                },
            ],
        };
    }
    else {
        const labels = sendData.map((dato) => dato._id);
        let nameArray = [];
        for (let i = 0; i < labels.length; i++) {
            nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
        }
        const montos = sendData.map((dato) => dato.monto);
        datos = {
            labels: nameArray,
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
    }
    else {
        reponseJson.code = 200;
        reponseJson.message = "sin resultado";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
sellerController.listVehiclesSell = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const cardsgroupmodel = yield Vehicles_schema_1.default.aggregate([
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
    const cardsgroupNacional = yield Vehicles_schema_1.default.aggregate([
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
            let imgvehicles = yield ImgVehicle_schema_1.default.findOne({ id_vehicle: cardsgroupmodel[i].vehicles[j]._id });
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
    countMechanicaFile = yield Vehicles_schema_1.default.aggregate([
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
// -------brand------
sellerController.allBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        jsonResponse.code = generar_jwt_1.default.code;
        jsonResponse.message = generar_jwt_1.default.message;
        jsonResponse.status = false;
        jsonResponse.data = null;
        return res.json(jsonResponse);
    }
    const brand = yield brands_schema_1.default.find();
    if (brand) {
        jsonResponse.code = 200;
        jsonResponse.message = "marcas encontradas";
        jsonResponse.status = true;
        jsonResponse.data = brand;
    }
    else {
        jsonResponse.code = 400;
        jsonResponse.message = "no se encontraron marcas";
        jsonResponse.status = false;
    }
    res.json(jsonResponse);
});
// -----model-----
sellerController.allModels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        jsonResponse.code = generar_jwt_1.default.code;
        jsonResponse.message = generar_jwt_1.default.message;
        jsonResponse.status = false;
        jsonResponse.data = null;
        return res.json(jsonResponse);
    }
    const model = yield modelVehicle_schema_1.default.find();
    if (model) {
        jsonResponse.code = 200;
        jsonResponse.message = "todos los modelos";
        jsonResponse.status = true;
        jsonResponse.data = model;
    }
    else {
        jsonResponse.code = 400;
        jsonResponse.message = "no hay modelos";
        jsonResponse.status = false;
    }
    res.json(jsonResponse);
});
sellerController.autocompleteModels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { search } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const vehiclesFiltered = yield modelVehicle_schema_1.default.find({
        model: { $regex: search, $options: "i" },
    });
    if (vehiclesFiltered) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = vehiclesFiltered;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
// -----ventas------
sellerController.buyVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = new Response_1.ResponseModel();
    const date_sell = (0, moment_1.default)().format("YYYY-MM-DD");
    const { id_vehicle, id_seller, name_new_owner, dni_new_owner, phone_new_owner, email_new_owner, price_ofert, } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        responseJson.code = generar_jwt_1.default.code;
        responseJson.message = generar_jwt_1.default.message;
        responseJson.status = false;
        responseJson.data = null;
        return res.json(responseJson);
    }
    const vehicle = yield Vehicles_schema_1.default.findByIdAndUpdate(id_vehicle, {
        id_seller_buyer: id_seller,
        name_new_owner: name_new_owner,
        dni_new_owner: dni_new_owner,
        phone_new_owner: phone_new_owner,
        email_new_owner: email_new_owner,
        price_ofert: price_ofert,
        date_sell: date_sell,
        sold: false,
    });
    const getVehicle = yield Vehicles_schema_1.default.findById(id_vehicle);
    const infoBuyer = yield Sellers_schema_1.default.findById(id_seller);
    const infoSeller = yield Sellers_schema_1.default.findById(getVehicle.id_seller);
    const email = yield Users_schema_1.default.findById(infoSeller.id_user);
    const emailBuyer = yield Users_schema_1.default.findById(infoBuyer.id_user);
    const mailOptions = {
        from: "Toyousado Notifications",
        to: email.email,
        subject: "Oferta de vehículo",
        html: `<div>
        <p>Tienes una oferta de compra para:</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle.model}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle.year}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle.plate}</div>
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
        model: getVehicle.model,
        year: getVehicle.year,
        plate: getVehicle.plate,
        fullName: infoSeller.fullName,
        concesionary: infoSeller.concesionary,
        city: infoSeller.city,
        title: "Tienes una oferta de compra para:",
    };
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    sendNotification(infoSeller._id.toString(), dataVehicle, "Oferta de vehículo");
    responseJson.code = 200;
    responseJson.message =
        "Compra realizada, esperar confirmación o rechazo del vendedor";
    responseJson.status = true;
    // }
    res.json(responseJson);
});
// ----notificaciones----
sellerController.getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const notificationsUser = yield notifications_schema_1.default
        .find({ id_user: id_user, status: false })
        .sort({ date: -1 });
    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "notificaciones obtenidas exitosamente";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron notificaciones";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
sellerController.updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const notificationsUser = yield notifications_schema_1.default.findByIdAndUpdate(id, {
        status: true,
    });
    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "notificacion actualizada exitosamente";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "error al actualizar notificacion";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
sellerController.notificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const notificationsUser = yield notifications_schema_1.default.findById(id);
    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "notificacion encontrada exitosamente";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontro notificacion";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
sellerController.countNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const countNotifies = yield notifications_schema_1.default.countDocuments({
        id_user: id_user,
        status: false,
    });
    if (countNotifies) {
        reponseJson.code = 200;
        reponseJson.message = "conteo de notificaciones exitoso";
        reponseJson.status = true;
        reponseJson.data = countNotifies;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontro notificacion";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
// -----tecnico mecanico---
sellerController.addMechanic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    const date_created = (0, moment_1.default)().format("YYYY-MM-DD");
    const { email, password, username, fullName, city, concesionary } = req.body;
    const hash = yield bcrypt_1.default.hash(password, 10);
    const exist = yield Users_schema_1.default.findOne({ email: email });
    if (exist) {
        reponseJson.code = 400;
        reponseJson.message = "El usuario se encuentra registrado";
        reponseJson.status = false;
        reponseJson.data = "";
    }
    else {
        const newUser = new Users_schema_1.default({
            email,
            password: hash,
            username,
            type_user: "mechanic",
        });
        const newMechanic = new Mechanics_schema_1.default({
            fullName,
            city,
            concesionary,
            date_created,
        });
        yield newUser.save();
        if (newUser) {
            newMechanic.id_user = newUser._id;
        }
        yield newMechanic.save();
        if (newMechanic && newUser) {
            const mailOptions = {
                from: "Toyousado",
                to: email,
                subject: "Bienvenido",
                text: "Bienvenido a Toyousado, tu usuario es: " +
                    email +
                    " y tu contraseña es: " +
                    password +
                    "",
            };
            yield (0, nodemailer_1.sendEmail)(mailOptions);
            reponseJson.code = 200;
            reponseJson.message = "Técnico agregado exitosamente";
            reponseJson.status = true;
            reponseJson.data = "";
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "Error al agregar técnico";
            reponseJson.status = false;
            reponseJson.data = "";
        }
    }
    res.json(reponseJson);
});
sellerController.allMechanics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    let arrayMechanics = [];
    let infoMechanic = [];
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const ress = yield Users_schema_1.default.find({ type_user: "mechanic" })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            reponseJson.code = 200;
            reponseJson.message = "Técnicos encontrados";
            reponseJson.status = true;
            for (let i = 0; i < res.length; i++) {
                yield Mechanics_schema_1.default
                    .find({ id_user: res[i]._id })
                    .then((res2) => {
                    if (res2) {
                        res2.forEach((element) => {
                            infoMechanic.push(element);
                        });
                    }
                    else {
                        infoMechanic = [];
                        return res2;
                    }
                })
                    .catch((err) => {
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
                            image: (yield imgUser_schema_1.default.findOne({ id_user: res[j]._id }))
                                ? yield imgUser_schema_1.default.findOne({ id_user: res[j]._id })
                                : "",
                        };
                        arrayMechanics.push(mechanic);
                    }
                }
            }
            reponseJson.data = arrayMechanics;
            return reponseJson;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "no se encontraron técnicos";
            reponseJson.status = false;
            return reponseJson;
        }
    }))
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
});
sellerController.mechanicByConcesionary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    const { concesionary } = req.body;
    let arrayMechanics = [];
    const mecByConcesionary = yield Mechanics_schema_1.default.find({
        concesionary: concesionary,
    });
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
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
                image: (yield imgUser_schema_1.default.findOne({
                    id_user: mecByConcesionary[i].id_user,
                }))
                    ? yield imgUser_schema_1.default.findOne({ id_user: mecByConcesionary[i].id_user })
                    : "",
            };
            arrayMechanics.push(mechanic);
        }
        reponseJson.code = 200;
        reponseJson.message = "Técnicos encontrados";
        reponseJson.status = true;
        reponseJson.data = arrayMechanics;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron Técnicos";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
// ------zonas-----
sellerController.allZones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const ress = yield Zones_schema_1.default
        .find()
        .then((res) => {
        if (res) {
            reponseJson.code = 200;
            reponseJson.message = "zonas encontradas";
            reponseJson.status = true;
            reponseJson.data = res;
            return reponseJson;
        }
        else if (!res) {
            reponseJson.code = 400;
            reponseJson.message = "no se encontraron zonas";
            reponseJson.status = false;
            return reponseJson;
        }
    })
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
});
// ----concesionario----
sellerController.allConcesionaries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { search } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const ress = yield Concesionaries_schema_1.default
        .find()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(res);
        if (res) {
            reponseJson.code = 200;
            reponseJson.message = "concesionarias encontradas";
            reponseJson.status = true;
            reponseJson.data = res;
            return reponseJson;
        }
        else if (!res) {
            reponseJson.code = 400;
            reponseJson.message = "no se encontraron concesionarias";
            reponseJson.status = false;
            return reponseJson;
        }
    }))
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
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
function getMonthlyTotals(data) {
    const monthlyTotals = [];
    for (let i = 0; i < data.length; i++) {
        const document = data[i];
        const month = document._id.substring(0, 7); // Extrae el año y mes de la fecha
        if (monthlyTotals[month]) {
            monthlyTotals[month] += document.monto; // Si el mes ya existe en el objeto, acumula el monto
        }
        else {
            monthlyTotals[month] = document.monto; // Si el mes no existe en el objeto, crea la propiedad y asigna el monto
        }
    }
    const result = [];
    for (const month in monthlyTotals) {
        result.push({ _id: month + "-01", monto: monthlyTotals[month] }); // Convierte el objeto en un array
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
        const fecha = new Date(dato._id);
        const semana = getWeekNumber(fecha);
        if (semanas[semana]) {
            semanas[semana] += dato.monto;
        }
        else {
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
        semanas[contador] += dato.monto;
        contador++;
    }
    const result = [];
    for (const semana in semanas) {
        result.push({ semana: Number(semana), monto: semanas[semana] });
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
exports.default = sellerController;
//# sourceMappingURL=seller.controller.js.map