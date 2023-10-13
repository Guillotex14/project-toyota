import { Router } from "express";

//controller
import brandController from "../controllers/brand.controller";
import vehicleController from "../controllers/vehicle.controller";

const vehicleRouter = Router();

vehicleRouter.post("/insert-update-brand", brandController.insertUpdate);
vehicleRouter.post("/delete-brand", brandController.delete);
vehicleRouter.get("/get-brand", brandController.get);
vehicleRouter.get("/all-brands", brandController.all);
vehicleRouter.get("/all-paginator-brands", brandController.allPaginator);
vehicleRouter.get("/filterGraphySale", vehicleController.filterGraphySale);
vehicleRouter.get("/exportExcell", vehicleController.exportExcell);


export default vehicleRouter;