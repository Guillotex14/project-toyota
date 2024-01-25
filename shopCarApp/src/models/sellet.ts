export class CreateMechanic {
  public email!: string;
  public password!: string;
  public password_confirm!: string;
  public username!: string;
  public fullName!: string;
  public city!: string;
  public concesionary!: string;
  public phone!: string;
  public type_user: string = 'mechanic' 
}

export class CarDetailSeller{
  public _id!: string;
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
  public id_seller_buyer!: string;
  public mechanicalFile!: boolean;
  public type_vehicle!: string;
  public sold!: boolean;
  public general_condition!: number;
  public images!: ImagesVehicle[];
  public vin!: string;
  public vehicle_plate!: string;
  public price_ofert!: number;
  public final_price_sold!: number;
  public plate!: string;
  public imgs_documentation!: any[];
  public concesionary_maintenance!: boolean;
  public certified!: boolean;
}

export class CarDetailMechanicalFile{
  public _id!: string;

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
  // public id_vehicle!: string;
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

  // //lo nuevo
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

    public id_mechanic!: string;
    public certificate!: boolean;
    public steering_wheel!: string;
    public pedals!: string;
    public gauges_dashboard_lights!: string;
    public transmission_shift_lever!: string;
    public brake_lever!: string;
    public accessories!: string;
    public internal_upholstery!: string;
    public courtesy_lights!: string;
    public windshield!: string;
    public window_glass_operation!: string;
    public door_locks_handles!: string;
    public operation_manual_electric_mirrors!: string;
    public seat_belts!: string;
    public front_bumpers!: string;
    public front_grill!: string;
    public headlights_low_beams_cocuyos!: string;
    public fog_lights!: string;
    public bonnet!: string;
    public engine_ignition!: string;
    public engine_noises!: string;
    public general_condition_fluids!: string;
    public fluid_reservoirs!: string;
    public spark_plugs_coils_general_condition!: string;
    public air_filter!: string;
    public transmission_belts!: string;
    public appearance_hoses_caps_seals_connections!: string;
    public battery_condition_terminal_tightness_corrosion!: string;
    public fluid_leak!: string;
    public general_engine_compression_condition!: string;
    public stabilizer_bars!: string;
    public bearings!: string;
    public joints_dust_covers!: string;
    public shock_absorbers!: string;
    public spirals!: string;
    public upper_lower_plateaus!: string;
    public stumps!: string;
    public terminal_blocks!: string;
    public brakes!: string;
    public cardan_transmission_shaft!: string;
    public engine_transmission_oil_leaks!: string;
    public hydraulic_oil_leak_steering_box!: string;
    public excessive_rust_on_frame_compact!: string;
    public exhaust_pipe!: string;
    public doors!: string;
    public stop!: string;
    public fuel_pump_door!: string;
    public trunk_door!: string;
    public trunk_interior!: string;
    public replacement_rubber_tool_set!: string;
    public complete_emblems!: string;
    public bodywork!: string;
    public paint!: string;
    public tire_condition!: string;
    public wheel_ornaments!: string;
    public general_condition!: number;
    public dealer_maintenance!: string;

  public mechanic!:any;
  public vehicle!: any;
  public created_at!: string;
  public id_vehicle!: string;
}

export class AddVehicle{
  public brand!: string;
  public model!: string;
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
  public traction_control!: boolean;
  public performance!: boolean;
  public comfort!: boolean;
  public technology!: boolean;
  public images!: any[];
  public price!: number;
  public concesionary!: string;
  public id_seller!: string;
  public id_mechanic!: string;
  public type_vehicle!: string;
  public vin!: string;
  public vehicle_plate!: string;
  public imgs_documents!: any[];
  public concesionary_maintenance!: boolean;
  public certified!: boolean;
}

export class AddMechanicFile{
  public id_mechanic!: string;
  public id_vehicle!: string;
  public air_conditioning_system!: string;
  public battery_status_terminals!: string;
  public bearings!: string;
  public board_lights!: string;
  public brake_bands_drums!: string;
  public brake_fluid!: string;
  public brake_pads_discs!: string;
  public bugle_accessories!: string;
  public bushings_plateaus!: string;
  public courtesy_lights!: string;
  public dealer_maintenance!: string;
  public distribution_mail!: string;
  public engine_coolant_container!: string;
  public exhaust_pipe_bracket!: string;
  public fuel_system!: string;
  public master_cylinder!: string;
  public motor_oil!: string;
  public paint_condition!: string;
  public parking_break!: string;
  public part_emblems_complete!: string;
  public radiator_status!: string;
  public radio_player!: string;
  public shock_absorbers_coils!: string;
  public stabilizer_bar!: string;
  public stumps!: string;
  public terminals!: string;
  public tire_life!: string;
  public transmitter_belts!: string;
  public tripoids_rubbe_bands!: string;
  public upholstery_condition!: string;
  public wiper_shower_brushes_windshield!: string;
  public headlights_lights!: string;
  public general_condition!: number;
  
  //lo nuevo
  public odometer!:string;
  public engine_start!:string;
  public windshields_glass!:string;
  public hits_scratches!:string;
  public spark_plugs!:string;
  public injectors!:string;
  public fuel_filter_anti_pollen_filter!:string;
  public engine_noises!:string;
  public hits_scratches_sides!:string;
  public paint_condition_sides!:string;
  public trunk_hatch!:string;
  public spare_tire!:string;
  public hits_scratches_trunk!:string;
  public paint_condition_trunk!:string;
  public headlights_lights_trunk!:string;
  public fuel_tank_cover!:string;
  public pipes_hoses_connections!:string;
  public brake_discs!:string;
  
  
  //ya no se usa
  public fuel_tank_cover_pipes_hoses_connections!: string;
  public brake_pipes_hoses!: string;
  public gts!: string;
  public hits!: string;
  public scratches!: string;
  public spark_plugs_air_filter_fuel_filter_anti_pollen_filter!: string;
  public tire_pressure!: string;

}

export class ImageAddVehicle{
  public image!: string;
}

export class VehicleList{
  public _id!: string;
  public image!: any;
  public model!: string;
  public year!: number;
  public price!: number;
  public city!: string;
  public sold!: boolean;
  public id_seller_buyer!: string;
}

export class NotificationById{
  public _id!: string;
  public id_user!: string;
  public title!: string;
  public message!: string;
  public date!: string;
  public status!: boolean;
  public data!: any;
}

export class ImagesVehicle{
  public _id!: string;
  public img!: string;
  public public_id!: string;
}

export class comparisonModel{
  brand!: string;
  city!: string;
  concesionary!: string;
  displacement!: string;
  images!: ImagesVehicle[];
  image!: ImagesVehicle;
  kmColor!: string;
  km!: number;
  model!: string;
  price!: number;
  priceColor!: string;
  firstKm!: boolean;
  secondKm!: boolean;
  thirdKm!: boolean;
  fourthKm!: boolean;
  iqualKm!: boolean;
  firstPrice!: boolean;
  secondPrice!: boolean;
  thirdPrice!: boolean;
  fourthPrice!: boolean;
  iqualPrice!: boolean;
  titles!: string;
  year!: string;
  general_condition!: any
}

export class CustomerModel{
  public email!: string;
  public name!: string;
  public last_name!: string;
  public interested_car_model!: string;
  public phone!: string;
  public approximate_budget!: string;
  public concesionary!: string;
}
