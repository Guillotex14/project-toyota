"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const concesionariesSchema = new mongoose_1.Schema({
    name: String,
    state: String,
});
exports.default = (0, mongoose_1.model)("concesionaries", concesionariesSchema);
//# sourceMappingURL=concesionaries.schema.js.map