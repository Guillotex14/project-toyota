"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//controller
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authRouter = (0, express_1.Router)();
authRouter.post("/login", auth_controller_1.default.login);
authRouter.post("/addImgProfile", auth_controller_1.default.addImgProfile);
authRouter.post("/updateImgProfile", auth_controller_1.default.updateImgProfile);
authRouter.get("/sendMail", auth_controller_1.default.sendMail);
exports.default = authRouter;
//# sourceMappingURL=auth.route.js.map