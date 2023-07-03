import { Schema, model } from "mongoose";

const ImgVehicleSchema = new Schema({
    img: String,
    id_vehicle: {
        type: Schema.Types.ObjectId
    }
})

export default model("imgVehicle", ImgVehicleSchema);