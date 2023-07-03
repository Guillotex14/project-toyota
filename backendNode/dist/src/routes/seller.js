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
const Users_1 = __importDefault(require("../models/Users"));
const Vehicles_1 = __importDefault(require("../models/Vehicles"));
const Mechanics_1 = __importDefault(require("../models/Mechanics"));
const Zones_1 = __importDefault(require("../models/Zones"));
const Concesionaries_1 = __importDefault(require("../models/Concesionaries"));
const Response_1 = require("../models/Response");
const mechanicalsFiles_1 = __importDefault(require("../models/mechanicalsFiles"));
const sellerRouter = (0, express_1.Router)();
sellerRouter.post("/addMechanic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { email, password, username, fullName, city, concesionary } = req.body;
    const hash = yield bcrypt_1.default.hash(password, 10);
    const newUser = new Users_1.default({ email, password: hash, username, type_user: "mechanic" });
    const newMechanic = new Mechanics_1.default({ fullName, city, concesionary });
    yield newUser.save().then((res) => {
        if (res) {
            newMechanic.id_user = res._id;
        }
    }).catch((err) => {
        console.log(err);
    });
    yield newMechanic.save();
    reponseJson.code = 200;
    reponseJson.message = "Mecanico agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
}));
sellerRouter.post("/addVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { model, brand, year, displacement, km, engine_model, titles, fuel, transmission, transmission_2, city, dealer, concesionary, traction_control, performance, comfort, technology, price, id_seller, id_mechanic, images } = req.body;
    const newVehicle = new Vehicles_1.default({ model, year, brand, displacement, km, engine_model, titles, fuel, transmission, transmission_2, city, dealer, concesionary, traction_control, performance, comfort, technology, price, id_seller, id_mechanic });
    yield newVehicle.save();
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
    const ress = yield Vehicles_1.default.find().then((res) => {
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
    // for (let i = 0; i < ress!.data.length; i++) {
    //     if (ress!.data[i].id_seller !== id_seller) {
    //         let vehicle = {
    //             model: ress!.data[i].model,
    //             brand: ress!.data[i].brand,
    //             year: ress!.data[i].year,
    //             displacement: ress!.data[i].displacement,
    //             km: ress!.data[i].km,
    //             engine_model: ress!.data[i].engine_model,
    //             titles: ress!.data[i].titles,
    //             fuel: ress!.data[i].fuel,
    //             transmission: ress!.data[i].transmission,
    //             transmission_2: ress!.data[i].transmission_2,
    //             city: ress!.data[i].city,
    //             dealer: ress!.data[i].dealer,
    //             concesionary: ress!.data[i].concesionary,
    //             traction_control: ress!.data[i].traction_control,
    //             performance: ress!.data[i].performance,
    //             price:  ress!.data[i].price,
    //             comfort: ress!.data[i].comfort,
    //             technology: ress!.data[i].technology,
    //             mechanicalFile: ress!.data[i].mechanicalFile,
    //             id_seller: ress!.data[i].id_seller,
    //             id_mechanic: ress!.data[i].id_mechanic,
    //         }
    //         jsonRes.data.push(vehicle);
    //     }
    // }
    res.json(ress);
}));
sellerRouter.post("/vehicleById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const { _id } = req.body;
    const ress = yield Vehicles_1.default.findOne({ _id: _id }).then((res) => {
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
sellerRouter.post("/mechanicalFile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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