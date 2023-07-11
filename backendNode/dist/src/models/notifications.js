"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationsSchema = new mongoose_1.Schema({
    id_user: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    message: String,
    date: String,
    status: Boolean,
});
exports.default = (0, mongoose_1.model)("notifications", notificationsSchema);
//# sourceMappingURL=notifications.js.map