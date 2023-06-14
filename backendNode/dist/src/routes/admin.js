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
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_1 = __importDefault(require("../models/Users"));
const Vehicles_1 = __importDefault(require("../models/Vehicles"));
const Sellers_1 = __importDefault(require("../models/Sellers"));
const Response_1 = require("../models/Response");
const adminRouter = (0, express_1.Router)();
adminRouter.get("/allVehicles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const ress = yield Vehicles_1.default.find().then((res) => {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            jsonRes.data = res;
            return jsonRes;
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
    res.json(ress);
}));
adminRouter.get("/allSellers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const ress = yield Users_1.default.find({ type_user: "seller" }).then((res) => {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            jsonRes.data = res;
            return jsonRes;
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
    res.json(ress);
}));
adminRouter.post("/addSeller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { email, password, username, fullName, city, concesionary } = req.body;
    const hash = yield bcrypt_1.default.hash(password, 10);
    const newUser = new Users_1.default({ email, password: hash, username, type_user: "seller" });
    const newSeller = new Sellers_1.default({ fullName, city, concesionary });
    yield newUser.save().then((res) => {
        if (res) {
            newSeller.id_user = res._id;
        }
    }).catch((err) => {
        console.log(err);
    });
    yield newSeller.save();
    reponseJson.code = 200;
    reponseJson.message = "Vendedor agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
}));
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map