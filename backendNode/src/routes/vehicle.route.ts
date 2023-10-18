import { Router } from "express";

//controller
import brandController from "../controllers/brand.controller";
import vehicleController from "../controllers/vehicle.controller";
import modelVehiclesController from "../controllers/modelsVehicles.controller";

const vehicleRouter = Router();

// --------------vehiculos-------------------
vehicleRouter.post("/insert", vehicleController.insert);
vehicleRouter.post("/update", vehicleController.update);
vehicleRouter.post("/delete", vehicleController.delete);
vehicleRouter.get("/allVehicles", vehicleController.all);
vehicleRouter.get("/vehicleById", vehicleController.get);
vehicleRouter.post("/addImgVehicle", vehicleController.addImgVehicle);
vehicleRouter.post("/deleteImgVehicle", vehicleController.deleteImgVehicle);
vehicleRouter.post("/updateImgVehicle", vehicleController.updateImgVehicle);
vehicleRouter.get("/filterGraphySale", vehicleController.filterGraphySale);
vehicleRouter.get("/listVehiclesSale", vehicleController.listVehiclesSale);
vehicleRouter.get("/exportExcell", vehicleController.exportExcell);
vehicleRouter.post("/myVehicles", vehicleController.myVehicles);
vehicleRouter.post("/mechanicalFileByIdVehicle", vehicleController.mechanicalFileByIdVehicle);


// ---------------------brand--------------------
vehicleRouter.post("/insert-update-brand", brandController.insertUpdate);
vehicleRouter.post("/delete-brand", brandController.delete);
vehicleRouter.get("/get-brand", brandController.get);
vehicleRouter.get("/all-brands", brandController.all);
vehicleRouter.get("/all-paginator-brands", brandController.allPaginator);


//-------------modelos------------------------
vehicleRouter.post("/addModelVehicle", modelVehiclesController.addModel);
vehicleRouter.post("/updateModelVehicle", modelVehiclesController.updateModel);
vehicleRouter.post("/deleteModelVehicle", modelVehiclesController.deleteModel);
vehicleRouter.get("/allModelVehicle", modelVehiclesController.all);
vehicleRouter.get("/allModelPaginator", modelVehiclesController.allPaginator);
vehicleRouter.get("/get", modelVehiclesController.get);
vehicleRouter.get("/modelVehicleById", modelVehiclesController.modelVehicleById);


//---------------ficha mechanica--------------------


export default vehicleRouter;