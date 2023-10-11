import { Schema, model } from "mongoose";

const UsersSchema = new Schema({
    email: String,
    password: String,
    username: String,
    type_user: String,
    fullName: String,
    city: String,
    concesionary: String,
    phone: String,
    status: Number,
    date_created: String,
});

export default model("Users", UsersSchema);

