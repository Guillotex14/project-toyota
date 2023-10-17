"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//controller
const brand_controller_1 = __importDefault(require("../controllers/brand.controller"));
const vehicle_controller_1 = __importDefault(require("../controllers/vehicle.controller"));
const vehicleRouter = (0, express_1.Router)();
// --------------vehiculos-------------------
vehicleRouter.post("/insert", vehicle_controller_1.default.insert);
vehicleRouter.post("/update", vehicle_controller_1.default.update);
vehicleRouter.post("/delete", vehicle_controller_1.default.delete);
vehicleRouter.get("/allVehicles", vehicle_controller_1.default.all);
vehicleRouter.get("/vehicleById", vehicle_controller_1.default.get);
vehicleRouter.get("/filterGraphySale", vehicle_controller_1.default.filterGraphySale);
vehicleRouter.get("/listVehiclesSale", vehicle_controller_1.default.listVehiclesSale);
vehicleRouter.get("/exportExcell", vehicle_controller_1.default.exportExcell);
vehicleRouter.post("/addImgVehicle", vehicle_controller_1.default.addImgVehicle);
vehicleRouter.post("/deleteImgVehicle", vehicle_controller_1.default.deleteImgVehicle);
vehicleRouter.post("/updateImgVehicle", vehicle_controller_1.default.updateImgVehicle);
vehicleRouter.get("/myVehicles", vehicle_controller_1.default.myVehicles);
// ---------------------brand--------------------
vehicleRouter.post("/insert-update-brand", brand_controller_1.default.insertUpdate);
vehicleRouter.post("/delete-brand", brand_controller_1.default.delete);
vehicleRouter.get("/get-brand", brand_controller_1.default.get);
vehicleRouter.get("/all-brands", brand_controller_1.default.all);
vehicleRouter.get("/all-paginator-brands", brand_controller_1.default.allPaginator);
//-------------modelos------------------------
// vehicleRouter.post("/addModelVehicle", modelVehiclesController.add);
// vehicleRouter.post("/updateModelVehicle", modelVehiclesController.update);
// vehicleRouter.post("/deleteModelVehicle", modelVehiclesController.delete);
// vehicleRouter.get("/allModelVehicle", modelVehiclesController.all);
// vehicleRouter.get("/modelVehicleById", modelVehiclesController.get);
//---------------ficha mechanica--------------------
exports.default = vehicleRouter;
//# sourceMappingURL=vehicle.route.js.map