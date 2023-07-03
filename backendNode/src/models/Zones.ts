import { Schema, model } from "mongoose";

const zonesSchema = new Schema({
    name: String
});

export default model("zones", zonesSchema);