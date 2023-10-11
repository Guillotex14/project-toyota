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
const imgUser_schema_1 = __importDefault(require("../schemas/imgUser.schema"));
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
                message = `El usuario administrador fue creado con exito`;
            }
            if (data.type_user == "mechanic") {
                message = `El usuario tecnico fue creado con exito`;
            }
            if (data.type_user == "seller") {
                message = `El usuario vendedor fue creado con exito`;
            }
            let newUser = yield addOrUpdateUser(data);
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
            let newUser = yield addOrUpdateUser(data);
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
userController.modificarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    let user = yield Users_schema_1.default.find();
    for (let i = 0; i < user.length; i++) {
        let element = user[i];
        if (element.type_user == "admin") {
            let admin = yield Sellers_schema_1.default.findOne({ id_user: element._id });
            let data = {
                fullName: null,
                city: null,
                concesionary: null,
                date_created: null,
                phone: null,
                status: 1,
            };
            yield Users_schema_1.default.findOneAndUpdate({ _id: element._id }, data);
        }
        if (element.type_user == "seller") {
            let seller = yield Sellers_schema_1.default.findOne({ id_user: element._id });
            let data = {
                fullName: seller === null || seller === void 0 ? void 0 : seller.fullName,
                city: seller === null || seller === void 0 ? void 0 : seller.city,
                concesionary: seller === null || seller === void 0 ? void 0 : seller.concesionary,
                date_created: (seller === null || seller === void 0 ? void 0 : seller.date_created) ? seller === null || seller === void 0 ? void 0 : seller.date_created : null,
                phone: (seller === null || seller === void 0 ? void 0 : seller.phone) ? seller === null || seller === void 0 ? void 0 : seller.phone : null,
                status: 1,
            };
            yield Users_schema_1.default.findOneAndUpdate({ _id: element._id }, data);
        }
        if (element.type_user == "mechanic") {
            let mechanic = yield Mechanics_schema_1.default.findOne({ id_user: element._id });
            let data = {
                fullName: mechanic === null || mechanic === void 0 ? void 0 : mechanic.fullName,
                city: mechanic === null || mechanic === void 0 ? void 0 : mechanic.city,
                concesionary: mechanic === null || mechanic === void 0 ? void 0 : mechanic.concesionary,
                date_created: (mechanic === null || mechanic === void 0 ? void 0 : mechanic.date_created) ? mechanic === null || mechanic === void 0 ? void 0 : mechanic.date_created : null,
                phone: (mechanic === null || mechanic === void 0 ? void 0 : mechanic.phone) ? mechanic === null || mechanic === void 0 ? void 0 : mechanic.phone : null,
                status: 1,
            };
            yield Users_schema_1.default.findOneAndUpdate({ _id: element._id }, data);
        }
    }
    let otherUser = yield Users_schema_1.default.find();
    reponseJson.code = 400;
    reponseJson.message = "id_user requerido";
    reponseJson.status = false;
    reponseJson.data = otherUser;
    return res.json(reponseJson);
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
                message = `El usuario administrador fue modificado con exito`;
            }
            else if (data.type_user == "mechanic") {
                message = `El usuario tecnico fue modificado con exito`;
            }
            else if (data.type_user == "seller") {
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
                yield addOrUpdateUser(data);
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
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
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
    const userImg = yield imgUser_schema_1.default.findOne({ id_user: user._id });
    if (user) {
        sendata = {
            id_user: user === null || user === void 0 ? void 0 : user._id,
            email: user === null || user === void 0 ? void 0 : user.email,
            username: user === null || user === void 0 ? void 0 : user.username,
            type_user: user === null || user === void 0 ? void 0 : user.type_user,
            fullName: user === null || user === void 0 ? void 0 : user.fullName,
            city: user === null || user === void 0 ? void 0 : user.city,
            concesionary: user === null || user === void 0 ? void 0 : user.concesionary,
            date_created: user === null || user === void 0 ? void 0 : user.date_created,
            phone: user === null || user === void 0 ? void 0 : user.phone,
            status: user === null || user === void 0 ? void 0 : user.status,
            img: userImg ? userImg : null
        };
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
    search = {
        $or: [
            { email: { $regex: ".*" + data.s + ".*" } },
            { username: { $regex: ".*" + data.s + ".*" } },
            { type_user: { $regex: ".*" + data.s + ".*" } },
            { fullName: { $regex: ".*" + data.s + ".*" } },
            { city: { $regex: ".*" + data.s + ".*" } },
            { concesionary: { $regex: ".*" + data.s + ".*" } },
            { date_created: { $regex: ".*" + data.s + ".*" } },
            { phone: { $regex: ".*" + data.s + ".*" } },
        ],
    };
    project = {
        email: 1,
        username: 1,
        type_user: 1,
        fullName: 1,
        city: 1,
        concesionary: 1,
        date_created: 1,
        phone: 1,
    };
    if (data.type_user != "all") {
        search = Object.assign(Object.assign({}, search), { type_user: data.type_user });
    }
    let list = yield Users_schema_1.default.aggregate([
        {
            $match: search,
        },
        // {
        //   $lookup: {
        //     from: "imgusers",
        //     localField: "_id",
        //     foreignField: "id_user",
        //     as: "imgusers",
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$imgusers",
        //     preserveNullAndEmptyArrays: true 
        //   }
        // },
        {
            $skip: parseInt(data.lim) * parseInt(data.pos),
        },
        {
            $limit: parseInt(data.lim),
        },
    ]);
    let count;
    if (list.length > 0) {
        sendata.rows = list;
        for (let i = 0; i < sendata.rows.length; i++) {
            const element = sendata.rows[i];
            const userImg = yield imgUser_schema_1.default.findOne({ id_user: element._id });
            element.img = userImg ? userImg : null;
        }
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
                const userUpdate = {
                    email: data.email,
                    username: data.username,
                    type_user: data.type_user,
                    fullName: data.fullName,
                    city: data.city,
                    concesionary: data.concesionary,
                    phone: data.phone,
                };
                yield Users_schema_1.default.findOneAndUpdate(user, userUpdate);
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
                fullName: data.fullName,
                city: data.city,
                concesionary: data.concesionary,
                date_created: date_created,
                phone: data.phone,
                status: 1,
            });
            yield newUser.save();
            data.id_user = newUser._id;
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