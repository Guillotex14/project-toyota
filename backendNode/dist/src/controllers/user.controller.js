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
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const Response_1 = require("../models/Response");
const Users_schema_1 = __importDefault(require("../schemas/Users.schema"));
const Sellers_schema_1 = __importDefault(require("../schemas/Sellers.schema"));
const Mechanics_schema_1 = __importDefault(require("../schemas/Mechanics.schema"));
const imgUser_schema_1 = __importDefault(require("../schemas/imgUser.schema"));
const nodemailer_1 = require("../../nodemailer");
const notifications_schema_1 = __importDefault(require("../schemas/notifications.schema"));
const concesionaries_schema_1 = __importDefault(require("../schemas/concesionaries.schema"));
const userController = {};
userController.insert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "admin",
        "seller",
        "admin_concesionary",
    ]);
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
    let newUser = {};
    if (!user) {
        if (decode.type_user == "admin" ||
            decode.type_user == "admin_concesionary") {
            if (data.type_user == "admin") {
                newUser = yield addOrUpdateUser(data);
                message = `El usuario administrador fue creado con exito`;
            }
            else if (data.type_user == "admin_concesionary") { // admin creando un admin_concesionary
                let concesionario = yield concesionaries_schema_1.default.findOne({
                    _id: data.id_concesionary,
                });
                data.concesionary = concesionario.name;
                data.id_concesionary = concesionario._id;
                newUser = yield addOrUpdateUser(data);
                message = `El usuario administrador de concesionario fue creado con exito`;
            }
            if (data.type_user == "mechanic") {
                if (decode.type_user == "admin_concesionary") { //admin_concesionary creando un usuario mechanic y asigandole su concesionario correspondiente
                    let concesionario = yield concesionaries_schema_1.default.findOne({
                        _id: decode.id_concesionary,
                    });
                    data.concesionary = concesionario.name;
                    data.id_concesionary = concesionario._id;
                }
                newUser = yield addOrUpdateMechanic(data);
                message = `El usuario tecnico fue creado con exito`;
            }
            if (data.type_user == "seller") {
                if (decode.type_user == "admin_concesionary") { //admin_concesionary creando un usuario seller y asigandole su concesionario correspondiente
                    let concesionario = yield concesionaries_schema_1.default.findOne({
                        _id: decode.id_concesionary,
                    });
                    data.concesionary = concesionario.name;
                    data.id_concesionary = concesionario._id;
                }
                newUser = yield addOrUpdateSeller(data);
                message = `El usuario vendedor fue creado con exito`;
            }
            data.id_user = newUser.id_user;
            if (newUser) {
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
        }
        else if (decode.type_user == "seller") {
            let newUser = yield addOrUpdateMechanic(data);
            if (newUser) {
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "admin",
        "seller",
        "admin_concesionary",
    ]);
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
        if (decode.type_user == "admin" || decode.type_user == "admin_concesionary") {
            if (data.type_user == "admin") {
                message = `El usuario administrador fue modificado con exito`;
                yield addOrUpdateUser(data);
            }
            else if (data.type_user == "admin_concesionary") { // admin modificando un admin_concesionary
                message = `El usuario administrador de concesionario fue modificado con exito`;
                let concesionario = yield concesionaries_schema_1.default.findOne({
                    _id: data.id_concesionary,
                });
                data.concesionary = concesionario.name;
                data.id_concesionary = concesionario._id;
                yield addOrUpdateUser(data);
            }
            else if (data.type_user == "mechanic") {
                if (decode.type_user == "admin_concesionary") { //admin_concesionary modificando un usuario mechanic y asigandole su concesionario correspondiente
                    let concesionario = yield concesionaries_schema_1.default.findOne({
                        _id: decode.id_concesionary,
                    });
                    data.concesionary = concesionario.name;
                    data.id_concesionary = concesionario._id;
                }
                yield addOrUpdateMechanic(data);
                message = `El usuario tecnico fue modificado con exito`;
            }
            else if (data.type_user == "seller") {
                if (decode.type_user == "admin_concesionary") { //admin_concesionary modificando un usuario mechanic y asigandole su concesionario correspondiente
                    let concesionario = yield concesionaries_schema_1.default.findOne({
                        _id: decode.id_concesionary,
                    });
                    data.concesionary = concesionario.name;
                    data.id_concesionary = concesionario._id;
                }
                yield addOrUpdateSeller(data);
                message = `El usuario vendedor fue modificado con exito`;
            }
            else {
                message = `El usuario no se encuentra en ese rol`;
            }
            yield addOrUpdateUser(data);
            reponseJson.status = true;
            reponseJson.data = data;
        }
        else if (decode.type_user == "seller") {
            if (data.type_user == "mechanic") {
                message = `El usuario tecnico fue modificado con exito`;
                yield addOrUpdateMechanic(data);
            }
            else {
                message = `No tiene permiso de modificar/agregar otro rol de usuario`;
                reponseJson.code = 400;
                reponseJson.status = false;
                return res.json(reponseJson);
            }
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
    return res.json(reponseJson);
});
userController.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "admin",
        "seller",
        "admin_concesionary",
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let data = req.body;
    data = Object.assign(Object.assign({}, data), { status: 0 });
    const user = yield Users_schema_1.default.findOne({ _id: data.id_user });
    if (user) {
        let userDetele = yield deleteUser(data);
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
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
    let seller;
    let mechanic;
    if (data.id_user) {
        user = yield Users_schema_1.default.findOne({ _id: data.id_user });
    }
    else if (data.email) {
        user = yield Users_schema_1.default.findOne({ email: data.email });
    }
    const userImg = yield imgUser_schema_1.default.findOne({ id_user: user._id });
    if (user) {
        sendata = {
            id_user: user === null || user === void 0 ? void 0 : user._id,
            email: user === null || user === void 0 ? void 0 : user.email,
            username: user === null || user === void 0 ? void 0 : user.username,
            type_user: user === null || user === void 0 ? void 0 : user.type_user,
            img: userImg ? userImg : null,
        };
        if (user.type_user == "seller") {
            seller = yield Sellers_schema_1.default.findOne({ id_user: user._id });
            sendata = Object.assign(Object.assign({}, sendata), { seller });
        }
        else if (user.type_user == "mechanic") {
            mechanic = yield Mechanics_schema_1.default.findOne({ id_user: user._id });
            sendata = Object.assign(Object.assign({}, sendata), { mechanic });
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "admin_concesionary"]);
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
    if (data.type_user == "seller") {
        type_user_table = "sellers";
    }
    else if (data.type_user == "mechanic") {
        type_user_table = "mechanics";
    }
    else if (data.type_user == "admin_concesionary" ||
        data.type_user == "admin") {
        type_user_table = "users";
    }
    let sendata = {};
    let search;
    let project;
    search = {
        $or: [
            { email: { $regex: data.s, $options: "i" } },
            { username: { $regex: data.s, $options: "i" } },
            { type_user: { $regex: data.s, $options: "i" } },
            {
                [`${type_user_table}.fullName`]: {
                    $regex: ".*" + data.s + ".*",
                    $options: "i",
                },
            },
            {
                [`${type_user_table}.city`]: {
                    $regex: ".*" + data.s + ".*",
                    $options: "i",
                },
            },
            {
                [`${type_user_table}.concesionary`]: {
                    $regex: ".*" + data.s + ".*",
                    $options: "i",
                },
            },
            {
                [`${type_user_table}.date_created`]: {
                    $regex: ".*" + data.s + ".*",
                    $options: "i",
                },
            },
            {
                [`${type_user_table}.phone`]: {
                    $regex: ".*" + data.s + ".*",
                    $options: "i",
                },
            },
        ],
        type_user: data.type_user,
    };
    if (decode.type_user == "admin_concesionary") { // cuando el usuario admin_concesionary consulta
        let concesionary = yield concesionaries_schema_1.default.findOne({
            _id: decode.id_concesionary,
        });
        search = Object.assign(Object.assign({}, search), { [`${type_user_table}.concesionary`]: {
                $regex: ".*" + concesionary.name + ".*",
                $options: "i",
            } });
    }
    project = {
        id_user: "$_id",
        email: 1,
        username: 1,
        type_user: 1,
        [`${type_user_table}._id`]: 1,
        [`${type_user_table}.fullName`]: 1,
        [`${type_user_table}.city`]: 1,
        [`${type_user_table}.concesionary`]: 1,
        [`${type_user_table}.date_created`]: 1,
        [`${type_user_table}.phone`]: 1,
    };
    let list = yield Users_schema_1.default.aggregate([
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
            $match: search,
        },
        { $project: project },
        {
            $skip: parseInt(data.lim) * parseInt(data.pos),
        },
        {
            $limit: parseInt(data.lim),
        },
    ]);
    if (type_user_table == "users") {
        search = {
            $or: [
                { email: { $regex: data.s, $options: "i" } },
                { username: { $regex: data.s, $options: "i" } },
                { type_user: { $regex: data.s, $options: "i" } },
            ],
            type_user: data.type_user,
        };
        project = {
            id_user: "$_id",
            email: 1,
            username: 1,
            type_user: 1,
        };
        list = yield Users_schema_1.default.aggregate([
            {
                $match: search,
            },
            { $project: project },
            {
                $skip: parseInt(data.lim) * parseInt(data.pos),
            },
            {
                $limit: parseInt(data.lim),
            },
        ]);
    }
    let count;
    if (list.length > 0) {
        sendata.rows = list;
        for (let i = 0; i < sendata.rows.length; i++) {
            const element = sendata.rows[i];
            const userImg = yield imgUser_schema_1.default.findOne({ id_user: element.id_user });
            element.img = userImg ? userImg : null;
        }
        count = yield Users_schema_1.default.aggregate([
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
                $match: search,
            },
            { $project: project },
            {
                $count: "totalCount",
            },
        ]);
        if (type_user_table == "users") {
            count = yield Users_schema_1.default.aggregate([
                {
                    $match: search,
                },
                { $project: project },
                {
                    $count: "totalCount",
                },
            ]);
        }
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
    reponseJson.data = sendata;
    return res.json(reponseJson);
});
userController.allMechanic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let mechanicsArray = [];
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let search = {
        type_user: "mechanic",
    };
    if (decode.type_user == "admin_concesionary") {
        let concesionario = yield concesionaries_schema_1.default.findOne({
            _id: decode.id_concesionary,
        });
        search.concesionary = concesionario.name;
    }
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
userController.getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let data = req.query;
    let search;
    let project;
    let sendData = {};
    let count;
    let totalItems = 0;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "admin_concesionary",
        "mechanic",
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    if (!data) {
        data = {
            pos: 0,
            lim: 10,
        };
    }
    search = {
        id_user: new mongoose_1.default.Types.ObjectId(data === null || data === void 0 ? void 0 : data.id_user),
    };
    project = {
        _id: "$_id",
        id_user: 1,
        title: 1,
        message: 1,
        date: 1,
        data: 1,
        status: 1,
    };
    let list = yield notifications_schema_1.default.aggregate([
        {
            $match: search,
        },
        {
            $skip: parseInt(data.lim) * parseInt(data.pos),
        },
        {
            $limit: parseInt(data.lim),
        },
        { $project: project },
        {
            $sort: { date: -1 },
        }
    ]);
    sendData.rows = list;
    if (list.length > 0) {
        count = yield notifications_schema_1.default.aggregate([
            {
                $match: search,
            },
            {
                $count: "totalCount",
            },
        ]);
        reponseJson.code = 200;
        reponseJson.message = "notificaciones obtenidas exitosamente";
        reponseJson.status = true;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron notificaciones";
        reponseJson.status = false;
    }
    if (count) {
        totalItems = count[0].totalCount;
    }
    let totalPages = Math.ceil(totalItems / data.lim);
    sendData.count = totalItems;
    sendData.pages = totalPages;
    reponseJson.data = sendData;
    res.json(reponseJson);
    // if (decode == false) {
    //   reponseJson.code = jwt.code;
    //   reponseJson.message = jwt.message;
    //   reponseJson.status = false;
    //   reponseJson.data = null;
    //   return res.json(reponseJson);
    // }
    // console.log(id_user)
    // const notificationsUser = await notifications
    //   .find({ id_user: id_user, status: false })
    //   .sort({ date: -1 });
    // if (notificationsUser) {
    //   reponseJson.code = 200;
    //   reponseJson.message = "notificaciones obtenidas exitosamente";
    //   reponseJson.status = true;
    //   reponseJson.data = notificationsUser;
    // } else {
    //   reponseJson.code = 400;
    //   reponseJson.message = "no se encontraron notificaciones";
    //   reponseJson.status = false;
    // }
    // res.json(reponseJson);
});
userController.updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "admin_concesionary",
        "mechanic",
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const notificationsUser = yield notifications_schema_1.default.findByIdAndUpdate(id, {
        status: true,
    });
    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "notificacion actualizada exitosamente";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "error al actualizar notificacion";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
