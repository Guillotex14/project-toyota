import { Schema, model } from "mongoose";

const concesionarySchema = new Schema({
    name: String,
    zone: String,
})

export default model("concesionary", concesionarySchema);