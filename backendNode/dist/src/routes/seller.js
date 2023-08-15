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
const sharp_1 = __importDefault(require("sharp"));
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
const ImgVehicle_1 = __importDefault(require("../models/ImgVehicle"));
const modelVehicle_1 = __importDefault(require("../models/modelVehicle"));
const cloudinaryMetods_1 = require("../../cloudinaryMetods");
const nodemailer_1 = require("../../nodemailer");
const imgUser_1 = __importDefault(require("../models/imgUser"));
const global = __importStar(require("../global"));
const sellerRouter = (0, express_1.Router)();
sellerRouter.post("/addMechanic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const date_created = (0, moment_1.default)().format("YYYY-MM-DD");
    const { email, password, username, fullName, city, concesionary } = req.body;
    const hash = yield bcrypt_1.default.hash(password, 10);
    const exist = yield Users_1.default.findOne({ email: email });
    if (exist) {
        reponseJson.code = 400;
        reponseJson.message = "El usuario se encuentra registrado";
        reponseJson.status = false;
        reponseJson.data = "";
    }
    else {
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
sellerRouter.post("/addVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let emailmechanic = "";
    let infoSeller = {};
    let dateNow = (0, moment_1.default)().format("YYYY-MM-DD");
    const { model, brand, year, displacement, km, engine_model, titles, fuel, transmission, traction, city, dealer, concesionary, traction_control, performance, comfort, technology, id_seller, id_mechanic, type_vehicle, images, vin, vehicle_plate, } = req.body;
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
        date_create: dateNow,
        price: null,
        id_seller,
        id_mechanic,
        id_seller_buyer: null,
        type_vehicle,
        vin,
        vehicle_plate,
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
                const imgResize = yield desgloseImg(images[i].image);
                const filename = yield (0, cloudinaryMetods_1.uploadImageVehicle)(imgResize);
                const imgVehi = new ImgVehicle_1.default({
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
        text: "El vendedor " +
            infoSeller.fullName +
            " del concesionario " +
            infoSeller.concesionary +
            " del estado " +
            infoSeller.city +
            " ha agregado un vehículo para que sea revisado, por favor ingresa a la plataforma para revisarlo",
    };
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    sendNotificationMechanic(id_mechanic, mailOptions.text, mailOptions.subject);
    reponseJson.code = 200;
    reponseJson.message = "Vehículo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
}));
sellerRouter.post("/updateVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle, price } = req.body;
    const vehicleUpdated = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
        price: price,
    });
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
}));
sellerRouter.post("/addImgVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle, image } = req.body;
    const filename = yield (0, cloudinaryMetods_1.uploadImageVehicle)(image);
    const newImage = new ImgVehicle_1.default({
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
}));
sellerRouter.post("/deleteImgVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { public_id } = req.body;
    const delImag = yield (0, cloudinaryMetods_1.deleteImageVehicle)(public_id);
    const delImg = yield ImgVehicle_1.default.findOneAndDelete({ public_id: public_id });
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
}));
sellerRouter.post("/updateImgVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle, image, public_id } = req.body;
    const delImg = yield ImgVehicle_1.default.findOneAndDelete({ public_id: public_id });
    const delImag = yield (0, cloudinaryMetods_1.deleteImageVehicle)(public_id);
    if (delImg) {
        let filename = yield (0, cloudinaryMetods_1.uploadImageVehicle)(image);
        const newImage = new ImgVehicle_1.default({
            img: filename.secure_url,
            id_vehicle: id_vehicle,
            public_id: filename.public_id,
        });
        yield newImage.save();
        const arrayImages = yield ImgVehicle_1.default.find({ id_vehicle: id_vehicle });
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
}));
sellerRouter.get("/allVehicles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id_seller } = req.body;
    const vehiclesArray = yield Vehicles_1.default
        .find({
        mechanicalFile: true,
        sold: false,
        id_seller: { $ne: id_seller },
        price: { $ne: null },
    })
        .sort({ date_create: -1 });
    if (vehiclesArray) {
        jsonRes.code = 200;
        jsonRes.message = "vehículos encontrados";
        jsonRes.status = true;
        jsonRes.data = vehiclesArray;
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "no se encontraron vehículos";
        jsonRes.status = false;
    }
    res.json(jsonRes);
}));
sellerRouter.post("/myVehicles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    let arrayVehicles = [];
    const { id_seller } = req.body;
    const myVehicles = yield Vehicles_1.default
        .find({ id_seller: id_seller })
        .sort({ date_create: -1 });
    if (myVehicles) {
        for (let i = 0; i < myVehicles.length; i++) {
            let data = {
                name_new_owner: myVehicles[i].name_new_owner,
                dni_new_owner: myVehicles[i].dni_new_owner,
                phone_new_owner: myVehicles[i].phone_new_owner,
                email_new_owner: myVehicles[i].email_new_owner,
                price_ofert: myVehicles[i].price_ofert,
                final_price_sold: myVehicles[i].final_price_sold,
                _id: myVehicles[i]._id,
                model: myVehicles[i].model,
                brand: myVehicles[i].brand,
                year: myVehicles[i].year,
                displacement: myVehicles[i].displacement,
                km: myVehicles[i].km,
                engine_model: myVehicles[i].engine_model,
                titles: myVehicles[i].titles,
                fuel: myVehicles[i].fuel,
                transmission: myVehicles[i].transmission,
                city: myVehicles[i].city,
                dealer: myVehicles[i].dealer,
                concesionary: myVehicles[i].concesionary,
                traction_control: myVehicles[i].traction_control,
                performance: myVehicles[i].performance,
                comfort: myVehicles[i].comfort,
                technology: myVehicles[i].technology,
                id_seller: myVehicles[i].id_seller,
                id_mechanic: myVehicles[i].id_mechanic,
                price: myVehicles[i].price,
                mechanicalFile: myVehicles[i].mechanicalFile,
                id_seller_buyer: myVehicles[i].id_seller_buyer,
                sold: myVehicles[i].sold,
                type_vehicle: myVehicles[i].type_vehicle,
                traction: myVehicles[i].traction,
                date_sell: myVehicles[i].date_sell,
                date_create: myVehicles[i].date_create,
                plate: myVehicles[i].plate,
                vin: myVehicles[i].vin,
                dispatched: myVehicles[i].dispatched,
                images: (yield ImgVehicle_1.default.findOne({ id_vehicle: myVehicles[i]._id }))
                    ? yield ImgVehicle_1.default.findOne({ id_vehicle: myVehicles[i]._id })
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
}));
sellerRouter.post("/vehicleById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    const infoVehicle = yield Vehicles_1.default.findOne({ _id: id });
    const imgsVehichle = yield ImgVehicle_1.default.find({ id_vehicle: id });
    const mechanicalFile = yield mechanicalsFiles_1.default.findOne({ id_vehicle: id });
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
            responseJson.message = "Técnicos encontrados";
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
                            image: (yield imgUser_1.default.findOne({ id_user: res[j]._id }))
                                ? yield imgUser_1.default.findOne({ id_user: res[j]._id })
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
    const mecByConcesionary = yield Mechanics_1.default.find({
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
                image: (yield imgUser_1.default.findOne({
                    id_user: mecByConcesionary[i].id_user,
                }))
                    ? yield imgUser_1.default.findOne({ id_user: mecByConcesionary[i].id_user })
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
    const ress = yield Zones_1.default
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
    const ress = yield Concesionaries_1.default
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
sellerRouter.get("/allBrands", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const brand = yield brands_1.default.find();
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
}));
sellerRouter.get("/allModels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const model = yield modelVehicle_1.default.find();
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
}));
sellerRouter.post("/buyVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = new Response_1.ResponseModel();
    const date_sell = (0, moment_1.default)().format("YYYY-MM-DD");
    const { id_vehicle, id_seller, name_new_owner, dni_new_owner, phone_new_owner, email_new_owner, price_ofert, } = req.body;
    const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
        id_seller_buyer: id_seller,
        name_new_owner: name_new_owner,
        dni_new_owner: dni_new_owner,
        phone_new_owner: phone_new_owner,
        email_new_owner: email_new_owner,
        price_ofert: price_ofert,
    });
    const sameIdSeller = yield Vehicles_1.default.findById(id_vehicle);
    if (sameIdSeller.id_seller === id_seller) {
        const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
            id_seller_buyer: id_seller,
            name_new_owner: name_new_owner,
            dni_new_owner: dni_new_owner,
            phone_new_owner: phone_new_owner,
            email_new_owner: email_new_owner,
            price_ofert: price_ofert,
            price: price_ofert,
            sold: true,
            date_sell: date_sell,
            final_price_sold: price_ofert,
            dispatched: true,
        });
        if (vehicle) {
            responseJson.code = 200;
            responseJson.message = "vehículo comprado exitosamente";
            responseJson.status = true;
            responseJson.data = vehicle;
        }
        else {
            responseJson.code = 400;
            responseJson.message = "no se pudo comprar el vehículo";
            responseJson.status = false;
        }
    }
    else {
        const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
            id_seller_buyer: id_seller,
            name_new_owner: name_new_owner,
            dni_new_owner: dni_new_owner,
            phone_new_owner: phone_new_owner,
            email_new_owner: email_new_owner,
            price_ofert: price_ofert,
            sold: false,
        });
        const getVehicle = yield Vehicles_1.default.findById(id_vehicle);
        const infoBuyer = yield Sellers_1.default.findById(id_seller);
        const infoSeller = yield Sellers_1.default.findById(getVehicle.id_seller);
        const email = yield Users_1.default.findById(infoSeller.id_user);
        const emailBuyer = yield Users_1.default.findById(infoBuyer.id_user);
        const mailOptions = {
            from: "Toyousado Notifications",
            to: email.email,
            subject: "Compra de vehículo",
            text: `El vendedor ${infoBuyer.fullName} quiere comprar tu vehículo, para mas información comunicate con el vendedor al correo ${emailBuyer.email} o al número telefono ${infoBuyer.phone}`,
        };
        yield (0, nodemailer_1.sendEmail)(mailOptions);
        sendNotification(infoSeller._id.toString(), mailOptions.text, mailOptions.subject);
        responseJson.code = 200;
        responseJson.message =
            "Compra realizada, esperar confirmación o rechazo del vendedor";
        responseJson.status = true;
    }
    res.json(responseJson);
}));
sellerRouter.post("/approveBuyVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const date_sell = (0, moment_1.default)().format("YYYY-MM-DD");
    const { id_vehicle } = req.body;
    const infoVehicle = yield Vehicles_1.default.findById(id_vehicle);
    const vehicle = yield Vehicles_1.default.findByIdAndUpdate(id_vehicle, {
        price_ofert: infoVehicle.price_ofert,
        date_sell: date_sell,
        final_price_sold: infoVehicle.price_ofert,
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
            reponseJson.message = "no existe";
            reponseJson.status = false;
        }
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "error al aprobar la oferta";
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
        price_ofert: null,
        date_sell: null,
        name_new_owner: null,
        dni_new_owner: null,
        phone_new_owner: null,
        email_new_owner: null,
    });
    const infoBuyer = yield Sellers_1.default.findById(vehicle.id_seller_buyer);
    const userbuyer = yield Users_1.default.findById(infoBuyer.id_user);
    const infoSeller = yield Sellers_1.default.findById(vehicle.id_seller);
    const userSeller = yield Users_1.default.findById(infoSeller.id_user);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "oferta rechazada exitosamente";
        reponseJson.status = true;
        reponseJson.data = vehicle;
        const mailOptions = {
            from: "Toyousado Notifications",
            to: userbuyer.email,
            subject: "Compra de vehículo rechazada",
            text: `Tu compra del vehículo ${vehicle.model} del concesionario ${vehicle.concesionary} fue rechazada, para mas información comunicate con el vendedor al correo ${userSeller.email} o al número telefono ${infoSeller.phone}`,
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
}));
sellerRouter.post("/getNotifications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user } = req.body;
    const notificationsUser = yield notifications_1.default
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
}));
sellerRouter.post("/updateNotification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const notificationsUser = yield notifications_1.default.findByIdAndUpdate(id, {
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
}));
sellerRouter.post("/notificationById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const notificationsUser = yield notifications_1.default.findById(id);
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
    const vehiclesFiltered = yield Vehicles_1.default
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
                image: (yield ImgVehicle_1.default.findOne({
                    id_vehicle: vehiclesFiltered[i]._id,
                }))
                    ? yield ImgVehicle_1.default.findOne({ id_vehicle: vehiclesFiltered[i]._id })
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
sellerRouter.post("/autocompleteModels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { search } = req.body;
    const vehiclesFiltered = yield modelVehicle_1.default.find({
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
}));
sellerRouter.get("/filterGraphySell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let { month, yearSold, rangMonths, yearCar, brandCar, modelCar, id_user, concesionary, } = req.query;
    let now = new Date();
    let anioActual = now.getFullYear();
    if (yearSold) {
        anioActual = yearSold;
    }
    if (!month) {
        month = 1;
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
        seller = yield Sellers_1.default.findOne({ id_user: id_user });
        user = yield Users_1.default.findOne({ _id: id_user });
        if (seller && user.type_user != "admin") {
            mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: seller.concesionary, $options: "i" } });
        }
        else {
            if (concesionary) {
                mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
            }
        }
    }
    const vehiclesFiltered = yield Vehicles_1.default.aggregate([
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
    if (dateFrom && dateTo) {
        let from = new Date(dateFrom).toISOString().substr(0, 10);
        let to = new Date(dateTo).toISOString().substr(0, 10);
        mongQuery = Object.assign(Object.assign({}, mongQuery), { date_sell: {
                $gte: from,
                $lte: to,
            } });
    }
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
        seller = yield Sellers_1.default.findOne({ id_user: id_user });
        user = yield Users_1.default.findOne({ _id: id_user });
        if (seller && user.type_user != "admin") {
            mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: seller.concesionary, $options: "i" } });
        }
        else {
            if (concesionary) {
                mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
            }
        }
    }
    let cardsgroupmodel = [];
    if (user.type_user == "admin") {
        cardsgroupmodel = yield Vehicles_1.default.aggregate([
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
        for (let i = 0; i < cardsgroupmodel.length; i++) {
            for (let j = 0; j < cardsgroupmodel[i].vehicles.length; j++) {
                delete cardsgroupmodel[i].vehicles[j].mechanicalfiles;
            }
        }
    }
    else {
        cardsgroupmodel = yield Vehicles_1.default.aggregate([
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
                header: "Ficha mecanica",
                key: "ficha_mecanica",
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
        if (seller) {
            columns.splice(4, 1);
        }
        console.log(columns);
        worksheet.columns = columns;
        // Agregar los datos de los vehículos del grupo
        grupo.vehicles.forEach((vehiculo) => {
            let dataRow = {
                modelo: vehiculo.model,
                marca: vehiculo.brand,
                anhio: vehiculo.year,
                precio: vehiculo.price,
                ficha_mecanica: vehiculo.general_condition,
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
            if (seller) {
                delete dataRow.ficha_mecanica;
            }
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
        if (user.type_user == "admin") {
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
        }
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
    let sendUser = yield Users_1.default.findOne({ _id: id_user });
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
    let seller = null;
    let user = null;
    if (id_user) {
        seller = yield Sellers_1.default.findOne({ id_user: id_user });
        user = yield Users_1.default.findOne({ _id: id_user });
        if (seller && user.type_user != "admin") {
            mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: seller.concesionary, $options: "i" } });
        }
        else {
            if (concesionary) {
                mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: concesionary, $options: "i" } });
            }
        }
    }
    const cardsgroupmodel = yield Vehicles_1.default.aggregate([
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
    const cardsgroupNacional = yield Vehicles_1.default.aggregate([
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
        cardsgroupmodel[i].vehicles.forEach((card) => __awaiter(void 0, void 0, void 0, function* () {
            let imgvehicles = yield ImgVehicle_1.default.findOne({ id_vehicle: card._id });
            card.imgVehicle = imgvehicles;
        }));
        cardsgroupNacional.forEach((model) => {
            if (cardsgroupmodel[i]._id == model._id) {
                cardsgroupmodel[i] = Object.assign(Object.assign({}, cardsgroupmodel[i]), { minPriceGlobal: model.minPriceGlobal, avgPriceGlobal: model.avgPriceGlobal, maxPriceGlobal: model.maxPriceGlobal });
            }
        });
    }
    let otherQuery = Object.assign(Object.assign({}, mongQuery), { mechanicalFile: true });
    let countMechanicaFile = [];
    if (user.type_user == "admin") {
        countMechanicaFile = yield Vehicles_1.default.aggregate([
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
    }
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
sellerRouter.post("/dispatchedCar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id, final_price_sold } = req.body;
    const vehiclesFiltered = yield Vehicles_1.default.findOneAndUpdate({ _id: id }, { sold: true, price: final_price_sold, dispatched: true });
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
}));
sellerRouter.post("/repost", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const vehiclesFiltered = yield Vehicles_1.default.findOneAndUpdate({ _id: id }, {
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
}));
const gruopCardPrice = (listCar, groupPrice) => {
    let caray = {
        minPrice: {
            value: groupPrice.minPrice,
            cars: [],
        },
        medPrice: {
            value: groupPrice.medPrice,
            cars: [],
        },
        maxPrice: {
            value: groupPrice.maxPrice,
            cars: [],
        },
    };
    listCar.map((car) => {
        car.price = car.price ? car.price : 0;
        if (car.price <= groupPrice.minPrice) {
            caray.minPrice.cars.push(car);
        }
        if (car.price > groupPrice.minPrice && car.price <= groupPrice.medPrice) {
            caray.medPrice.cars.push(car);
        }
        if (car.price > groupPrice.medPrice && car.price <= groupPrice.maxPrice) {
            caray.maxPrice.cars.push(car);
        }
    });
    return caray;
};
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
const desgloseImg = (image) => __awaiter(void 0, void 0, void 0, function* () {
    let posr = image.split(";base64").pop();
    let imgBuff = Buffer.from(posr, "base64");
    const resize = yield (0, sharp_1.default)(imgBuff)
        .resize(150, 80)
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
exports.default = sellerRouter;
//# sourceMappingURL=seller.js.map