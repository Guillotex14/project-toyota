import { Schema, model } from "mongoose";

const mechanicalFileSchema = new Schema({
    part_emblems_complete: String,
    wiper_shower_brushes_windshield: String,
    hits: String,
    scratches: String,
    paint_condition: String,
    bugle_accessories: String,
    air_conditioning_system: String,
    radio_player: String,
    courtesy_lights: String, //igual
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
    stumps: String, // igual
    terminals: String,
    stabilizer_bar: String,
    bearings: String, // igual
    tripoids_rubbe_bands: String,
    shock_absorbers_coils: String,
    dealer_maintenance: String,
    headlights_lights: String,
    general_condition: String, //igual
    odometer: String,
    engine_start: String,
    windshields_glass: String,
    hits_scratches: String,
    spark_plugs: String,
    injectors: String,
    fuel_filter_anti_pollen_filter: String,
    engine_noises: String, // igual
    hits_scratches_sides: String,
    paint_condition_sides: String,
    trunk_hatch: String,
    spare_tire: String,
    hits_scratches_trunk: String,
    paint_condition_trunk: String,
    headlights_lights_trunk: String,
    fuel_tank_cover: String,
    pipes_hoses_connections: String,
    brake_discs: String,
    created_at: String,
    id_vehicle: {
        type: Schema.Types.ObjectId,
    },
    id_mechanic: {
        type: Schema.Types.ObjectId,
    },
    certificate:Boolean
});

export default model("mechanicalFile", mechanicalFileSchema);