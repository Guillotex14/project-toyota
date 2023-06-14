"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
    model: String,
    year: String,
    displacement: String,
    km: String,
    engine_model: String,
    titles: String,
    fuel: String,
    transmission: String,
    transmission_2: String,
    city: String,
    dealer: String,
    traction_control: String,
    performance: String,
    comfort: String,
    technology: String
});
exports.default = (0, mongoose_1.model)("vehicle", vehicleSchema);
//# sourceMappingURL=Vehicles.js.map