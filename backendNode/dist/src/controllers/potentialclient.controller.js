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
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const moment_1 = __importDefault(require("moment"));
const potentialClients_schema_1 = __importDefault(require("../schemas/potentialClients.schema"));
const potentialclient = {};
potentialclient.add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const exist = yield potentialClients_schema_1.default.findOne({ email: data.email });
    let now = (0, moment_1.default)().format("YYYY-MM-DD");
    if (exist) {
        reponseJson.code = 400;
        reponseJson.message = "El cliente: " + exist.name + " " + exist.last_name + " ya existe";
        reponseJson.status = false;
    }
    else {
        const newClient = new potentialClients_schema_1.default({
            email: data.email,
            name: data.name,
            last_name: data.last_name,
            interested_car_model: data.interested_car_model,
            phone: data.phone,
            date_created: now,
            approximate_budget: data.approximate_budget,
            id_user: decode.id_user,
            status: 1
        });
        yield newClient.save();
        if (newClient) {
            data._id = newClient._id;
            data.date_created = newClient.date_created;
            reponseJson.code = 200;
            reponseJson.message = "El cliente: " + data.name + " " + data.last_name + " agregada exitosamente";
            reponseJson.status = true;
            reponseJson.data = data;
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "Error al agregar al cliente" + data.name + " " + data.last_name;
            reponseJson.status = false;
        }
    }
    res.json(reponseJson);
});
potentialclient.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    if (data._id) {
        const clienteUpdate = { _id: data._id };
        yield potentialClients_schema_1.default.findOneAndUpdate(clienteUpdate, data);
        reponseJson.code = 200;
        reponseJson.message = "El cliente " + data.name + " " + data.last_name + " actualizado con exito";
        reponseJson.status = true;
        reponseJson.data = data;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Error al agregar al cliente" + data.name + " " + data.last_name;
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
potentialclient.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const clientDelete = yield potentialClients_schema_1.default.findOne({ _id: data._id });
    if (clientDelete) {
        const ress = yield potentialClients_schema_1.default.findOneAndDelete({ _id: data._id });
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Cliente no encontrado";
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    reponseJson.code = 200;
    reponseJson.message = "Cliente borrada con exito";
    reponseJson.status = true;
    res.json(reponseJson);
});
potentialclient.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let getClient;
    if (data._id) {
        getClient = yield potentialClients_schema_1.default.findOne({ _id: data._id });
    }
    else if (data.name) {
        getClient = yield potentialClients_schema_1.default.findOne({ name: data.name });
    }
    if (getClient) {
        let user = yield Users_schema_1.default.findOne({ _id: getClient.id_user });
        let seller = yield Sellers_schema_1.default.findOne({ id_user: user === null || user === void 0 ? void 0 : user._id });
        getClient.seller = seller;
        getClient.user = user;
    }
    reponseJson.code = 200;
    reponseJson.message = "Cliente encontrada con exito";
    reponseJson.data = getClient;
    reponseJson.status = true;
    res.json(reponseJson);
});
potentialclient.all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    if (!data) {
        data = {
            s: "",
        };
    }
    let search;
    let project;
    search = {
        $or: [
            { _id: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { name: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { last_name: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { email: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { interested_car_model: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { phone: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { approximate_budget: { $regex: ".*" + data.s + ".*", $options: "i" } },
        ],
    };
    project = {
        _id: "$_id",
        name: 1,
        last_name: 1,
        email: 1,
        interested_car_model: 1,
        phone: 1,
        approximate_budget: 1,
    };
    let list = yield potentialClients_schema_1.default.aggregate([
        {
            $match: search,
        },
        {
            $project: project,
        },
    ]);
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        let user = yield Users_schema_1.default.findOne({ _id: element.id_user });
        let seller = yield Sellers_schema_1.default.findOne({ id_user: user === null || user === void 0 ? void 0 : user._id });
        element.seller = seller;
        element.user = user;
    }
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = list;
    res.json(reponseJson);
});
potentialclient.allPaginator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    if (!data) {
        data = {
            s: "",
            pos: 0,
            lim: 10,
        };
    }
    let search;
    let project;
    search = {
        $or: [
            { _id: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { name: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { last_name: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { email: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { interested_car_model: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { phone: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { approximate_budget: { $regex: ".*" + data.s + ".*", $options: "i" } },
        ],
    };
    project = {
        _id: "$_id",
        name: 1,
        last_name: 1,
        email: 1,
        interested_car_model: 1,
        phone: 1,
        approximate_budget: 1,
    };
    let sendata = {};
    let list = yield potentialClients_schema_1.default.aggregate([
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
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        let user = yield Users_schema_1.default.findOne({ _id: element.id_user });
        let seller = yield Sellers_schema_1.default.findOne({ id_user: user === null || user === void 0 ? void 0 : user._id });
        element.seller = seller;
        element.user = user;
    }
    sendata.rows = list;
    let count;
    if (list.length > 0) {
        count = yield potentialClients_schema_1.default.aggregate([
            {
                $match: search,
            },
            {
                $count: "totalCount",
            },
        ]);
        reponseJson.code = 200;
        reponseJson.message = "Cliente encontrado con exito";
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
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = sendata;
    res.json(reponseJson);
});
exports.default = potentialclient;
//# sourceMappingURL=potentialclient.controller.js.map