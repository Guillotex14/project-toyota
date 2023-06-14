"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const registerMedicSchema = new mongoose_1.Schema({
    email: String,
    password: String,
    fullName: String,
    dni: String,
    birthDate: String,
    specialty: String,
    phoneNumber: String,
    address: String,
    gender: String,
});
exports.default = (0, mongoose_1.model)("registerMedic", registerMedicSchema);
//# sourceMappingURL=registerMedic.js.map