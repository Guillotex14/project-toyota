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
// nueva ruta post user/getNotifications
mechanicRouter.post('/getNotifications', mechanic_controller_1.default.getNotifications);
// nueva ruta post user/updateNotification
mechanicRouter.post('/updateNotification', mechanic_controller_1.default.updateNotification);
// nueva ruta post user/notificationById
mechanicRouter.post('/notificationById', mechanic_controller_1.default.notificationById);
// nueva ruta post user/countNotifications
mechanicRouter.post('/countNotifications', mechanic_controller_1.default.countNotifications);
// nueva ruta get vehicle/all-brands o all-paginator-brands
mechanicRouter.get("/allBrands", mechanic_controller_1.default.allBrands);
// nueva ruta get vehicle/allModelVehicle o allModelPaginator
mechanicRouter.get("/allModels", mechanic_controller_1.default.allModels);
exports.default = mechanicRouter;
//# sourceMappingURL=mechanic.route.js.map