"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MechanicSchema = new mongoose_1.Schema({
    fullName: String,
    city: String,
    concesionary: String,
    id_concesionary: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    date_created: String,
    phone: String,
    id_user: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    status: Number,
});
exports.default = (0, mongoose_1.model)("Mechanic", MechanicSchema);
//# sourceMappingURL=Mechanics.schema.js.map