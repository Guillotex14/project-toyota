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
    const jsonRes = new Response_1.ResponseModel();
    let arraySellers = [];
    let infoSellers = [];
    const ress = yield Users_1.default.find({ type_user: "seller" }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            for (let i = 0; i < res.length; i++) {
                yield Sellers_1.default.find({ id_user: res[i]._id }).then((res2) => {
                    console.log(res2, "res2");
                    if (res2) {
                        res2.forEach((element) => {
                            infoSellers.push(element);
                        });
                    }
                    else if (!res2) {
                        infoSellers = [];
                        return res2;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            for (let j = 0; j < res.length; j++) {
                for (let k = 0; k < infoSellers.length; k++) {
                    if (res[j]._id.toString() == infoSellers[k].id_user.toString()) {
                        let seller = {
                            id: res[j]._id,
                            id_seller: infoSellers[k]._id,
                            fullName: infoSellers[k].fullName,
                            city: infoSellers[k].city,
                            concesionary: infoSellers[k].concesionary,
                            username: res[j].username,
                            email: res[j].email,
                            type_user: res[j].type_user,
                        };
                        arraySellers.push(seller);
                    }
                }
            }
            jsonRes.data = arraySellers;
            return jsonRes;
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
    res.json(ress);
}));
adminRouter.post("/addSeller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const reqAdd = req.body;
    const hash = yield bcrypt_1.default.hash(reqAdd.password, 10);
    const newUser = new Users_1.default({ email: reqAdd.email, password: hash, username: reqAdd.username, type_user: "seller" });
    const newSeller = new Sellers_1.default({ fullName: reqAdd.fullName, city: reqAdd.city, concesionary: reqAdd.concesionary });
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
adminRouter.post("/sellerById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    let infoSeller = {};
    const ress = yield Users_1.default.findOne({ _id: id }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            yield Sellers_1.default.findOne({ id_user: res._id }).then((res2) => {
                if (res2) {
                    infoSeller.id = res._id;
                    infoSeller.id_seller = res2._id;
                    infoSeller.fullName = res2.fullName;
                    infoSeller.city = res2.city;
                    infoSeller.concesionary = res2.concesionary;
                    infoSeller.username = res.username;
                    infoSeller.email = res.email;
                    infoSeller.type_user = res.type_user;
                }
                else if (!res2) {
                    infoSeller = {};
                    return res2;
                }
            }).catch((err) => {
                console.log(err);
            });
            jsonRes.data = infoSeller;
            return jsonRes;
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
    res.json(ress);
}));
adminRouter.post("/updateSeller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
adminRouter.post("/deleteSeller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    const ress = yield Users_1.default.findOneAndDelete({ _id: id }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            yield Sellers_1.default.findOneAndDelete({ id_user: res._id }).then((res2) => {
                if (res2) {
                    return res2;
                }
                else if (!res2) {
                    return res2;
                }
            }).catch((err) => {
                console.log(err);
            });
            return jsonRes;
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
    res.json(ress);
}));
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map