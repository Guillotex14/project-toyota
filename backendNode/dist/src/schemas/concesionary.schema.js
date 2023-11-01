"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const concesionarySchema = new mongoose_1.Schema({
    name: String,
    zone: String,
});
exports.default = (0, mongoose_1.model)("concesionary", concesionarySchema);
//# sourceMappingURL=concesionary.schema.js.map