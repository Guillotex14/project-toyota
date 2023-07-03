import { Schema, model } from "mongoose";

const vehicleSchema = new Schema({
    model: String,
    brand: String,
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
    concesionary: String,
    traction_control: String,
    performance: String,
    price: String,
    comfort: String,
    technology: String,
    mechanicalFile: Boolean,
    id_seller: {
        type: Schema.Types.ObjectId
    },
    id_mechanic: {
        type: Schema.Types.ObjectId
    }
});

export default model("vehicle", vehicleSchema);