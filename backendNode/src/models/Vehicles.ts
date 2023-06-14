import { Schema, model } from "mongoose";

const vehicleSchema = new Schema({
    model: String,
    year: String,
    displacement: String,
    km: String,
    engine_model: String,
    titles: String,
    fuel: String,
    transmission: String,
    transmission_2: String,
    city: String,
    dealer: String,
    traction_control: String,
    performance: String,
    comfort: String,
    technology: String

});

export default model("vehicle", vehicleSchema);