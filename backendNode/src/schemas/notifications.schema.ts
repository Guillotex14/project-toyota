import { Schema, model } from "mongoose";

const notificationsSchema = new Schema({
    id_user: {
        type: Schema.Types.ObjectId,
    },
    title: String,
    message: String,
    data: {
        type: Object
    },
    date: String,
    status: Boolean,
});

export default model("notifications", notificationsSchema);