"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sale_controller_1 = __importDefault(require("../controllers/sale.controller"));
const saleRouter = (0, express_1.Router)();
saleRouter.post("/buyVehicle", sale_controller_1.default.buyVehicle);
saleRouter.post("/approveBuyVehicle", sale_controller_1.default.approveBuyVehicle);
saleRouter.post("/rejectBuyVehicle", sale_controller_1.default.rejectBuyVehicle);
exports.default = saleRouter;
//# sourceMappingURL=sale.route.js.map