"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const modelVehicleSchema = new mongoose_1.Schema({
    model: String,
    type_vehicle: String,
    brand: String
});
exports.default = (0, mongoose_1.model)("modelvehicle", modelVehicleSchema);
//# sourceMappingURL=modelVehicle.schema.js.map