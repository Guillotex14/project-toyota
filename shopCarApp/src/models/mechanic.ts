export class CarDetailMechanic{
    public model!: string;
    public brand!: string;
    public year!: number;
    public displacement!: string;
    public km!: number;
    public engine_model!: string;
    public titles!: string;
    public fuel!: string;
    public transmission!: string;
    public traction!: string;
    public city!: string;
    public dealer!: string;
    public concesionary!: string;
    public traction_control!: string;
    public performance!: string;
    public price!: number;
    public comfort!: string;
    public technology!: string;
    public id_seller!: string;
    public id_mechanic!: string;
    public mechanicalFile!: boolean;
    public sold!: boolean;
    public general_condition!: any;
    public vin!: string;
    public vehicle_plate!: string;
    public images!: any[]
    public id_seller_buyer!: string;
    public plate!: string
    public imgs_documentation!: any[];
    public concesionary_maintenance!: boolean;
    public certified!: boolean;
}

export class MechanicalFileDetail{
    // public air_conditioning_system!: string;
    // public battery_status_terminals!: string;
    // public bearings!: string;
    // public board_lights!: string;
    // public brake_bands_drums!: string;
    // public brake_fluid!: string;
    // public brake_pads_discs!: string;
    // public brake_pipes_hoses!: string;
    // public bugle_accessories!: string;
    // public bushings_plateaus!: string;
    // public courtesy_lights!: string;
    // public dealer_maintenance!: string;
    // public distribution_mail!: string;
    // public engine_coolant_container!: string;
    // public exhaust_pipe_bracket!: string;
    // public fuel_system!: string;
    // public fuel_tank_cover_pipes_hoses_connections!: string;
    // public gts!: string;
    // public hits!: string;
    // public id_mechanic!: string;
    // public master_cylinder!: string;
    // public motor_oil!: string;
    // public paint_condition!: string;
    // public parking_break!: string;
    // public part_emblems_complete!: string;
    // public radiator_status!: string;
    // public radio_player!: string;
    // public scratches!: string;
    // public shock_absorbers_coils!: string;
    // public spark_plugs_air_filter_fuel_filter_anti_pollen_filter!: string;
    // public stabilizer_bar!: string;
    // public stumps!: string;
    // public terminals!: string;
    // public tire_life!: string;
    // public tire_pressure!: string;
    // public transmitter_belts!: string;
    // public tripoids_rubbe_bands!: string;
    // public upholstery_condition!: string;
    // public wiper_shower_brushes_windshield!: string;
    // public headlights_lights!: string;
    // public general_condition!: any;

    // public odometer!:string;
    // public engine_start!:string;
    // public windshields_glass!:string;
    // public hits_scratches!:string;
    // public spark_plugs!:string;
    // public injectors!:string;
    // public fuel_filter_anti_pollen_filter!:string;
    // public engine_noises!:string;
    // public hits_scratches_sides!:string;
    // public paint_condition_sides!:string;
    // public trunk_hatch!:string;
    // public spare_tire!:string;
    // public hits_scratches_trunk!:string;
    // public paint_condition_trunk!:string;
    // public headlights_lights_trunk!:string;
    // public fuel_tank_cover!:string;
    // public pipes_hoses_connections!:string;
    // public brake_discs!:string;
    public id_vehicle!: string;
    public id_mechanic!: string;
    public certificate!: boolean;

