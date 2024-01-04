import { Router } from "express";

//controller
import brandController from "../controllers/brand.controller";
import vehicleController from "../controllers/vehicle.controller";
import modelVehiclesController from "../controllers/modelsVehicles.controller";
import concesionaryController from "../controllers/concesionary.controller";
import statesController from "../controllers/states.controller";

const vehicleRouter = Router();

// --------------vehiculos-------------------
vehicleRouter.post("/addVehicle", vehicleController.addVehicle);

vehicleRouter.post("/updateVehicle", vehicleController.updateVehicle);

vehicleRouter.post("/addImgVehicle", vehicleController.addImgVehicle);

vehicleRouter.post("/deleteImgVehicle", vehicleController.deleteImgVehicle);

vehicleRouter.post("/updateImgVehicle", vehicleController.updateImgVehicle);

vehicleRouter.post("/addImgDocuments", vehicleController.addImgDocuments);

vehicleRouter.post("/deleteImgDocuments", vehicleController.deleteImgDocuments);

vehicleRouter.post("/updateImgDocuments", vehicleController.updateImgDocuments);    

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

vehicleRouter.get("/generatePdf", vehicleController.generatePdf);

vehicleRouter.get("/generatePdfFichaTecnica", vehicleController.generatePdfFichaTecnica);

vehicleRouter.post("/inspections",vehicleController.inspections);

vehicleRouter.post("/countInspections",vehicleController.countInspections);

vehicleRouter.post("/addMechanicalFile",vehicleController.addMechanicalFile);

vehicleRouter.post("/updateMechanicalFile",vehicleController.updateMechanicalFile);

vehicleRouter.post("/getMechanicFileByIdVehicle",vehicleController.getMechanicFileByIdVehicle);

vehicleRouter.get("/ofertInfo",vehicleController.ofertInfo);

vehicleRouter.get("/myOfferts",vehicleController.myOfferts);

vehicleRouter.post("/addRerportMechanicalFile",vehicleController.addRerportMechanicalFile);

vehicleRouter.post("/commentRerportMechanicalFile",vehicleController.commentRerportMechanicalFile);

vehicleRouter.post("/acceptUpdateMechanicalFile",vehicleController.acceptUpdateMechanicalFile);

vehicleRouter.get("/allRerportMechanicalFile",vehicleController.allRerportMechanicalFile);

vehicleRouter.post("/applyCertificate", vehicleController.applyCertificate);


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
vehicleRouter.post("/autoCompleteModels",modelVehiclesController.autoComplete);


//---------------concesionarios--------------------
vehicleRouter.get("/allConcesionaries", concesionaryController.all);

//---------------estados---------------------------
vehicleRouter.get("/allStates", statesController.all);


// request models and branch
vehicleRouter.post("/add_request_models_brands",vehicleController.add_request_models_brands);
vehicleRouter.post("/approve_request_models_brands",vehicleController.approve_request_models_brands);
vehicleRouter.post("/success_request_models_brands",vehicleController.success_request_models_brands);
vehicleRouter.post("/cancel_request_models_brands",vehicleController.cancel_request_models_brands);



export default vehicleRouter;