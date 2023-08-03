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
const fs_1 = __importDefault(require("fs"));
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
const imgUser_1 = __importDefault(require("../models/imgUser"));
const ImgVehicle_1 = __importDefault(require("../models/ImgVehicle"));
const sellerRouter = (0, express_1.Router)();
sellerRouter.post("/addMechanic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const date_created = (0, moment_1.default)().format("DD/MM/YYYY");
    const { email, password, username, fullName, city, concesionary } = req.body;
    const hash = yield bcrypt_1.default.hash(password, 10);
    const newUser = new Users_1.default({
        email,
        password: hash,
        username,
        type_user: "mechanic",
    });
    const newMechanic = new Mechanics_1.default({
        fullName,
        city,
        concesionary,
        date_created,
    });
    yield newUser
        .save()
        .then((res) => {
        if (res) {
            newMechanic.id_user = res._id;
        }
    })
        .catch((err) => {
        console.log(err);
    });
    yield newMechanic.save();
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "jefersonmujica@gmail.com",
            pass: "qtthfkossxcahyzo",
        },
    });
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
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
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
    let dateNow = (0, moment_1.default)().format("DD/MM/YYYY");
    const { model, brand, year, displacement, km, engine_model, titles, fuel, transmission, traction, city, dealer, concesionary, traction_control, performance, comfort, technology, id_seller, id_mechanic, type_vehicle, images, } = req.body;
    const newVehicle = new Vehicles_1.default({
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
        date: dateNow,
        price: null,
        id_seller,
        id_mechanic,
        id_seller_buyer: null,
        type_vehicle,
    });
    yield newVehicle.save();
    yield Mechanics_1.default
        .findOne({ _id: id_mechanic })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            yield Users_1.default.findOne({ _id: res.id_user })
                .then((res) => {
                if (res) {
                    emailmechanic = res.email;
                }
            })
                .catch((err) => {
                console.log(err);
            });
        }
    }))
        .catch((err) => {
        console.log(err);
    });
    infoSeller = yield Sellers_1.default.findOne({ _id: id_seller });
    if (images) {
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const filename = yield saveBse64ImageInPublicDirectory(images[i].image, `${newVehicle._id}-${i}`);
                const imgVehi = new ImgVehicle_1.default({
                    img: filename,
                    id_vehicle: newVehicle._id,
                });
                yield imgVehi.save();
            }
        }
    }
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "jefersonmujica@gmail.com",
            pass: "qtthfkossxcahyzo",
        },
    });
    const mailOptions = {
        from: "Toyousado",
        to: emailmechanic,
        subject: "Revisión de vehiculo",
        text: "El vendedor " +
            infoSeller.fullName +
            " del concesionario " +
            infoSeller.concesionary +
            " de la ciudad de " +
            infoSeller.city +
            " ha agregado un vehiculo para que sea revisado, por favor ingresa a la plataforma para revisarlo",
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
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
    const { part_emblems_complete, wiper_shower_brushes_windshield, hits, scratches, paint_condition, bugle_accessories, air_conditioning_system, radio_player, courtesy_lights, upholstery_condition, gts, board_lights, tire_pressure, tire_life, battery_status_terminals, transmitter_belts, motor_oil, engine_coolant_container, radiator_status, exhaust_pipe_bracket, fuel_tank_cover_pipes_hoses_connections, distribution_mail, spark_plugs_air_filter_fuel_filter_anti_pollen_filter, fuel_system, parking_break, brake_bands_drums, brake_pads_discs, brake_pipes_hoses, master_cylinder, brake_fluid, bushings_plateaus, stumps, terminals, Stabilizer_bar, bearings, tripoids_rubbe_bands, shock_absorbers_coils, dealer_maintenance, id_vehicle, id_mechanic, } = req.body;
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
        id_mechanic,
    });
    const newMechanicFileSaved = yield newMechanicFile.save();
    const vehicleUpdated = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
        mechanicalFile: true,
    });
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
sellerRouter.post("/addImgProfile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user, image } = req.body;
    const filename = yield saveBse64ImageInPublicDirectory(image, `${id_user}`);
    const newImage = new imgUser_1.default({ img: filename, id_user: id_user });
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
}));
sellerRouter.post("/updateImgProfile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user, image, old_image } = req.body;
    const delImag = yield delBse64ImageInPublicDirectoryUser(old_image);
    if (delImag) {
        const filename = yield saveBse64ImageInPublicDirectoryUser(image, `${id_user}`);
        const newImage = yield imgUser_1.default.findOneAndUpdate({ id_user: id_user }, { img: filename });
        if (newImage) {
            reponseJson.code = 200;
            reponseJson.message = "Imagen actualizada exitosamente";
            reponseJson.status = true;
            reponseJson.data = newImage;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "No se pudo actualizar la imagen";
            reponseJson.status = false;
        }
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo eliminar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
sellerRouter.post("/updateVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle, price, images, old_image } = req.body;
    const vehicleUpdated = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
        price: price,
    });
    // if (images) {
    //     if(images.length > 0){
    //         // const vehicleUpdated = await vehicles.findByIdAndUpdate(id_vehicle,{images: images});
    //     }
    // }
    if (old_image) {
        if (old_image.length > 0) {
            yield ImgVehicle_1.default.deleteMany({ id_vehicle: id_vehicle });
            for (let i = 0; i < old_image.length; i++) {
                delBse64ImageInPublicDirectory(old_image[i].img);
            }
            if (images) {
                if (images.length > 0) {
                    for (let i = 0; i < images.length; i++) {
                        let filename = saveBse64ImageInPublicDirectory(images[i].img, `${id_vehicle}` + i);
                        const newImage = new ImgVehicle_1.default({
                            img: filename,
                            id_vehicle: id_vehicle,
                        });
                        yield newImage.save();
                    }
                }
            }
        }
    }
    else {
        if (images) {
            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    let filename = saveBse64ImageInPublicDirectory(images[i].img, `${id_vehicle}` + i);
                    const newImage = new ImgVehicle_1.default({
                        img: filename,
                        id_vehicle: id_vehicle,
                    });
                    yield newImage.save();
                }
            }
        }
    }
    if (vehicleUpdated) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Vehiculo actualizado correctamente";
        reponseJson.data = vehicleUpdated;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo actualizar el vehiculo";
    }
    res.json(reponseJson);
}));
sellerRouter.get("/allVehicles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id_seller } = req.body;
    const ress = yield Vehicles_1.default
        .find({
        mechanicalFile: true,
        sold: false,
        id_seller: { $ne: id_seller },
        price: { $ne: null },
    })
        .sort({ date: -1 })
        .then((res) => {
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
    })
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.post("/myVehicles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id_seller } = req.body;
    const ress = yield Vehicles_1.default
        .find({ id_seller: id_seller })
        .then((res) => {
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
    })
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.post("/vehicleById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    const ress = yield Vehicles_1.default
        .findOne({ _id: id })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            yield mechanicalsFiles_1.default
                .findOne({ id_vehicle: res._id })
                .then((res2) => __awaiter(void 0, void 0, void 0, function* () {
                if (res2) {
                    yield ImgVehicle_1.default.find({ id_vehicle: res._id })
                        .then((res3) => {
                        if (res3) {
                            let vehicle = {
                                _id: res._id,
                                model: res.model,
                                year: res.year,
                                brand: res.brand,
                                displacement: res.displacement,
                                km: res.km,
                                engine_model: res.engine_model,
                                titles: res.titles,
                                fuel: res.fuel,
                                transmission: res.transmission,
                                transmission_2: res.transmission_2,
                                city: res.city,
                                dealer: res.dealer,
                                concesionary: res.concesionary,
                                traction_control: res.traction_control,
                                performance: res.performance,
                                price: res.price,
                                comfort: res.comfort,
                                technology: res.technology,
                                mechanicalFile: res.mechanicalFile,
                                sold: res.sold,
                                date: res.date,
                                type_vehicle: res.type_vehicle,
                                id_seller: res.id_seller,
                                id_mechanic: res.id_mechanic,
                                id_seller_buyer: res.id_seller_buyer,
                                general_condition: res2.general_condition,
                                images: res3,
                            };
                            jsonRes.code = 200;
                            jsonRes.message = "success";
                            jsonRes.status = true;
                            jsonRes.data = vehicle;
                            return jsonRes;
                        }
                        else {
                            let vehicle = {
                                _id: res._id,
                                model: res.model,
                                year: res.year,
                                brand: res.brand,
                                displacement: res.displacement,
                                km: res.km,
                                engine_model: res.engine_model,
                                titles: res.titles,
                                fuel: res.fuel,
                                transmission: res.transmission,
                                transmission_2: res.transmission_2,
                                city: res.city,
                                dealer: res.dealer,
                                concesionary: res.concesionary,
                                traction_control: res.traction_control,
                                performance: res.performance,
                                price: res.price,
                                comfort: res.comfort,
                                technology: res.technology,
                                mechanicalFile: res.mechanicalFile,
                                sold: res.sold,
                                date: res.date,
                                type_vehicle: res.type_vehicle,
                                id_seller: res.id_seller,
                                id_mechanic: res.id_mechanic,
                                id_seller_buyer: res.id_seller_buyer,
                                general_condition: res2.general_condition,
                                images: [],
                            };
                            jsonRes.code = 200;
                            jsonRes.message = "success";
                            jsonRes.status = true;
                            jsonRes.data = vehicle;
                            return jsonRes;
                        }
                    })
                        .catch((err) => {
                        console.log(err);
                    });
                }
                else {
                    let vehicle = {
                        _id: res._id,
                        model: res.model,
                        year: res.year,
                        brand: res.brand,
                        displacement: res.displacement,
                        km: res.km,
                        engine_model: res.engine_model,
                        titles: res.titles,
                        fuel: res.fuel,
                        transmission: res.transmission,
                        transmission_2: res.transmission_2,
                        city: res.city,
                        dealer: res.dealer,
                        concesionary: res.concesionary,
                        traction_control: res.traction_control,
                        performance: res.performance,
                        price: res.price,
                        comfort: res.comfort,
                        technology: res.technology,
                        mechanicalFile: res.mechanicalFile,
                        sold: res.sold,
                        date: res.date,
                        type_vehicle: res.type_vehicle,
                        id_seller: res.id_seller,
                        id_mechanic: res.id_mechanic,
                        id_seller_buyer: res.id_seller_buyer,
                        general_condition: "",
                        images: [],
                    };
                    jsonRes.code = 200;
                    jsonRes.message = "auto sin ficha mecanica";
                    jsonRes.status = true;
                    jsonRes.data = vehicle;
                    return jsonRes;
                }
            }))
                .catch((err) => {
                console.log(err);
            });
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe 1";
            jsonRes.status = false;
            return jsonRes;
        }
    }))
        .catch((err) => {
        console.log(err);
    });
    // const ress2 = await ImgVehicle.find({id_vehicle: id});
    // console.log("imagenes", ress2)
    // if (ress2){
    //     jsonRes.data.images = ress2;
    // }else{
    //     jsonRes.data.images = [];
    // }
    // jsonRes.data.images = ress2;
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
    const ress = yield Users_1.default.find({ type_user: "mechanic" })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            responseJson.code = 200;
            responseJson.message = "success";
            responseJson.status = true;
            for (let i = 0; i < res.length; i++) {
                yield Mechanics_1.default
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
    }))
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.post("/mechanicByConcesionary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const { concesionary } = req.body;
    const ress = yield Mechanics_1.default
        .find({ concesionary: concesionary })
        .then((res) => {
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
    })
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.get("/allZones", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const ress = yield Zones_1.default
        .find()
        .then((res) => {
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
    })
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.get("/allConcesionaries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const ress = yield Concesionaries_1.default
        .find()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }))
        .catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
