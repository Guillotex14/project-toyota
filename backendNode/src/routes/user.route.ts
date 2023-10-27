import { Router } from "express";

//controller
import userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/insert", userController.insert);

userRouter.post("/update", userController.update);

userRouter.post("/delete", userController.delete);

userRouter.get("/get", userController.get);

userRouter.get("/all", userController.all);

userRouter.post("/getNotifications", userController.getNotifications);

userRouter.post("/updateNotification", userController.updateNotification);

userRouter.post("/notificationById", userController.notificationById);

userRouter.post("/countNotifications", userController.countNotifications);

export default userRouter;