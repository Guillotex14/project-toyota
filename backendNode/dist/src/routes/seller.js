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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const moment_1 = __importDefault(require("moment"));
const Users_1 = __importDefault(require("../models/Users"));
const Vehicles_1 = __importDefault(require("../models/Vehicles"));
const Mechanics_1 = __importDefault(require("../models/Mechanics"));
const Zones_1 = __importDefault(require("../models/Zones"));
const Concesionaries_1 = __importDefault(require("../models/Concesionaries"));
const Response_1 = require("../models/Response");
const mechanicalsFiles_1 = __importDefault(require("../models/mechanicalsFiles"));
const Sellers_1 = __importDefault(require("../models/Sellers"));
const brands_1 = __importDefault(require("../models/brands"));
const notifications_1 = __importDefault(require("../models/notifications"));
const sellerRouter = (0, express_1.Router)();
sellerRouter.post("/addMechanic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const date_created = (0, moment_1.default)().format('DD/MM/YYYY');
    const { email, password, username, fullName, city, concesionary } = req.body;
    const hash = yield bcrypt_1.default.hash(password, 10);
    const newUser = new Users_1.default({ email, password: hash, username, type_user: "mechanic" });
    const newMechanic = new Mechanics_1.default({ fullName, city, concesionary, date_created });
    yield newUser.save().then((res) => {
        if (res) {
            newMechanic.id_user = res._id;
        }
    }).catch((err) => {
        console.log(err);
    });
    yield newMechanic.save();
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'jefersonmujica@gmail.com',
            pass: 'qtthfkossxcahyzo',
        }
    });
    const mailOptions = {
        from: 'Toyousado',
        to: email,
        subject: 'Bienvenido',
        text: 'Bienvenido a Toyousado, tu usuario es: ' + email + ' y tu contraseña es: ' + password + '',
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
        ;
    });
    reponseJson.code = 200;
    reponseJson.message = "Mecanico agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
}));
sellerRouter.post("/addVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let emailmechanic = "";
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format('DD/MM/YYYY');
    const { model, brand, year, displacement, km, engine_model, titles, fuel, transmission, transmission_2, city, dealer, concesionary, traction_control, performance, comfort, technology, price, id_seller, id_mechanic, type_vehicle, images } = req.body;
    const newVehicle = new Vehicles_1.default({ model, year, brand, displacement, km, engine_model, titles, fuel, transmission, transmission_2, city, dealer, concesionary, traction_control, performance, comfort, technology, mechanicalFile: false, sold: false, date: dateNow, price, id_seller, id_mechanic, id_seller_buyer: null, type_vehicle });
    yield newVehicle.save();
    yield Mechanics_1.default.findOne({ _id: id_mechanic }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            yield Users_1.default.findOne({ _id: res.id_user }).then((res) => {
                if (res) {
                    emailmechanic = res.email;
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    })).catch((err) => {
        console.log(err);
    });
    yield Sellers_1.default.findOne({ _id: id_seller }).then((res) => {
        if (res) {
            infoSeller = res;
        }
    }).catch((err) => {
        console.log(err);
    });
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'jefersonmujica@gmail.com',
            pass: 'qtthfkossxcahyzo',
        }
    });
    const mailOptions = {
        from: 'Toyousado',
        to: emailmechanic,
        subject: 'Revisión de vehiculo',
        text: 'El vendedor ' + infoSeller.fullName + ' del concesionario ' + infoSeller.concesionary + ' de la ciudad de ' + infoSeller.city + ' ha agregado un vehiculo para que sea revisado, por favor ingresa a la plataforma para revisarlo',
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
    sendNotificationMechanic(id_mechanic, mailOptions.text, mailOptions.subject);
    reponseJson.code = 200;
    reponseJson.message = "Vehiculo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
}));
sellerRouter.post("/addMechanicalFile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { part_emblems_complete, wiper_shower_brushes_windshield, hits, scratches, paint_condition, bugle_accessories, air_conditioning_system, radio_player, courtesy_lights, upholstery_condition, gts, board_lights, tire_pressure, tire_life, battery_status_terminals, transmitter_belts, motor_oil, engine_coolant_container, radiator_status, exhaust_pipe_bracket, fuel_tank_cover_pipes_hoses_connections, distribution_mail, spark_plugs_air_filter_fuel_filter_anti_pollen_filter, fuel_system, parking_break, brake_bands_drums, brake_pads_discs, brake_pipes_hoses, master_cylinder, brake_fluid, bushings_plateaus, stumps, terminals, Stabilizer_bar, bearings, tripoids_rubbe_bands, shock_absorbers_coils, dealer_maintenance, id_vehicle, id_mechanic } = req.body;
    const newMechanicFile = new mechanicalsFiles_1.default({
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
        Stabilizer_bar,
        bearings,
        tripoids_rubbe_bands,
        shock_absorbers_coils,
        dealer_maintenance,
        approve: false,
        reject: false,
        edit: false,
        id_vehicle,
        id_mechanic
    });
    const newMechanicFileSaved = yield newMechanicFile.save();
    const vehicleUpdated = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, { mechanicalFile: true });
    if (newMechanicFileSaved) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica creada correctamente";
        reponseJson.data = newMechanicFileSaved;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo crear la Ficha mecanica";
    }
    res.json(reponseJson);
}));
sellerRouter.get("/allVehicles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id_seller } = req.body;
    const ress = yield Vehicles_1.default.find({ mechanicalFile: true, sold: false, id_seller: { $ne: id_seller } }).then((res) => {
        console.log("carros a la venta", res);
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            jsonRes.data = res;
            return jsonRes;
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.post("/myVehicles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id_seller } = req.body;
    const ress = yield Vehicles_1.default.find({ id_seller: id_seller }).then((res) => {
        console.log("carros a la venta", res);
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            jsonRes.data = res;
            return jsonRes;
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.post("/vehicleById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    console.log("id", id);
    const ress = yield Vehicles_1.default.findOne({ _id: id }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(res);
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            jsonRes.data = res;
            return jsonRes;
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    })).catch((err) => {
        console.log(err);
    });
    res.json(jsonRes);
}));
sellerRouter.post("/mechanicalFileByIdVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const mecFile = yield mechanicalsFiles_1.default.findOne({ id_vehicle: id_vehicle });
    if (mecFile) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica encontrada";
        reponseJson.data = mecFile;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro la ficha mecanica";
    }
    res.json(reponseJson);
}));
sellerRouter.get("/allMechanics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = new Response_1.ResponseModel();
    let arrayMechanics = [];
    let infoMechanic = [];
    const ress = yield Users_1.default.find({ type_user: "mechanic" }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            responseJson.code = 200;
            responseJson.message = "success";
            responseJson.status = true;
            for (let i = 0; i < res.length; i++) {
                yield Mechanics_1.default.find({ id_user: res[i]._id }).then((res2) => {
                    if (res2) {
                        res2.forEach((element) => {
                            infoMechanic.push(element);
                        });
                    }
                    else {
                        infoMechanic = [];
                        return res2;
                    }
                }).catch((err) => {
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
                            type_user: res[j].type_user
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
            responseJson.message = "no existe";
            responseJson.status = false;
            return responseJson;
        }
    })).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.post("/mechanicByConcesionary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const { concesionary } = req.body;
    const ress = yield Mechanics_1.default.find({ concesionary: concesionary }).then((res) => {
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        }
        else if (!res) {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.get("/allZones", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const ress = yield Zones_1.default.find().then((res) => {
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        }
        else if (!res) {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.get("/allConcesionaries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const ress = yield Concesionaries_1.default.find().then((res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(res);
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        }
        else if (!res) {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    })).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.get("/allBrands", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const brand = yield brands_1.default.find().then((res) => {
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        }
        else {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }).catch((err) => {
        console.log(err);
    });
    res.json(jsonResponse);
}));
sellerRouter.post('/buyVehicle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = new Response_1.ResponseModel();
    const { id_vehicle, id_seller } = req.body;
    const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, { id_seller_buyer: id_seller });
    const getVehicle = yield Vehicles_1.default.findById(id_vehicle);
    const infoBuyer = yield Sellers_1.default.findById(id_seller);
    const infoSeller = yield Sellers_1.default.findById(getVehicle.id_seller);
    const email = yield Users_1.default.findById(infoSeller.id_user);
    const emailBuyer = yield Users_1.default.findById(infoBuyer.id_user);
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'jefersonmujica@gmail.com',
            pass: 'qtthfkossxcahyzo',
        },
    });
    const mailOptions = {
        from: 'Toyousado Notifications',
        to: email.email,
        subject: 'Compra de vehiculo',
        text: `el vendedor ${infoBuyer.fullName} quiere comprar tu vehiculo, para mas información comunicate con el vendedor al correo ${emailBuyer.email} o al numero telefono ${infoBuyer.phone}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
        ;
    });
    sendNotification(infoSeller._id.toString(), mailOptions.text, mailOptions.subject);
    responseJson.code = 200;
    responseJson.message = "Compra realizada, esperar confirmación o rechazo del vendedor";
    responseJson.status = true;
    res.json(responseJson);
}));
sellerRouter.post('/approveBuyVehicle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, { sold: true });
    const infoBuyer = yield Sellers_1.default.findById(vehicle.id_seller_buyer);
    const userbuyer = yield Users_1.default.findById(infoBuyer.id_user);
    const infoSeller = yield Sellers_1.default.findById(vehicle.id_seller);
    const userSeller = yield Users_1.default.findById(infoSeller.id_user);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = vehicle;
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'jefersonmujica@gmail.com',
                pass: 'qtthfkossxcahyzo',
            },
        });
        const mailOptions = {
            from: 'Toyousado Notifications',
            to: userbuyer.email,
            subject: 'Compra de vehiculo aprobada',
            text: `Tu compra del vehiculo ${vehicle.model} del concesionario ${vehicle.concesionary} ha sido aprobada, para mas información comunicate con el vendedor al correo ${userSeller.email} o al numero telefono ${infoSeller.phone}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
            ;
        });
        sendNotification(userbuyer._id.toString(), mailOptions.text, mailOptions.subject);
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
sellerRouter.post('/rejectBuyVehicle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, { id_seller_buyer: null, sold: false });
    const infoBuyer = yield Sellers_1.default.findById(vehicle.id_seller_buyer);
    const userbuyer = yield Users_1.default.findById(infoBuyer.id_user);
    const infoSeller = yield Sellers_1.default.findById(vehicle.id_seller);
    const userSeller = yield Users_1.default.findById(infoSeller.id_user);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = vehicle;
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'jefersonmujica@gmail.com',
                pass: 'qtthfkossxcahyzo',
            },
        });
        const mailOptions = {
            from: 'Toyousado Notifications',
            to: userbuyer.email,
            subject: 'Compra de vehiculo rechazada',
            text: `Tu compra del vehiculo ${vehicle.model} del concesionario ${vehicle.concesionary} fue rechazada, para mas información comunicate con el vendedor al correo ${userSeller.email} o al numero telefono ${infoSeller.phone}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
            ;
        });
        sendNotification(userbuyer._id.toString(), mailOptions.text, mailOptions.subject);
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
sellerRouter.post('/getNotifications', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user } = req.body;
    const notificationsUser = yield notifications_1.default.find({ id_user: id_user, status: false });
    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
sellerRouter.post('/updateNotification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const notificationsUser = yield notifications_1.default.findByIdAndUpdate(id, { status: true });
    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
sellerRouter.post('/notificationById', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const notificationsUser = yield notifications_1.default.findById(id);
    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
sellerRouter.post('/countNotifications', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user } = req.body;
    const countNotifies = yield notifications_1.default.countDocuments({ id_user: id_user, status: false });
    if (countNotifies) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = countNotifies;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
sellerRouter.post('/getVehicleByType', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { type_vehicle } = req.body;
    const arrayVehicles = yield Vehicles_1.default.find({ type_vehicle: type_vehicle, mechanicalFile: true, sold: false, id_seller_buyer: null });
    console.log("arrayVehicles", arrayVehicles);
    if (arrayVehicles) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
const sendNotification = (id_seller, message, title) => __awaiter(void 0, void 0, void 0, function* () {
    // const jsonRes: ResponseModel = new ResponseModel();
    const userInfo = yield Sellers_1.default.findOne({ _id: id_seller });
    if (userInfo) {
        const notify = new notifications_1.default({
            id_user: userInfo.id_user,
            title: title,
            message: message,
            date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            status: false
        });
        yield notify.save();
    }
});
const sendNotificationMechanic = (id_mechanic, message, title) => __awaiter(void 0, void 0, void 0, function* () {
    // const jsonRes: ResponseModel = new ResponseModel();
    const userInfo = yield Mechanics_1.default.findOne({ _id: id_mechanic });
    if (userInfo) {
        const notify = new notifications_1.default({
            id_user: userInfo.id_user,
            title: title,
            message: message,
            date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            status: false
        });
        yield notify.save();
    }
});
function saveImage(img, imgname) {
    let posr = img.split(';')[0];
    let base64 = img.split(';base64,').pop();
    let mime_type = posr.split(':')[1];
    let type = mime_type.split('/')[1];
    let directory = '../public/img/vehicles/';
    img.mv(__dirname + directory + imgname + "." + type);
    return imgname + "." + type;
}
// public function uploadBase64($image, $name)
//     {
//         $posr = explode(';', $image)[0];
//         $base64 = explode(";base64,", $image);
//         $mime_type = explode(':', $posr)[1];
//         $type = explode('/', $mime_type)[1];
//         $directory = '../public/img/recipes/';
//         file_put_contents($directory . $name . "." . $type, base64_decode($base64[1]));
//         return $name . "." . $type;
//     }
exports.default = sellerRouter;
//# sourceMappingURL=seller.js.map