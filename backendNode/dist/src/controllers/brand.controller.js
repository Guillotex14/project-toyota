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
const brands_schema_1 = __importDefault(require("../schemas/brands.schema"));
const brandController = {};
brandController.insertUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin"]);
    const data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    if (data._id) {
        const brand = { _id: data._id };
        yield brands_schema_1.default.findOneAndUpdate(brand, data);
        reponseJson.code = 200;
        reponseJson.message = "Marca " + data.name + " actualizado con exito";
        reponseJson.status = true;
        reponseJson.data = data;
    }
    else {
        const exist = yield brands_schema_1.default.findOne({ name: data.name });
        if (exist) {
            reponseJson.code = 400;
            reponseJson.message = "La marca " + data.name + "  ya existe";
            reponseJson.status = false;
        }
        else {
            const newBrand = new brands_schema_1.default({ name: data.name });
            yield newBrand.save();
            if (newBrand) {
                data._id = newBrand._id;
                reponseJson.code = 200;
                reponseJson.message = "Marca " + data.name + " agregada exitosamente";
                reponseJson.status = true;
                reponseJson.data = "";
            }
            else {
                reponseJson.code = 400;
                reponseJson.message = "Error al agregar la marca" + data.name;
                reponseJson.status = false;
            }
        }
    }
    res.json(reponseJson);
});
brandController.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const data = req.body;
    console.log(data);
    const brand = yield brands_schema_1.default.findOne({ _id: data._id });
    console.log(brand);
    if (brand) {
        const ress = yield brands_schema_1.default.findOneAndDelete({ _id: data._id });
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "Marca no encontrado";
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    reponseJson.code = 200;
    reponseJson.message = "Marca borrada con exito";
    reponseJson.status = true;
    return res.json(reponseJson);
});
brandController.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const list = yield brands_schema_1.default.find();
    if (list) {
        reponseJson.code = 200;
        reponseJson.message = "Lista de marcas";
        reponseJson.status = true;
        reponseJson.data = list;
    }
    else {
        reponseJson.code = 200;
        reponseJson.message = "No hay marcas registradas";
        reponseJson.status = true;
        reponseJson.data = null;
    }
    return res.json(reponseJson);
});
brandController.all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        // return res.json(reponseJson);
    }
    const list = yield brands_schema_1.default.find();
    if (list) {
        reponseJson.code = 200;
        reponseJson.message = "Lista de marcas";
        reponseJson.status = true;
        reponseJson.data = list;
    }
    else {
        reponseJson.code = 200;
        reponseJson.message = "No hay marcas registradas";
        reponseJson.status = true;
        reponseJson.data = null;
    }
    res.json(reponseJson);
});
exports.default = brandController;
//# sourceMappingURL=brand.controller.js.map