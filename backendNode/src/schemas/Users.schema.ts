import { Schema, model } from "mongoose";

const UsersSchema = new Schema({
    email: String,
    password: String,
    username: String,
    type_user: String,
    id_concesionary: String,
    concesionary: String,
    status: Number,
});

export default model("Users", UsersSchema);

