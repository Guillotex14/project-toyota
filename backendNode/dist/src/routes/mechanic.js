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
const Response_1 = require("../models/Response");
const Vehicles_1 = __importDefault(require("../models/Vehicles"));
const mechanicalsFiles_1 = __importDefault(require("../models/mechanicalsFiles"));
const mechanicRouter = (0, express_1.Router)();
mechanicRouter.post("/inspections", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_mechanic } = req.body;
    const vehiclesList = yield Vehicles_1.default.find({ id_mechanic: id_mechanic, mechanicalFile: false });
    if (vehiclesList.length > 0) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.data = vehiclesList;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontraron vehiculos";
    }
    res.json(reponseJson);
}));
mechanicRouter.post("/countInspections", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_mechanic } = req.body;
    const vehiclesList = yield Vehicles_1.default.countDocuments({ id_mechanic: id_mechanic, mechanicalFile: false });
    reponseJson.code = 200;
    reponseJson.status = true;
    reponseJson.message = "Cantidad de vehiculos";
    reponseJson.data = vehiclesList;
    res.json(reponseJson);
}));
mechanicRouter.post("/getVehicleById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const vehicle = yield Vehicles_1.default.findOne({ _id: id });
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.data = vehicle;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro el vehiculo";
    }
    res.json(reponseJson);
}));
mechanicRouter.post("/getMechanicFileByIdVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const mecFile = yield mechanicalsFiles_1.default.findOne({ id_vehicle });
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
mechanicRouter.post("/addMechanicalFile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
mechanicRouter.post("/approveMechanicalFile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_mechanical_file } = req.body;
    const mechanicalFileUpdated = yield mechanicalsFiles_1.default.findByIdAndUpdate(id_mechanical_file, { approve: true, reject: false, edit: false });
    if (mechanicalFileUpdated) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica aprobada correctamente";
        reponseJson.data = mechanicalFileUpdated;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo aprobar la Ficha mecanica";
    }
    res.json(reponseJson);
}));
mechanicRouter.post("/rejectMechanicalFile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_mechanical_file } = req.body;
    const mechanicalFileUpdated = yield mechanicalsFiles_1.default.findByIdAndUpdate(id_mechanical_file, { approve: false, reject: true, edit: false });
    if (mechanicalFileUpdated) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica rechazada correctamente";
        reponseJson.data = mechanicalFileUpdated;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo rechazar la Ficha mecanica";
    }
    res.json(reponseJson);
}));
mechanicRouter.post("/editMechanicalFile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_mechanical_file } = req.body;
    const mechanicalFileUpdated = yield mechanicalsFiles_1.default.findByIdAndUpdate(id_mechanical_file, { approve: false, reject: false, edit: true });
    if (mechanicalFileUpdated) {
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica editada correctamente";
        reponseJson.data = mechanicalFileUpdated;
    }
    else {
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo editar la Ficha mecanica";
    }
    res.json(reponseJson);
}));
exports.default = mechanicRouter;
//# sourceMappingURL=mechanic.js.map