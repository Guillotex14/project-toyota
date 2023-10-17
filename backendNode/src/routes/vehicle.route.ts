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
vehicleRouter.get("/filterGraphySale", vehicleController.filterGraphySale);
vehicleRouter.get("/exportExcell", vehicleController.exportExcell);


// ---------------------brand--------------------
vehicleRouter.post("/insert-update-brand", brandController.insertUpdate);
vehicleRouter.post("/delete-brand", brandController.delete);
vehicleRouter.get("/get-brand", brandController.get);
vehicleRouter.get("/all-brands", brandController.all);
vehicleRouter.get("/all-paginator-brands", brandController.allPaginator);


//-------------modelo------------------------
vehicleRouter.post("/addModelVehicle", modelVehiclesController.add);
vehicleRouter.post("/updateModelVehicle", modelVehiclesController.update);
vehicleRouter.post("/deleteModelVehicle", modelVehiclesController.delete);
vehicleRouter.get("/allModelVehicle", modelVehiclesController.all);
vehicleRouter.get("/modelVehicleById", modelVehiclesController.get);


//---------------ficha mechanica--------------------


export default vehicleRouter;