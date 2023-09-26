import { Schema, model } from "mongoose";

const UsersSchema = new Schema({
    email: String,
    password: String,
    username: String,
    type_user: String,
});

export default model("Users", UsersSchema);

