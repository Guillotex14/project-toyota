"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
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
    date_create: String,
    type_vehicle: String,
    vin: String,
    plate: String,
    child: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'imgVehicle' // nombre de la colección secundaria
    },
    mechanicalFile: {
        type: Boolean,
        default: false
    },
    sold: {
        type: Boolean,
        default: false
    },
    dispatched: {
        type: Boolean,
        default: false
    },
    date_sell: {
        type: String,
        default: null
    },
    name_new_owner: {
        type: String,
        default: null
    },
    dni_new_owner: {
        type: String,
        default: null
    },
    phone_new_owner: {
        type: String,
        default: null
    },
    email_new_owner: {
        type: String,
        default: null
    },
    price_ofert: {
        type: Number,
        default: null
    },
    final_price_sold: {
        type: Number,
        default: null
    },
    concesionary_maintenance: {
        type: Boolean
    },
    certified: {
        type: Boolean
    },
    id_seller: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    id_mechanic: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    id_seller_buyer: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    imgs_documentation: {
        type: Array,
        default: []
    }
});
exports.default = (0, mongoose_1.model)("vehicle", vehicleSchema);
//# sourceMappingURL=Vehicles.schema.js.map