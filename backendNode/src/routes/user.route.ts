import { Router } from "express";

//controller
import userController from "../controllers/user.controller";
import modelVehiclesController from "../controllers/modelsVehicles.controller";

const userRouter = Router();

userRouter.post("/insert", userController.insert);
userRouter.post("/update", userController.update);
userRouter.post("/delete", userController.delete);
userRouter.get("/get", userController.get);
userRouter.get("/all", userController.all);
userRouter.get("/modificarUsuario", userController.modificarUsuario);
userRouter.get("/allModelPaginator",modelVehiclesController.allPaginator);
userRouter.get("/allModel",modelVehiclesController.all);
userRouter.post("/updateModel",modelVehiclesController.updateModel);
userRouter.post("/deleteModel",modelVehiclesController.deleteModel);

export default userRouter;