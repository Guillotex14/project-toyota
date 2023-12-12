"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const potentialclient_controller_1 = __importDefault(require("../controllers/potentialclient.controller"));
const clientRouter = (0, express_1.Router)();
// ------- clientes potenciales-----------
clientRouter.post("/add", potentialclient_controller_1.default.add);
clientRouter.post("/update", potentialclient_controller_1.default.update);
clientRouter.post("/delete", potentialclient_controller_1.default.delete);
clientRouter.get("/get", potentialclient_controller_1.default.get);
clientRouter.get("/all", potentialclient_controller_1.default.all);
clientRouter.get("/allPaginator", potentialclient_controller_1.default.allPaginator);
exports.default = clientRouter;
//# sourceMappingURL=client.route.js.map