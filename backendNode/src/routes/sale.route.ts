import { Router } from "express";
import vehicleController from "../controllers/vehicle.controller";

const saleRouter = Router();

saleRouter.post("/buyVehicle", vehicleController.buyVehicle);
saleRouter.post("/approveBuyVehicle", vehicleController.approveBuyVehicle);
saleRouter.post("/rejectBuyVehicle", vehicleController.rejectBuyVehicle);

export default saleRouter;
