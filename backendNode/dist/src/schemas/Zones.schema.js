"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zonesSchema = new mongoose_1.Schema({
    name: String
});
exports.default = (0, mongoose_1.model)("zones", zonesSchema);
//# sourceMappingURL=Zones.schema.js.map