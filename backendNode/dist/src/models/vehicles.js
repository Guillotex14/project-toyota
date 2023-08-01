"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
    model: String,
    brand: String,
    year: Number,
    displacement: String,
    km: Number,
    engine_model: String,
    titles: String,
    fuel: String,
    transmission: String,
    traction: String,
    city: String,
    dealer: String,
    concesionary: String,
    traction_control: String,
    performance: String,
    price: Number,
    comfort: String,
    technology: String,
    mechanicalFile: Boolean,
    sold: Boolean,
    date: String,
    type_vehicle: String,
    id_seller: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    id_mechanic: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    id_seller_buyer: {
        type: mongoose_1.Schema.Types.ObjectId
    }
});
exports.default = (0, mongoose_1.model)("vehicle", vehicleSchema);
//# sourceMappingURL=Vehicles.js.map