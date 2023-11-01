import { Schema, model } from "mongoose";

const SellerSchema = new Schema({
    fullName: String,
    city: String,
    concesionary: String,
    id_concesionary: {
        type: Schema.Types.ObjectId
    },
    phone: String,
    date_created: String,
    id_user: {
        type: Schema.Types.ObjectId
    },
    status: Number,

});

export default model("Sellers", SellerSchema);