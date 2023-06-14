"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dataProfessionalSchema = new mongoose_1.Schema({
    university: String,
    uni_admission_date: String,
    uni_graduation_date: String,
    MPPS: String,
    postgrade: String,
    portgrade_university: String,
    postgrade_admission_date: String,
    postgrade_graduation_date: String,
    days_of_service: String,
    files: String,
    additional: String
});
exports.default = (0, mongoose_1.model)("dataProfessional", dataProfessionalSchema);
//# sourceMappingURL=dataProfessional.js.map