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
const states_schema_1 = __importDefault(require("../schemas/states.schema"));
const statesController = {};
statesController.all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller", "mechanic", "admin_concesionary"]);
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
            { name: { $regex: ".*" + data.s + ".*", $options: "i" } },
        ],
    };
    project = {
        _id: "$_id",
        name: 1,
    };
    let list = yield states_schema_1.default.aggregate([
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
exports.default = statesController;
//# sourceMappingURL=states.controller.js.map