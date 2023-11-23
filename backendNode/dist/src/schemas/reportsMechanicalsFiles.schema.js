"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportsmechanicalsfilesSchema = new mongoose_1.Schema({
    campos: {
        type: Object
    },
    type: String,
    comment: String,
    id_mechanic_file: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    id_user: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    date: String
});
exports.default = (0, mongoose_1.model)("reportsmechanicalsfiles", reportsmechanicalsfilesSchema);
//# sourceMappingURL=reportsMechanicalsFiles.schema.js.map