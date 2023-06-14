"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MechanicSchema = new mongoose_1.Schema({
    fullName: String,
    email: String,
    username: String,
    password: String,
    city: String,
    type_user: String,
    concesionary: String,
    id_user: {
        type: mongoose_1.Schema.Types.ObjectId
    },
});
exports.default = (0, mongoose_1.model)("Mechanic", MechanicSchema);
//# sourceMappingURL=Mechanics.js.map