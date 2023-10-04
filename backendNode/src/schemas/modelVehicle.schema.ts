import { Schema, model } from "mongoose";

const modelVehicleSchema = new Schema({
    model: String,
    type_vehicle: String,
    brand: String
});

export default model("modelvehicle", modelVehicleSchema);