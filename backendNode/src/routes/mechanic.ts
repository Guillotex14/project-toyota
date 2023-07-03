import { Router, Request, Response } from 'express';
import { ResponseModel } from '../models/Response';
import vehicles from '../models/Vehicles';
import mechanics from '../models/Mechanics';
import mechanicalsFiles from '../models/mechanicalsFiles';

const mechanicRouter = Router();

mechanicRouter.post("/inspections", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id_mechanic} = req.body;

    const vehiclesList = await vehicles.find({id_mechanic: id_mechanic, mechanicalFile: false});
    if(vehiclesList.length > 0){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.data = vehiclesList;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontraron vehiculos";
    }

    res.json(reponseJson);
});

mechanicRouter.post("/countInspections", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id_mechanic} = req.body;

    const vehiclesList = await vehicles.countDocuments({id_mechanic: id_mechanic, mechanicalFile: false});

    reponseJson.code = 200;
    reponseJson.status = true;
    reponseJson.message = "Cantidad de vehiculos";
    reponseJson.data = vehiclesList;
    
    res.json(reponseJson);

});

mechanicRouter.post("/getVehicleById", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id} = req.body;

    const vehicle = await vehicles.findOne({_id: id});
    if(vehicle){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.data = vehicle;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro el vehiculo";
    }

    res.json(reponseJson);

});

mechanicRouter.post("/getMechanicFileByIdVehicle", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id_vehicle} = req.body;

    const mecFile = await mechanicalsFiles.findOne({id_vehicle});
    if(mecFile){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica encontrada";
        reponseJson.data = mecFile;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro la ficha mecanica";
    }

    res.json(reponseJson);
});

mechanicRouter.post("/addMechanicalFile", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();

    const {
        part_emblems_complete,
        wiper_shower_brushes_windshield,
        hits,
        scratches,
        paint_condition,
        bugle_accessories,
        air_conditioning_system,
        radio_player,
        courtesy_lights,
        upholstery_condition,
        gts,
        board_lights,
        tire_pressure,
        tire_life,
        battery_status_terminals,
        transmitter_belts,
        motor_oil,
        engine_coolant_container,
        radiator_status,
        exhaust_pipe_bracket,
        fuel_tank_cover_pipes_hoses_connections,
        distribution_mail,
        spark_plugs_air_filter_fuel_filter_anti_pollen_filter,
        fuel_system,
        parking_break,
        brake_bands_drums,
        brake_pads_discs,
        brake_pipes_hoses,
        master_cylinder,
        brake_fluid,
        bushings_plateaus,
        stumps,
        terminals,
        Stabilizer_bar,
        bearings,
        tripoids_rubbe_bands,
        shock_absorbers_coils,
        dealer_maintenance,
        id_vehicle,
        id_mechanic
    } = req.body;

    const newMechanicFile = new mechanicalsFiles({
        part_emblems_complete,
        wiper_shower_brushes_windshield,
        hits,
        scratches,
        paint_condition,
        bugle_accessories,
        air_conditioning_system,
        radio_player,
        courtesy_lights,
        upholstery_condition,
        gts,
        board_lights,
        tire_pressure,
        tire_life,
        battery_status_terminals,
        transmitter_belts,
        motor_oil,
        engine_coolant_container,
        radiator_status,
        exhaust_pipe_bracket,
        fuel_tank_cover_pipes_hoses_connections,
        distribution_mail,
        spark_plugs_air_filter_fuel_filter_anti_pollen_filter,
        fuel_system,
        parking_break,
        brake_bands_drums,
        brake_pads_discs,
        brake_pipes_hoses,
        master_cylinder,
        brake_fluid,
        bushings_plateaus,
        stumps,
        terminals,
        Stabilizer_bar,
        bearings,
        tripoids_rubbe_bands,
        shock_absorbers_coils,
        dealer_maintenance,
        id_vehicle,
        id_mechanic
    });

    const newMechanicFileSaved = await newMechanicFile.save();

    const vehicleUpdated = await vehicles.findByIdAndUpdate(id_vehicle,{mechanicalFile: true});

    if(newMechanicFileSaved){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica creada correctamente";
        reponseJson.data = newMechanicFileSaved;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo crear la Ficha mecanica";
    }

    res.json(reponseJson);
});

mechanicRouter.post("/approveMechanicalFile", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();

    const {id_mechanical_file} = req.body;

    const mechanicalFileUpdated = await mechanicalsFiles.findByIdAndUpdate(id_mechanical_file,{approve: true, reject: false, edit: false});

    if(mechanicalFileUpdated){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica aprobada correctamente";
        reponseJson.data = mechanicalFileUpdated;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo aprobar la Ficha mecanica";
    }

    res.json(reponseJson);



});

mechanicRouter.post("/rejectMechanicalFile", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();

    const {id_mechanical_file} = req.body;

    const mechanicalFileUpdated = await mechanicalsFiles.findByIdAndUpdate(id_mechanical_file,{approve: false, reject: true, edit: false});

    if(mechanicalFileUpdated){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica rechazada correctamente";
        reponseJson.data = mechanicalFileUpdated;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo rechazar la Ficha mecanica";
    }

    res.json(reponseJson);

});


mechanicRouter.post("/editMechanicalFile", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();

    const { id_mechanical_file } = req.body;

    const mechanicalFileUpdated = await mechanicalsFiles.findByIdAndUpdate(id_mechanical_file,{approve: false, reject: false, edit: true});

    if(mechanicalFileUpdated){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecanica editada correctamente";
        reponseJson.data = mechanicalFileUpdated;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo editar la Ficha mecanica";
    }

    res.json(reponseJson);

});




export default mechanicRouter;