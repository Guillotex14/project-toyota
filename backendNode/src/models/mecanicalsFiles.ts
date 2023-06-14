import { Schema, model } from "mongoose";

const medicalFile = new Schema({
    disease: String,
    allergy: String,
    condiction: String,
    additional: String
});

export default model("medicalFile", medicalFile);