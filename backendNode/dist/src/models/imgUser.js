"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ImgUserSchema = new mongoose_1.Schema({
    img: String,
    public_id: String,
    id_user: {
        type: mongoose_1.Schema.Types.ObjectId
    }
});
exports.default = (0, mongoose_1.model)("imgUser", ImgUserSchema);
//# sourceMappingURL=imgUser.js.map