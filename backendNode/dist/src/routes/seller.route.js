"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seller_controller_1 = __importDefault(require("../controllers/seller.controller"));
const sellerRouter = (0, express_1.Router)();
// ------vehicle-----
sellerRouter.post("/addVehicle", seller_controller_1.default.addVehicle);
sellerRouter.post("/updateVehicle", seller_controller_1.default.updateVehicle);
sellerRouter.post("/addImgVehicle", seller_controller_1.default.addImgVehicle);
sellerRouter.post("/deleteImgVehicle", seller_controller_1.default.deleteImgVehicle);
sellerRouter.post("/updateImgVehicle", seller_controller_1.default.updateImgVehicle);
sellerRouter.get("/allVehicles", seller_controller_1.default.allVehicles);
sellerRouter.post("/myVehicles", seller_controller_1.default.myVehicles);
sellerRouter.post("/vehicleById", seller_controller_1.default.vehicleById);
sellerRouter.post("/mechanicalFileByIdVehicle", seller_controller_1.default.mechanicalFileByIdVehicle);
sellerRouter.post("/getVehicleByType", seller_controller_1.default.getVehicleByType);
sellerRouter.post("/buyVehicle", seller_controller_1.default.buyVehicle);
sellerRouter.post("/approveBuyVehicle", seller_controller_1.default.approveBuyVehicle);
sellerRouter.post("/rejectBuyVehicle", seller_controller_1.default.rejectBuyVehicle);
sellerRouter.post("/dispatchedCar", seller_controller_1.default.dispatchedCar);
sellerRouter.post("/repost", seller_controller_1.default.repost);
sellerRouter.post("/filterVehiclesWithMongo", seller_controller_1.default.filterVehiclesWithMongo);
sellerRouter.get("/filterGraphySell", seller_controller_1.default.filterGraphySell);
sellerRouter.get("/listVehiclesSell", seller_controller_1.default.listVehiclesSell);
// --------mechanic-------
sellerRouter.post("/addMechanic", seller_controller_1.default.addMechanic);
sellerRouter.get("/allMechanics", seller_controller_1.default.allMechanics);
// ------zona----
sellerRouter.get("/allZones", seller_controller_1.default.allZones);
// -----concnesionario----
sellerRouter.post("/mechanicByConcesionary", seller_controller_1.default.mechanicByConcesionary);
sellerRouter.get("/allConcesionaries", seller_controller_1.default.allConcesionaries);
// ------brand------
sellerRouter.get("/allBrands", seller_controller_1.default.allBrands);
// ------model------
sellerRouter.post("/autocompleteModels", seller_controller_1.default.autocompleteModels);
sellerRouter.get("/allModels", seller_controller_1.default.allModels);
// -----notificacione-----
sellerRouter.post("/getNotifications", seller_controller_1.default.getNotifications);
sellerRouter.post("/updateNotification", seller_controller_1.default.updateNotification);
sellerRouter.post("/notificationById", seller_controller_1.default.notificationById);
sellerRouter.post("/countNotifications", seller_controller_1.default.countNotifications);
exports.default = sellerRouter;
//# sourceMappingURL=seller.route.js.map