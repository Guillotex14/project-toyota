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
const Response_1 = require("../models/Response");
const Users_schema_1 = __importDefault(require("../schemas/Users.schema"));
const Sellers_schema_1 = __importDefault(require("../schemas/Sellers.schema"));
const Mechanics_schema_1 = __importDefault(require("../schemas/Mechanics.schema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const moment_1 = __importDefault(require("moment"));
const nodemailer_1 = require("../../nodemailer");
const userController = {};
userController.insert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    const data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    if (!data.type_user || data.type_user == "") {
        reponseJson.code = 400;
        reponseJson.message = "typo de usuario para crear requerido";
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const user = yield Users_schema_1.default.findOne({ email: data.email });
    let message = "";
    if (!user) {
        if (decode.type_user == "admin") {
            if (data.type_user == "admin") {
                let new_admin = yield addOrUpdateAdmin(data);
                data.id_user = new_admin.id_user;
                message = `El usuario administrador fue creado con exito`;
            }
            if (data.type_user == "mechanic") {
                let newMechanic = yield addOrUpdateMechanic(data);
                data.id_user = newMechanic.id_user;
                data.id_mechanic = newMechanic.id_mechanic;
                if (newMechanic) {
                    const mailOptions = {
                        from: "Toyousado",
                        to: data.email,
                        subject: "Bienvenido",
                        text: "Bienvenido a Toyousado, tu usuario es: " +
                            data.email +
                            " y tu contraseña es: " +
                            data.password +
                            "",
                    };
                    yield (0, nodemailer_1.sendEmail)(mailOptions);
                }
                message = `El usuario tecnico fue creado con exito`;
            }
            if (data.type_user == "seller") {
                let newSeller = yield addOrUpdateSeller(data);
                data.id_user = newSeller.id_user;
                data.id_seller = newSeller.id_seller;
                message = `El usuario vendedor fue creado con exito`;
            }
        }
        else if (decode.type_user == "seller") {
            let newMechanic = yield addOrUpdateMechanic(data);
            data.id_user = newMechanic.id_user;
            data.id_mechanic = newMechanic.id_mechanic;
            if (newMechanic) {
                const mailOptions = {
                    from: "Toyousado",
                    to: data.email,
                    subject: "Bienvenido",
                    text: "Bienvenido a Toyousado, tu usuario es: " +
                        data.email +
                        " y tu contraseña es: " +
                        data.password +
                        "",
                };
                yield (0, nodemailer_1.sendEmail)(mailOptions);
            }
            message = `El usuario tecnico fue creado con exito`;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "Usuario sin perimiso";
            reponseJson.status = false;
        }
        reponseJson.code = 200;
        reponseJson.message = message;
        reponseJson.status = true;
        reponseJson.data = data;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Usuario existente";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
userController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    const data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    if (!data.id_user || data.id_user == "") {
        reponseJson.code = 400;
        reponseJson.message = "id_user requerido";
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    if (!data.type_user || data.type_user == "") {
        reponseJson.code = 400;
        reponseJson.message = "typo de usuario para editar requerido";
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const user = yield Users_schema_1.default.findOne({ _id: data.id_user });
    let message = "";
    if (user) {
        if (decode.type_user == "admin") {
            if (data.type_user == user.type_user) {
                yield addOrUpdateAdmin(data);
                message = `El usuario administrador fue modificado con exito`;
            }
            else if (data.type_user == user.type_user) {
                yield addOrUpdateMechanic(data);
                message = `El usuario tecnico fue modificado con exito`;
            }
            else if (data.type_user == user.type_user) {
                yield addOrUpdateSeller(data);
                message = `El usuario vendedor fue modificado con exito`;
            }
            else {
                message = `El usuario no se encuentra en ese rol`;
            }
            reponseJson.status = data;
        }
        else if (decode.type_user == "seller") {
            yield addOrUpdateMechanic(data);
            message = `El usuario tecnico fue modificado con exito`;
            reponseJson.status = data;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "Usuario sin perimiso";
            reponseJson.status = false;
        }
        reponseJson.code = 200;
        reponseJson.message = message;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Usuario no existente";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
userController.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
});
userController.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
});
userController.all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
});
function addOrUpdateAdmin(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.id_user) {
            const user = { _id: data.id_user };
            if (data.password != "") {
                const hash = yield bcrypt_1.default.hash(data.password, 12);
                data.password = hash;
                yield Users_schema_1.default.findOneAndUpdate(user, data);
            }
            else {
                const userUpdate = { email: data.email, username: data.username };
                yield Users_schema_1.default.findOneAndUpdate(user, userUpdate);
            }
        }
        else {
            const hash = yield bcrypt_1.default.hash(data.password, 12);
            const newUser = new Users_schema_1.default({
                email: data.email,
                password: hash,
                username: data.username,
                type_user: "admin",
            });
            yield newUser.save();
            data.id_user = newUser._id;
        }
        return data;
    });
}
function addOrUpdateSeller(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.id_user) {
            const seller = { _id: data.id_seller };
            const user = { _id: data.id_user };
            if (data.password != "") {
                const hash = yield bcrypt_1.default.hash(data.password, 12);
                data.password = hash;
                yield Users_schema_1.default.findOneAndUpdate(user, data);
            }
            else {
                const userUpdate = { email: data.email, username: data.username };
                yield Users_schema_1.default.findOneAndUpdate(user, userUpdate);
            }
            yield Sellers_schema_1.default.findOneAndUpdate(seller, data);
        }
        else {
            const date_created = (0, moment_1.default)().format("YYYY-MM-DD");
            const hash = yield bcrypt_1.default.hash(data.password, 12);
            const newUser = new Users_schema_1.default({
                email: data.email,
                password: hash,
                username: data.username,
                type_user: "seller",
            });
            const newSeller = new Sellers_schema_1.default({
                fullName: data.fullName,
                city: data.city,
                concesionary: data.concesionary,
                date_created: date_created,
                phone: data.phone,
            });
            yield newUser.save();
            newSeller.id_user = newUser._id;
            yield newSeller.save();
            data.id_user = newUser._id;
            data.id_seller = newSeller._id;
        }
        return data;
    });
}
function addOrUpdateMechanic(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.id_user) {
            const mechanic = { _id: data.id_mechanic };
            const user = { _id: data.id_user };
            if (data.password != "") {
                const hash = yield bcrypt_1.default.hash(data.password, 12);
                data.password = hash;
                yield Users_schema_1.default.findOneAndUpdate(user, data);
            }
            else {
                const userUpdate = { email: data.email, username: data.username };
                yield Users_schema_1.default.findOneAndUpdate(user, userUpdate);
            }
            yield Mechanics_schema_1.default.findOneAndUpdate(mechanic, data);
        }
        else {
            const date_created = (0, moment_1.default)().format("YYYY-MM-DD");
            const hash = yield bcrypt_1.default.hash(data.password, 12);
            const newUser = new Users_schema_1.default({
                email: data.email,
                password: hash,
                username: data.username,
                type_user: "mechanic",
            });
            const newMechanic = new Mechanics_schema_1.default({
                fullName: data.fullName,
                city: data.city,
                concesionary: data.concesionary,
                date_created: date_created,
            });
            yield newUser.save();
            newMechanic.id_user = newUser._id;
            yield newMechanic.save();
            data.id_user = newUser._id;
            data.id_mechanic = newMechanic._id;
        }
        return data;
    });
}
exports.default = userController;
//# sourceMappingURL=user.controller.js.map