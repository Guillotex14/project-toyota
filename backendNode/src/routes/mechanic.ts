import { Router, Request, Response, response } from 'express';
import { ResponseModel } from '../models/Response';
import moment from 'moment';

import vehicles from '../models/Vehicles';
import mechanics from '../models/Mechanics';
import sellers from '../models/Sellers';
import users from '../models/Users';
import mechanicalsFiles from '../models/mechanicalsFiles';
import notifications from '../models/notifications';
import ImgVehicle from '../models/ImgVehicle';
import { sendEmail } from '../../nodemailer';
import brands from '../models/brands';
import modelVehicle from '../models/modelVehicle';

const mechanicRouter = Router();

mechanicRouter.post("/inspections", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id_mechanic} = req.body;

    const vehiclesList = await vehicles.find({id_mechanic: id_mechanic, mechanicalFile: false}).sort({date_create: -1});
    if(vehiclesList.length > 0){

        let arrayInpecciones: any[] = [];

        for (let i = 0; i < vehiclesList.length; i++) {
            let data = {
                name_new_owner: vehiclesList[i].name_new_owner,
                dni_new_owner: vehiclesList[i].dni_new_owner,
                phone_new_owner: vehiclesList[i].phone_new_owner,
                email_new_owner: vehiclesList[i].email_new_owner,
                price_ofert: vehiclesList[i].price_ofert,
                final_price_sold: vehiclesList[i].final_price_sold,
                _id: vehiclesList[i]._id,
                model: vehiclesList[i].model,
                brand: vehiclesList[i].brand,
                year: vehiclesList[i].year,
                displacement: vehiclesList[i].displacement,
                km: vehiclesList[i].km,
                engine_model: vehiclesList[i].engine_model,
                titles: vehiclesList[i].titles,
                fuel: vehiclesList[i].fuel,
                transmission: vehiclesList[i].transmission,
                city: vehiclesList[i].city,
                dealer: vehiclesList[i].dealer,
                concesionary: vehiclesList[i].concesionary,
                traction_control: vehiclesList[i].traction_control,
                performance: vehiclesList[i].performance,
                comfort: vehiclesList[i].comfort,
                technology: vehiclesList[i].technology,
                id_seller: vehiclesList[i].id_seller,
                id_mechanic: vehiclesList[i].id_mechanic,
                __v: vehiclesList[i].__v,
                price: vehiclesList[i].price,
                mechanicalFile: vehiclesList[i].mechanicalFile,
                id_seller_buyer: vehiclesList[i].id_seller_buyer,
                sold: vehiclesList[i].sold,
                type_vehicle: vehiclesList[i].type_vehicle,
                traction: vehiclesList[i].traction,
                date_sell: vehiclesList[i].date_sell,
                date_create: vehiclesList[i].date_create,
                plate: vehiclesList[i].plate,
                vin: vehiclesList[i].vin,
                image: await ImgVehicle.findOne({ id_vehicle: vehiclesList[i]._id }) ? await ImgVehicle.findOne({ id_vehicle: vehiclesList[i]._id }) : "",
            }
            arrayInpecciones.push(data);
        }

        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Inspecciones encontradas";
        reponseJson.data = arrayInpecciones;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontraron inspecciones";
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
    const imgVehicle = await ImgVehicle.find({id_vehicle: id});
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
                traction: vehicle.traction,
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
                date_create: vehicle.date_create,
                type_vehicle: vehicle.type_vehicle,
                id_seller: vehicle.id_seller,
                id_mechanic: vehicle.id_mechanic,
                id_seller_buyer: vehicle.id_seller_buyer,
                general_condition: mechanicFile.general_condition,
                images: imgVehicle ? imgVehicle : []
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
                transmission_2: vehicle.traction,
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
                date_create: vehicle.date_create,
                type_vehicle: vehicle.type_vehicle,
                id_seller: vehicle.id_seller,
                id_mechanic: vehicle.id_mechanic,
                id_seller_buyer: vehicle.id_seller_buyer,
                general_condition: "",
                images: imgVehicle ? imgVehicle : []
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
        date_create: dateNow,
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

        const mailOptions = {
            from: 'Toyousado Notifications',
            to: mailSeller,
            subject: 'Ficha mecanica creada',
            text: `La ficha mecanica de tu vehiculo ha sido creada correctamente, la ficha mecanica fue creada por ${infoMechanic!.fullname} de la concesionaria ${infoMechanic!.concesionary} de la ciudad de ${infoMechanic!.city}`,
        };

        await sendEmail(mailOptions);

        // if (general_condition === "malo") {
        //     const mailOptions = {
        //         from: 'Toyousado Notifications',
        //         to: mailSeller,
        //         subject: 'Ficha mecanica Rechazada',
        //         text: `La ficha mecanica de tu vehiculo ha sido Rechazada, la ficha mecanica fue rechazada por ${mechanic!.fullName} de la concesionaria ${mechanic!.concesionary} de la ciudad de ${mechanic!.city}, para mas informacion contacta con el mecanico`,
        //     };

        //       await sendEmail(mailOptions);

        // }

        // if (general_condition === "bueno" || general_condition === "excelente" || general_condition === "regular") {     
        //     const mailOptions = {
        //         from: 'Toyousado Notifications',
        //         to: mailSeller,
        //         subject: 'Ficha mecanica creada',
        //         text: `La ficha mecanica de tu vehiculo ha sido creada correctamente, la ficha mecanica fue creada por ${mechanic!.fullName} de la concesionaria ${mechanic!.concesionary} de la ciudad de ${mechanic!.city}`,
        //     };
    
        //      await sendEmail(mailOptions);

        // }

        sendNotification(vehicle!.id_seller?.toString()!, mailOptions.text, mailOptions.subject);

    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo crear la Ficha mecanica";
    }

    res.json(reponseJson);
});

