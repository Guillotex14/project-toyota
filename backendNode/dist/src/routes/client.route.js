"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const potentialclient_controller_1 = __importDefault(require("../controllers/potentialclient.controller"));
const clientRouter = (0, express_1.Router)();
// ------- clientes potenciales-----------
clientRouter.post("/addClient", potentialclient_controller_1.default.add);
clientRouter.post("/updateClient", potentialclient_controller_1.default.update);
clientRouter.post("/deleteClient", potentialclient_controller_1.default.delete);
clientRouter.get("/getClient", potentialclient_controller_1.default.get);
clientRouter.get("/allClient", potentialclient_controller_1.default.all);
clientRouter.get("/allPaginatorClient", potentialclient_controller_1.default.allPaginator);
exports.default = clientRouter;
//# sourceMappingURL=client.route.js.map