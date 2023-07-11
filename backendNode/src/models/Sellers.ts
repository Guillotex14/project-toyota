import { Schema, model } from "mongoose";

const SellerSchema = new Schema({
    fullName: String,
    city: String,
    concesionary: String,
    date_created: String,
    id_user: {
        type: Schema.Types.ObjectId
    },
});

export default model("Sellers", SellerSchema);