userController.notificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "mechanic",
        "admin_concesionary"
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const notificationsUser = yield notifications_schema_1.default.findById(id);
    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "notificacion encontrada exitosamente";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontro notificacion";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
userController.countNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_user } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, [
        "seller",
        "admin",
        "mechanic",
        "admin_concesionary"
    ]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const countNotifies = yield notifications_schema_1.default.countDocuments({
        id_user: id_user,
        status: false,
    });
    if (countNotifies) {
        reponseJson.code = 200;
        reponseJson.message = "conteo de notificaciones exitoso";
        reponseJson.status = true;
        reponseJson.data = countNotifies;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontro notificacion";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
function addOrUpdateUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.id_user) {
            const user = { _id: data.id_user };
            if (data.password != "") {
                const hash = yield bcrypt_1.default.hash(data.password, 12);
                data.password = hash;
                yield Users_schema_1.default.findOneAndUpdate(user, data);
            }
            else {
                let userUpdate = {
                    email: data.email,
                    username: data.username,
                    type_user: data.type_user,
                };
                if (data.type_user == "admin_concesionay") {
                    userUpdate.id_concesionary = data.id_concesionary;
                }
                yield Users_schema_1.default.findOneAndUpdate(user, userUpdate);
            }
        }
        else {
            const date_created = (0, moment_1.default)().format("YYYY-MM-DD");
            const hash = yield bcrypt_1.default.hash(data.password, 12);
            let _user = {
                email: data.email,
                password: hash,
                username: data.username,
                type_user: data.type_user,
                date_created: date_created,
                status: 1,
            };
            if (data.type_user == "admin_concesionay") {
                _user.id_concesionary = data.id_concesionary;
            }
            const newUser = new Users_schema_1.default(_user);
            yield newUser.save();
            data.id_user = newUser._id;
        }
        return data;
    });
}
function addOrUpdateMechanic(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.id_user) {
            const user = { _id: data.id_user };
            if (data.password != "") {
                const hash = yield bcrypt_1.default.hash(data.password, 12);
                data.password = hash;
                yield Users_schema_1.default.findOneAndUpdate(user, data);
            }
            else {
                const userUpdate = {
                    email: data.email,
                    username: data.username,
                    type_user: data.type_user,
                };
                const mechanicUpdate = {
                    fullName: data.fullName,
                    city: data.city,
                    concesionary: data.concesionary,
                    id_concesionary: data.id_concesionary ? data.id_concesionary : null,
                    phone: data.phone,
                };
                const query = yield Mechanics_schema_1.default.findOne({ id_user: user._id });
                let mechanic = { _id: query._id };
                yield Users_schema_1.default.findOneAndUpdate(user, userUpdate);
                yield Mechanics_schema_1.default.findOneAndUpdate(mechanic, mechanicUpdate);
            }
        }
        else {
            const date_created = (0, moment_1.default)().format("YYYY-MM-DD");
            const hash = yield bcrypt_1.default.hash(data.password, 12);
            const newUser = new Users_schema_1.default({
                email: data.email,
                password: hash,
                username: data.username,
                type_user: data.type_user,
                date_created: date_created,
                status: 1,
            });
            yield newUser.save();
            data.id_user = newUser._id;
            const newMechanic = new Mechanics_schema_1.default({
                fullName: data.fullName,
                city: data.city,
                concesionary: data.concesionary,
                id_concesionary: data.id_concesionary ? data.id_concesionary : null,
                date_created: date_created,
                phone: data.phone,
                id_user: data.id_user,
                status: 1,
            });
            yield newMechanic.save();
            data.id_mechanic = newMechanic._id;
        }
        return data;
    });
}
function addOrUpdateSeller(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.id_user) {
            const user = { _id: data.id_user };
            if (data.password != "") {
                const hash = yield bcrypt_1.default.hash(data.password, 12);
                data.password = hash;
                yield Users_schema_1.default.findOneAndUpdate(user, data);
            }
            else {
                const userUpdate = {
                    email: data.email,
                    username: data.username,
                    type_user: data.type_user,
                };
                const sellerUpdate = {
                    fullName: data.fullName,
                    city: data.city,
                    concesionary: data.concesionary,
                    phone: data.phone,
                };
                const query = yield Sellers_schema_1.default.findOne({ id_user: user._id });
                let seller = { _id: query._id };
                yield Users_schema_1.default.findOneAndUpdate(user, userUpdate);
                yield Sellers_schema_1.default.findOneAndUpdate(seller, sellerUpdate);
            }
        }
        else {
            const date_created = (0, moment_1.default)().format("YYYY-MM-DD");
            const hash = yield bcrypt_1.default.hash(data.password, 12);
            const newUser = new Users_schema_1.default({
                email: data.email,
                password: hash,
                username: data.username,
                type_user: data.type_user,
                date_created: date_created,
                status: 1,
            });
            yield newUser.save();
            data.id_user = newUser._id;
            const newSeller = new Sellers_schema_1.default({
                fullName: data.fullName,
                city: data.city,
                concesionary: data.concesionary,
                id_concesionary: data.id_concesionary ? data.id_concesionary : null,
                date_created: date_created,
                phone: data.phone,
                id_user: data.id_user,
                status: 1,
            });
            yield newSeller.save();
            data.id_seller = newSeller._id;
        }
        return data;
    });
}
function deleteUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.id_user) {
            const user = { _id: data.id_user };
            const userUpdate = { status: data.status };
            yield Users_schema_1.default.findOneAndUpdate(user, userUpdate);
        }
        return data;
    });
}
exports.default = userController;
//# sourceMappingURL=user.controller.js.map