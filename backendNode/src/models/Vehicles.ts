import { Schema, model } from "mongoose";

const vehicleSchema = new Schema({
    model: String,
    brand: String,
    year: Number,
    displacement: String,
    km: Number,
    engine_model: String,
    titles: String,
    fuel: String,
    transmission: String,
    traction: String,
    city: String,
    dealer: String,
    concesionary: String,
    traction_control: String,
    performance: String,
    price: Number,
    comfort: String,
    technology: String,
    mechanicalFile: Boolean,
    sold: Boolean,
    date: String,
    date_create: String,
    date_sell: String,
    type_vehicle: String,
    id_seller: {
        type: Schema.Types.ObjectId
    },
    id_mechanic: {
        type: Schema.Types.ObjectId
    },
    id_seller_buyer: {
        type: Schema.Types.ObjectId
    }
});

export default model("vehicle", vehicleSchema);