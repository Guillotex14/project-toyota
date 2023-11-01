import { Schema, model } from "mongoose";

const concesionariesSchema = new Schema({
    name: String,
    state: String,
})

export default model("concesionaries", concesionariesSchema);