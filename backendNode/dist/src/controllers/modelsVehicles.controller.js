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
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const modelVehicle_schema_1 = __importDefault(require("../schemas/modelVehicle.schema"));
const modelVehiclesController = {};
modelVehiclesController.all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "mechanic"]);
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
        ],
    };
    project = {
        _id: "$_id",
        name: 1,
    };
    let list = yield modelVehicle_schema_1.default.aggregate([
        {
            $match: search,
        },
        {
            $project: project,
        },
    ]);
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = list;
    res.json(reponseJson);
});
modelVehiclesController.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    reponseJson.code = 200;
    reponseJson.message = "Vehículo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
});
modelVehiclesController.modelVehicleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    reponseJson.code = 200;
    reponseJson.message = "Vehículo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
});
modelVehiclesController.allPaginator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "mechanic"]);
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
            { model: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { type_vehicle: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { brand: { $regex: ".*" + data.s + ".*", $options: "i" } },
        ],
    };
    project = {
        _id: "$_id",
        model: 1,
        type_vehicle: 1,
        brand: 1
    };
    let sendata = {};
    let list = yield modelVehicle_schema_1.default.aggregate([
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
        count = yield modelVehicle_schema_1.default.aggregate([
            {
                $match: search,
            },
            {
                $count: "totalCount",
            },
        ]);
        reponseJson.code = 200;
        reponseJson.message = "Lista de modelos de vehiculos";
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
modelVehiclesController.updateModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const data = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const update = yield modelVehicle_schema_1.default.findByIdAndUpdate(data._id, data);
    if (update) {
        reponseJson.code = 200;
        reponseJson.message = "Modélo actualizado correctamente";
        reponseJson.status = true;
        reponseJson.data = update;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Error al actualizar modélo de vehiculo";
        reponseJson.status = false;
        reponseJson.data = [];
    }
    res.json(reponseJson);
});
modelVehiclesController.deleteModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const data = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const update = yield modelVehicle_schema_1.default.findByIdAndDelete(data._id);
    if (update) {
        reponseJson.code = 200;
        reponseJson.message = "Modélo Eliminado correctamente";
        reponseJson.status = true;
        reponseJson.data = update;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Error al eliminar modélo de vehiculo";
        reponseJson.status = false;
        reponseJson.data = [];
    }
    res.json(reponseJson);
});
modelVehiclesController.addModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    if (decode == false) {
        jsonRes.code = generar_jwt_1.default.code;
        jsonRes.message = generar_jwt_1.default.message;
        jsonRes.status = false;
        jsonRes.data = null;
        return res.json(jsonRes);
    }
    const { model, brand, type_vehicle } = req.body;
    const exist = yield modelVehicle_schema_1.default.findOne({ model: model });
    if (exist) {
        jsonRes.code = 400;
        jsonRes.message = "El modelo ya existe";
        jsonRes.status = false;
    }
    else {
        const newModel = new modelVehicle_schema_1.default({ model: model, brand: brand, type_vehicle: type_vehicle });
        yield newModel.save();
        if (newModel) {
            jsonRes.code = 200;
            jsonRes.message = "Modelo agregado exitosamente";
            jsonRes.status = true;
            // jsonRes.data = "";
        }
        else {
            jsonRes.code = 400;
            jsonRes.message = "Error al agregar el modelo";
            jsonRes.status = false;
        }
    }
    res.json(jsonRes);
});
exports.default = modelVehiclesController;
//# sourceMappingURL=modelsVehicles.controller.js.map