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
  public traction_control!: boolean;
  public performance!: boolean;
  public price!: number;
  public comfort!: boolean;
  public technology!: boolean;
  public id_seller!: string;
  public id_mechanic!: string;
  public id_seller_buyer!: string;
  public mechanicalFile!: boolean;
  public type_vehicle!: string;
  public sold!: boolean;
  public general_condition!: string;
  public images!: ImagesVehicle[];
  public vin!: string;
  public vehicle_plate!: string;
  public price_ofert!: number;
  public final_price_sold!: number;
  public plate!: string;
}

export class CarDetailMechanicalFile{
  public air_conditioning_system!: string;
  public battery_status_terminals!: string;
  public bearings!: string;
  public board_lights!: string;
  public brake_bands_drums!: string;
  public brake_fluid!: string;
  public brake_pads_discs!: string;
  public brake_pipes_hoses!: string;
  public bugle_accessories!: string;
  public bushings_plateaus!: string;
  public courtesy_lights!: string;
  public dealer_maintenance!: string;
  public distribution_mail!: string;
  public engine_coolant_container!: string;
  public exhaust_pipe_bracket!: string;
  public fuel_system!: string;
  public fuel_tank_cover_pipes_hoses_connections!: string;
  public gts!: string;
  public hits!: string;
  public id_mechanic!: string;
  public id_vehicle!: string;
  public master_cylinder!: string;
  public motor_oil!: string;
  public paint_condition!: string;
  public parking_break!: string;
  public part_emblems_complete!: string;
  public radiator_status!: string;
  public radio_player!: string;
  public scratches!: string;
  public shock_absorbers_coils!: string;
  public spark_plugs_air_filter_fuel_filter_anti_pollen_filter!: string;
  public stabilizer_bar!: string;
  public stumps!: string;
  public terminals!: string;
  public tire_life!: string;
  public tire_pressure!: string;
  public transmitter_belts!: string;
  public tripoids_rubbe_bands!: string;
  public upholstery_condition!: string;
  public wiper_shower_brushes_windshield!: string;
  public headlights_lights!: string;
  public general_condition!: string;

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
  public general_condition!: string;
  
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
