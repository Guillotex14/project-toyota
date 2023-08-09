"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mechanicalFileSchema = new mongoose_1.Schema({
    part_emblems_complete: String,
    wiper_shower_brushes_windshield: String,
    hits: String,
    scratches: String,
    paint_condition: String,
    bugle_accessories: String,
    air_conditioning_system: String,
    radio_player: String,
    courtesy_lights: String,
    upholstery_condition: String,
    gts: String,
    board_lights: String,
    tire_pressure: String,
    tire_life: String,
    battery_status_terminals: String,
    transmitter_belts: String,
    motor_oil: String,
    engine_coolant_container: String,
    radiator_status: String,
    exhaust_pipe_bracket: String,
    fuel_tank_cover_pipes_hoses_connections: String,
    distribution_mail: String,
    spark_plugs_air_filter_fuel_filter_anti_pollen_filter: String,
    fuel_system: String,
    parking_break: String,
    brake_bands_drums: String,
    brake_pads_discs: String,
    brake_pipes_hoses: String,
    master_cylinder: String,
    brake_fluid: String,
    bushings_plateaus: String,
    stumps: String,
    terminals: String,
    stabilizer_bar: String,
    bearings: String,
    tripoids_rubbe_bands: String,
    shock_absorbers_coils: String,
    dealer_maintenance: String,
    headlights_lights: String,
    general_condition: String,
    date: String,
    id_vehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    id_mechanic: {
        type: mongoose_1.Schema.Types.ObjectId,
    }
});
exports.default = (0, mongoose_1.model)("mechanicalFile", mechanicalFileSchema);
//# sourceMappingURL=mechanicalsFiles.js.map