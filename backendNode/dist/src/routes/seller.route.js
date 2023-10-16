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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const nodemailer_1 = require("../../nodemailer");
const seller_controller_1 = __importDefault(require("../controllers/seller.controller"));
const Concesionaries_schema_1 = __importDefault(require("../schemas/Concesionaries.schema"));
const ImgVehicle_schema_1 = __importDefault(require("../schemas/ImgVehicle.schema"));
const Mechanics_schema_1 = __importDefault(require("../schemas/Mechanics.schema"));
const Response_1 = require("../models/Response");
const Vehicles_schema_1 = __importDefault(require("../schemas/Vehicles.schema"));
const Sellers_schema_1 = __importDefault(require("../schemas/Sellers.schema"));
const imgUser_schema_1 = __importDefault(require("../schemas/imgUser.schema"));
const Users_schema_1 = __importDefault(require("../schemas/Users.schema"));
const Zones_schema_1 = __importDefault(require("../schemas/Zones.schema"));
const global = __importStar(require("../global"));
const sellerRouter = (0, express_1.Router)();
sellerRouter.post("/addVehicle", seller_controller_1.default.addVehicle);
sellerRouter.post("/updateVehicle", seller_controller_1.default.updateVehicle);
sellerRouter.post("/addImgVehicle", seller_controller_1.default.addImgVehicle);
sellerRouter.post("/deleteImgVehicle", seller_controller_1.default.deleteImgVehicle);
sellerRouter.post("/updateImgVehicle", seller_controller_1.default.updateImgVehicle);
sellerRouter.get("/allVehicles", seller_controller_1.default.allVehicles);
sellerRouter.post("/myVehicles", seller_controller_1.default.myVehicles);
sellerRouter.post("/vehicleById", seller_controller_1.default.vehicleById);
sellerRouter.post("/mechanicalFileByIdVehicle", seller_controller_1.default.mechanicalFileByIdVehicle);
sellerRouter.get("/allBrands", seller_controller_1.default.allBrands);
sellerRouter.get("/allModels", seller_controller_1.default.allModels);
sellerRouter.post("/buyVehicle", seller_controller_1.default.buyVehicle);
sellerRouter.post("/approveBuyVehicle", seller_controller_1.default.approveBuyVehicle);
sellerRouter.post("/rejectBuyVehicle", seller_controller_1.default.rejectBuyVehicle);
sellerRouter.post("/dispatchedCar", seller_controller_1.default.dispatchedCar);
sellerRouter.post("/repost", seller_controller_1.default.repost);
sellerRouter.post("/getNotifications", seller_controller_1.default.getNotifications);
sellerRouter.post("/updateNotification", seller_controller_1.default.updateNotification);
sellerRouter.post("/notificationById", seller_controller_1.default.notificationById);
sellerRouter.post("/countNotifications", seller_controller_1.default.countNotifications);
sellerRouter.post("/autocompleteModels", seller_controller_1.default.autocompleteModels);
sellerRouter.post("/addMechanic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
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
}));
sellerRouter.get("/allMechanics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = new Response_1.ResponseModel();
    let arrayMechanics = [];
    let infoMechanic = [];
    const ress = yield Users_schema_1.default.find({ type_user: "mechanic" })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            responseJson.code = 200;
            responseJson.message = "Técnicos encontrados";
            responseJson.status = true;
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
            responseJson.data = arrayMechanics;
            return responseJson;
        }
        else {
            responseJson.code = 400;
            responseJson.message = "no se encontraron técnicos";
            responseJson.status = false;
            return responseJson;
        }
    }))
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.post("/mechanicByConcesionary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const { concesionary } = req.body;
    let arrayMechanics = [];
    const mecByConcesionary = yield Mechanics_schema_1.default.find({
        concesionary: concesionary,
    });
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
        jsonResponse.code = 200;
        jsonResponse.message = "Técnicos encontrados";
        jsonResponse.status = true;
        jsonResponse.data = arrayMechanics;
    }
    else {
        jsonResponse.code = 400;
        jsonResponse.message = "no se encontraron Técnicos";
        jsonResponse.status = false;
    }
    res.json(jsonResponse);
    // const ress = await mechanics
    //   .find({ concesionary: concesionary })
    //   .then((res: any) => {
    //     if (res) {
    //       for
    //       jsonResponse.code = 200;
    //       jsonResponse.message = "Técnicos encontrados";
    //       jsonResponse.status = true;
    //       jsonResponse.data = res;
    //       return jsonResponse;
    //     } else if (!res) {
    //       jsonResponse.code = 400;
    //       jsonResponse.message = "no se encontraron Técnicos";
    //       jsonResponse.status = false;
    //       return jsonResponse;
    //     }
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //   });
}));
sellerRouter.get("/allZones", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const ress = yield Zones_schema_1.default
        .find()
        .then((res) => {
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "zonas encontradas";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        }
        else if (!res) {
            jsonResponse.code = 400;
            jsonResponse.message = "no se encontraron zonas";
            jsonResponse.status = false;
            return jsonResponse;
        }
    })
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.get("/allConcesionaries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const ress = yield Concesionaries_schema_1.default
        .find()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(res);
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "concesionarias encontradas";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        }
        else if (!res) {
            jsonResponse.code = 400;
            jsonResponse.message = "no se encontraron concesionarias";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }))
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.post("/getVehicleByType", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
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
}));
sellerRouter.post("/filterVehiclesWithMongo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //aqui declaramos las respuestas
    const reponseJson = new Response_1.ResponseModel();
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
}));
sellerRouter.get("/filterGraphySell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
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
}));
sellerRouter.get("/exportExcell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
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
        seller = yield Sellers_schema_1.default.findOne({ id_user: id_user });
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
    cardsgroupmodel = yield Vehicles_schema_1.default.aggregate([
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
}));
sellerRouter.get("/listVehiclesSell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
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
}));
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
exports.default = sellerRouter;
//# sourceMappingURL=seller.route.js.map