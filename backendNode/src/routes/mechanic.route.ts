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

export default mechanicRouter;