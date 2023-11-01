import { Schema, model } from "mongoose";

const statesSchema = new Schema({
    name: String,
})

export default model("states", statesSchema);