sellerRouter.get("/allBrands", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const brand = yield brands_1.default
        .find()
        .then((res) => {
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
    })
        .catch((err) => {
        console.log(err);
    });
    res.json(jsonResponse);
}));
sellerRouter.post("/buyVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = new Response_1.ResponseModel();
    const { id_vehicle, id_seller } = req.body;
    const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
        id_seller_buyer: id_seller,
    });
    const getVehicle = yield Vehicles_1.default.findById(id_vehicle);
    const infoBuyer = yield Sellers_1.default.findById(id_seller);
    const infoSeller = yield Sellers_1.default.findById(getVehicle.id_seller);
    const email = yield Users_1.default.findById(infoSeller.id_user);
    const emailBuyer = yield Users_1.default.findById(infoBuyer.id_user);
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "jefersonmujica@gmail.com",
            pass: "qtthfkossxcahyzo",
        },
    });
    const mailOptions = {
        from: "Toyousado Notifications",
        to: email.email,
        subject: "Compra de vehiculo",
        text: `el vendedor ${infoBuyer.fullName} quiere comprar tu vehiculo, para mas información comunicate con el vendedor al correo ${emailBuyer.email} o al numero telefono ${infoBuyer.phone}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
    sendNotification(infoSeller._id.toString(), mailOptions.text, mailOptions.subject);
    responseJson.code = 200;
    responseJson.message =
        "Compra realizada, esperar confirmación o rechazo del vendedor";
    responseJson.status = true;
    res.json(responseJson);
}));
sellerRouter.post("/approveBuyVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            service: "gmail",
            auth: {
                user: "jefersonmujica@gmail.com",
                pass: "qtthfkossxcahyzo",
            },
        });
        const mailOptions = {
            from: "Toyousado Notifications",
            to: userbuyer.email,
            subject: "Compra de vehiculo aprobada",
            text: `Tu compra del vehiculo ${vehicle.model} del concesionario ${vehicle.concesionary} ha sido aprobada, para mas información comunicate con el vendedor al correo ${userSeller.email} o al numero telefono ${infoSeller.phone}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
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
sellerRouter.post("/rejectBuyVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
        id_seller_buyer: null,
        sold: false,
    });
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
            service: "gmail",
            auth: {
                user: "jefersonmujica@gmail.com",
                pass: "qtthfkossxcahyzo",
            },
        });
        const mailOptions = {
            from: "Toyousado Notifications",
            to: userbuyer.email,
            subject: "Compra de vehiculo rechazada",
            text: `Tu compra del vehiculo ${vehicle.model} del concesionario ${vehicle.concesionary} fue rechazada, para mas información comunicate con el vendedor al correo ${userSeller.email} o al numero telefono ${infoSeller.phone}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
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
sellerRouter.post("/getNotifications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user } = req.body;
    const notificationsUser = yield notifications_1.default
        .find({ id_user: id_user, status: false })
        .sort({ date: -1 });
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
sellerRouter.post("/updateNotification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const notificationsUser = yield notifications_1.default.findByIdAndUpdate(id, {
        status: true,
    });
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
sellerRouter.post("/notificationById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
sellerRouter.post("/countNotifications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user } = req.body;
    const countNotifies = yield notifications_1.default.countDocuments({
        id_user: id_user,
        status: false,
    });
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
sellerRouter.post("/getVehicleByType", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { type_vehicle } = req.body;
    const arrayVehicles = yield Vehicles_1.default.find({
        type_vehicle: type_vehicle,
        mechanicalFile: true,
        sold: false,
        id_seller_buyer: null,
    });
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
sellerRouter.post("/filterVehiclesWithMongo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //aqui declaramos las respuestas
    const reponseJson = new Response_1.ResponseModel();
    let query = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle, } = req.body;
    //aqui creamos las condiciones para el filtro de los vehiculos y las querys
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
    const vehiclesFiltered = yield Vehicles_1.default.find(query).sort({ date: -1 });
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
}));
sellerRouter.get("/filterGraphySell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let { month, yearSold, rangMonths, yearCar, brandCar, modelCar } = req.query;
    //   yearSold = 2023; // A de venta
    //   rangMonths = 12; // Rango de meses
    //   month = 1; // Mes donde comienza el rango
    // yearCar = 2010; // Año del vehículo
    // brandCar = "Toyota"; // Marca del vehículo
    // modelCar = "TkT"; // Modelo del vehículo
    let now = new Date();
    let anioActual = now.getFullYear();
    if (yearSold) {
        anioActual = yearSold;
    }
    let firtsMonth = new Date(anioActual, 0, 1);
    let last = new Date(anioActual, 11);
    let lastDayLasyMont = getLastDayOfMonth(anioActual, 11);
    let lastMonth = new Date(anioActual, 11, lastDayLasyMont.getDate());
    let rangArrayMonth = [];
    if (rangMonths && rangMonths < 12) {
        rangArrayMonth = getMonthRange(month, rangMonths);
        firtsMonth = new Date(anioActual, (month - 1), 1);
        if (rangArrayMonth.length > 0) {
            last = new Date(anioActual, (rangArrayMonth.length - 1));
            lastDayLasyMont = getLastDayOfMonth(anioActual, (rangArrayMonth.length - 1));
            lastMonth = new Date(anioActual, (rangArrayMonth.length - 1), lastDayLasyMont.getDate());
        }
        else {
            last = new Date(anioActual, (month - 1));
            lastDayLasyMont = getLastDayOfMonth(anioActual, (month - 1));
            lastMonth = new Date(anioActual, (month - 1), lastDayLasyMont.getDate());
        }
    }
    let from = `${firtsMonth.getFullYear()}-${firtsMonth.getMonth() + 1 < 10 ? "0" + (firtsMonth.getMonth() + 1) : firtsMonth.getMonth() + 1}-${firtsMonth.getDate() < 10 ? "0" + firtsMonth.getDate() : firtsMonth.getDate()}`;
    let to = `${lastMonth.getFullYear()}-${lastMonth.getMonth() + 1 < 10 ? "0" + (lastMonth.getMonth() + 1) : lastMonth.getMonth() + 1}-${lastMonth.getDate() < 10 ? "0" + lastMonth.getDate() : lastMonth.getDate()}`;
    let mongQuery = {
        date_sell: {
            $gte: from,
            $lte: to, // Filtrar documentos hasta el 31 de diciembre del año
        },
        sold: true, // Campo de búsqueda adicional
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
    console.log(mongQuery);
    const vehiclesFiltered = yield Vehicles_1.default.aggregate([
        {
            $match: mongQuery
        },
        {
            $group: {
                _id: "$date_sell",
                monto: { $sum: "$price" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const labels = vehiclesFiltered.map((dato) => dato._id);
    let nameArray = [];
    for (let i = 0; i < labels.length; i++) {
        nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
    }
    const montos = vehiclesFiltered.map((dato) => dato.monto);
    const datos = {
        labels: nameArray,
        datasets: [
            {
                label: "Montos Mensuales",
                data: montos, // Montos en el eje y
            },
        ],
    };
    if (true) {
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
const sendNotification = (id_seller, message, title) => __awaiter(void 0, void 0, void 0, function* () {
    // const jsonRes: ResponseModel = new ResponseModel();
    const userInfo = yield Sellers_1.default.findOne({ _id: id_seller });
    if (userInfo) {
        const notify = new notifications_1.default({
            id_user: userInfo.id_user,
            title: title,
            message: message,
            date: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
            status: false,
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
            date: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
            status: false,
        });
        yield notify.save();
    }
});
const saveBse64ImageInPublicDirectory = (image, name) => __awaiter(void 0, void 0, void 0, function* () {
    const posr = image.split(";")[0];
    const base64 = image.split(";base64,").pop();
    const mime_type = posr.split(":")[1];
    const type = mime_type.split("/")[1];
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const imgBin = Buffer.from(base64Data, "base64");
    fs_1.default.writeFile("public/images/vehicle/" + name + "." + type, imgBin, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Imagen guardada");
        }
    });
    return name + "." + type;
});
const saveBse64ImageInPublicDirectoryUser = (image, name) => __awaiter(void 0, void 0, void 0, function* () {
    const posr = image.split(";")[0];
    const base64 = image.split(";base64,").pop();
    const mime_type = posr.split(":")[1];
    const type = mime_type.split("/")[1];
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const imgBin = Buffer.from(base64Data, "base64");
    fs_1.default.writeFile("public/images/users/" + name + "." + type, imgBin, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Imagen guardada");
        }
    });
    return name + "." + type;
});
const delBse64ImageInPublicDirectory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let del = false;
    fs_1.default.unlink("public/images/vehicles/" + name, (err) => {
        if (err) {
            console.log(err);
            del = false;
        }
        else {
            console.log("Imagen eliminada");
            del = true;
        }
    });
    return del;
});
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
    const endMonthIndex = Math.min(startMonthIndex + rangeMonths - 1, 11);
    const monthRange = months.slice(startMonthIndex, endMonthIndex + 1);
    return monthRange;
}
function getLastDayOfMonth(year, month) {
    // Ajustar el mes para que sea el siguiente
    const nextMonth = month + 1;
    // Crear una nueva fecha con el primer día del mes siguiente
    const firstDayOfNextMonth = new Date(year, nextMonth, 1);
    // Restar un día para obtener el último día del mes actual
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - (24 * 60 * 60 * 1000));
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
const delBse64ImageInPublicDirectoryUser = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let del = false;
    fs_1.default.unlink("public/images/users" + name, (err) => {
        if (err) {
            console.log(err);
            del = false;
        }
        else {
            console.log("Imagen eliminada");
            del = true;
        }
    });
    return del;
});
exports.default = sellerRouter;
//# sourceMappingURL=seller.js.map