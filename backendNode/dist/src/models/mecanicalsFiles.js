"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const medicalFile = new mongoose_1.Schema({
    disease: String,
    allergy: String,
    condiction: String,
    additional: String
});
exports.default = (0, mongoose_1.model)("medicalFile", medicalFile);
//# sourceMappingURL=mecanicalsFiles.js.map