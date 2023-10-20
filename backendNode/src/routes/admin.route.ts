import { Router, Request, Response } from "express";
import adminController from "../controllers/admin.controller";
adminController

const adminRouter = Router();

adminRouter.post('/allVehicles', adminController.allVehicles);

adminRouter.get("/allSellers", adminController.allSellers);

adminRouter.post("/addSeller", adminController.addSeller);

adminRouter.post("/sellerById", adminController.sellerById);

adminRouter.post("/updateSeller", adminController.updateSeller);

adminRouter.post("/deleteSeller", adminController.deleteSeller);

adminRouter.post("/vehicleById", adminController.vehicleById);

adminRouter.post("/mechanicalFileByIdVehicle", adminController.mechanicalFileByIdVehicle);

adminRouter.post("/addBrand", adminController.addBrand);

adminRouter.get("/allBrands", adminController.allBrands);

adminRouter.get("/allModels", adminController.allModels);

adminRouter.post("/addModelVehicle", adminController.addModelVehicle);



export default adminRouter;