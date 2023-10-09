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
            if (data.type_user == "admin") {
                yield addOrUpdateAdmin(data);
                message = `El usuario administrador fue modificado con exito`;
            }
            else if (data.type_user == "mechanic") {
                yield addOrUpdateMechanic(data);
                message = `El usuario tecnico fue modificado con exito`;
            }
            else if (data.type_user == "seller") {
                yield addOrUpdateSeller(data);
                message = `El usuario vendedor fue modificado con exito`;
            }
            else {
                message = `El usuario no se encuentra en ese rol`;
            }
            reponseJson.status = true;
            reponseJson.data = data;
        }
        else if (decode.type_user == "seller") {
            yield addOrUpdateMechanic(data);
            message = `El usuario tecnico fue modificado con exito`;
            reponseJson.status = true;
            reponseJson.data = data;
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
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const data = req.body;
    const user = yield Users_schema_1.default.findOne({ _id: data.id_user });
    if (user) {
        if (user.type_user == "admin") {
            const ress = yield Users_schema_1.default.findOneAndDelete({ _id: user._id });
        }
        else if (user.type_user == "seller") {
            const userSeller = yield Sellers_schema_1.default.findOneAndDelete({ id_user: user._id });
            const ress = yield Users_schema_1.default.findOneAndDelete({ _id: user._id });
        }
        else if (user.type_user == "mechanic") {
            const usermechanic = yield Mechanics_schema_1.default.findOneAndDelete({
                id_user: user._id,
            });
            const ress = yield Users_schema_1.default.findOneAndDelete({ _id: user._id });
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "Tipo de usuario indefinido";
            reponseJson.status = false;
            reponseJson.data = null;
            return res.json(reponseJson);
        }
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Usuario no encontrado";
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    reponseJson.code = 200;
    reponseJson.message = "Usuario borrado con exito";
    reponseJson.status = true;
    return res.json(reponseJson);
});
userController.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const data = req.query;
    let sendata = {};
    let user;
    if (data.id_user) {
        user = yield Users_schema_1.default.findOne({ _id: data.id_user });
    }
    else if (data.email) {
        user = yield Users_schema_1.default.findOne({ email: data.email });
    }
    if (user) {
        sendata = {
            id_user: user === null || user === void 0 ? void 0 : user._id,
            email: user === null || user === void 0 ? void 0 : user.email,
            username: user === null || user === void 0 ? void 0 : user.username,
            type_user: user === null || user === void 0 ? void 0 : user.type_user,
        };
        if (user.type_user == "admin") {
            let ress = yield Users_schema_1.default.findOne({ _id: user._id });
            sendata = {
                id_user: ress === null || ress === void 0 ? void 0 : ress._id,
                email: ress === null || ress === void 0 ? void 0 : ress.email,
                username: ress === null || ress === void 0 ? void 0 : ress.username,
                type_user: ress === null || ress === void 0 ? void 0 : ress.type_user,
            };
        }
        else if (user.type_user == "seller") {
            let userSeller = yield Sellers_schema_1.default.findOne({ id_user: user._id });
            sendata = Object.assign(Object.assign({}, sendata), { id_seller: userSeller === null || userSeller === void 0 ? void 0 : userSeller._id, fullName: userSeller === null || userSeller === void 0 ? void 0 : userSeller.fullName, city: userSeller === null || userSeller === void 0 ? void 0 : userSeller.city, concesionary: userSeller === null || userSeller === void 0 ? void 0 : userSeller.concesionary, date_created: userSeller === null || userSeller === void 0 ? void 0 : userSeller.date_created, phone: userSeller === null || userSeller === void 0 ? void 0 : userSeller.phone });
        }
        else if (user.type_user == "mechanic") {
            let usermechanic = yield Mechanics_schema_1.default.findOne({ id_user: user._id });
            sendata = Object.assign(Object.assign({}, sendata), { id_mechanic: usermechanic === null || usermechanic === void 0 ? void 0 : usermechanic._id, fullName: usermechanic === null || usermechanic === void 0 ? void 0 : usermechanic.fullName, city: usermechanic === null || usermechanic === void 0 ? void 0 : usermechanic.city, concesionary: usermechanic === null || usermechanic === void 0 ? void 0 : usermechanic.concesionary, date_created: usermechanic === null || usermechanic === void 0 ? void 0 : usermechanic.date_created, phone: usermechanic === null || usermechanic === void 0 ? void 0 : usermechanic.phone });
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "Tipo de usuario indefinido";
            reponseJson.status = false;
            reponseJson.data = null;
            return res.json(reponseJson);
        }
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Usuario no encontrado";
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    reponseJson.code = 200;
    reponseJson.message = "Usuario encontrado con exito";
    reponseJson.data = sendata;
    reponseJson.status = true;
    return res.json(reponseJson);
});
userController.all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let data = req.query;
    if (!data) {
        data = {
            s: "",
            pos: 0,
            lim: 10,
            type_user: "admin",
        };
    }
    let type_user_table = "admin";
    let sendata = {};
    let user;
    let search;
    let project;
    if (data.type_user == "seller") {
        type_user_table = "sellers";
        search = {
            $or: [
                { _id: { $regex: ".*" + data.s + ".*" } },
                { email: { $regex: ".*" + data.s + ".*" } },
                { username: { $regex: ".*" + data.s + ".*" } },
                { type_user: { $regex: ".*" + data.s + ".*" } },
                { "sellers._id": { $regex: ".*" + data.s + ".*" } },
                { "sellers.fullName": { $regex: ".*" + data.s + ".*" } },
                { "sellers.city": { $regex: ".*" + data.s + ".*" } },
                { "sellers.concesionary": { $regex: ".*" + data.s + ".*" } },
                { "sellers.date_created": { $regex: ".*" + data.s + ".*" } },
                { "sellers.phone": { $regex: ".*" + data.s + ".*" } },
            ],
            type_user: data.type_user,
        };
        project = {
            _id: "$_id",
            email: 1,
            username: 1,
            type_user: 1,
            "sellers._id": 1,
            "sellers.fullName": 1,
            "sellers.city": 1,
            "sellers.concesionary": 1,
            "sellers.date_created": 1,
            "sellers.phone": 1,
        };
    }
    else if (data.type_user == "mechanic") {
        type_user_table = "mechanics";
        search = {
            $or: [
                { _id: { $regex: ".*" + data.s + ".*" } },
                { email: { $regex: ".*" + data.s + ".*" } },
                { username: { $regex: ".*" + data.s + ".*" } },
                { type_user: { $regex: ".*" + data.s + ".*" } },
                { "mechanics._id": { $regex: ".*" + data.s + ".*" } },
                { "mechanics.fullName": { $regex: ".*" + data.s + ".*" } },
                { "mechanics.city": { $regex: ".*" + data.s + ".*" } },
                { "mechanics.concesionary": { $regex: ".*" + data.s + ".*" } },
                { "mechanics.date_created": { $regex: ".*" + data.s + ".*" } },
                { "mechanics.phone": { $regex: ".*" + data.s + ".*" } },
            ],
            type_user: data.type_user,
        };
        project = {
            _id: "$_id",
            email: 1,
            username: 1,
            type_user: 1,
            "mechanics._id": 2,
            "mechanics.fullName": 2,
            "mechanics.city": 2,
            "mechanics.concesionary": 2,
            "mechanics.date_created": 2,
            "mechanics.phone": 2,
        };
    }
    else if (data.type_user == "admin") {
        type_user_table = "users";
        search = {
            $or: [
                { _id: { $regex: ".*" + data.s + ".*" } },
                { email: { $regex: ".*" + data.s + ".*" } },
                { username: { $regex: ".*" + data.s + ".*" } },
                { type_user: { $regex: ".*" + data.s + ".*" } },
            ],
            type_user: data.type_user,
        };
        project = {
            _id: "$_id",
            email: 1,
            username: 1,
            type_user: 1,
        };
    }
    if (data.type_user == "admin") {
        let list = yield Users_schema_1.default.aggregate([
            {
                $match: search,
            },
            {
                $skip: parseInt(data.lim) * parseInt(data.pos),
            },
            {
                $limit: parseInt(data.lim),
            },
            {
                $project: project,
            },
        ]);
        sendata.rows = list;
        let count;
        if (list.length > 0) {
            count = yield Users_schema_1.default.aggregate([
                {
                    $match: search,
                },
                {
                    $count: "totalCount",
                },
            ]);
            reponseJson.code = 200;
            reponseJson.message = "Usuario encontrado con exito";
            reponseJson.status = true;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "sin resultado";
            reponseJson.status = true;
        }
        let totalItems = 0;
        if (count) {
            totalItems = count[0].totalCount;
        }
        let totalPages = Math.ceil(totalItems / data.lim);
        sendata.count = totalItems;
        sendata.pages = totalPages;
    }
    else {
        let list = yield Users_schema_1.default.aggregate([
            {
                $match: search,
            },
            {
                $lookup: {
                    from: type_user_table,
                    localField: "_id",
                    foreignField: "id_user",
                    as: type_user_table,
                },
            },
            {
                $unwind: `$${type_user_table}`,
            },
            {
                $skip: parseInt(data.lim) * parseInt(data.pos),
            },
            {
                $limit: parseInt(data.lim),
            },
            {
                $project: project,
            },
        ]);
        sendata.rows = list;
        let count;
        if (list.length > 0) {
            count = yield Users_schema_1.default.aggregate([
                {
                    $match: search,
                },
                {
                    $lookup: {
                        from: type_user_table,
                        localField: "_id",
                        foreignField: "id_user",
                        as: type_user_table,
                    },
                },
                {
                    $unwind: `$${type_user_table}`,
                },
                {
                    $count: "totalCount",
                },
            ]);
            reponseJson.code = 200;
            reponseJson.message = "Usuario encontrado con exito";
            reponseJson.status = true;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "sin resultado";
            reponseJson.status = true;
        }
        let totalItems = 0;
        if (count) {
            totalItems = count[0].totalCount;
        }
        let totalPages = Math.ceil(totalItems / data.lim);
        sendata.count = totalItems;
        sendata.pages = totalPages;
    }
    reponseJson.data = sendata;
    return res.json(reponseJson);
});
userController.allMechanic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    let mechanicsArray = [];
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const search = {
        type_user: "mechanic",
    };
    const query = yield Users_schema_1.default.aggregate([
        {
            $match: search,
        },
        {
            $lookup: {
                from: "mechanics",
                localField: "_id",
                foreignField: "id_user",
                as: "infoUser",
            },
        },
        { $sort: { date_created: -1 } },
    ]);
    if (query) {
        mechanicsArray = query.map((mech) => {
            let mecha = {
                _id: mech._id,
            };
            mechanicsArray.push(mecha);
        });
        reponseJson.code = 200;
        reponseJson.message = "Lista de mecanicos";
        reponseJson.status = true;
        reponseJson.data = query;
    }
    else {
        reponseJson.code = 200;
        reponseJson.message = "";
        reponseJson.status = true;
    }
    return res.json(reponseJson);
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