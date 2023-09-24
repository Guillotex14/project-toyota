import { Schema, model } from "mongoose";

const brandsSchema = new Schema({
    name: String,
});

export default model("brands", brandsSchema);