import { Schema, model } from "mongoose";

const ImgUserSchema = new Schema({
    img: String,
    id_user: {
        type: Schema.Types.ObjectId
    }
})

export default model("imgUser", ImgUserSchema);