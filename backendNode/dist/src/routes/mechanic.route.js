"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mechanic_controller_1 = __importDefault(require("../controllers/mechanic.controller"));
const mechanicRouter = (0, express_1.Router)();
mechanicRouter.post("/getVehicles", mechanic_controller_1.default.getVehicles);
mechanicRouter.post("/inspections", mechanic_controller_1.default.inspections);
mechanicRouter.post("/countInspections", mechanic_controller_1.default.countInspections);
mechanicRouter.post("/getVehicleById", mechanic_controller_1.default.getVehicleById);
mechanicRouter.post("/addMechanicalFile", mechanic_controller_1.default.addMechanicalFile);
mechanicRouter.post("/updateMechanicalFile", mechanic_controller_1.default.updateMechanicalFile);
mechanicRouter.post("/getMechanicFileByIdVehicle", mechanic_controller_1.default.getMechanicFileByIdVehicle);
mechanicRouter.post('/getNotifications', mechanic_controller_1.default.getNotifications);
mechanicRouter.post('/updateNotification', mechanic_controller_1.default.updateNotification);
mechanicRouter.post('/notificationById', mechanic_controller_1.default.notificationById);
mechanicRouter.post('/countNotifications', mechanic_controller_1.default.countNotifications);
mechanicRouter.get("/allBrands", mechanic_controller_1.default.allBrands);
mechanicRouter.get("/allModels", mechanic_controller_1.default.allModels);
exports.default = mechanicRouter;
//# sourceMappingURL=mechanic.route.js.map