import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import moment from "moment";
import { sendEmail } from "../../nodemailer";
import sellerController from "../controllers/seller.controller";
import concesionary from "../schemas/Concesionaries.schema";
import ImgVehicle from "../schemas/ImgVehicle.schema";
import mechanics from "../schemas/Mechanics.schema";
import { ResponseModel } from "../models/Response";
import vehicles from "../schemas/Vehicles.schema";
import Sellers from "../schemas/Sellers.schema";
import imgUser from "../schemas/imgUser.schema";
import Users from "../schemas/Users.schema";
import zones from "../schemas/Zones.schema";
import * as global from "../global";

const sellerRouter = Router();

sellerRouter.post("/addVehicle", sellerController.addVehicle);

sellerRouter.post("/updateVehicle", sellerController.updateVehicle);

sellerRouter.post("/addImgVehicle", sellerController.addImgVehicle);

sellerRouter.post("/deleteImgVehicle", sellerController.deleteImgVehicle);

sellerRouter.post("/updateImgVehicle", sellerController.updateImgVehicle);

sellerRouter.get("/allVehicles", sellerController.allVehicles);

sellerRouter.post("/myVehicles", sellerController.myVehicles);

sellerRouter.post("/vehicleById", sellerController.vehicleById);

sellerRouter.post("/mechanicalFileByIdVehicle", sellerController.mechanicalFileByIdVehicle);

sellerRouter.get("/allBrands", sellerController.allBrands);

sellerRouter.get("/allModels", sellerController.allModels);

sellerRouter.post("/buyVehicle", sellerController.buyVehicle);

sellerRouter.post("/approveBuyVehicle", sellerController.approveBuyVehicle);

sellerRouter.post("/rejectBuyVehicle",sellerController.rejectBuyVehicle);

sellerRouter.post("/dispatchedCar", sellerController.dispatchedCar);

sellerRouter.post("/repost", sellerController.repost);

sellerRouter.post("/getNotifications", sellerController.getNotifications);

sellerRouter.post("/updateNotification", sellerController.updateNotification);

sellerRouter.post("/notificationById", sellerController.notificationById);

sellerRouter.post("/countNotifications", sellerController.countNotifications);

sellerRouter.post("/autocompleteModels", sellerController.autocompleteModels);

sellerRouter.post("/addMechanic", sellerController.addMechanic);
sellerRouter.get("/allMechanics", sellerController.allMechanics);
sellerRouter.post("/mechanicByConcesionary", sellerController.mechanicByConcesionary);
sellerRouter.get("/allZones", sellerController.allZones);
sellerRouter.get("/allConcesionaries", sellerController.allConcesionaries);
sellerRouter.post("/getVehicleByType", sellerController.getVehicleByType);
sellerRouter.post("/filterVehiclesWithMongo", sellerController.filterVehiclesWithMongo);
sellerRouter.get("/filterGraphySell", sellerController.filterGraphySell);
sellerRouter.get("/listVehiclesSell", sellerController.listVehiclesSell);


export default sellerRouter;
