"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const potentialClientSchema = new mongoose_1.Schema({
    email: String,
    name: String,
    last_name: String,
    interested_car_model: String,
    phone: String,
    approximate_budget: Number,
    status: Number
});
exports.default = (0, mongoose_1.model)("potentialclient", potentialClientSchema);
//# sourceMappingURL=potentialClient.schema.js.map