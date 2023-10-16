"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//controller
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const modelsVehicles_controller_1 = __importDefault(require("../controllers/modelsVehicles.controller"));
const userRouter = (0, express_1.Router)();
userRouter.post("/insert", user_controller_1.default.insert);
userRouter.post("/update", user_controller_1.default.update);
userRouter.post("/delete", user_controller_1.default.delete);
userRouter.get("/get", user_controller_1.default.get);
userRouter.get("/all", user_controller_1.default.all);
userRouter.get("/modificarUsuario", user_controller_1.default.modificarUsuario);
userRouter.get("/allModelPaginator", modelsVehicles_controller_1.default.allPaginator);
userRouter.get("/allModel", modelsVehicles_controller_1.default.all);
userRouter.post("/updateModel", modelsVehicles_controller_1.default.updateModel);
userRouter.post("/deleteModel", modelsVehicles_controller_1.default.deleteModel);
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map