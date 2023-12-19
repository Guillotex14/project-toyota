"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const potentialClientsSchema = new mongoose_1.Schema({
    email: String,
    name: String,
    last_name: String,
    interested_car_model: String,
    phone: String,
    approximate_budget: Number,
    concesionary: String,
    status: Number,
    date_created: String,
    id_user: {
        type: mongoose_1.Schema.Types.ObjectId
    },
});
exports.default = (0, mongoose_1.model)("potentialclients", potentialClientsSchema);
//# sourceMappingURL=potentialClients.schema.js.map