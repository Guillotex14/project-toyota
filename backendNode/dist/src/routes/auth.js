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
const Sellers_1 = __importDefault(require("../models/Sellers"));
const Mechanics_1 = __importDefault(require("../models/Mechanics"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authRouter = (0, express_1.Router)();
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { email, password } = req.body;
    const ress = yield Users_1.default.findOne({ email: email }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            const hash = bcrypt_1.default.compareSync(password, res.password);
            if (hash) {
                jsonRes.code = 200;
                jsonRes.message = "login success";
                jsonRes.status = true;
                if (res.type_user == "seller") {
                    yield Sellers_1.default.findOne({ id_user: res._id }).then((res2) => __awaiter(void 0, void 0, void 0, function* () {
                        if (res2) {
                            let seller = {
                                id: res._id,
                                id_sell: res2._id,
                                fullName: res2.fullName,
                                city: res2.city,
                                concesionary: res2.concesionary,
                                email: res.email,
                                username: res.username,
                                type_user: res.type_user
                            };
                            jsonRes.data = seller;
                            // return jsonRes;
                        }
                    })).catch((err) => {
                        console.log(err);
                    });
                }
                else if (res.type_user == "mechanic") {
                    yield Mechanics_1.default.findOne({ id_user: res._id }).then((res2) => __awaiter(void 0, void 0, void 0, function* () {
                        if (res2) {
                            let mechanic = {
                                id: res._id,
                                id_mechanic: res2._id,
                                fullName: res2.fullName,
                                city: res2.city,
                                concesionary: res2.concesionary,
                                email: res.email,
                                username: res.username,
                                type_user: res.type_user
                            };
                            jsonRes.data = mechanic;
                            // return jsonRes;
                        }
                    })).catch((err) => {
                        console.log(err);
                    });
                }
                else {
                    jsonRes.data = res;
                }
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
    })).catch((err) => {
        console.log(err);
    });
    res.json(jsonRes);
}));
exports.default = authRouter;
//# sourceMappingURL=auth.js.map