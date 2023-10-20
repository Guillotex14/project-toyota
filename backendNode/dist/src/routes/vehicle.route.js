"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//controller
const brand_controller_1 = __importDefault(require("../controllers/brand.controller"));
const vehicle_controller_1 = __importDefault(require("../controllers/vehicle.controller"));
const modelsVehicles_controller_1 = __importDefault(require("../controllers/modelsVehicles.controller"));
const vehicleRouter = (0, express_1.Router)();
// --------------vehiculos-------------------
vehicleRouter.post("/addVehicle", vehicle_controller_1.default.addVehicle);
vehicleRouter.post("/updateVehicle", vehicle_controller_1.default.updateVehicle);
vehicleRouter.post("/addImgVehicle", vehicle_controller_1.default.addImgVehicle);
vehicleRouter.post("/deleteImgVehicle", vehicle_controller_1.default.deleteImgVehicle);
vehicleRouter.post("/updateImgVehicle", vehicle_controller_1.default.updateImgVehicle);
vehicleRouter.get("/allVehicles", vehicle_controller_1.default.allVehicles);
vehicleRouter.post("/myVehicles", vehicle_controller_1.default.myVehicles);
vehicleRouter.post("/vehicleById", vehicle_controller_1.default.vehicleById);
vehicleRouter.post("/mechanicalFileByIdVehicle", vehicle_controller_1.default.mechanicalFileByIdVehicle);
vehicleRouter.post("/getVehicleByType", vehicle_controller_1.default.getVehicleByType);
vehicleRouter.post("/filterVehiclesWithMongo", vehicle_controller_1.default.filterVehiclesWithMongo);
vehicleRouter.get("/listVehiclesSale", vehicle_controller_1.default.listVehiclesSale);
vehicleRouter.get("/exportExcell", vehicle_controller_1.default.exportExcell);
vehicleRouter.post("/buyVehicle", vehicle_controller_1.default.buyVehicle);
vehicleRouter.post("/approveBuyVehicle", vehicle_controller_1.default.approveBuyVehicle);
vehicleRouter.post("/rejectBuyVehicle", vehicle_controller_1.default.rejectBuyVehicle);
vehicleRouter.post("/dispatchedCar", vehicle_controller_1.default.dispatchedCar);
vehicleRouter.post("/repost", vehicle_controller_1.default.repost);
vehicleRouter.get("/filterGraphySale", vehicle_controller_1.default.filterGraphySale);
// ---------------------brand--------------------
vehicleRouter.post("/insert-update-brand", brand_controller_1.default.insertUpdate);
vehicleRouter.post("/delete-brand", brand_controller_1.default.delete);
vehicleRouter.get("/get-brand", brand_controller_1.default.get);
vehicleRouter.get("/all-brands", brand_controller_1.default.all);
vehicleRouter.get("/all-paginator-brands", brand_controller_1.default.allPaginator);
//-------------modelos------------------------
vehicleRouter.post("/addModelVehicle", modelsVehicles_controller_1.default.addModel);
vehicleRouter.post("/updateModelVehicle", modelsVehicles_controller_1.default.updateModel);
vehicleRouter.post("/deleteModelVehicle", modelsVehicles_controller_1.default.deleteModel);
vehicleRouter.get("/allModelVehicle", modelsVehicles_controller_1.default.all);
vehicleRouter.get("/allModelPaginator", modelsVehicles_controller_1.default.allPaginator);
vehicleRouter.get("/get", modelsVehicles_controller_1.default.get);
vehicleRouter.get("/modelVehicleById", modelsVehicles_controller_1.default.modelVehicleById);
//---------------ficha mechanica--------------------
exports.default = vehicleRouter;
//# sourceMappingURL=vehicle.route.js.map