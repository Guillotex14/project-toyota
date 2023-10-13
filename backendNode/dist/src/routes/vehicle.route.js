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
vehicleRouter.post("/insert-update-brand", brand_controller_1.default.insertUpdate);
vehicleRouter.post("/delete-brand", brand_controller_1.default.delete);
vehicleRouter.get("/get-brand", brand_controller_1.default.get);
vehicleRouter.get("/all-brands", brand_controller_1.default.all);
vehicleRouter.get("/all-paginator-brands", brand_controller_1.default.allPaginator);
vehicleRouter.get("/filterGraphySale", vehicle_controller_1.default.filterGraphySale);
vehicleRouter.get("/exportExcell", vehicle_controller_1.default.exportExcell);
exports.default = vehicleRouter;
//# sourceMappingURL=vehicle.route.js.map