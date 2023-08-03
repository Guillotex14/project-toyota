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
//models
const Users_1 = __importDefault(require("../models/Users"));
const Response_1 = require("../models/Response");
const Sellers_1 = __importDefault(require("../models/Sellers"));
const Mechanics_1 = __importDefault(require("../models/Mechanics"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const imgUser_1 = __importDefault(require("../models/imgUser"));
const cloudinaryMetods_1 = require("../../cloudinaryMetods");
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
                const userImg = yield imgUser_1.default.findOne({ id_user: res._id });
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
                                type_user: res.type_user,
                                img: userImg ? userImg : null
                            };
                            jsonRes.data = seller;
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
                                type_user: res.type_user,
                                img: userImg ? userImg : null
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
authRouter.post("/addImgProfile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user, image } = req.body;
    const filename = yield (0, cloudinaryMetods_1.uploadImageUser)(image);
    const newImage = new imgUser_1.default({ img: filename.secure_url, id_user: id_user, public_id: filename.public_id });
    yield newImage.save();
    if (newImage) {
        reponseJson.code = 200;
        reponseJson.message = "Imagen agregada exitosamente";
        reponseJson.status = true;
        reponseJson.data = newImage;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo agregar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
authRouter.post("/updateImgProfile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user, image, public_id } = req.body;
    const delImg = yield (0, cloudinaryMetods_1.deleteImageUser)(public_id);
    const delImgdb = yield imgUser_1.default.findOneAndDelete({ public_id: public_id });
    if (delImg.result == "ok") {
        const filename = yield (0, cloudinaryMetods_1.uploadImageUser)(image);
        const newImage = new imgUser_1.default({ img: filename.secure_url, id_user: id_user, public_id: filename.public_id });
        if (newImage) {
            reponseJson.message = "Imagen actualizada exitosamente";
            reponseJson.status = true;
            reponseJson.data = newImage;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "No se pudo actualizar la imagen";
            reponseJson.status = false;
        }
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo eliminar la imagen";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
exports.default = authRouter;
//# sourceMappingURL=auth.js.map