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

// nueva ruta post user/getNotifications--
mechanicRouter.post('/getNotifications', mechanicController.getNotifications);

// nueva ruta post user/updateNotification--
mechanicRouter.post('/updateNotification',mechanicController.updateNotification);

// nueva ruta post user/notificationById
mechanicRouter.post('/notificationById', mechanicController.notificationById);

// nueva ruta post user/countNotifications
mechanicRouter.post('/countNotifications', mechanicController.countNotifications);

// nueva ruta get vehicle/all-brands o all-paginator-brands
mechanicRouter.get("/allBrands", mechanicController.allBrands);

// nueva ruta get vehicle/allModelVehicle o allModelPaginator
mechanicRouter.get("/allModels", mechanicController.allModels);

export default mechanicRouter;