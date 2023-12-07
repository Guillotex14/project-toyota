import { Schema, model } from "mongoose";

const potentialClientsSchema = new Schema({
    email: String,
    name:String,
    last_name:String,
    interested_car_model:String,
    phone:String,
    approximate_budget:Number,
    status:Number,
    date_created:String,
});


export default model("potentialclients", potentialClientsSchema);
