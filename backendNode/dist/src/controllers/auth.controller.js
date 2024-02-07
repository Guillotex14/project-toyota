"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Response_1 = require("../models/Response");
const Users_schema_1 = __importDefault(require("../schemas/Users.schema"));
const Sellers_schema_1 = __importDefault(require("../schemas/Sellers.schema"));
const Mechanics_schema_1 = __importDefault(require("../schemas/Mechanics.schema"));
const imgUser_schema_1 = __importDefault(require("../schemas/imgUser.schema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinaryMetods_1 = require("../../cloudinaryMetods");
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const Concesionaries_schema_1 = __importDefault(require("../schemas/Concesionaries.schema"));
const global = __importStar(require("../global"));
const authController = {};
authController.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { email, password } = req.body;
    const user = yield Users_schema_1.default.findOne({ email: email });
    if (user) {
        jsonRes.code = 200;
        jsonRes.message = "login success";
        jsonRes.status = true;
        const hash = bcrypt_1.default.compareSync(password, user.password);
        const userImg = yield imgUser_schema_1.default.findOne({ id_user: user._id });
        if (hash) {
            if (user.type_user === "seller") {
                const seller = yield Sellers_schema_1.default.findOne({ id_user: user._id });
                const infoSeller = {
                    id: user._id,
                    id_sell: seller._id,
                    fullName: seller.fullName,
                    city: seller.city,
                    concesionary: seller.concesionary,
                    email: user.email,
                    username: user.username,
                    type_user: user.type_user,
                    img: userImg ? userImg : null,
                };
                jsonRes.data = infoSeller;
            }
            else if (user.type_user === "mechanic") {
                const mechanic = yield Mechanics_schema_1.default.findOne({ id_user: user._id });
                const infoMechanic = {
                    id: user._id,
                    id_mechanic: mechanic._id,
                    fullName: mechanic.fullName,
                    city: mechanic.city,
                    concesionary: mechanic.concesionary,
                    email: user.email,
                    username: user.username,
                    type_user: user.type_user,
                    img: userImg ? userImg : null,
                };
                jsonRes.data = infoMechanic;
            }
            else {
                let admin = {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    type_user: user.type_user,
                    img: userImg ? userImg : null,
                };
                if (user.type_user == "admin_concesionary") {
                    let concesionary = yield Concesionaries_schema_1.default.findOne({
                        _id: user.id_concesionary,
                    });
                    admin.id_concesionary = user.id_concesionary;
                    admin.concesionary = concesionary.name;
                }
                jsonRes.data = admin;
            }
            let token = generar_jwt_1.default.generateToken(jsonRes.data);
            jsonRes.data.token = token;
        }
        else {
            jsonRes.code = 400;
            jsonRes.message = "Contraseña incorrecta";
            jsonRes.status = false;
        }
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "Ususario no registrado";
        jsonRes.status = false;
    }
    res.json(jsonRes);
});
authController.addImgProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user, image } = req.body;
    const filename = yield (0, cloudinaryMetods_1.uploadImageUser)(image);
    const newImage = new imgUser_schema_1.default({
        img: filename.secure_url,
        id_user: id_user,
        public_id: filename.public_id,
    });
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
});
authController.updateImgProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user, image, public_id } = req.body;
    const delImg = yield (0, cloudinaryMetods_1.deleteImageUser)(public_id);
    const delImgdb = yield imgUser_schema_1.default.findOneAndDelete({ public_id: public_id });
    if (delImg.result == "ok") {
        const filename = yield (0, cloudinaryMetods_1.uploadImageUser)(image);
        const newImage = new imgUser_schema_1.default({
            img: filename.secure_url,
            id_user: id_user,
            public_id: filename.public_id,
        });
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
});
authController.sendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    // const { id } = req.query;
    // const template = templatesMails("ofertByCar");
    // const mailOptions = {
    //   from: 'Servicio de notificaciones',
    //   to: 'jefersonmujica@gmail.com',
    //   subject: 'Notificacion de prueba',
    //   html: template,
    // }
    // const responseMail = await sendEmail(mailOptions);
    res.json(global.urlBase);
});
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map