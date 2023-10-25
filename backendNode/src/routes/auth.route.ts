import { Router } from "express";

//controller
import authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post("/addImgProfile", authController.addImgProfile);

authRouter.post("/updateImgProfile", authController.updateImgProfile);


export default authRouter;