"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//modelss
const Users_1 = __importDefault(require("../models/Users"));
const Response_1 = require("../models/Response");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authRouter = (0, express_1.Router)();
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { email, password } = req.body;
    const ress = yield Users_1.default.findOne({ email: email }).then((res) => {
        if (res) {
            const hash = bcrypt_1.default.compareSync(password, res.password);
            console.log(hash);
            if (hash) {
                jsonRes.code = 200;
                jsonRes.message = "login success";
                jsonRes.status = true;
                jsonRes.data = res;
                return jsonRes;
            }
            else {
                jsonRes.code = 400;
                jsonRes.message = "password incorrecto";
                jsonRes.status = false;
                return jsonRes;
            }
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err) => {
        console.log(err);
    });
    console.log(ress === null || ress === void 0 ? void 0 : ress.data.type_user);
    // if (ress?.data.type_user == "seller") {
    //     const info = await sellers.findOne({id_user: ress?.data._id}).then((res:any) => {
    //         if (res) {
    //             jsonRes.code = 200;
    //             jsonRes.message = "login success";
    //             jsonRes.status = true;
    //             jsonRes.data = res;
    //             return res;
    //         }
    //     }).catch((err: any) => {
    //         console.log(err)
    //     });
    // } else if (ress?.data.type_user == "mechanic") {
    // } else {
    // }
    res.json(ress);
}));
authRouter.post("/loginMedic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const { email, password } = req.body;
    const ress = yield Users_1.default.findOne({ email: email }).then((res) => {
        if (res) {
            if (res.password == password) {
                jsonRes.code = 200;
                jsonRes.message = "login success";
                jsonRes.status = true;
                jsonRes.data = res;
                return jsonRes;
            }
            else if (res.password != password && res.password != null) {
                jsonRes.code = 400;
                jsonRes.message = "password incorrecto";
                jsonRes.status = false;
                return jsonRes;
            }
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err) => {
        console.log(err);
    });
    console.log(ress);
    res.json(ress);
}));
authRouter.get("/registerPatient", (req, res) => {
    console.log("Register");
    res.send("Register");
});
authRouter.get("/registerMedic", (req, res) => {
    console.log("Register");
    res.send("Register");
});
authRouter.get("/forgotPassword", (req, res) => {
    console.log("forgotPassword");
    res.send("forgotPassword");
});
authRouter.get("/verifyCode", (req, res) => {
    console.log("verifyCode");
    res.send("verifyCode");
});
authRouter.get("/resetPassword", (req, res) => {
    console.log("resetPassword");
    res.send("resetPassword");
});
exports.default = authRouter;
//# sourceMappingURL=auth.js.map