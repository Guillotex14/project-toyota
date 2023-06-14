"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SellerSchema = new mongoose_1.Schema({
    fullName: String,
    city: String,
    concesionary: String,
    id_user: {
        type: mongoose_1.Schema.Types.ObjectId
    },
});
exports.default = (0, mongoose_1.model)("Sellers", SellerSchema);
//# sourceMappingURL=Sellers.js.map