    public steering_wheel!: any;
    public pedals!: any;
    public gauges_dashboard_lights!: any;
    public transmission_shift_lever!: any;
    public brake_lever!: any;
    public accessories!: any;
    public internal_upholstery!: any;
    public courtesy_lights!: any;
    public windshield!: any;
    public window_glass_operation!: any;
    public door_locks_handles!: any;
    public operation_manual_electric_mirrors!: any;
    public seat_belts!: any;
    public front_bumpers!: any;
    public front_grill!: any;
    public headlights_low_beams_cocuyos!: any;
    public fog_lights!: any;
    public bonnet!: any;
    public engine_ignition!: any;
    public engine_noises!: any;
    public general_condition_fluids!: any;
    public fluid_reservoirs!: any;
    public spark_plugs_coils_general_condition!: any;
    public air_filter!: any;
    public transmission_belts!: any;
    public appearance_hoses_caps_seals_connections!: any;
    public battery_condition_terminal_tightness_corrosion!: any;
    public fluid_leak!: any;
    public general_engine_compression_condition!: any;
    public stabilizer_bars!: any;
    public bearings!: any;
    public joints_dust_covers!: any;
    public shock_absorbers!: any;
    public spirals!: any;
    public upper_lower_plateaus!: any;
    public stumps!: any;
    public terminal_blocks!: any;
    public brakes!: any;
    public cardan_transmission_shaft!: any;
    public engine_transmission_oil_leaks!: any;
    public hydraulic_oil_leak_steering_box!: any;
    public excessive_rust_on_frame_compact!: any;
    public exhaust_pipe!: any;
    public doors!: any;
    public stop!: any;
    public fuel_pump_door!: any;
    public trunk_door!: any;
    public trunk_interior!: any;
    public replacement_rubber_tool_set!: any;
    public complete_emblems!: any;
    public bodywork!: any;
    public paint!: any;
    public tire_condition!: any;
    public wheel_ornaments!: any;



    public general_condition!: number;
    public dealer_maintenance!: string;
    public mechanic!:any;
    public vehicle!: any;
    public created_at!: string;
    
}

export class MechanicalFileModel{
    public id_vehicle!: string;
    public id_mechanic!: string;
    public certificate!: boolean;
    
    public steering_wheel!: any;
    public pedals!: any;
    public gauges_dashboard_lights!: any;
    public transmission_shift_lever!: any;
    public brake_lever!: any;
    public accessories!: any;
    public internal_upholstery!: any;
    public courtesy_lights!: any;
    public windshield!: any;
    public window_glass_operation!: any;
    public door_locks_handles!: any;
    public operation_manual_electric_mirrors!: any;
    public seat_belts!: any;
    public front_bumpers!: any;
    public front_grill!: any;
    public headlights_low_beams_cocuyos!: any;
    public fog_lights!: any;
    public bonnet!: any;
    public engine_ignition!: any;
    public engine_noises!: any;
    public general_condition_fluids!: any;
    public fluid_reservoirs!: any;
    public spark_plugs_coils_general_condition!: any;
    public air_filter!: any;
    public transmission_belts!: any;
    public appearance_hoses_caps_seals_connections!: any;
    public battery_condition_terminal_tightness_corrosion!: any;
    public fluid_leak!: any;
    public general_engine_compression_condition!: any;
    public stabilizer_bars!: any;
    public bearings!: any;
    public joints_dust_covers!: any;
    public shock_absorbers!: any;
    public spirals!: any;
    public upper_lower_plateaus!: any;
    public stumps!: any;
    public terminal_blocks!: any;
    public brakes!: any;
    public cardan_transmission_shaft!: any;
    public engine_transmission_oil_leaks!: any;
    public hydraulic_oil_leak_steering_box!: any;
    public excessive_rust_on_frame_compact!: any;
    public exhaust_pipe!: any;
    public doors!: any;
    public stop!: any;
    public fuel_pump_door!: any;
    public trunk_door!: any;
    public trunk_interior!: any;
    public replacement_rubber_tool_set!: any;
    public complete_emblems!: any;
    public bodywork!: any;
    public paint!: any;
    public tire_condition!: any;
    public wheel_ornaments!: any;



    public general_condition!: number;
    public dealer_maintenance!: string;
}

export class ObjectMecFileModel{
    public apply: boolean = false;
    public no_apply: boolean = false;
    public upgrade: boolean = false;
}