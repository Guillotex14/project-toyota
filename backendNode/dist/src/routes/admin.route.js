"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
admin_controller_1.default;
const adminRouter = (0, express_1.Router)();
adminRouter.post('/allVehicles', admin_controller_1.default.allVehicles);
adminRouter.get("/allSellers", admin_controller_1.default.allSellers);
adminRouter.post("/addSeller", admin_controller_1.default.addSeller);
adminRouter.post("/sellerById", admin_controller_1.default.sellerById);
adminRouter.post("/updateSeller", admin_controller_1.default.updateSeller);
adminRouter.post("/deleteSeller", admin_controller_1.default.deleteSeller);
adminRouter.post("/vehicleById", admin_controller_1.default.vehicleById);
adminRouter.post("/mechanicalFileByIdVehicle", admin_controller_1.default.mechanicalFileByIdVehicle);
adminRouter.post("/addBrand", admin_controller_1.default.addBrand);
adminRouter.get("/allBrands", admin_controller_1.default.allBrands);
adminRouter.get("/allModels", admin_controller_1.default.allModels);
adminRouter.post("/addModelVehicle", admin_controller_1.default.addModelVehicle);
exports.default = adminRouter;
//# sourceMappingURL=admin.route.js.map