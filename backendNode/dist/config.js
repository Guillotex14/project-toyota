"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.mongoDBUri = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.mongoDBUri = process.env.MONGODB_URI || "mongodb+srv://jefersonmujica:SkibCc1nKFNmcfb1@cluster0.luvml6n.mongodb.net/toyotaShopDB?retryWrites=true&w=majority";
exports.port = process.env.PORT || 3000;
//# sourceMappingURL=config.js.map