mechanicRouter.post("/getVehicles", async (req: Request, res: Response) => {
    //aqui declaramos las respuestas
    const reponseJson: ResponseModel = new ResponseModel();
    let query: any = {};
    //aqui declaramos las variables que vamos a recibir
    const {
    minYear,
    maxYear,
    minKm,
    maxKm,
    minPrice,
    maxPrice,
    brand,
    model,
    ubication,
    type_vehicle,
    id_mechanic
    } = req.body;

    //aqui creamos las condiciones para el filtro de los vehiculos y las querys

    if (minYear === 0 && maxYear === 0) {
    query.year = { $gte: 0 };
    } else if (minYear !== 0 && maxYear === 0) {
    query.year = { $gte: minYear };
    } else if (minYear === 0 && maxYear !== 0) {
    query.year = { $lte: maxYear };
    } else {
    query.year = { $gte: minYear, $lte: maxYear };
    }

    if (minKm === 0 && maxKm === 0) {
    query.km = { $gte: 0 };
    } else if (minKm !== 0 && maxKm === 0) {
    query.km = { $gte: minKm };
    } else if (minKm === 0 && maxKm !== 0) {
    query.km = { $lte: maxKm };
    } else {
    query.km = { $gte: minKm, $lte: maxKm };
    }

    if (minPrice === 0 && maxPrice === 0) {
    query.price = { $gte: 0, $ne: null };
    } else if (minPrice !== 0 && maxPrice === 0) {
    query.price = { $gte: minPrice, $ne: null };
    } else if (minPrice === 0 && maxPrice !== 0) {
    query.price = { $lte: maxPrice, $ne: null };
    } else {
    query.price = { $gte: minPrice, $lte: maxPrice };
    }

    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    query.mechanicalFile = true;
    query.id_mechanic = id_mechanic;

    const vehiclesFiltered = await vehicles.find(query).sort({date_create:-1});

    if (vehiclesFiltered) {

        let arrayVehicles: any[] = [];

        for (let i = 0; i < vehiclesFiltered.length; i++) {
            let data = {
                name_new_owner: vehiclesFiltered[i].name_new_owner,
                dni_new_owner: vehiclesFiltered[i].dni_new_owner,
                phone_new_owner: vehiclesFiltered[i].phone_new_owner,
                email_new_owner: vehiclesFiltered[i].email_new_owner,
                price_ofert: vehiclesFiltered[i].price_ofert,
                final_price_sold: vehiclesFiltered[i].final_price_sold,
                _id: vehiclesFiltered[i]._id,
                model: vehiclesFiltered[i].model,
                brand: vehiclesFiltered[i].brand,
                year: vehiclesFiltered[i].year,
                displacement: vehiclesFiltered[i].displacement,
                km: vehiclesFiltered[i].km,
                engine_model: vehiclesFiltered[i].engine_model,
                titles: vehiclesFiltered[i].titles,
                fuel: vehiclesFiltered[i].fuel,
                transmission: vehiclesFiltered[i].transmission,
                city: vehiclesFiltered[i].city,
                dealer: vehiclesFiltered[i].dealer,
                concesionary: vehiclesFiltered[i].concesionary,
                traction_control: vehiclesFiltered[i].traction_control,
                performance: vehiclesFiltered[i].performance,
                comfort: vehiclesFiltered[i].comfort,
                technology: vehiclesFiltered[i].technology,
                id_seller: vehiclesFiltered[i].id_seller,
                id_mechanic: vehiclesFiltered[i].id_mechanic,
                __v: vehiclesFiltered[i].__v,
                price: vehiclesFiltered[i].price,
                mechanicalFile: vehiclesFiltered[i].mechanicalFile,
                id_seller_buyer: vehiclesFiltered[i].id_seller_buyer,
                sold: vehiclesFiltered[i].sold,
                type_vehicle: vehiclesFiltered[i].type_vehicle,
                traction: vehiclesFiltered[i].traction,
                date_sell: vehiclesFiltered[i].date_sell,
                date_create: vehiclesFiltered[i].date_create,
                plate: vehiclesFiltered[i].plate,
                vin: vehiclesFiltered[i].vin,
                image: await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id }) ? await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id }) : "",
            }
            arrayVehicles.push(data);
        }

        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;
    } else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);
}
);

mechanicRouter.post('/getNotifications', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_user } = req.body;

    const notificationsUser = await notifications.find({id_user: id_user, status: false}).sort({date: -1});

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

mechanicRouter.get("/allBrands", async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();

    const brand = await brands.find()

    if (brand) {

    jsonResponse.code = 200;
    jsonResponse.message = "success";
    jsonResponse.status = true;
    jsonResponse.data = brand;
    
    } else {
    jsonResponse.code = 400;
    jsonResponse.message = "no existe";
    jsonResponse.status = false;
    
    }

    res.json(jsonResponse);
});

mechanicRouter.get("/allModels", async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();

    const model = await modelVehicle.find();

    if (model) {
    jsonResponse.code = 200;
    jsonResponse.message = "todos los modelos";
    jsonResponse.status = true;
    jsonResponse.data = model;
    }else{
    jsonResponse.code = 400;
    jsonResponse.message = "no hay modelos";
    jsonResponse.status = false;
    }

    res.json(jsonResponse);

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