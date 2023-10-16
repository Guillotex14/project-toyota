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
// mechanicRouter.get("/allBrands", async (req: Request, res: Response) => {
//     const jsonResponse: ResponseModel = new ResponseModel();
//     const brand = await brands.find()
//     if (brand) {
//     jsonResponse.code = 200;
//     jsonResponse.message = "Marcas encontradas exitosamente";
//     jsonResponse.status = true;
//     jsonResponse.data = brand;
//     } else {
//     jsonResponse.code = 400;
//     jsonResponse.message = "no se encontraron marcas";
//     jsonResponse.status = false;
//     }
//     res.json(jsonResponse);
// });
// mechanicRouter.get("/allModels", async (req: Request, res: Response) => {
//     const jsonResponse: ResponseModel = new ResponseModel();
//     const model = await modelVehicle.find();
//     if (model) {
//     jsonResponse.code = 200;
//     jsonResponse.message = "todos los modelos";
//     jsonResponse.status = true;
//     jsonResponse.data = model;
//     }else{
//     jsonResponse.code = 400;
//     jsonResponse.message = "no hay modelos";
//     jsonResponse.status = false;
//     }
//     res.json(jsonResponse);
// });
exports.default = mechanicRouter;
//# sourceMappingURL=mechanic.route.js.map