"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ImgVehicleSchema = new mongoose_1.Schema({
    img: String,
    id_vehicle: {
        type: mongoose_1.Schema.Types.ObjectId
    }
});
exports.default = (0, mongoose_1.model)("imgVehicle", ImgVehicleSchema);
//# sourceMappingURL=ImgVehicle.js.map