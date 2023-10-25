import { Router } from "express";

//controller
import brandController from "../controllers/brand.controller";
import vehicleController from "../controllers/vehicle.controller";
import modelVehiclesController from "../controllers/modelsVehicles.controller";

const vehicleRouter = Router();

// --------------vehiculos-------------------
vehicleRouter.post("/addVehicle", vehicleController.addVehicle);

vehicleRouter.post("/updateVehicle", vehicleController.updateVehicle);

vehicleRouter.post("/addImgVehicle", vehicleController.addImgVehicle);

vehicleRouter.post("/deleteImgVehicle", vehicleController.deleteImgVehicle);

vehicleRouter.post("/updateImgVehicle", vehicleController.updateImgVehicle);

vehicleRouter.post("/allVehicles", vehicleController.allVehicles);

vehicleRouter.post("/myVehicles", vehicleController.myVehicles);

vehicleRouter.post("/vehicleById", vehicleController.vehicleById);

vehicleRouter.post("/mechanicalFileByIdVehicle", vehicleController.mechanicalFileByIdVehicle);

vehicleRouter.post("/getVehicleByType", vehicleController.getVehicleByType);

vehicleRouter.post("/filterVehiclesWithMongo", vehicleController.filterVehiclesWithMongo);

vehicleRouter.get("/listVehiclesSale", vehicleController.listVehiclesSale);

vehicleRouter.get("/exportExcell", vehicleController.exportExcell);

vehicleRouter.post("/dispatchedCar", vehicleController.dispatchedCar);

vehicleRouter.post("/repost", vehicleController.repost);

vehicleRouter.get("/filterGraphySale", vehicleController.filterGraphySale);

vehicleRouter.post("/inspections",vehicleController.inspections);

vehicleRouter.post("/countInspections",vehicleController.countInspections);

vehicleRouter.post("/addMechanicalFile",vehicleController.addMechanicalFile);

vehicleRouter.post("/updateMechanicalFile",vehicleController.updateMechanicalFile);

vehicleRouter.post("/getMechanicFileByIdVehicle",vehicleController.getMechanicFileByIdVehicle);


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
// vehicleRouter.get("/modelVehicleById", modelVehiclesController.modelVehicleById);


//---------------ficha mechanica--------------------


export default vehicleRouter;