import { Router } from "express";
import vehicleController from "../controllers/vehicle.controller";
import saleController from "../controllers/sale.controller";

const saleRouter = Router();

saleRouter.post("/buyVehicle", saleController.buyVehicle);
saleRouter.post("/approveBuyVehicle", saleController.approveBuyVehicle);
saleRouter.post("/rejectBuyVehicle", saleController.rejectBuyVehicle);

export default saleRouter;
