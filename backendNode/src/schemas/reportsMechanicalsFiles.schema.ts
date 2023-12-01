import { json } from "express";
import { Schema, model } from "mongoose";

const reportsmechanicalsfilesSchema = new Schema({
    campos_actualizados: {
        type: Object
    },
    type: String,
    comment: String,
    id_mechanic_file: {
        type: Schema.Types.ObjectId
    },
    id_user:{
        type: Schema.Types.ObjectId
    },
    campos_anteriores: {
        type: Object
    },
    date: String
});

export default model("reportsmechanicalsfiles", reportsmechanicalsfilesSchema);