import { Router, Request, Response, response } from 'express';
import { ResponseModel } from '../models/Response';
import moment from 'moment';

import vehicles from '../models/Vehicles';
import mechanics from '../models/Mechanics';
import sellers from '../models/Sellers';
import users from '../models/Users';
import mechanicalsFiles from '../models/mechanicalsFiles';
import nodemailer from 'nodemailer';
import notifications from '../models/notifications';

const mechanicRouter = Router();

mechanicRouter.post("/inspections", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id_mechanic} = req.body;

    const vehiclesList = await vehicles.find({id_mechanic: id_mechanic, mechanicalFile: false}).sort({date: -1});
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
    const mechanicFile = await mechanicalsFiles.findOne({id_vehicle: id});
    if(vehicle){
        
        if (mechanicFile) {

            let data = {
                _id: vehicle._id,
                model: vehicle.model,
                year: vehicle.year,
                brand: vehicle.brand,
                displacement: vehicle.displacement,
                km: vehicle.km,
                engine_model: vehicle.engine_model,
                titles: vehicle.titles,
                fuel: vehicle.fuel,
                transmission: vehicle.transmission,
                transmission_2: vehicle.transmission_2,
                city: vehicle.city,
                dealer: vehicle.dealer,
                concesionary: vehicle.concesionary,
                traction_control: vehicle.traction_control,
                performance: vehicle.performance,
                price: vehicle.price,
                comfort: vehicle.comfort,
                technology: vehicle.technology,
                mechanicalFile: vehicle.mechanicalFile,
                sold: vehicle.sold,
                date: vehicle.date,
                type_vehicle: vehicle.type_vehicle,
                id_seller: vehicle.id_seller,
                id_mechanic: vehicle.id_mechanic,
                id_seller_buyer: vehicle.id_seller_buyer,
                general_condition: mechanicFile.general_condition
            }

            reponseJson.code = 200;
            reponseJson.status = true;
            reponseJson.message = "Vehiculo encontrado";
            reponseJson.data = data;

        }else{
            let data = {
                _id: vehicle._id,
                model: vehicle.model,
                year: vehicle.year,
                brand: vehicle.brand,
                displacement: vehicle.displacement,
                km: vehicle.km,
                engine_model: vehicle.engine_model,
                titles: vehicle.titles,
                fuel: vehicle.fuel,
                transmission: vehicle.transmission,
                transmission_2: vehicle.transmission_2,
                city: vehicle.city,
                dealer: vehicle.dealer,
                concesionary: vehicle.concesionary,
                traction_control: vehicle.traction_control,
                performance: vehicle.performance,
                price: vehicle.price,
                comfort: vehicle.comfort,
                technology: vehicle.technology,
                mechanicalFile: vehicle.mechanicalFile,
                sold: vehicle.sold,
                date: vehicle.date,
                type_vehicle: vehicle.type_vehicle,
                id_seller: vehicle.id_seller,
                id_mechanic: vehicle.id_mechanic,
                id_seller_buyer: vehicle.id_seller_buyer,
                general_condition: ""
            }

            reponseJson.code = 200;
            reponseJson.status = true;
            reponseJson.message = "Vehiculo encontrado";
            reponseJson.data = data;
        }

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

    const mecFile = await mechanicalsFiles.findOne({id_vehicle: id_vehicle});
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
    
    let mailSeller = "";
    let infoMechanic:any = {};
    let dateNow = moment().format('YYYY-MM-DD');
    let messageNotification = "";
    let title = "";

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
        headlights_lights,
        general_condition,
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
        headlights_lights,
        general_condition,
        date: dateNow,
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

        //obteniendo el correo del vendedor
        const vehicle = await vehicles.findOne({_id: id_vehicle});

        if(vehicle){
            const seller = await sellers.findOne({_id: vehicle.id_seller});
            if(seller){
                const user = await users.findOne({_id: seller.id_user})
                if(user){
                    mailSeller = user.email!;
                }
            }
        }

        //obteniendo la informacion del mecanico
        const mechanic = await mechanics.findOne({_id: id_mechanic});

        if(mechanic){
            infoMechanic.fullname = mechanic.fullName;
            infoMechanic.concesionary = mechanic.concesionary;
            infoMechanic.city = mechanic.city;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jefersonmujica@gmail.com',
                pass: 'qtthfkossxcahyzo',
            }
        });
        

        if (general_condition === "malo") {
            const mailOptions = {
                from: 'Toyousado Notifications',
                to: mailSeller,
                subject: 'Ficha mecanica Rechazada',
                text: `La ficha mecanica de tu vehiculo ha sido Rechazada, la ficha mecanica fue rechazada por ${infoMechanic.fullname} de la concesionaria ${infoMechanic.concesionary} de la ciudad de ${infoMechanic.city}, para mas informacion contacta con el mecanico`,
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                };
            });

            messageNotification = `La ficha mecanica de tu vehiculo ha sido Rechazada, la ficha mecanica fue rechazada por ${infoMechanic.fullname} de la concesionaria ${infoMechanic.concesionary} de la ciudad de ${infoMechanic.city}, para mas informacion contacta con el mecanico`;
            title = "Ficha mecanica Rechazada";
        }

        if (general_condition === "bueno" || general_condition === "excelente" || general_condition === "regular") {     
            const mailOptions = {
                from: 'Toyousado Notifications',
                to: mailSeller,
                subject: 'Ficha mecanica creada',
                text: `La ficha mecanica de tu vehiculo ha sido creada correctamente, la ficha mecanica fue creada por ${infoMechanic.fullname} de la concesionaria ${infoMechanic.concesionary} de la ciudad de ${infoMechanic.city}`,
            };
    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                };
            });

            messageNotification = `La ficha mecanica de tu vehiculo ha sido creada correctamente, la ficha mecanica fue creada por ${infoMechanic.fullname} de la concesionaria ${infoMechanic.concesionary} de la ciudad de ${infoMechanic.city}`;
            title = "Ficha mecanica creada";
        }

        sendNotification(vehicle!.id_seller?.toString()!, messageNotification, title);

    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo crear la Ficha mecanica";
    }

    res.json(reponseJson);
});

mechanicRouter.post('/getVehicles', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_mechanic } = req.body;

    const vehiclesMechanic = await vehicles.find({id_mechanic: id_mechanic, mechanicalFile:true});

    if(vehiclesMechanic){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Vehiculos encontrados";
        reponseJson.data = vehiclesMechanic;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontraron vehiculos";
    }

    res.json(reponseJson);

});

mechanicRouter.post('/getNotifications', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_user } = req.body;

    const notificationsUser = await notifications.find({id_user: id_user, status: false});

    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }else{
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);
});

mechanicRouter.post('/updateNotification', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id } = req.body;

    const notificationsUser = await notifications.findByIdAndUpdate(id, {status: true});

    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }else{
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);
});

mechanicRouter.post('/notificationById', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id } = req.body;

    const notificationsUser = await notifications.findById(id);

    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }else{
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);
});

mechanicRouter.post('/countNotifications', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_user } = req.body;

    const countNotifies = await notifications.countDocuments({id_user: id_user, status: false});

    if (countNotifies) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = countNotifies;
    }else{

        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);

});

const sendNotification = async (id_seller:string, message: string, title: string) => {
    // const jsonRes: ResponseModel = new ResponseModel();

    const userInfo = await sellers.findOne({_id: id_seller});

    if(userInfo){
        const notify = new notifications({
            id_user: userInfo.id_user,
            title: title,
            message: message,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            status: false
        });

        await notify.save();


    }

}

export default mechanicRouter;