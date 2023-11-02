"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const statesSchema = new mongoose_1.Schema({
    name: String,
});
exports.default = (0, mongoose_1.model)("states", statesSchema);
//# sourceMappingURL=states.schema.js.map