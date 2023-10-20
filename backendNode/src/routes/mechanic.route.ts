import { Router } from 'express';
import mechanicController from '../controllers/mechanic.controller';


const mechanicRouter = Router();

mechanicRouter.post("/getVehicles", mechanicController.getVehicles);

mechanicRouter.post("/inspections", mechanicController.inspections);

mechanicRouter.post("/countInspections", mechanicController.countInspections);

mechanicRouter.post("/getVehicleById", mechanicController.getVehicleById);

mechanicRouter.post("/addMechanicalFile", mechanicController.addMechanicalFile);

mechanicRouter.post("/updateMechanicalFile", mechanicController.updateMechanicalFile);

mechanicRouter.post("/getMechanicFileByIdVehicle", mechanicController.getMechanicFileByIdVehicle);

mechanicRouter.post('/getNotifications', mechanicController.getNotifications);

mechanicRouter.post('/updateNotification',mechanicController.updateNotification);

mechanicRouter.post('/notificationById', mechanicController.notificationById);

mechanicRouter.post('/countNotifications', mechanicController.countNotifications);

mechanicRouter.get("/allBrands", mechanicController.allBrands);

mechanicRouter.get("/allModels", mechanicController.allModels);

export default mechanicRouter;