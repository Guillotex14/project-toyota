import { Schema, model } from "mongoose";

const mechanicalFileSchema = new Schema({
    created_at: String,
    id_vehicle: {
        type: Schema.Types.ObjectId,
    },
    id_mechanic: {
        type: Schema.Types.ObjectId,
    },
    certificate: Boolean,
    //----interior------
    steering_wheel: String,
    pedals: String,
    gauges_dashboard_lights: String,
    transmission_shift_lever: String,
    brake_lever: String,
    accessories: String,
    internal_upholstery: String,
    courtesy_lights: String,
    windshield: String,
    window_glass_operation: String,
    door_locks_handles: String,
    operation_manual_electric_mirrors: String,
    seat_belts: String,
    //---Frontal
    front_bumpers: String,
    front_grill: String,
    headlights_low_beams_cocuyos: String,
    fog_lights: String,
    //----Comportamiento de motor
    bonnet: String,
    engine_ignition: String,
    engine_noises: String,
    general_condition_fluids: String,
    fluid_reservoirs: String,
    spark_plugs_coils_general_condition: String,
    air_filter: String,
    transmission_belts: String,
    appearance_hoses_caps_seals_connections: String,
    battery_condition_terminal_tightness_corrosion: String,
    fluid_leak: String,
    general_engine_compression_condition: String,
    //---bajo chasis---
    stabilizer_bars: String,
    bearings: String,
    joints_dust_covers: String,
    shock_absorbers: String, //
    spirals: String,
    upper_lower_plateaus: String,
    stumps: String,
    terminal_blocks: String,
    brakes: String,
    cardan_transmission_shaft: String,
    engine_transmission_oil_leaks: String,
    hydraulic_oil_leak_steering_box: String,
    excessive_rust_on_frame_compact: String,
    exhaust_pipe: String,
    // ---laterales----
    doors: String,
    // -----trasera-----
    stop: String,
    fuel_pump_door: String,
    trunk_door: String,
    trunk_interior: String,
    replacement_rubber_tool_set: String,
    // -----exterior-------
    complete_emblems: String,
    bodywork: String,
    paint: String,
    tire_condition: String,
    wheel_ornaments: String,
    // ------other-------
    general_condition: String,
    dealer_maintenance:String,

});

export default model("filemechanical", mechanicalFileSchema)