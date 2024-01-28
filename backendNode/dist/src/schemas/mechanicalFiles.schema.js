"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mechanicalFileSchema = new mongoose_1.Schema({
    created_at: String,
    id_vehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    id_mechanic: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    certificate: Boolean,
    //----interior------
    steering_wheel: Object,
    pedals: Object,
    gauges_dashboard_lights: Object,
    transmission_shift_lever: Object,
    brake_lever: Object,
    accessories: Object,
    internal_upholstery: Object,
    courtesy_lights: Object,
    windshield: Object,
    window_glass_operation: Object,
    door_locks_handles: Object,
    operation_manual_electric_mirrors: Object,
    seat_belts: Object,
    //---Frontal
    front_bumpers: Object,
    front_grill: Object,
    headlights_low_beams_cocuyos: Object,
    fog_lights: Object,
    //----Comportamiento de motor
    bonnet: Object,
    engine_ignition: Object,
    engine_noises: Object,
    general_condition_fluids: Object,
    fluid_reservoirs: Object,
    spark_plugs_coils_general_condition: Object,
    air_filter: Object,
    transmission_belts: Object,
    appearance_hoses_caps_seals_connections: Object,
    battery_condition_terminal_tightness_corrosion: Object,
    fluid_leak: Object,
    general_engine_compression_condition: Object,
    //---bajo chasis---
    stabilizer_bars: Object,
    bearings: Object,
    joints_dust_covers: Object,
    shock_absorbers: Object,
    spirals: Object,
    upper_lower_plateaus: Object,
    stumps: Object,
    terminal_blocks: Object,
    brakes: Object,
    cardan_transmission_shaft: Object,
    engine_transmission_oil_leaks: Object,
    hydraulic_oil_leak_steering_box: Object,
    excessive_rust_on_frame_compact: Object,
    exhaust_pipe: Object,
    // ---laterales----
    doors: Object,
    // -----trasera-----
    stop: Object,
    fuel_pump_door: Object,
    trunk_door: Object,
    trunk_interior: Object,
    replacement_rubber_tool_set: Object,
    // -----exterior-------
    complete_emblems: Object,
    bodywork: Object,
    paint: Object,
    tire_condition: Object,
    wheel_ornaments: Object,
    // ------other-------
    general_condition: Number,
    dealer_maintenance: String,
});
exports.default = (0, mongoose_1.model)("filemechanical", mechanicalFileSchema);
//# sourceMappingURL=mechanicalFiles.schema.js.map