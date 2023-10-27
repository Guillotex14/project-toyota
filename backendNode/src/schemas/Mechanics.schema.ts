import { Schema, model } from "mongoose";

const MechanicSchema = new Schema({
    fullName: String,
    city: String,
    concesionary: String,
    date_created: String,
    phone: String,
    id_user: {
        type: Schema.Types.ObjectId
    },
    status: Number,
});

export default model("Mechanic", MechanicSchema);