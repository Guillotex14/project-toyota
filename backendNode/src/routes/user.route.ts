import { Router } from "express";

//controller
import userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/insert", userController.insert);
userRouter.post("/update", userController.update);
userRouter.post("/delete", userController.delete);
userRouter.get("/get", userController.get);
userRouter.get("/all", userController.all);
userRouter.get("/modificarUsuario", userController.modificarUsuario);


export default userRouter;