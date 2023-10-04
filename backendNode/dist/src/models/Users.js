"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UsersSchema = new mongoose_1.Schema({
    email: String,
    password: String,
    username: String,
    type_user: String,
});
exports.default = (0, mongoose_1.model)("Users", UsersSchema);
//# sourceMappingURL=Users.js.map