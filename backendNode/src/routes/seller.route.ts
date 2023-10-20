import { Router, Request, Response } from "express";
import sellerController from "../controllers/seller.controller";


const sellerRouter = Router();
// ------vehicle-----
sellerRouter.post("/addVehicle", sellerController.addVehicle);

sellerRouter.post("/updateVehicle", sellerController.updateVehicle);

sellerRouter.post("/addImgVehicle", sellerController.addImgVehicle);

sellerRouter.post("/deleteImgVehicle", sellerController.deleteImgVehicle);

sellerRouter.post("/updateImgVehicle", sellerController.updateImgVehicle);

sellerRouter.get("/allVehicles", sellerController.allVehicles);

sellerRouter.post("/myVehicles", sellerController.myVehicles);

sellerRouter.post("/vehicleById", sellerController.vehicleById);

sellerRouter.post("/mechanicalFileByIdVehicle", sellerController.mechanicalFileByIdVehicle);

sellerRouter.post("/getVehicleByType", sellerController.getVehicleByType);


sellerRouter.post("/buyVehicle", sellerController.buyVehicle);

sellerRouter.post("/approveBuyVehicle", sellerController.approveBuyVehicle);

sellerRouter.post("/rejectBuyVehicle",sellerController.rejectBuyVehicle);

sellerRouter.post("/dispatchedCar", sellerController.dispatchedCar);

sellerRouter.post("/repost", sellerController.repost);

sellerRouter.post("/filterVehiclesWithMongo", sellerController.filterVehiclesWithMongo);

sellerRouter.get("/filterGraphySell", sellerController.filterGraphySell);

sellerRouter.get("/listVehiclesSell", sellerController.listVehiclesSell);

// --------mechanic-------
sellerRouter.post("/addMechanic", sellerController.addMechanic);

sellerRouter.get("/allMechanics", sellerController.allMechanics);

// ------zona----
sellerRouter.get("/allZones", sellerController.allZones);

// -----concnesionario----
sellerRouter.post("/mechanicByConcesionary", sellerController.mechanicByConcesionary);

sellerRouter.get("/allConcesionaries", sellerController.allConcesionaries);

// ------brand------
sellerRouter.get("/allBrands", sellerController.allBrands);

// ------model------
sellerRouter.post("/autocompleteModels", sellerController.autocompleteModels);

sellerRouter.get("/allModels", sellerController.allModels);

// -----notificacione-----
sellerRouter.post("/getNotifications", sellerController.getNotifications);

sellerRouter.post("/updateNotification", sellerController.updateNotification);

sellerRouter.post("/notificationById", sellerController.notificationById);

sellerRouter.post("/countNotifications", sellerController.countNotifications);

export default sellerRouter;
