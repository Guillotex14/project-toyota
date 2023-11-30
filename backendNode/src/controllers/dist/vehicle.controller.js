"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Response_1 = require("../models/Response");
var Users_schema_1 = require("../schemas/Users.schema");
var Sellers_schema_1 = require("../schemas/Sellers.schema");
var Mechanics_schema_1 = require("../schemas/Mechanics.schema");
var generar_jwt_1 = require("../helpers/generar-jwt");
var moment_1 = require("moment");
var nodemailer_1 = require("../../nodemailer");
var Vehicles_schema_1 = require("../schemas/Vehicles.schema");
var notifications_schema_1 = require("../schemas/notifications.schema");
var sharp_1 = require("sharp");
var Vehicles_schema_2 = require("../schemas/Vehicles.schema");
var mechanicalsFiles_schema_1 = require("../schemas/mechanicalsFiles.schema");
var ImgVehicle_schema_1 = require("../schemas/ImgVehicle.schema");
var fs_1 = require("fs");
var ejs_1 = require("ejs");
var puppeteer_1 = require("puppeteer");
var axios_1 = require("axios");
var cloudinaryMetods_1 = require("../../cloudinaryMetods");
var global = require("../global");
var mongoose_1 = require("mongoose");
var Concesionaries_schema_1 = require("../schemas/Concesionaries.schema");
var templates_mails_1 = require("../templates/mails/templates.mails");
var reportsMechanicalsFiles_schema_1 = require("../schemas/reportsMechanicalsFiles.schema");
var vehicleController = {};
vehicleController.addVehicle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, emailmechanic, infoSeller, dateNow, documents, _a, model, brand, year, displacement, km, engine_model, titles, fuel, transmission, traction, city, concesionary, traction_control, performance, comfort, technology, id_seller, id_mechanic, type_vehicle, images, vin, vehicle_plate, imgs_documents, concesionary_maintenance, general_condition, newVehicle, mec, i, imgResize, filename, imgVehi, i, imgResize, filename, data, dataVehicle, template, mailOptions;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "admin_concesionary"])];
            case 1:
                decode = _b.sent();
                emailmechanic = "";
                infoSeller = {};
                dateNow = moment_1["default"]().format("YYYY-MM-DD");
                documents = [];
                _a = req.body, model = _a.model, brand = _a.brand, year = _a.year, displacement = _a.displacement, km = _a.km, engine_model = _a.engine_model, titles = _a.titles, fuel = _a.fuel, transmission = _a.transmission, traction = _a.traction, city = _a.city, concesionary = _a.concesionary, traction_control = _a.traction_control, performance = _a.performance, comfort = _a.comfort, technology = _a.technology, id_seller = _a.id_seller, id_mechanic = _a.id_mechanic, type_vehicle = _a.type_vehicle, images = _a.images, vin = _a.vin, vehicle_plate = _a.vehicle_plate, imgs_documents = _a.imgs_documents, concesionary_maintenance = _a.concesionary_maintenance, general_condition = _a.general_condition;
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                newVehicle = new Vehicles_schema_2["default"]({
                    model: model,
                    year: year,
                    brand: brand,
                    displacement: displacement,
                    km: km,
                    engine_model: engine_model,
                    titles: titles,
                    fuel: fuel,
                    transmission: transmission,
                    traction: traction,
                    city: city,
                    concesionary: concesionary,
                    traction_control: traction_control,
                    performance: performance,
                    comfort: comfort,
                    technology: technology,
                    mechanicalFile: false,
                    sold: false,
                    date_create: dateNow,
                    price: null,
                    id_seller: id_seller,
                    id_mechanic: id_mechanic,
                    id_seller_buyer: null,
                    type_vehicle: type_vehicle,
                    vin: vin,
                    plate: vehicle_plate,
                    concesionary_maintenance: concesionary_maintenance,
                    general_condition: general_condition
                });
                return [4 /*yield*/, newVehicle.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, Mechanics_schema_1["default"].findOne({ _id: id_mechanic })];
            case 3:
                mec = _b.sent();
                return [4 /*yield*/, Users_schema_1["default"].findOne({ _id: mec.id_user })];
            case 4:
                emailmechanic = _b.sent();
                return [4 /*yield*/, Sellers_schema_1["default"].findOne({ _id: id_seller })];
            case 5:
                infoSeller = _b.sent();
                if (!images) return [3 /*break*/, 11];
                if (!(images.length > 0)) return [3 /*break*/, 11];
                i = 0;
                _b.label = 6;
            case 6:
                if (!(i < images.length)) return [3 /*break*/, 11];
                return [4 /*yield*/, desgloseImg(images[i].image)];
            case 7:
                imgResize = _b.sent();
                return [4 /*yield*/, cloudinaryMetods_1.uploadImageVehicle(imgResize)];
            case 8:
                filename = _b.sent();
                imgVehi = new ImgVehicle_schema_1["default"]({
                    img: filename.secure_url,
                    id_vehicle: newVehicle._id,
                    public_id: filename.public_id
                });
                return [4 /*yield*/, imgVehi.save()];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 6];
            case 11:
                if (!imgs_documents) return [3 /*break*/, 16];
                if (!(imgs_documents.length > 0)) return [3 /*break*/, 16];
                i = 0;
                _b.label = 12;
            case 12:
                if (!(i < imgs_documents.length)) return [3 /*break*/, 16];
                return [4 /*yield*/, desgloseImg(imgs_documents[i].image)];
            case 13:
                imgResize = _b.sent();
                return [4 /*yield*/, cloudinaryMetods_1.uploadDocuments(imgResize)];
            case 14:
                filename = _b.sent();
                data = {
                    img: filename.secure_url,
                    public_id: filename.public_id
                };
                documents.push(data);
                _b.label = 15;
            case 15:
                i++;
                return [3 /*break*/, 12];
            case 16: return [4 /*yield*/, Vehicles_schema_2["default"].findByIdAndUpdate(newVehicle._id, {
                    imgs_documentation: documents
                })];
            case 17:
                _b.sent();
                dataVehicle = {
                    model: model,
                    year: year,
                    plate: vehicle_plate,
                    fullName: infoSeller.fullName,
                    concesionary: infoSeller.concesionary,
                    city: infoSeller.city,
                    title: "Tienes el siguiente vehículo para generar la ficha técnica",
                    link: "" + newVehicle._id
                };
                template = templates_mails_1.templatesMails("newInspect", dataVehicle);
                mailOptions = {
                    from: "Toyousado",
                    to: emailmechanic.email,
                    subject: "Revisión de vehículo",
                    html: template
                };
                sendNotificationMechanic(id_mechanic, dataVehicle, "Revisión de vehículo");
                return [4 /*yield*/, nodemailer_1.sendEmail(mailOptions)];
            case 18:
                _b.sent();
                reponseJson.code = 200;
                reponseJson.message = "Vehículo agregado exitosamente";
                reponseJson.status = true;
                reponseJson.data = "";
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.addImgVehicle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, _a, id_vehicle, image, filename, newImage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "admin_concesionary"])];
            case 1:
                decode = _b.sent();
                _a = req.body, id_vehicle = _a.id_vehicle, image = _a.image;
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, cloudinaryMetods_1.uploadImageVehicle(image)];
            case 2:
                filename = _b.sent();
                newImage = new ImgVehicle_schema_1["default"]({
                    img: filename.secure_url,
                    id_vehicle: id_vehicle,
                    public_id: filename.public_id
                });
                return [4 /*yield*/, newImage.save()];
            case 3:
                _b.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.deleteImgVehicle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, public_id, token, decode, delImag, delImg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                public_id = req.body.public_id;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "admin_concesionary"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, cloudinaryMetods_1.deleteImageVehicle(public_id)];
            case 2:
                delImag = _a.sent();
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOneAndDelete({ public_id: public_id })];
            case 3:
                delImg = _a.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.updateImgVehicle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, _a, id_vehicle, image, public_id, token, decode, delImg, delImag, filename, newImage, arrayImages, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                _a = req.body, id_vehicle = _a.id_vehicle, image = _a.image, public_id = _a.public_id;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin"])];
            case 1:
                decode = _b.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOneAndDelete({ public_id: public_id })];
            case 2:
                delImg = _b.sent();
                return [4 /*yield*/, cloudinaryMetods_1.deleteImageVehicle(public_id)];
            case 3:
                delImag = _b.sent();
                if (!delImg) return [3 /*break*/, 7];
                return [4 /*yield*/, cloudinaryMetods_1.uploadImageVehicle(image)];
            case 4:
                filename = _b.sent();
                newImage = new ImgVehicle_schema_1["default"]({
                    img: filename.secure_url,
                    id_vehicle: id_vehicle,
                    public_id: filename.public_id
                });
                return [4 /*yield*/, newImage.save()];
            case 5:
                _b.sent();
                return [4 /*yield*/, ImgVehicle_schema_1["default"].find({ id_vehicle: id_vehicle })];
            case 6:
                arrayImages = _b.sent();
                data = {
                    images: arrayImages,
                    imgEdit: newImage
                };
                reponseJson.code = 200;
                reponseJson.message = "Imagen actualizada exitosamente";
                reponseJson.data = data;
                reponseJson.status = true;
                return [3 /*break*/, 8];
            case 7:
                reponseJson.code = 400;
                reponseJson.message = "No se pudo actualizar la imagen";
                reponseJson.status = false;
                _b.label = 8;
            case 8:
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.addImgDocuments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, _a, id_vehicle, image, filename, document, vehicle;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "admin_concesionary"])];
            case 1:
                decode = _b.sent();
                _a = req.body, id_vehicle = _a.id_vehicle, image = _a.image;
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, cloudinaryMetods_1.uploadDocuments(image)];
            case 2:
                filename = _b.sent();
                document = {
                    img: filename.secure_url,
                    public_id: filename.public_id
                };
                return [4 /*yield*/, Vehicles_schema_2["default"].findById(id_vehicle)];
            case 3:
                vehicle = _b.sent();
                if (vehicle) {
                    vehicle.imgs_documentation.push(document);
                    vehicle.save();
                }
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.deleteImgDocuments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, _a, public_id, vehicle_id, token, decode, imgs_documentation, index, delImag, delImg;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                _a = req.body, public_id = _a.public_id, vehicle_id = _a.vehicle_id;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "admin_concesionary"])];
            case 1:
                decode = _b.sent();
                imgs_documentation = [];
                index = 0;
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, cloudinaryMetods_1.deleteImageVehicle(public_id)];
            case 2:
                delImag = _b.sent();
                return [4 /*yield*/, Vehicles_schema_2["default"].findByIdAndUpdate(vehicle_id, {
                        $pull: { imgs_documentation: { public_id: public_id } }
                    })];
            case 3:
                delImg = _b.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.updateImgDocuments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, _a, id_vehicle, image, public_id, token, decode, delImg, delImag, filename, document, vehicle;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                _a = req.body, id_vehicle = _a.id_vehicle, image = _a.image, public_id = _a.public_id;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "admin_concesionary"])];
            case 1:
                decode = _b.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"].findByIdAndUpdate(id_vehicle, {
                        $pull: { imgs_documentation: { public_id: public_id } }
                    })];
            case 2:
                delImg = _b.sent();
                return [4 /*yield*/, cloudinaryMetods_1.deleteImageVehicle(public_id)];
            case 3:
                delImag = _b.sent();
                if (!delImg) return [3 /*break*/, 6];
                return [4 /*yield*/, cloudinaryMetods_1.uploadDocuments(image)];
            case 4:
                filename = _b.sent();
                document = {
                    img: filename.secure_url,
                    public_id: filename.public_id
                };
                return [4 /*yield*/, Vehicles_schema_2["default"].findById(id_vehicle)];
            case 5:
                vehicle = _b.sent();
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
                return [3 /*break*/, 7];
            case 6:
                reponseJson.code = 400;
                reponseJson.message = "No se pudo actualizar la imagen";
                reponseJson.status = false;
                _b.label = 7;
            case 7:
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.updateVehicle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, data, vehicleUpdated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller"])];
            case 1:
                decode = _a.sent();
                data = req.body.data;
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"].findByIdAndUpdate(data._id, data)];
            case 2:
                vehicleUpdated = _a.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.allVehicles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, query, token, decode, _a, minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, vehiclesFiltered, arrayVehicles, i, data, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                query = {};
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, [
                        "seller",
                        "admin",
                        "admin_concesionary",
                        "mechanic",
                    ])];
            case 1:
                decode = _d.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                _a = req.body, minYear = _a.minYear, maxYear = _a.maxYear, minKm = _a.minKm, maxKm = _a.maxKm, minPrice = _a.minPrice, maxPrice = _a.maxPrice, brand = _a.brand, model = _a.model, ubication = _a.ubication, type_vehicle = _a.type_vehicle;
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
                return [4 /*yield*/, Vehicles_schema_2["default"].find(query).sort({ date_create: -1 })];
            case 2:
                vehiclesFiltered = _d.sent();
                if (!vehiclesFiltered) return [3 /*break*/, 10];
                arrayVehicles = [];
                i = 0;
                _d.label = 3;
            case 3:
                if (!(i < vehiclesFiltered.length)) return [3 /*break*/, 9];
                _b = {
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
                    vin: vehiclesFiltered[i].vin
                };
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({
                        id_vehicle: vehiclesFiltered[i]._id
                    })];
            case 4:
                if (!(_d.sent())) return [3 /*break*/, 6];
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({ id_vehicle: vehiclesFiltered[i]._id })];
            case 5:
                _c = _d.sent();
                return [3 /*break*/, 7];
            case 6:
                _c = "";
                _d.label = 7;
            case 7:
                data = (_b.image = _c,
                    _b);
                arrayVehicles.push(data);
                _d.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 3];
            case 9:
                reponseJson.code = 200;
                reponseJson.message = "vehículos encontrados exitosamente";
                reponseJson.status = true;
                reponseJson.data = arrayVehicles;
                return [3 /*break*/, 11];
            case 10:
                reponseJson.code = 400;
                reponseJson.message =
                    "no se encontraron vehículos con los filtros seleccionados";
                reponseJson.status = false;
                _d.label = 11;
            case 11:
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.myVehicles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonRes, arrayVehicles, query, _a, minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, token, decode, vehiclesFiltered, i, data, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                jsonRes = new Response_1.ResponseModel();
                arrayVehicles = [];
                query = {};
                _a = req.body, minYear = _a.minYear, maxYear = _a.maxYear, minKm = _a.minKm, maxKm = _a.maxKm, minPrice = _a.minPrice, maxPrice = _a.maxPrice, brand = _a.brand, model = _a.model, ubication = _a.ubication, type_vehicle = _a.type_vehicle;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, [
                        "seller",
                        "admin",
                        "admin_concesionary",
                        "mechanic",
                    ])];
            case 1:
                decode = _d.sent();
                if (decode == false) {
                    jsonRes.code = generar_jwt_1["default"].code;
                    jsonRes.message = generar_jwt_1["default"].message;
                    jsonRes.status = false;
                    jsonRes.data = null;
                    return [2 /*return*/, res.json(jsonRes)];
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
                return [4 /*yield*/, Vehicles_schema_2["default"].find(query).sort({ date_create: -1 })];
            case 2:
                vehiclesFiltered = _d.sent();
                if (!vehiclesFiltered) return [3 /*break*/, 10];
                i = 0;
                _d.label = 3;
            case 3:
                if (!(i < vehiclesFiltered.length)) return [3 /*break*/, 9];
                _b = {
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
                    dispatched: vehiclesFiltered[i].dispatched
                };
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({
                        id_vehicle: vehiclesFiltered[i]._id
                    })];
            case 4:
                if (!(_d.sent())) return [3 /*break*/, 6];
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({ id_vehicle: vehiclesFiltered[i]._id })];
            case 5:
                _c = _d.sent();
                return [3 /*break*/, 7];
            case 6:
                _c = "";
                _d.label = 7;
            case 7:
                data = (_b.images = _c,
                    _b);
                arrayVehicles.push(data);
                _d.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 3];
            case 9:
                jsonRes.code = 200;
                jsonRes.message = "Vehicleos encontrados";
                jsonRes.status = true;
                jsonRes.data = arrayVehicles;
                return [3 /*break*/, 11];
            case 10:
                jsonRes.code = 400;
                jsonRes.message = "No se encontraron vehículos";
                jsonRes.status = false;
                _d.label = 11;
            case 11:
                res.json(jsonRes);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.vehicleById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonRes, id, token, decode, infoVehicle, imgsVehichle, mechanicalFile, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jsonRes = new Response_1.ResponseModel();
                id = req.body.id;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, [
                        "seller",
                        "admin",
                        "mechanic",
                        "admin_concesionary",
                    ])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    jsonRes.code = generar_jwt_1["default"].code;
                    jsonRes.message = generar_jwt_1["default"].message;
                    jsonRes.status = false;
                    jsonRes.data = null;
                    return [2 /*return*/, res.json(jsonRes)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"].findOne({ _id: id })];
            case 2:
                infoVehicle = _a.sent();
                return [4 /*yield*/, ImgVehicle_schema_1["default"].find({ id_vehicle: id })];
            case 3:
                imgsVehichle = _a.sent();
                return [4 /*yield*/, mechanicalsFiles_schema_1["default"].findOne({ id_vehicle: id })];
            case 4:
                mechanicalFile = _a.sent();
                if (infoVehicle) {
                    data = {
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
                        general_condition: mechanicalFile
                            ? mechanicalFile.general_condition
                            : "",
                        images: imgsVehichle ? imgsVehichle : [],
                        imgs_documentation: infoVehicle.imgs_documentation
                            ? infoVehicle.imgs_documentation
                            : []
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.mechanicalFileByIdVehicle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, id_vehicle, token, decode, mecFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                id_vehicle = req.body.id_vehicle;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, [
                        "mechanic",
                        "seller",
                        "admin",
                        "admin_concesionary",
                    ])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, mechanicalsFiles_schema_1["default"].aggregate([
                        {
                            $match: {
                                id_vehicle: new mongoose_1["default"].Types.ObjectId(id_vehicle)
                            }
                        },
                        {
                            $lookup: {
                                from: "vehicles",
                                localField: "id_vehicle",
                                foreignField: "_id",
                                as: "vehicle"
                            }
                        },
                        {
                            $lookup: {
                                from: "mechanics",
                                localField: "id_mechanic",
                                foreignField: "_id",
                                as: "mechanic"
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "mechanic.id_user",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { $unwind: "$vehicle" },
                        { $unwind: "$mechanic" },
                        { $unwind: "$user" },
                        {
                            $project: {
                                _id: 1,
                                id_vehicle: 1,
                                id_mechanic: 1,
                                part_emblems_complete: 1,
                                wiper_shower_brushes_windshield: 1,
                                hits: 1,
                                scratches: 1,
                                paint_condition: 1,
                                bugle_accessories: 1,
                                air_conditioning_system: 1,
                                radio_player: 1,
                                courtesy_lights: 1,
                                upholstery_condition: 1,
                                gts: 1,
                                board_lights: 1,
                                tire_pressure: 1,
                                tire_life: 1,
                                battery_status_terminals: 1,
                                transmitter_belts: 1,
                                motor_oil: 1,
                                engine_coolant_container: 1,
                                radiator_status: 1,
                                exhaust_pipe_bracket: 1,
                                fuel_tank_cover_pipes_hoses_connections: 1,
                                distribution_mail: 1,
                                spark_plugs_air_filter_fuel_filter_anti_pollen_filter: 1,
                                fuel_system: 1,
                                parking_break: 1,
                                brake_bands_drums: 1,
                                brake_pads_discs: 1,
                                brake_pipes_hoses: 1,
                                master_cylinder: 1,
                                brake_fluid: 1,
                                bushings_plateaus: 1,
                                stumps: 1,
                                terminals: 1,
                                stabilizer_bar: 1,
                                bearings: 1,
                                tripoids_rubbe_bands: 1,
                                shock_absorbers_coils: 1,
                                dealer_maintenance: 1,
                                headlights_lights: 1,
                                general_condition: 1,
                                odometer: 1,
                                engine_start: 1,
                                windshields_glass: 1,
                                hits_scratches: 1,
                                spark_plugs: 1,
                                injectors: 1,
                                fuel_filter_anti_pollen_filter: 1,
                                engine_noises: 1,
                                hits_scratches_sides: 1,
                                paint_condition_sides: 1,
                                trunk_hatch: 1,
                                spare_tire: 1,
                                hits_scratches_trunk: 1,
                                paint_condition_trunk: 1,
                                headlights_lights_trunk: 1,
                                fuel_tank_cover: 1,
                                pipes_hoses_connections: 1,
                                brake_discs: 1,
                                created_at: 1,
                                vehicle: {
                                    price_ofert: 1
                                },
                                mechanic: {
                                    fullName: 1
                                }
                            }
                        }
                    ])];
            case 2:
                mecFile = _a.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.dispatchedCar = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, _a, id, final_price_sold, token, decode, vehiclesFiltered;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                _a = req.body, id = _a.id, final_price_sold = _a.final_price_sold;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "admin_concesionary"])];
            case 1:
                decode = _b.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"].findOneAndUpdate({ _id: id }, { sold: true, price: final_price_sold, dispatched: true })];
            case 2:
                vehiclesFiltered = _b.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.repost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, id, token, decode, vehiclesFiltered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                id = req.body.id;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "admin_concesionary"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"].findOneAndUpdate({ _id: id }, {
                        sold: false,
                        price_ofert: null,
                        final_price_sold: null,
                        name_new_owner: null,
                        dni_new_owner: null,
                        phone_new_owner: null,
                        email_new_owner: null,
                        date_sell: null,
                        id_seller_buyer: null
                    })];
            case 2:
                vehiclesFiltered = _a.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.getVehicleByType = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, type_vehicle, arrayVehicles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, [
                        "seller",
                        "admin",
                        "admin_concesionary",
                        "mechanic",
                    ])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                type_vehicle = req.body.type_vehicle;
                return [4 /*yield*/, Vehicles_schema_2["default"].find({
                        type_vehicle: type_vehicle,
                        mechanicalFile: true,
                        sold: false,
                        id_seller_buyer: null
                    })];
            case 2:
                arrayVehicles = _a.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.filterVehiclesWithMongo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, query, _a, minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, vehiclesFiltered, arrayVehicles, i, data, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, [
                        "seller",
                        "admin",
                        "admin_concesionary",
                        "mechanic",
                    ])];
            case 1:
                decode = _d.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                query = {};
                _a = req.body, minYear = _a.minYear, maxYear = _a.maxYear, minKm = _a.minKm, maxKm = _a.maxKm, minPrice = _a.minPrice, maxPrice = _a.maxPrice, brand = _a.brand, model = _a.model, ubication = _a.ubication, type_vehicle = _a.type_vehicle;
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
                return [4 /*yield*/, Vehicles_schema_2["default"].find(query).sort({ date_create: -1 })];
            case 2:
                vehiclesFiltered = _d.sent();
                if (!vehiclesFiltered) return [3 /*break*/, 10];
                arrayVehicles = [];
                i = 0;
                _d.label = 3;
            case 3:
                if (!(i < vehiclesFiltered.length)) return [3 /*break*/, 9];
                _b = {
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
                    concesionary_maintenance: vehiclesFiltered[i].concesionary_maintenance
                };
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({
                        id_vehicle: vehiclesFiltered[i]._id
                    })];
            case 4:
                if (!(_d.sent())) return [3 /*break*/, 6];
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({ id_vehicle: vehiclesFiltered[i]._id })];
            case 5:
                _c = _d.sent();
                return [3 /*break*/, 7];
            case 6:
                _c = "";
                _d.label = 7;
            case 7:
                data = (_b.image = _c,
                    _b);
                arrayVehicles.push(data);
                _d.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 3];
            case 9:
                reponseJson.code = 200;
                reponseJson.message = "vehículos encontrados exitosamente";
                reponseJson.status = true;
                reponseJson.data = arrayVehicles;
                return [3 /*break*/, 11];
            case 10:
                reponseJson.code = 400;
                reponseJson.message =
                    "no se encontraron vehículos con los filtros seleccionados";
                reponseJson.status = false;
                _d.label = 11;
            case 11:
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.filterGraphySale = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, data, now, anioActual, monthActual, firtsMonth, last, lastDayLasyMont, lastMonth, rangArrayMonth, from, to, mongQuery, user, sendData, chartData, datos, optionset, vehiclesFiltered, listCars, j, imgvehicles, cantMonth, groupByWeek, groupByOneMonth, labels_1, total, labels_2, nameArray, i, total, conditionGroup, cardsgroupmodel, listCars, j, imgvehicles, result, labels, minData, avgData, maxData, arrayMount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["admin", "seller", "admin_concesionary"])];
            case 1:
                decode = _a.sent();
                data = req.query;
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                now = new Date();
                anioActual = now.getFullYear();
                monthActual = now.getMonth() + 1;
                if (data.yearSold) {
                    anioActual = data.yearSold;
                }
                if (!data.month) {
                    data.month = monthActual;
                }
                if (!data.rangMonths) {
                    data.rangMonths = 1;
                } //
                firtsMonth = new Date(anioActual, data.month - 1, 1);
                last = new Date(anioActual, 11);
                lastDayLasyMont = getLastDayOfMonth(anioActual, 11);
                lastMonth = new Date(anioActual, 11, lastDayLasyMont.getDate());
                rangArrayMonth = [];
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
                from = firtsMonth.getFullYear() + "-" + (firtsMonth.getMonth() + 1 < 10
                    ? "0" + (firtsMonth.getMonth() + 1)
                    : firtsMonth.getMonth() + 1) + "-" + (firtsMonth.getDate() < 10
                    ? "0" + firtsMonth.getDate()
                    : firtsMonth.getDate());
                to = lastMonth.getFullYear() + "-" + (lastMonth.getMonth() + 1 < 10
                    ? "0" + (lastMonth.getMonth() + 1)
                    : lastMonth.getMonth() + 1) + "-" + (lastMonth.getDate() < 10 ? "0" + lastMonth.getDate() : lastMonth.getDate());
                mongQuery = {
                    date_sell: {
                        $gte: from,
                        $lte: to
                    },
                    sold: true,
                    dispatched: true
                };
                if (data.yearCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { year: parseInt(data.yearCar) });
                }
                if (data.brandCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { brand: { $regex: data.brandCar, $options: "i" } });
                }
                if (data.modelCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { model: { $regex: data.modelCar, $options: "i" } });
                }
                user = null;
                sendData = [];
                chartData = {};
                datos = {};
                optionset = {
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
                    data: {}
                };
                if (!!data.triple_m) return [3 /*break*/, 8];
                return [4 /*yield*/, Vehicles_schema_1["default"].aggregate([
                        {
                            $match: mongQuery
                        },
                        {
                            $group: {
                                _id: "$date_sell",
                                total: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                mes: "$_id",
                                total: 1,
                                _id: 0
                            }
                        },
                        { $sort: { _id: 1 } },
                    ])];
            case 2:
                vehiclesFiltered = _a.sent();
                return [4 /*yield*/, Vehicles_schema_1["default"].aggregate([
                        {
                            $match: mongQuery
                        }
                    ])];
            case 3:
                listCars = _a.sent();
                j = 0;
                _a.label = 4;
            case 4:
                if (!(j < listCars.length)) return [3 /*break*/, 7];
                listCars[j].imgVehicle = null;
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({
                        id_vehicle: listCars[j]._id
                    })];
            case 5:
                imgvehicles = _a.sent();
                listCars[j].imgVehicle = imgvehicles;
                _a.label = 6;
            case 6:
                j++;
                return [3 /*break*/, 4];
            case 7:
                sendData = getQuantityTotals(vehiclesFiltered);
                cantMonth = calcularMeses(from, to);
                if (cantMonth == 1 || sendData.length == 1) {
                    groupByWeek = [];
                    groupByOneMonth = [];
                    groupByWeek = agruparPorSemana(sendData);
                    groupByOneMonth = agruparPorWeek(groupByWeek);
                    labels_1 = groupByOneMonth.map(function (item) { return item.semana; });
                    total = groupByOneMonth.map(function (item) { return item.total; });
                    datos = {
                        labels: labels_1,
                        datasets: [
                            __assign(__assign({}, optionset), { data: total }),
                        ],
                        list: listCars
                    };
                }
                else {
                    labels_2 = sendData.map(function (dato) { return dato.mes; });
                    nameArray = [];
                    for (i = 0; i < labels_2.length; i++) {
                        nameArray[i] = getNameMonth(labels_2[i]); // devuelve el nombre del mes
                    }
                    nameArray = orderMonths(nameArray);
                    console.log(nameArray);
                    total = sendData.map(function (dato) { return dato.total; });
                    datos = {
                        labels: nameArray,
                        datasets: [
                            __assign(__assign({}, optionset), { data: total }),
                        ],
                        list: listCars
                    };
                }
                return [3 /*break*/, 15];
            case 8:
                conditionGroup = {
                    _id: "$date_sell",
                    minAmount: { $min: "$price" },
                    avgAmount: { $avg: "$price" },
                    maxAmount: { $max: "$price" }
                };
                if (data.triple_m == "max") {
                    conditionGroup = {
                        _id: "$date_sell",
                        maxAmount: { $max: "$price" }
                    };
                }
                else if (data.triple_m == "mid") {
                    conditionGroup = {
                        _id: "$date_sell",
                        // maxAmount: { $literal: 0 },
                        avgAmount: { $avg: "$price" }
                    };
                }
                else if (data.triple_m == "min") {
                    conditionGroup = {
                        _id: "$date_sell",
                        // maxAmount: { $literal: 0 },
                        // avgAmount: { $literal: 0 },
                        minAmount: { $min: "$price" }
                    };
                }
                else if (data.triple_m == "all") {
                    conditionGroup = {
                        _id: "$date_sell",
                        minAmount: { $min: "$price" },
                        avgAmount: { $avg: "$price" },
                        maxAmount: { $max: "$price" }
                    };
                }
                return [4 /*yield*/, Vehicles_schema_1["default"].aggregate([
                        {
                            $match: mongQuery
                        },
                        {
                            $group: conditionGroup
                        },
                        {
                            $sort: {
                                _id: 1
                            }
                        },
                    ])];
            case 9:
                cardsgroupmodel = _a.sent();
                return [4 /*yield*/, Vehicles_schema_1["default"].aggregate([
                        {
                            $match: mongQuery
                        }
                    ])];
            case 10:
                listCars = _a.sent();
                j = 0;
                _a.label = 11;
            case 11:
                if (!(j < listCars.length)) return [3 /*break*/, 14];
                listCars[j].imgVehicle = null;
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({
                        id_vehicle: listCars[j]._id
                    })];
            case 12:
                imgvehicles = _a.sent();
                listCars[j].imgVehicle = imgvehicles;
                _a.label = 13;
            case 13:
                j++;
                return [3 /*break*/, 11];
            case 14:
                result = groupAndSumByMonth(cardsgroupmodel);
                labels = [];
                minData = [];
                avgData = [];
                maxData = [];
                result.forEach(function (item) {
                    labels.push(getNameMonth(item.month)); // Agregar el mes como etiqueta
                    minData.push(item.minAmount); // Agregar el monto mínimo
                    avgData.push(item.avgAmount); // Agregar el monto promedio
                    maxData.push(item.maxAmount); // Agregar el monto máximo
                });
                arrayMount = [];
                if (data.triple_m == "max") {
                    arrayMount = [
                        {
                            label: "Monto Máximo",
                            data: maxData,
                            borderColor: "red",
                            fill: false
                        }
                    ];
                }
                else if (data.triple_m == "mid") {
                    arrayMount = [
                        {
                            label: "Monto Promedio",
                            data: avgData,
                            borderColor: "green",
                            fill: false
                        }
                    ];
                }
                else if (data.triple_m == "min") {
                    arrayMount = [
                        {
                            label: "Monto Mínimo",
                            data: minData,
                            borderColor: "blue",
                            fill: false
                        }
                    ];
                }
                else if (data.triple_m == "all") {
                    arrayMount = [
                        {
                            label: "Monto Mínimo",
                            data: minData,
                            borderColor: "blue",
                            fill: false
                        },
                        {
                            label: "Monto Promedio",
                            data: avgData,
                            borderColor: "green",
                            fill: false
                        },
                        {
                            label: "Monto Máximo",
                            data: maxData,
                            borderColor: "red",
                            fill: false
                        }
                    ];
                }
                chartData = {
                    labels: labels,
                    datasets: arrayMount,
                    list: listCars
                };
                datos = chartData;
                _a.label = 15;
            case 15:
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.listVehiclesSale = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, _a, dateTo, dateFrom, yearCar, brandCar, modelCar, concesionary, id_user, now, from_at, to_at, mongQuery, otherMong, from, to, user, cardsgroupmodel, cardsgroupNacional, _loop_1, i, otherQuery, countMechanicaFile, datos;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["admin", "seller", "admin_concesionary"])];
            case 1:
                decode = _b.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                _a = req.query, dateTo = _a.dateTo, dateFrom = _a.dateFrom, yearCar = _a.yearCar, brandCar = _a.brandCar, modelCar = _a.modelCar, concesionary = _a.concesionary, id_user = _a.id_user;
                now = new Date();
                from_at = now.getFullYear() + "-01-01";
                to_at = now.getFullYear() + "-12-31";
                mongQuery = {
                    sold: true,
                    dispatched: true,
                    date_sell: {
                        $gte: from_at,
                        $lte: to_at
                    }
                };
                otherMong = {
                    sold: true,
                    dispatched: true,
                    date_sell: {
                        $gte: from_at,
                        $lte: to_at
                    }
                };
                if (dateFrom && dateTo) {
                    from = new Date(dateFrom).toISOString().substr(0, 10);
                    to = new Date(dateTo).toISOString().substr(0, 10);
                    mongQuery = __assign(__assign({}, mongQuery), { date_sell: {
                            $gte: from,
                            $lte: to
                        } });
                    otherMong = __assign(__assign({}, otherMong), { date_sell: {
                            $gte: from,
                            $lte: to
                        } });
                }
                if (yearCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { year: parseInt(yearCar) });
                    otherMong = __assign(__assign({}, otherMong), { year: parseInt(yearCar) });
                }
                if (brandCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { brand: { $regex: brandCar, $options: "i" } });
                    otherMong = __assign(__assign({}, otherMong), { brand: { $regex: brandCar, $options: "i" } });
                }
                if (modelCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { model: { $regex: modelCar, $options: "i" } });
                    otherMong = __assign(__assign({}, otherMong), { model: { $regex: modelCar, $options: "i" } });
                }
                if (concesionary) {
                    mongQuery = __assign(__assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
                }
                user = null;
                return [4 /*yield*/, Users_schema_1["default"].findOne({ _id: id_user })];
            case 2:
                user = _b.sent();
                return [4 /*yield*/, Vehicles_schema_2["default"].aggregate([
                        {
                            $match: mongQuery
                        },
                        {
                            $group: {
                                _id: "$model",
                                minPrice: { $min: "$price" },
                                avgPrice: { $avg: "$price" },
                                maxPrice: { $max: "$price" },
                                vehicles: { $push: "$$ROOT" }
                            }
                        },
                        {
                            $sort: {
                                _id: 1
                            }
                        },
                    ])];
            case 3:
                cardsgroupmodel = _b.sent();
                return [4 /*yield*/, Vehicles_schema_2["default"].aggregate([
                        {
                            $match: otherMong
                        },
                        {
                            $group: {
                                _id: "$model",
                                minPriceGlobal: { $min: "$price" },
                                avgPriceGlobal: { $avg: "$price" },
                                maxPriceGlobal: { $max: "$price" }
                            }
                        },
                        {
                            $sort: {
                                _id: 1
                            }
                        },
                    ])];
            case 4:
                cardsgroupNacional = _b.sent();
                _loop_1 = function (i) {
                    var j, imgvehicles;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                j = 0;
                                _a.label = 1;
                            case 1:
                                if (!(j < cardsgroupmodel[i].vehicles.length)) return [3 /*break*/, 4];
                                cardsgroupmodel[i].vehicles[j].imgVehicle = null;
                                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({
                                        id_vehicle: cardsgroupmodel[i].vehicles[j]._id
                                    })];
                            case 2:
                                imgvehicles = _a.sent();
                                cardsgroupmodel[i].vehicles[j].imgVehicle = imgvehicles;
                                _a.label = 3;
                            case 3:
                                j++;
                                return [3 /*break*/, 1];
                            case 4:
                                cardsgroupNacional.forEach(function (model) {
                                    if (cardsgroupmodel[i]._id == model._id) {
                                        cardsgroupmodel[i] = __assign(__assign({}, cardsgroupmodel[i]), { minPriceGlobal: model.minPriceGlobal, avgPriceGlobal: model.avgPriceGlobal, maxPriceGlobal: model.maxPriceGlobal });
                                    }
                                });
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _b.label = 5;
            case 5:
                if (!(i < cardsgroupmodel.length)) return [3 /*break*/, 8];
                return [5 /*yield**/, _loop_1(i)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 5];
            case 8:
                otherQuery = __assign(__assign({}, mongQuery), { mechanicalFile: true });
                countMechanicaFile = [];
                return [4 /*yield*/, Vehicles_schema_2["default"].aggregate([
                        {
                            $match: otherQuery
                        },
                        {
                            $lookup: {
                                from: "mechanicalfiles",
                                localField: "_id",
                                foreignField: "id_vehicle",
                                as: "mechanicalfiles"
                            }
                        },
                        {
                            $unwind: {
                                path: "$mechanicalfiles"
                            }
                        },
                        {
                            $match: {
                                "mechanicalfiles.general_condition": {
                                    $in: ["bueno", "malo", "regular", "excelente"]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$mechanicalfiles.general_condition",
                                count: { $sum: 1 }
                            }
                        },
                    ])];
            case 9:
                countMechanicaFile = _b.sent();
                datos = {};
                datos = {
                    grupocard: cardsgroupmodel,
                    mechanicaFiles: countMechanicaFile
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.exportExcell = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, data, _a, dateTo, dateFrom, yearCar, brandCar, modelCar, concesionary, id_user, ExcelJS, now, from_at, to_at, mongQuery, otherMong, from, to, seller, user, concesionary_1, cardsgroupmodel, cardsgroupNacional, _loop_2, i, datos, workbook, headerStyle, footerStyle, fileName, filePath, sendUrl, mailOptions, sendadta;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["admin", "seller", "admin_concesionary"])];
            case 1:
                decode = _b.sent();
                data = req.query;
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                _a = req.query, dateTo = _a.dateTo, dateFrom = _a.dateFrom, yearCar = _a.yearCar, brandCar = _a.brandCar, modelCar = _a.modelCar, concesionary = _a.concesionary, id_user = _a.id_user;
                ExcelJS = require("exceljs");
                now = new Date();
                from_at = now.getFullYear() + "-01-01";
                to_at = now.getFullYear() + "-12-31";
                mongQuery = {
                    sold: true,
                    dispatched: true,
                    date_sell: {
                        $gte: from_at,
                        $lte: to_at
                    }
                };
                otherMong = {
                    sold: true,
                    dispatched: true,
                    date_sell: {
                        $gte: from_at,
                        $lte: to_at
                    }
                };
                if (dateFrom && dateTo) {
                    from = new Date(dateFrom).toISOString().substr(0, 10);
                    to = new Date(dateTo).toISOString().substr(0, 10);
                    mongQuery = __assign(__assign({}, mongQuery), { date_sell: {
                            $gte: from,
                            $lte: to
                        } });
                    otherMong = __assign(__assign({}, otherMong), { date_sell: {
                            $gte: from,
                            $lte: to
                        } });
                }
                if (yearCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { year: parseInt(yearCar) });
                    otherMong = __assign(__assign({}, otherMong), { year: parseInt(yearCar) });
                }
                if (brandCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { brand: { $regex: brandCar, $options: "i" } });
                    otherMong = __assign(__assign({}, otherMong), { brand: { $regex: brandCar, $options: "i" } });
                }
                if (modelCar) {
                    mongQuery = __assign(__assign({}, mongQuery), { model: { $regex: modelCar, $options: "i" } });
                    otherMong = __assign(__assign({}, otherMong), { model: { $regex: modelCar, $options: "i" } });
                }
                if (concesionary) {
                    mongQuery = __assign(__assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
                }
                seller = null;
                user = null;
                if (!(decode.type_user == "admin_concesionary")) return [3 /*break*/, 3];
                return [4 /*yield*/, Concesionaries_schema_1["default"].findOne({ _id: decode.id_concesionary })];
            case 2:
                concesionary_1 = _b.sent();
                mongQuery = __assign(__assign({}, mongQuery), { concesionary: { $regex: concesionary_1.name, $options: "i" } });
                _b.label = 3;
            case 3:
                if (decode.type_user == "seller") {
                    // let concesionary:any=await ConcesionariesSchema.findOne({_id:decode.id_concesionary})
                    mongQuery = __assign(__assign({}, mongQuery), { concesionary: { $regex: decode.concesionary, $options: "i" } });
                }
                cardsgroupmodel = [];
                return [4 /*yield*/, Vehicles_schema_2["default"].aggregate([
                        {
                            $match: mongQuery
                        },
                        {
                            $lookup: {
                                from: "mechanicalfiles",
                                localField: "_id",
                                foreignField: "id_vehicle",
                                as: "mechanicalfiles"
                            }
                        },
                        {
                            $unwind: "$mechanicalfiles"
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
                                        ]
                                    }
                                },
                                statusRegular: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$mechanicalfiles.general_condition", "regular"] },
                                            1,
                                            0,
                                        ]
                                    }
                                },
                                statusBueno: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$mechanicalfiles.general_condition", "bueno"] },
                                            1,
                                            0,
                                        ]
                                    }
                                },
                                statusExcelente: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$mechanicalfiles.general_condition", "excelente"] },
                                            1,
                                            0,
                                        ]
                                    }
                                },
                                vehicles: {
                                    $push: {
                                        $mergeObjects: [
                                            "$$ROOT",
                                            { general_condition: "$mechanicalfiles.general_condition" },
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $sort: {
                                _id: 1
                            }
                        },
                    ])];
            case 4:
                cardsgroupmodel = _b.sent();
                return [4 /*yield*/, Vehicles_schema_2["default"].aggregate([
                        {
                            $match: otherMong
                        },
                        {
                            $group: {
                                _id: "$model",
                                minPriceGlobal: { $min: "$price" },
                                avgPriceGlobal: { $avg: "$price" },
                                maxPriceGlobal: { $max: "$price" }
                            }
                        },
                        {
                            $sort: {
                                _id: 1
                            }
                        },
                    ])];
            case 5:
                cardsgroupNacional = _b.sent();
                _loop_2 = function (i) {
                    cardsgroupNacional.forEach(function (model) {
                        if (cardsgroupmodel[i]._id == model._id) {
                            cardsgroupmodel[i] = __assign(__assign({}, cardsgroupmodel[i]), { minPriceGlobal: model.minPriceGlobal, avgPriceGlobal: model.avgPriceGlobal, maxPriceGlobal: model.maxPriceGlobal });
                        }
                    });
                };
                for (i = 0; i < cardsgroupmodel.length; i++) {
                    _loop_2(i);
                }
                datos = {};
                datos = {
                    grupocard: cardsgroupmodel
                };
                workbook = new ExcelJS.Workbook();
                headerStyle = {
                    font: { bold: true }
                };
                footerStyle = {
                    font: { bold: true, color: { argb: "FFFFFFFF" } },
                    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF000000" } }
                };
                datos.grupocard.forEach(function (grupo) {
                    var worksheet = workbook.addWorksheet(grupo._id);
                    // Agregar los encabezados de las columnas
                    var columns = [];
                    columns = [
                        { header: "Modelo", key: "modelo", width: 15, style: headerStyle },
                        { header: "Marca", key: "marca", width: 15, style: headerStyle },
                        { header: "Año", key: "anhio", width: 15, style: headerStyle },
                        { header: "Precio", key: "precio", width: 15, style: headerStyle },
                        {
                            header: "Ficha mecánica",
                            key: "ficha_mécanica",
                            width: 15,
                            style: headerStyle
                        },
                        { header: "Fecha", key: "fecha", width: 15, style: headerStyle },
                        {
                            header: "Fecha de venta",
                            key: "fecha_venta",
                            width: 15,
                            style: headerStyle
                        },
                        {
                            header: "Desplazamiento",
                            key: "desplazamiento",
                            width: 15,
                            style: headerStyle
                        },
                        { header: "KM", key: "km", width: 15, style: headerStyle },
                        {
                            header: "Modelo de motor",
                            key: "modelo_motor",
                            width: 15,
                            style: headerStyle
                        },
                        { header: "Titulo", key: "titulo", width: 15, style: headerStyle },
                        {
                            header: "Combustible",
                            key: "combustible",
                            width: 15,
                            style: headerStyle
                        },
                        {
                            header: "Transmisión",
                            key: "transmision",
                            width: 15,
                            style: headerStyle
                        },
                        { header: "Ciudad", key: "ciudad", width: 15, style: headerStyle },
                        {
                            header: "Concesionario",
                            key: "concesionario",
                            width: 30,
                            style: headerStyle
                        },
                        {
                            header: "Control de tracción",
                            key: "control_traccion",
                            width: 30,
                            style: headerStyle
                        },
                        {
                            header: "Tipo de vehiculo",
                            key: "tipo_de_vehiculo",
                            width: 30,
                            style: headerStyle
                        },
                        { header: "Tracción", key: "traccion", width: 15, style: headerStyle },
                        { header: "Lamina", key: "lamina", width: 15, style: headerStyle },
                        { header: "Vino", key: "vino", width: 15, style: headerStyle },
                    ];
                    worksheet.columns = columns;
                    // Agregar los datos de los vehículos del grupo
                    grupo.vehicles.forEach(function (vehiculo) {
                        var dataRow = {
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
                            vino: vehiculo.vin
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
                        style: footerStyle
                    });
                    worksheet.addRow({
                        modelo: "Promedio Precio",
                        precio: grupo.avgPrice,
                        style: footerStyle
                    });
                    worksheet.addRow({
                        modelo: "Máximo Precio",
                        precio: grupo.maxPrice,
                        style: footerStyle
                    });
                    // Separar las secciones de los datos
                    worksheet.addRow({}); // Línea vacía
                    worksheet.addRow({}); // Línea vacía
                    // Agregar las secciones del mínimo, medio y máximo precio
                    worksheet.addRow({
                        modelo: "Mínimo Precio Global",
                        precio: grupo.minPriceGlobal,
                        style: footerStyle
                    });
                    worksheet.addRow({
                        modelo: "Promedio Precio Global",
                        precio: grupo.avgPriceGlobal,
                        style: footerStyle
                    });
                    worksheet.addRow({
                        modelo: "Máximo Precio Global",
                        precio: grupo.maxPriceGlobal,
                        style: footerStyle
                    });
                    worksheet.addRow({}); // Línea vacía
                    worksheet.addRow({}); // Línea vacía
                    // Agregar las secciones del mínimo, medio y máximo precio
                    worksheet.addRow({
                        modelo: "Condición general - Malo",
                        precio: grupo.statusMalo,
                        style: footerStyle
                    });
                    worksheet.addRow({
                        modelo: "Condición general - Regular",
                        precio: grupo.statusRegular,
                        style: footerStyle
                    });
                    worksheet.addRow({
                        modelo: "Condición general - Bueno",
                        precio: grupo.statusBueno,
                        style: footerStyle
                    });
                    worksheet.addRow({
                        modelo: "Condición general - Excelente",
                        precio: grupo.statusExcelente,
                        style: footerStyle
                    });
                });
                fileName = now.getTime() + ".xlsx";
                crearCarpetaSiNoExiste('./public/pdf');
                filePath = "./public/pdf/" + fileName;
                sendUrl = global.urlBase + "public/pdf/" + fileName;
                workbook.xlsx
                    .writeFile(filePath)
                    .then(function () {
                    // Envía la ruta del archivo al frontend para su descarga
                    // (esto dependerá de cómo implementes la comunicación con tu aplicación Ionic)
                    console.log("Archivo Excel generado:", filePath);
                })["catch"](function (error) {
                    console.log("Error al generar el archivo Excel:", error);
                });
                mailOptions = {
                    from: "Toyousado",
                    to: decode.email,
                    subject: "Exportar excell",
                    text: "puede descargar el excell " + fileName,
                    attachments: [
                        {
                            filename: fileName,
                            path: sendUrl
                        },
                    ]
                };
                return [4 /*yield*/, nodemailer_1.sendEmail(mailOptions)];
            case 6:
                _b.sent();
                sendadta = {};
                workbook.xlsx
                    .writeBuffer()
                    .then(function (buffer) { return __awaiter(void 0, void 0, void 0, function () {
                    var base64;
                    return __generator(this, function (_a) {
                        base64 = buffer.toString("base64");
                        // Crear un objeto de respuesta con el archivo base64
                        sendadta = {
                            fileName: now.getTime() + ".xlsx",
                            path: sendUrl,
                            base64Data: "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
                                base64
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
                        return [2 /*return*/];
                    });
                }); })["catch"](function (error) {
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.generatePdf = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonRes, data, token, decode, infoVehicle, imgsVehichle, mechanicalFile, data_1, img64, now, fileName, sendData, pdf, html, options, document, base64, fileBuffer, base64Data, fileName_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jsonRes = new Response_1.ResponseModel();
                data = req.query;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "mechanic", "admin", "admin_concesionary"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    jsonRes.code = generar_jwt_1["default"].code;
                    jsonRes.message = generar_jwt_1["default"].message;
                    jsonRes.status = false;
                    jsonRes.data = null;
                    return [2 /*return*/, res.json(jsonRes)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"].findOne({ _id: data.id })];
            case 2:
                infoVehicle = _a.sent();
                if (!infoVehicle) return [3 /*break*/, 12];
                return [4 /*yield*/, ImgVehicle_schema_1["default"].find({ id_vehicle: infoVehicle._id })];
            case 3:
                imgsVehichle = _a.sent();
                return [4 /*yield*/, mechanicalsFiles_schema_1["default"].findOne({ id_vehicle: infoVehicle._id })];
            case 4:
                mechanicalFile = _a.sent();
                data_1 = {
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
                        : []
                };
                console.log(mechanicalFile);
                img64 = "";
                if (!data_1.images) return [3 /*break*/, 6];
                return [4 /*yield*/, getImageAsBase64(data_1.images[0].img)];
            case 5:
                img64 = _a.sent();
                _a.label = 6;
            case 6:
                now = new Date();
                fileName = now.getTime() + ".pdf";
                sendData = {
                    model: data_1.model,
                    brand: data_1.brand,
                    year: data_1.year,
                    km: data_1.km,
                    img: img64,
                    displacement: data_1.displacement,
                    fuel: data_1.fuel,
                    titles: data_1.titles,
                    plate: data_1.plate,
                    transmission: data_1.transmission,
                    traction: data_1.traction,
                    city: data_1.city,
                    concesionary: data_1.concesionary,
                    price: data_1.price,
                    traction_control: data_1.traction_control,
                    technology: data_1.technology,
                    performance: data_1.performance,
                    comfort: data_1.comfort,
                    concesionary_maintenance: data_1.concesionary_maintenance ? data_1.concesionary_maintenance : "false",
                    general_condition: data_1.general_condition,
                    general_condition_end: ""
                };
                if (sendData.general_condition === "excelente" || sendData.general_condition > "96") {
                    sendData.general_condition_end = "excelente";
                }
                else if (sendData.general_condition === "bueno" || (sendData.general_condition >= "86" && sendData.general_condition < "96")) {
                    sendData.general_condition_end = "<div class=\"col-12 condiciones\">\n                <span style=\"font-size: 22px !important;font-weight: bold;\">Condici\u00F3n del veh\u00EDculo:</span>\n              </div><div class=\"col-5\"></div>\n      <div class=\"col-7\">\n        <p\n          style=\"font-size: 25px !important; color: #F9D616 !important;font-weight: bold;margin: 10px auto !important;\">\n          Bueno</p>\n      </div>";
                }
                else if (sendData.general_condition === "regular" || (sendData.general_condition >= "76" && sendData.general_condition < "86")) {
                    sendData.general_condition_end = "<div class=\"col-12 condiciones\">\n                <span style=\"font-size: 22px !important;font-weight: bold;\">Condici\u00F3n del veh\u00EDculo:</span>\n              </div><div class=\"col-5\"></div>\n      <div class=\"col-7\">\n        <p\n          style=\"font-size: 25px !important; color: #F7941D !important;font-weight: bold;margin: 10px auto !important;\">\n          Regular</p>\n      </div>";
                }
                else if (sendData.general_condition === "malo" || sendData.general_condition > "76") {
                    sendData.general_condition_end = "<div class=\"col-12 condiciones\">\n                <span style=\"font-size: 22px !important;font-weight: bold;\">Condici\u00F3n del veh\u00EDculo:</span>\n              </div><div class=\"col-5\"></div>\n      <div class=\"col-7\">\n        <p\n          style=\"font-size: 25px !important; color: #EB0A1E !important;font-weight: bold;margin: 10px auto !important;\">\n          Malo</p>\n      </div>";
                }
                _a.label = 7;
            case 7:
                _a.trys.push([7, 10, , 11]);
                pdf = require("pdf-creator-node");
                html = fs_1["default"].readFileSync("./src/views/template.html", "utf8");
                options = {
                    format: "Letter",
                    orientation: "landscape"
                };
                document = {
                    html: html,
                    data: sendData,
                    // path: "./output.pdf",
                    type: "buffer"
                };
                base64 = void 0;
                return [4 /*yield*/, pdf.create(document, options)];
            case 8:
                base64 = _a.sent();
                fileBuffer = base64;
                base64Data = 'data:application/pdf;base64,' + fileBuffer.toString('base64');
                return [4 /*yield*/, cloudinaryMetods_1.uploadPdf(base64Data)];
            case 9:
                fileName_1 = _a.sent();
                jsonRes.data = base64Data;
                // jsonRes.data = fileName.secure_url;
                jsonRes.code = 200;
                jsonRes.message = "success";
                jsonRes.status = true;
                return [3 /*break*/, 11];
            case 10:
                error_1 = _a.sent();
                return [2 /*return*/, error_1];
            case 11: return [3 /*break*/, 13];
            case 12:
                jsonRes.code = 400;
                jsonRes.message = "No se pudo obtener la información del vehículo";
                jsonRes.status = false;
                _a.label = 13;
            case 13:
                res.json(jsonRes);
                return [2 /*return*/];
        }
    });
}); };
var generate_Pdf = function (data, pdfName) { return __awaiter(void 0, void 0, void 0, function () {
    var filePath, html, browser, page, newpdf, bs64, fileName, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filePath = "./public/dataSheetPdf/" + pdfName;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                return [4 /*yield*/, ejs_1["default"].renderFile('./src/views/template.ejs', data)];
            case 2:
                html = _a.sent();
                return [4 /*yield*/, puppeteer_1["default"].launch()];
            case 3:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 4:
                page = _a.sent();
                return [4 /*yield*/, page.setContent(html)];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.pdf({
                        // path: filePath,
                        format: 'Letter',
                        printBackground: true,
                        landscape: true
                    })];
            case 6:
                newpdf = _a.sent();
                return [4 /*yield*/, browser.close()];
            case 7:
                _a.sent();
                bs64 = newpdf.toString('base64');
                return [4 /*yield*/, cloudinaryMetods_1.uploadPdf("data:application/pdf;base64," + bs64)];
            case 8:
                fileName = _a.sent();
                return [2 /*return*/, {
                        url: fileName.secure_url
                    }];
            case 9:
                error_2 = _a.sent();
                return [2 /*return*/, error_2];
            case 10: return [2 /*return*/];
        }
    });
}); };
vehicleController.inspections = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, id_mechanic, token, decode, vehiclesList, arrayInpecciones, i, data, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                id_mechanic = req.body.id_mechanic;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["mechanic"])];
            case 1:
                decode = _c.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"]
                        .find({ id_mechanic: id_mechanic, mechanicalFile: false })
                        .sort({ date_create: -1 })];
            case 2:
                vehiclesList = _c.sent();
                if (!(vehiclesList.length > 0)) return [3 /*break*/, 10];
                arrayInpecciones = [];
                i = 0;
                _c.label = 3;
            case 3:
                if (!(i < vehiclesList.length)) return [3 /*break*/, 9];
                _a = {
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
                    vin: vehiclesList[i].vin
                };
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({ id_vehicle: vehiclesList[i]._id })];
            case 4:
                if (!(_c.sent())) return [3 /*break*/, 6];
                return [4 /*yield*/, ImgVehicle_schema_1["default"].findOne({ id_vehicle: vehiclesList[i]._id })];
            case 5:
                _b = _c.sent();
                return [3 /*break*/, 7];
            case 6:
                _b = "";
                _c.label = 7;
            case 7:
                data = (_a.image = _b,
                    _a);
                arrayInpecciones.push(data);
                _c.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 3];
            case 9:
                reponseJson.code = 200;
                reponseJson.status = true;
                reponseJson.message = "Inspecciones encontradas";
                reponseJson.data = arrayInpecciones;
                return [3 /*break*/, 11];
            case 10:
                reponseJson.code = 400;
                reponseJson.status = false;
                reponseJson.message = "No se encontraron inspecciones";
                _c.label = 11;
            case 11:
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.countInspections = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, id_mechanic, token, decode, vehiclesList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                id_mechanic = req.body.id_mechanic;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["mechanic"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"].countDocuments({
                        id_mechanic: id_mechanic,
                        mechanicalFile: false
                    })];
            case 2:
                vehiclesList = _a.sent();
                reponseJson.code = 200;
                reponseJson.status = true;
                reponseJson.message = "Cantidad de vehículos";
                reponseJson.data = vehiclesList;
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.addMechanicalFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, mailSeller, infoMechanic, nameSeller, conceSeller, citySeller, dateNow, _a, part_emblems_complete, wiper_shower_brushes_windshield, hits, scratches, paint_condition, bugle_accessories, air_conditioning_system, radio_player, courtesy_lights, upholstery_condition, gts, board_lights, tire_pressure, tire_life, battery_status_terminals, transmitter_belts, motor_oil, engine_coolant_container, radiator_status, exhaust_pipe_bracket, fuel_tank_cover_pipes_hoses_connections, distribution_mail, spark_plugs_air_filter_fuel_filter_anti_pollen_filter, fuel_system, parking_break, brake_bands_drums, brake_pads_discs, brake_pipes_hoses, master_cylinder, brake_fluid, bushings_plateaus, stumps, terminals, stabilizer_bar, bearings, tripoids_rubbe_bands, shock_absorbers_coils, dealer_maintenance, headlights_lights, general_condition, id_vehicle, id_mechanic, odometer, engine_start, windshields_glass, hits_scratches, spark_plugs, injectors, fuel_filter_anti_pollen_filter, engine_noises, hits_scratches_sides, paint_condition_sides, trunk_hatch, spare_tire, hits_scratches_trunk, paint_condition_trunk, headlights_lights_trunk, fuel_tank_cover, pipes_hoses_connections, brake_discs, newMechanicFile, newMechanicFileSaved, now, newReportMechanicsFiles, vehicleUpdated, vehicle, seller, user, mechanic, mailOptions, dataVehicle;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["mechanic"])];
            case 1:
                decode = _c.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                mailSeller = "";
                infoMechanic = {};
                nameSeller = "";
                conceSeller = "";
                citySeller = "";
                dateNow = moment_1["default"]().format("YYYY-MM-DD");
                _a = req.body, part_emblems_complete = _a.part_emblems_complete, wiper_shower_brushes_windshield = _a.wiper_shower_brushes_windshield, hits = _a.hits, scratches = _a.scratches, paint_condition = _a.paint_condition, bugle_accessories = _a.bugle_accessories, air_conditioning_system = _a.air_conditioning_system, radio_player = _a.radio_player, courtesy_lights = _a.courtesy_lights, upholstery_condition = _a.upholstery_condition, gts = _a.gts, board_lights = _a.board_lights, tire_pressure = _a.tire_pressure, tire_life = _a.tire_life, battery_status_terminals = _a.battery_status_terminals, transmitter_belts = _a.transmitter_belts, motor_oil = _a.motor_oil, engine_coolant_container = _a.engine_coolant_container, radiator_status = _a.radiator_status, exhaust_pipe_bracket = _a.exhaust_pipe_bracket, fuel_tank_cover_pipes_hoses_connections = _a.fuel_tank_cover_pipes_hoses_connections, distribution_mail = _a.distribution_mail, spark_plugs_air_filter_fuel_filter_anti_pollen_filter = _a.spark_plugs_air_filter_fuel_filter_anti_pollen_filter, fuel_system = _a.fuel_system, parking_break = _a.parking_break, brake_bands_drums = _a.brake_bands_drums, brake_pads_discs = _a.brake_pads_discs, brake_pipes_hoses = _a.brake_pipes_hoses, master_cylinder = _a.master_cylinder, brake_fluid = _a.brake_fluid, bushings_plateaus = _a.bushings_plateaus, stumps = _a.stumps, terminals = _a.terminals, stabilizer_bar = _a.stabilizer_bar, bearings = _a.bearings, tripoids_rubbe_bands = _a.tripoids_rubbe_bands, shock_absorbers_coils = _a.shock_absorbers_coils, dealer_maintenance = _a.dealer_maintenance, headlights_lights = _a.headlights_lights, general_condition = _a.general_condition, id_vehicle = _a.id_vehicle, id_mechanic = _a.id_mechanic, odometer = _a.odometer, engine_start = _a.engine_start, windshields_glass = _a.windshields_glass, hits_scratches = _a.hits_scratches, spark_plugs = _a.spark_plugs, injectors = _a.injectors, fuel_filter_anti_pollen_filter = _a.fuel_filter_anti_pollen_filter, engine_noises = _a.engine_noises, hits_scratches_sides = _a.hits_scratches_sides, paint_condition_sides = _a.paint_condition_sides, trunk_hatch = _a.trunk_hatch, spare_tire = _a.spare_tire, hits_scratches_trunk = _a.hits_scratches_trunk, paint_condition_trunk = _a.paint_condition_trunk, headlights_lights_trunk = _a.headlights_lights_trunk, fuel_tank_cover = _a.fuel_tank_cover, pipes_hoses_connections = _a.pipes_hoses_connections, brake_discs = _a.brake_discs;
                newMechanicFile = new mechanicalsFiles_schema_1["default"]({
                    part_emblems_complete: part_emblems_complete,
                    wiper_shower_brushes_windshield: wiper_shower_brushes_windshield,
                    hits: hits,
                    scratches: scratches,
                    paint_condition: paint_condition,
                    bugle_accessories: bugle_accessories,
                    air_conditioning_system: air_conditioning_system,
                    radio_player: radio_player,
                    courtesy_lights: courtesy_lights,
                    upholstery_condition: upholstery_condition,
                    gts: gts,
                    board_lights: board_lights,
                    tire_pressure: tire_pressure,
                    tire_life: tire_life,
                    battery_status_terminals: battery_status_terminals,
                    transmitter_belts: transmitter_belts,
                    motor_oil: motor_oil,
                    engine_coolant_container: engine_coolant_container,
                    radiator_status: radiator_status,
                    exhaust_pipe_bracket: exhaust_pipe_bracket,
                    fuel_tank_cover_pipes_hoses_connections: fuel_tank_cover_pipes_hoses_connections,
                    distribution_mail: distribution_mail,
                    spark_plugs_air_filter_fuel_filter_anti_pollen_filter: spark_plugs_air_filter_fuel_filter_anti_pollen_filter,
                    fuel_system: fuel_system,
                    parking_break: parking_break,
                    brake_bands_drums: brake_bands_drums,
                    brake_pads_discs: brake_pads_discs,
                    brake_pipes_hoses: brake_pipes_hoses,
                    master_cylinder: master_cylinder,
                    brake_fluid: brake_fluid,
                    bushings_plateaus: bushings_plateaus,
                    stumps: stumps,
                    terminals: terminals,
                    stabilizer_bar: stabilizer_bar,
                    bearings: bearings,
                    tripoids_rubbe_bands: tripoids_rubbe_bands,
                    shock_absorbers_coils: shock_absorbers_coils,
                    dealer_maintenance: dealer_maintenance,
                    headlights_lights: headlights_lights,
                    general_condition: general_condition,
                    odometer: odometer,
                    engine_start: engine_start,
                    windshields_glass: windshields_glass,
                    hits_scratches: hits_scratches,
                    spark_plugs: spark_plugs,
                    injectors: injectors,
                    fuel_filter_anti_pollen_filter: fuel_filter_anti_pollen_filter,
                    engine_noises: engine_noises,
                    hits_scratches_sides: hits_scratches_sides,
                    paint_condition_sides: paint_condition_sides,
                    trunk_hatch: trunk_hatch,
                    spare_tire: spare_tire,
                    hits_scratches_trunk: hits_scratches_trunk,
                    paint_condition_trunk: paint_condition_trunk,
                    headlights_lights_trunk: headlights_lights_trunk,
                    fuel_tank_cover: fuel_tank_cover,
                    pipes_hoses_connections: pipes_hoses_connections,
                    brake_discs: brake_discs,
                    created_at: dateNow,
                    id_vehicle: id_vehicle,
                    id_mechanic: id_mechanic
                });
                return [4 /*yield*/, newMechanicFile.save()];
            case 2:
                newMechanicFileSaved = _c.sent();
                now = moment_1["default"]().format("YYYY-MM-DD");
                newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1["default"]({
                    campos: null,
                    type: "Nueva ficha mecanica",
                    comment: "",
                    id_mechanic_file: newMechanicFile._id,
                    id_user: decode.id,
                    date: now
                });
                return [4 /*yield*/, newReportMechanicsFiles.save()];
            case 3:
                _c.sent();
                return [4 /*yield*/, Vehicles_schema_2["default"].findByIdAndUpdate(id_vehicle, {
                        mechanicalFile: true
                    })];
            case 4:
                vehicleUpdated = _c.sent();
                if (!newMechanicFileSaved) return [3 /*break*/, 11];
                reponseJson.code = 200;
                reponseJson.status = true;
                reponseJson.message = "Ficha mecánica creada correctamente";
                reponseJson.data = newMechanicFileSaved;
                return [4 /*yield*/, Vehicles_schema_2["default"].findOne({ _id: id_vehicle })];
            case 5:
                vehicle = _c.sent();
                if (!vehicle) return [3 /*break*/, 8];
                return [4 /*yield*/, Sellers_schema_1["default"].findOne({ _id: vehicle.id_seller })];
            case 6:
                seller = _c.sent();
                if (!seller) return [3 /*break*/, 8];
                nameSeller = seller.fullName;
                conceSeller = seller.concesionary;
                citySeller = seller.city;
                return [4 /*yield*/, Users_schema_1["default"].findOne({ _id: seller.id_user })];
            case 7:
                user = _c.sent();
                if (user) {
                    mailSeller = user.email;
                }
                _c.label = 8;
            case 8: return [4 /*yield*/, Mechanics_schema_1["default"].findOne({ _id: id_mechanic })];
            case 9:
                mechanic = _c.sent();
                if (mechanic) {
                    infoMechanic.fullname = mechanic.fullName;
                    infoMechanic.concesionary = mechanic.concesionary;
                    infoMechanic.city = mechanic.city;
                }
                mailOptions = {
                    from: "Toyousado Notifications",
                    to: mailSeller,
                    subject: "Ficha mecánica creada",
                    html: "<div>\n          <p>Ficha t\u00E9cnica creada exitosamente para:</p>\n          </div>\n          <div class=\"div-table\" style=\"width: 100%;\">\n              <div class=\"table\" style=\"display: table;border-collapse: collapse;margin: auto;\">\n              <div style=\" display: table-row;border: 1px solid #000;\">\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199\">Modelo</div>\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9\">" + vehicle.model + "</div>\n              </div>\n              <div style=\" display: table-row;border: 1px solid #000;\">\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199\">A\u00F1o</div>\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9\">" + vehicle.year + "</div>\n              </div>\n              <div style=\" display: table-row;border: 1px solid #000;\">\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199\">Placa</div>\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9\">" + vehicle.plate + "</div>\n              </div>\n              <div style=\" display: table-row;border: 1px solid #000;\">\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199\">Vendedor</div>\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9\">" + nameSeller + "</div>\n              </div>\n              <div style=\" display: table-row;border: 1px solid #000;\">\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199\">Concesionario</div>\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9\">" + conceSeller + "</div>\n              </div>\n              <div style=\" display: table-row;border: 1px solid #000;\">\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199\">Estado</div>\n                  <div style=\"display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9\">" + citySeller + "</div>\n              </div>\n              </div>\n          </div>"
                };
                dataVehicle = {
                    model: vehicle.model,
                    year: vehicle.year,
                    plate: vehicle.plate ? vehicle.plate : "",
                    fullName: nameSeller,
                    concesionary: conceSeller,
                    city: citySeller,
                    title: "Ficha técnica creada exitosamente para:",
                    link: "" + vehicle._id
                };
                return [4 /*yield*/, nodemailer_1.sendEmail(mailOptions)];
            case 10:
                _c.sent();
                sendNotification((_b = vehicle.id_seller) === null || _b === void 0 ? void 0 : _b.toString(), dataVehicle, "Ficha técnica creada");
                return [3 /*break*/, 12];
            case 11:
                reponseJson.code = 400;
                reponseJson.status = false;
                reponseJson.message = "No se pudo crear la Ficha técnica";
                _c.label = 12;
            case 12:
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.updateMechanicalFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, token, decode, data, now, dataFile, oldFicha, update, newReportMechanicsFiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["mechanic"])];
            case 1:
                decode = _a.sent();
                data = req.body.data;
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                now = moment_1["default"]().format("YYYY-MM-DD");
                dataFile = {
                    campos: null,
                    type: "Modificación de ficha mecanica",
                    comment: "",
                    id_mechanic_file: data._id,
                    id_user: decode.id,
                    date: now
                };
                return [4 /*yield*/, mechanicalsFiles_schema_1["default"].findOne({ _id: data._id })];
            case 2:
                oldFicha = _a.sent();
                return [4 /*yield*/, mechanicalsFiles_schema_1["default"].findByIdAndUpdate(data._id, data)];
            case 3:
                update = _a.sent();
                dataFile.campos = setCampos(oldFicha, update);
                newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1["default"](dataFile);
                return [4 /*yield*/, newReportMechanicsFiles.save()];
            case 4:
                _a.sent();
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
                return [2 /*return*/, res.json(reponseJson)];
        }
    });
}); };
vehicleController.getMechanicFileByIdVehicle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, id_vehicle, token, decode, mecFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                id_vehicle = req.body.id_vehicle;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["mechanic"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, mechanicalsFiles_schema_1["default"].findOne({ id_vehicle: id_vehicle })];
            case 2:
                mecFile = _a.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.ofertInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, id, token, decode, vehicle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                id = req.query;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "mechanic"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    reponseJson.data = null;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, Vehicles_schema_2["default"].aggregate([
                        {
                            $match: {
                                _id: new mongoose_1["default"].Types.ObjectId(String(id === null || id === void 0 ? void 0 : id.id))
                            }
                        },
                        {
                            $lookup: {
                                from: "sellers",
                                localField: "id_seller_buyer",
                                foreignField: "_id",
                                as: "seller"
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "seller.id_user",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        {
                            $unwind: "$seller"
                        },
                        {
                            $unwind: "$user"
                        },
                        {
                            $project: {
                                price_ofert: 1,
                                seller: {
                                    fullName: 1,
                                    phone: 1,
                                    city: 1,
                                    concesionary: 1
                                },
                                user: {
                                    email: 1
                                }
                            }
                        },
                    ])];
            case 2:
                vehicle = _a.sent();
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
                return [2 /*return*/];
        }
    });
}); };
vehicleController.myOfferts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, data, token, decode, query, search, project, count, sendData, list, totalItems, totalPages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                data = req.query;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller"])];
            case 1:
                decode = _a.sent();
                query = {};
                sendData = {};
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    return [2 /*return*/, res.json(reponseJson)];
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
                        brand: ""
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
                return [4 /*yield*/, Vehicles_schema_2["default"].aggregate([
                        {
                            $match: query
                        },
                        {
                            $skip: parseInt(data.lim) * parseInt(data.pos)
                        },
                        {
                            $limit: parseInt(data.lim)
                        },
                        {
                            $project: project
                        },
                    ])];
            case 2:
                list = _a.sent();
                sendData.rows = list;
                if (!(list.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, Vehicles_schema_2["default"].aggregate([
                        {
                            $match: query
                        },
                        {
                            $count: "totalCount"
                        }
                    ])];
            case 3:
                count = _a.sent();
                reponseJson.code = 200;
                reponseJson.message = "Lista de modelos de vehiculos";
                reponseJson.status = true;
                return [3 /*break*/, 5];
            case 4:
                reponseJson.code = 400;
                reponseJson.message = "sin resultado";
                reponseJson.status = true;
                _a.label = 5;
            case 5:
                totalItems = 0;
                if (count) {
                    totalItems = count[0].totalCount;
                }
                totalPages = Math.ceil(totalItems / data.lim);
                sendData.count = totalItems;
                sendData.pages = totalPages;
                reponseJson.code = 200;
                reponseJson.message = "Lista de ofertas";
                reponseJson.status = true;
                reponseJson.data = sendData;
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.addRerportMechanicalFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, data, token, decode, now, newReportMechanicsFiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                data = req.body;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "mechanic", "admin_concesionary"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                now = moment_1["default"]().format("YYYY-MM-DD");
                newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1["default"]({
                    campos: null,
                    type: "Normal",
                    comment: data.comment,
                    id_mechanic_file: data.id_mechanic_file,
                    id_user: decode.id,
                    date: now
                });
                return [4 /*yield*/, newReportMechanicsFiles.save()];
            case 2:
                _a.sent();
                data.id = newReportMechanicsFiles._id;
                reponseJson.code = 200;
                reponseJson.message = "nuevo reporte";
                reponseJson.status = true;
                reponseJson.data = data;
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.commentRerportMechanicalFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, data, token, decode, now, newReportMechanicsFiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                data = req.body;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "mechanic", "admin_concesionary"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                now = moment_1["default"]().format("YYYY-MM-DD");
                if (!data.id) return [3 /*break*/, 3];
                return [4 /*yield*/, reportsMechanicalsFiles_schema_1["default"].findByIdAndUpdate(data.id, {
                        comment: data.comment + ". Fecha: " + now
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1["default"]({
                    campos: null,
                    type: "Comentario",
                    comment: data.comment,
                    id_mechanic_file: data.id_mechanic_file,
                    id_user: decode.id,
                    date: now
                });
                return [4 /*yield*/, newReportMechanicsFiles.save()];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                reponseJson.code = 200;
                reponseJson.message = "";
                reponseJson.status = true;
                reponseJson.data = null;
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.acceptUpdateMechanicalFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reponseJson, data, token, decode, now, newReportMechanicsFiles, newReportMechanicsFiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reponseJson = new Response_1.ResponseModel();
                data = req.body;
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "mechanic", "admin_concesionary"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                now = moment_1["default"]().format("YYYY-MM-DD");
                if (!(data.accept == "Si" || data.accept == "si")) return [3 /*break*/, 3];
                newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1["default"]({
                    campos: null,
                    type: "Aceptar modificacion de ficha mecanica",
                    comment: "",
                    id_mechanic_file: data.id_mechanic_file,
                    id_user: decode.id,
                    date: now
                });
                return [4 /*yield*/, newReportMechanicsFiles.save()];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                newReportMechanicsFiles = new reportsMechanicalsFiles_schema_1["default"]({
                    campos: null,
                    type: "Cancelar modificacion de ficha mecanica",
                    comment: "",
                    id_mechanic_file: data.id_mechanic_file,
                    id_user: decode.id,
                    date: now
                });
                return [4 /*yield*/, newReportMechanicsFiles.save()];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                reponseJson.code = 200;
                reponseJson.message = "";
                reponseJson.status = true;
                reponseJson.data = null;
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
vehicleController.allRerportMechanicalFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, reponseJson, token, decode, reports, i, element, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = req.query;
                reponseJson = new Response_1.ResponseModel();
                token = req.header("Authorization");
                return [4 /*yield*/, generar_jwt_1["default"].getAuthorization(token, ["seller", "admin", "mechanic", "admin_concesionary"])];
            case 1:
                decode = _a.sent();
                if (decode == false) {
                    reponseJson.code = generar_jwt_1["default"].code;
                    reponseJson.message = generar_jwt_1["default"].message;
                    reponseJson.status = false;
                    return [2 /*return*/, res.json(reponseJson)];
                }
                return [4 /*yield*/, reportsMechanicalsFiles_schema_1["default"].find({ _id: data.id }).sort({ date: -1 })];
            case 2:
                reports = _a.sent();
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < reports.length)) return [3 /*break*/, 6];
                element = reports[i];
                return [4 /*yield*/, Users_schema_1["default"].findOne({ _id: element.id_user })];
            case 4:
                user = _a.sent();
                element.user = user;
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                reponseJson.code = 200;
                reponseJson.message = "";
                reponseJson.status = true;
                reponseJson.data = reports;
                res.json(reponseJson);
                return [2 /*return*/];
        }
    });
}); };
function generateBase64(pdfPath) {
    return __awaiter(this, void 0, Promise, function () {
        var fileStream, chunks;
        return __generator(this, function (_a) {
            fileStream = fs_1["default"].createReadStream(pdfPath);
            console.log("fileStream", fileStream);
            chunks = [];
            console.log("chunks", chunks);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fileStream.on('data', function (chunk) {
                        chunks.push(chunk);
                    });
                    fileStream.on('end', function () {
                        var fileBuffer = Buffer.concat(chunks);
                        var base64String = fileBuffer.toString('base64');
                        resolve(base64String);
                    });
                    fileStream.on('error', function (error) {
                        reject(error);
                    });
                })];
        });
    });
}
var setCampos = function (oldFicha, update) {
    var campos = {};
    if (oldFicha.part_emblems_complete != update.part_emblems_complete) {
        campos.part_emblems_complete = update.part_emblems_complete;
    }
    if (oldFicha.wiper_shower_brushes_windshield != update.wiper_shower_brushes_windshield) {
        campos.wiper_shower_brushes_windshield = update.wiper_shower_brushes_windshield;
    }
    if (oldFicha.hits != update.hits) {
        campos.hits = update.hits;
    }
    if (oldFicha.scratches != update.scratches) {
        campos.scratches = update.scratches;
    }
    if (oldFicha.paint_condition != update.paint_condition) {
        campos.paint_condition = update.paint_condition;
    }
    if (oldFicha.bugle_accessories != update.bugle_accessories) {
        campos.bugle_accessories = update.bugle_accessories;
    }
    if (oldFicha.air_conditioning_system != update.air_conditioning_system) {
        campos.air_conditioning_system = update.air_conditioning_system;
    }
    if (oldFicha.radio_player != update.radio_player) {
        campos.radio_player = update.radio_player;
    }
    if (oldFicha.courtesy_lights != update.courtesy_lights) {
        campos.courtesy_lights = update.courtesy_lights;
    }
    if (oldFicha.upholstery_condition != update.upholstery_condition) {
        campos.upholstery_condition = update.upholstery_condition;
    }
    if (oldFicha.gts != update.gts) {
        campos.gts = update.gts;
    }
    if (oldFicha.board_lights != update.board_lights) {
        campos.board_lights = update.board_lights;
    }
    if (oldFicha.tire_pressure != update.tire_pressure) {
        campos.tire_pressure = update.tire_pressure;
    }
    if (oldFicha.tire_life != update.tire_life) {
        campos.tire_life = update.tire_life;
    }
    if (oldFicha.battery_status_terminals != update.battery_status_terminals) {
        campos.battery_status_terminals = update.battery_status_terminals;
    }
    if (oldFicha.transmitter_belts != update.transmitter_belts) {
        campos.transmitter_belts = update.transmitter_belts;
    }
    if (oldFicha.motor_oil != update.motor_oil) {
        campos.motor_oil = update.motor_oil;
    }
    if (oldFicha.engine_coolant_container != update.engine_coolant_container) {
        campos.engine_coolant_container = update.engine_coolant_container;
    }
    if (oldFicha.radiator_status != update.radiator_status) {
        campos.radiator_status = update.radiator_status;
    }
    if (oldFicha.exhaust_pipe_bracket != update.exhaust_pipe_bracket) {
        campos.exhaust_pipe_bracket = update.exhaust_pipe_bracket;
    }
    if (oldFicha.fuel_tank_cover_pipes_hoses_connections != update.fuel_tank_cover_pipes_hoses_connections) {
        campos.fuel_tank_cover_pipes_hoses_connections = update.fuel_tank_cover_pipes_hoses_connections;
    }
    if (oldFicha.distribution_mail != update.distribution_mail) {
        campos.distribution_mail = update.distribution_mail;
    }
    if (oldFicha.spark_plugs_air_filter_fuel_filter_anti_pollen_filter != update.spark_plugs_air_filter_fuel_filter_anti_pollen_filter) {
        campos.spark_plugs_air_filter_fuel_filter_anti_pollen_filter = update.spark_plugs_air_filter_fuel_filter_anti_pollen_filter;
    }
    if (oldFicha.fuel_system != update.fuel_system) {
        campos.fuel_system = update.fuel_system;
    }
    if (oldFicha.parking_break != update.parking_break) {
        campos.parking_break = update.parking_break;
    }
    if (oldFicha.brake_bands_drums != update.brake_bands_drums) {
        campos.brake_bands_drums = update.brake_bands_drums;
    }
    if (oldFicha.brake_pads_discs != update.brake_pads_discs) {
        campos.brake_pads_discs = update.brake_pads_discs;
    }
    if (oldFicha.brake_pipes_hoses != update.brake_pipes_hoses) {
        campos.brake_pipes_hoses = update.brake_pipes_hoses;
    }
    if (oldFicha.master_cylinder != update.master_cylinder) {
        campos.master_cylinder = update.master_cylinder;
    }
    if (oldFicha.brake_fluid != update.brake_fluid) {
        campos.brake_fluid = update.brake_fluid;
    }
    if (oldFicha.bushings_plateaus != update.bushings_plateaus) {
        campos.bushings_plateaus = update.bushings_plateaus;
    }
    if (oldFicha.stumps != update.stumps) {
        campos.stumps = update.stumps;
    }
    if (oldFicha.terminals != update.terminals) {
        campos.terminals = update.terminals;
    }
    if (oldFicha.stabilizer_bar != update.stabilizer_bar) {
        campos.stabilizer_bar = update.stabilizer_bar;
    }
    if (oldFicha.bearings != update.bearings) {
        campos.bearings = update.bearings;
    }
    if (oldFicha.tripoids_rubbe_bands != update.tripoids_rubbe_bands) {
        campos.tripoids_rubbe_bands = update.tripoids_rubbe_bands;
    }
    if (oldFicha.shock_absorbers_coils != update.shock_absorbers_coils) {
        campos.shock_absorbers_coils = update.shock_absorbers_coils;
    }
    if (oldFicha.dealer_maintenance != update.dealer_maintenance) {
        campos.dealer_maintenance = update.dealer_maintenance;
    }
    if (oldFicha.headlights_lights != update.headlights_lights) {
        campos.headlights_lights = update.headlights_lights;
    }
    if (oldFicha.general_condition != update.general_condition) {
        campos.general_condition = update.general_condition;
    }
    if (oldFicha.odometer != update.odometer) {
        campos.odometer = update.odometer;
    }
    if (oldFicha.engine_start != update.engine_start) {
        campos.engine_start = update.engine_start;
    }
    if (oldFicha.windshields_glass != update.windshields_glass) {
        campos.windshields_glass = update.windshields_glass;
    }
    if (oldFicha.hits_scratches != update.hits_scratches) {
        campos.hits_scratches = update.hits_scratches;
    }
    if (oldFicha.spark_plugs != update.spark_plugs) {
        campos.spark_plugs = update.spark_plugs;
    }
    if (oldFicha.injectors != update.injectors) {
        campos.injectors = update.injectors;
    }
    if (oldFicha.fuel_filter_anti_pollen_filter != update.fuel_filter_anti_pollen_filter) {
        campos.fuel_filter_anti_pollen_filter = update.fuel_filter_anti_pollen_filter;
    }
    if (oldFicha.engine_noises != update.engine_noises) {
        campos.engine_noises = update.engine_noises;
    }
    if (oldFicha.hits_scratches_sides != update.hits_scratches_sides) {
        campos.hits_scratches_sides = update.hits_scratches_sides;
    }
    if (oldFicha.paint_condition_sides != update.paint_condition_sides) {
        campos.paint_condition_sides = update.paint_condition_sides;
    }
    if (oldFicha.trunk_hatch != update.trunk_hatch) {
        campos.trunk_hatch = update.trunk_hatch;
    }
    if (oldFicha.spare_tire != update.spare_tire) {
        campos.spare_tire = update.spare_tire;
    }
    if (oldFicha.hits_scratches_trunk != update.hits_scratches_trunk) {
        campos.hits_scratches_trunk = update.hits_scratches_trunk;
    }
    if (oldFicha.paint_condition_trunk != update.paint_condition_trunk) {
        campos.paint_condition_trunk = update.paint_condition_trunk;
    }
    if (oldFicha.headlights_lights_trunk != update.headlights_lights_trunk) {
        campos.headlights_lights_trunk = update.headlights_lights_trunk;
    }
    if (oldFicha.fuel_tank_cover != update.fuel_tank_cover) {
        campos.fuel_tank_cover = update.fuel_tank_cover;
    }
    if (oldFicha.pipes_hoses_connections != update.pipes_hoses_connections) {
        campos.pipes_hoses_connections = update.pipes_hoses_connections;
    }
    if (oldFicha.brake_discs != update.brake_discs) {
        campos.brake_discs = update.brake_discs;
    }
    return campos;
};
var crearCarpetaSiNoExiste = function (nombreCarpeta) {
    if (!fs_1["default"].existsSync(nombreCarpeta)) {
        fs_1["default"].mkdirSync(nombreCarpeta);
        console.log("Carpeta \"" + nombreCarpeta + "\" creada exitosamente");
    }
    else {
        console.log("La carpeta \"" + nombreCarpeta + "\" ya existe");
    }
};
function getImageAsBase64(url) {
    return __awaiter(this, void 0, Promise, function () {
        var response, contentType, base64Image, dataURI, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].get(url, {
                            responseType: 'arraybuffer'
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200) {
                        contentType = response.headers['content-type'];
                        base64Image = Buffer.from(response.data, 'binary').toString('base64');
                        dataURI = "data:" + contentType + ";base64," + base64Image;
                        return [2 /*return*/, dataURI];
                    }
                    else {
                        throw new Error('Failed to fetch image from the URL');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    throw new Error('Error fetching the image: ' + error_3.message);
                case 3: return [2 /*return*/];
            }
        });
    });
}
var desgloseImg = function (image) { return __awaiter(void 0, void 0, void 0, function () {
    var posr, imgBuff, resize;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                posr = image.split(";base64").pop();
                imgBuff = Buffer.from(posr, "base64");
                return [4 /*yield*/, sharp_1["default"](imgBuff)
                        .resize(300, 250)
                        .toBuffer()
                        .then(function (data) {
                        return data;
                    })["catch"](function (err) {
                        console.log("error", err);
                        return "";
                    })];
            case 1:
                resize = _a.sent();
                return [2 /*return*/, "data:image/jpeg;base64," + resize.toString("base64")];
        }
    });
}); };
var sendNotificationMechanic = function (id_mechanic, data, title) { return __awaiter(void 0, void 0, void 0, function () {
    var userInfo, notify;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Mechanics_schema_1["default"].findOne({ _id: id_mechanic })];
            case 1:
                userInfo = _a.sent();
                if (!userInfo) return [3 /*break*/, 3];
                notify = new notifications_schema_1["default"]({
                    id_user: userInfo.id_user,
                    title: title,
                    data: data,
                    date: moment_1["default"]().format("YYYY-MM-DD HH:mm:ss"),
                    status: false
                });
                return [4 /*yield*/, notify.save()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
function groupAndSumByMonth(data) {
    var result = {};
    data.forEach(function (item) {
        var dateParts = item._id.split("-");
        var year = dateParts[0];
        var month = dateParts[1];
        var monthKey = year + "-" + month;
        if (!result[monthKey]) {
            result[monthKey] = {
                minAmount: 0,
                avgAmount: 0,
                maxAmount: 0
            };
        }
        result[monthKey].minAmount += item.minAmount ? item.minAmount : 0;
        result[monthKey].avgAmount += item.avgAmount ? item.avgAmount : 0;
        result[monthKey].maxAmount += item.maxAmount ? item.maxAmount : 0;
    });
    return Object.entries(result).map(function (_a) {
        var key = _a[0], value = _a[1];
        return ({
            month: key,
            minAmount: value.minAmount,
            avgAmount: value.avgAmount,
            maxAmount: value.maxAmount
        });
    });
}
function getQuantityTotals(data) {
    var quantityTotals = [];
    for (var i = 0; i < data.length; i++) {
        var document = data[i];
        var mes = document.mes.substring(0, 7); // Extrae el año y mes de la fecha
        if (quantityTotals[mes]) {
            quantityTotals[mes] += document.total; // Si el mes ya existe en el objeto, acumula el canitdad
        }
        else {
            quantityTotals[mes] = document.total; // Si el mes no existe en el objeto, crea la propiedad y asigna el cantidad
        }
    }
    var result = [];
    for (var mes in quantityTotals) {
        result.push({ mes: mes + "-01", total: quantityTotals[mes] }); // Convierte el objeto en un array
    }
    return result;
}
var calcularMeses = function (fechaInicial, fechaFinal) {
    var inicio = new Date(fechaInicial);
    var fin = new Date(fechaFinal);
    var diferenciaMeses = (fin.getFullYear() - inicio.getFullYear()) * 12 +
        (fin.getMonth() - inicio.getMonth());
    return diferenciaMeses;
};
var agruparPorSemana = function (datos) {
    var semanas = [];
    for (var _i = 0, datos_1 = datos; _i < datos_1.length; _i++) {
        var dato = datos_1[_i];
        var fecha = new Date(dato.mes);
        var semana = getWeekNumber(fecha);
        if (semanas[semana]) {
            semanas[semana] += dato.total;
        }
        else {
            semanas[semana] = dato.total;
        }
    }
    var result = [];
    for (var semana in semanas) {
        result.push({ semana: Number(semana), total: semanas[semana] });
    }
    return result;
};
var getWeekNumber = function (date) {
    var onejan = new Date(date.getFullYear(), 0, 1);
    var week = Math.ceil(((date - onejan) / 86400000 + onejan.getDay()) / 7);
    return week;
};
var agruparPorWeek = function (datos) {
    var semanas = [];
    var contador = 1;
    for (var _i = 0, datos_2 = datos; _i < datos_2.length; _i++) {
        var dato = datos_2[_i];
        if (!semanas[contador]) {
            semanas[contador] = 0;
        }
        semanas[contador] += dato.total;
        contador++;
    }
    var result = [];
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
    var months = [
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
    var startMonthIndex = startMonth - 1;
    var endMonthIndex = Math.min(startMonthIndex + parseInt(rangeMonths) - 1, 11);
    var monthRange = months.slice(startMonthIndex, endMonthIndex + 1);
    return monthRange;
}
function getLastDayOfMonth(year, month) {
    // Ajustar el mes para que sea el siguiente
    var nextMonth = parseInt(month + 1);
    // Crear una nueva fecha con el primer día del mes siguiente
    var firstDayOfNextMonth = new Date(year, nextMonth, 1);
    // Restar un día para obtener el último día del mes actual
    var lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 24 * 60 * 60 * 1000);
    return lastDayOfMonth;
}
var getNameMonth = function (date) {
    var partsDate = date.split("-");
    var months = [
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
    return months.filter(function (mes) { return mes.index === parseInt(partsDate[1]); })[0].month;
};
var orderMonths = function (requiredMonths) {
    var months = [
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
    var filteredMonths = months.filter(function (mes) { return requiredMonths.includes(mes.month); });
    filteredMonths.sort(function (a, b) { return a.index - b.index; });
    return filteredMonths.map(function (mes) { return mes.month; });
};
var llenarFechasFaltantes = function (arr, mesInicial, rango) {
    var fechasFaltantes = [];
    var rango_for = (parseInt(mesInicial) + parseInt(rango)) > 12 ? 12 : (parseInt(mesInicial) + parseInt(rango));
    for (var i = mesInicial; i <= rango_for; i++) {
        var fecha = "2023-" + i.toString().padStart(2, '0') + "-01";
        fechasFaltantes.push(fecha);
    }
    var resultado = [];
    if (arr.length === 0) {
        for (var _i = 0, fechasFaltantes_1 = fechasFaltantes; _i < fechasFaltantes_1.length; _i++) {
            var fecha = fechasFaltantes_1[_i];
            resultado.push({ mes: fecha, total: 0 });
        }
    }
    else {
        var _loop_3 = function (fecha) {
            var encontrado = arr.find(function (item) { return item.mes === fecha; });
            if (encontrado) {
                resultado.push(encontrado);
            }
            else {
                resultado.push({ mes: fecha, total: 0 });
            }
        };
        for (var _a = 0, fechasFaltantes_2 = fechasFaltantes; _a < fechasFaltantes_2.length; _a++) {
            var fecha = fechasFaltantes_2[_a];
            _loop_3(fecha);
        }
        // Agregar elementos restantes del arreglo original
        for (var _b = 0, arr_1 = arr; _b < arr_1.length; _b++) {
            var elemento = arr_1[_b];
            if (!fechasFaltantes.includes(elemento.mes)) {
                resultado.push(elemento);
            }
        }
    }
    return resultado;
};
var sendNotification = function (id_seller, data, title) { return __awaiter(void 0, void 0, void 0, function () {
    var userInfo, notify;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Sellers_schema_1["default"].findOne({ _id: id_seller })];
            case 1:
                userInfo = _a.sent();
                if (!userInfo) return [3 /*break*/, 3];
                notify = new notifications_schema_1["default"]({
                    id_user: userInfo.id_user,
                    title: title,
                    data: data,
                    date: moment_1["default"]().format("YYYY-MM-DD HH:mm:ss"),
                    status: false
                });
                return [4 /*yield*/, notify.save()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports["default"] = vehicleController;
