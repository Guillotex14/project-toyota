import { Schema, model } from "mongoose";

const MechanicSchema = new Schema({
    fullName: String,
    email: String,
    username: String,
    password: String,
    city: String,
    type_user: String,
    concesionary: String,
    id_user: {
        type: Schema.Types.ObjectId
    },
});

export default model("Mechanic", MechanicSchema);