"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const registerPatientSchema = new mongoose_1.Schema({
    email: String,
    password: String,
    fullName: String,
    dni: String,
    birthDate: String,
    phoneNumber: String,
    address: String,
});
exports.default = (0, mongoose_1.model)("registerPatient", registerPatientSchema);
//# sourceMappingURL=registerPatient.js.map