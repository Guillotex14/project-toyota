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
const fs_1 = __importDefault(require("fs"));
const imgUser_1 = __importDefault(require("../models/imgUser"));
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
                                img: userImg ? userImg === null || userImg === void 0 ? void 0 : userImg.img : ""
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
                                img: userImg ? userImg === null || userImg === void 0 ? void 0 : userImg.img : ""
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
    //creamos un ramdom para el nombre de la imagen
    const random = Math.floor(Math.random() * 1000000);
    const ramStr = yield generateString(7);
    const filename = yield saveBse64ImageInPublicDirectoryUser(image, `${ramStr}${random}`);
    const newImage = new imgUser_1.default({ img: filename, id_user: id_user });
    yield newImage.save();
    if (newImage) {
        reponseJson.code = 200;
        reponseJson.message = "Imagen agregada exitosamente";
        reponseJson.status = true;
        reponseJson.data = newImage.img;
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
    const { id_user, image, old_image } = req.body;
    const random = Math.floor(Math.random() * 100000);
    const ramStr = yield generateString(5);
    const delImag = yield delBse64ImageInPublicDirectoryUser(old_image);
    const delImg = yield imgUser_1.default.findOneAndDelete({ img: old_image });
    if (delImg) {
        const filename = yield saveBse64ImageInPublicDirectoryUser(image, `${ramStr}${random}`);
        const newImage = new imgUser_1.default({ img: filename, id_user: id_user });
        if (newImage) {
            reponseJson.message = "Imagen actualizada exitosamente";
            reponseJson.status = true;
            reponseJson.data = newImage.img;
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
const saveBse64ImageInPublicDirectoryUser = (image, name) => __awaiter(void 0, void 0, void 0, function* () {
    const posr = image.split(";")[0];
    const base64 = image.split(";base64,").pop();
    const mime_type = posr.split(":")[1];
    const type = mime_type.split("/")[1];
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const imgBin = Buffer.from(base64Data, "base64");
    fs_1.default.writeFile("public/images/users/" + name + "." + type, imgBin, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Imagen guardada");
        }
    });
    return name + "." + type;
});
const delBse64ImageInPublicDirectoryUser = (name) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs_1.default.unlink("public/images/users/" + name, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Imagen eliminada");
        }
    });
});
const generateString = (length) => __awaiter(void 0, void 0, void 0, function* () {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += yield characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
});
exports.default = authRouter;
//# sourceMappingURL=auth.js.map