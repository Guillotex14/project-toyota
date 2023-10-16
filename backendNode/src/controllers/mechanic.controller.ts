import { Request, Response } from 'express';
import jwt from "../helpers/generar-jwt";
import moment from 'moment';
import { sendEmail } from '../../nodemailer';
import mechanicalsFiles from '../schemas/mechanicalsFiles.schema';
import notifications from '../schemas/notifications.schema';
import ImgVehicle from '../schemas/ImgVehicle.schema';
import mechanics from '../schemas/Mechanics.schema';
import { ResponseModel } from '../models/Response';
import vehicles from '../schemas/Vehicles.schema';
import sellers from '../schemas/Sellers.schema';
import users from '../schemas/Users.schema';


const mechanicController: any = {};

mechanicController.getVehicles = async (req: Request, res: Response) => {
    
    //aqui declaramos las respuestas
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);

    
    let query: any = {};
    let arrayVehicles: any[] = [];
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

    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    
    //aqui creamos las condiciones para el filtro de los vehículos y las querys

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

    // if (minPrice === 0 && maxPrice === 0) {
    // query.price = { $gte: 0, $ne: null };
    // } else if (minPrice !== 0 && maxPrice === 0) {
    // query.price = { $gte: minPrice, $ne: null };
    // } else if (minPrice === 0 && maxPrice !== 0) {
    // query.price = { $lte: maxPrice, $ne: null };
    // } else {
    // query.price = { $gte: minPrice, $lte: maxPrice };
    // }

    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    query.mechanicalFile = true;
    query.id_mechanic = id_mechanic;

    const vehiclesFiltered = await vehicles.find(query).sort({date_create:-1});

    if (vehiclesFiltered) {

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
        reponseJson.message = "Vehicleos encontrados exitosamente";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;
    } else {
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron vehículos";
        reponseJson.status = false;
    }

    res.json(reponseJson);
}

mechanicController.inspections = async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id_mechanic} = req.body;

    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);

    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

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
}

mechanicController.countInspections = async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id_mechanic} = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);

    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    const vehiclesList = await vehicles.countDocuments({id_mechanic: id_mechanic, mechanicalFile: false});

    reponseJson.code = 200;
    reponseJson.status = true;
    reponseJson.message = "Cantidad de vehículos";
    reponseJson.data = vehiclesList;
    
    res.json(reponseJson);

}

mechanicController.getVehicleById = async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id} = req.body;

    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);

    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    
    const vehicle = await vehicles.findOne({_id: id});
    const mechanicFile = await mechanicalsFiles.findOne({id_vehicle: id});
    const imgVehicle = await ImgVehicle.find({id_vehicle: id});
    if(vehicle){
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
            general_condition: mechanicFile ? mechanicFile.general_condition : "",
            images: imgVehicle ? imgVehicle : []
        }
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Vehículo encontrado";
        reponseJson.data = data;

    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro el vehículo";
    }

    res.json(reponseJson);

}

mechanicController.addMechanicalFile = async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);
    
    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    let mailSeller: any = "";
    let infoMechanic:any = {};
    let nameSeller: string = ""
    let conceSeller: string = ""
    let citySeller: string = ""
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
        stabilizer_bar,
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
        stabilizer_bar,
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
        reponseJson.message = "Ficha mecánica creada correctamente";
        reponseJson.data = newMechanicFileSaved;

        //obteniendo el correo del vendedor
        const vehicle = await vehicles.findOne({_id: id_vehicle});

        if(vehicle){
            const seller = await sellers.findOne({_id: vehicle.id_seller});
            if(seller){
                nameSeller = seller!.fullName!;
                conceSeller = seller!.concesionary!;
                citySeller = seller!.city!;
                const user = await users.findOne({_id: seller.id_user})
                if(user){
                    mailSeller = user.email!;
                }
            }
        }
        //obteniendo la informacion del tecnico
        const mechanic = await mechanics.findOne({_id: id_mechanic});

        if(mechanic){
            infoMechanic.fullname = mechanic.fullName;
            infoMechanic.concesionary = mechanic.concesionary;
            infoMechanic.city = mechanic.city;
        }

        const mailOptions = {
            from: 'Toyousado Notifications',
            to: mailSeller,
            subject: 'Ficha mecánica creada',
            html: `<div>
            <p>Ficha técnica creada exitosamente para:</p>
            </div>
            <div class="div-table" style="width: 100%;">
                <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
                <div style=" display: table-row;border: 1px solid #000;">
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle!.model}</div>
                </div>
                <div style=" display: table-row;border: 1px solid #000;">
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle!.year}</div>
                </div>
                <div style=" display: table-row;border: 1px solid #000;">
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${vehicle!.plate}</div>
                </div>
                <div style=" display: table-row;border: 1px solid #000;">
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${nameSeller}</div>
                </div>
                <div style=" display: table-row;border: 1px solid #000;">
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${conceSeller}</div>
                </div>
                <div style=" display: table-row;border: 1px solid #000;">
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
                    <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${citySeller}</div>
                </div>
                </div>
            </div>`,
        };
        
        const dataVehicle = {
            model: vehicle!.model,
            year: vehicle!.year,
            plate: vehicle!.plate ? vehicle!.plate : "",
            fullName: nameSeller,
            concesionary: conceSeller,
            city: citySeller,
            title: "Ficha técnica creada exitosamente para:"
        }
        
        await sendEmail(mailOptions);

        sendNotification(vehicle!.id_seller?.toString()!, dataVehicle, "Ficha técnica creada");

    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo crear la Ficha técnica";
    }

    res.json(reponseJson);
}

mechanicController.updateMechanicalFile = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);
    const {data} = req.body;

    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    const update = await mechanicalsFiles.findByIdAndUpdate(data._id, data);

    if (update) {
        reponseJson.code = 200;
        reponseJson.message = "Ficha mecánica actualizada exitosamente";
        reponseJson.status = true;
        reponseJson.data = null;
    } else {
        reponseJson.code = 400;
        reponseJson.message = "Error al actualizar Ficha mecánica";
        reponseJson.status = false;
        reponseJson.data = null;
    }

    return res.json(reponseJson);
};

mechanicController.getMechanicFileByIdVehicle = async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();
    const {id_vehicle} = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);
    
    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    const mecFile = await mechanicalsFiles.findOne({id_vehicle: id_vehicle});
    if(mecFile){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Ficha mecánica encontrada";
        reponseJson.data = mecFile;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se encontro la ficha mecánica";
    }

    res.json(reponseJson);
}

mechanicController.getNotifications = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id_user } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);
    
    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    const notificationsUser = await notifications.find({id_user: id_user, status: false}).sort({date: -1});

    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "notificaciones encontradas exitosamente";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }else{
        reponseJson.code = 400;
        reponseJson.message = "no se encontraron notificaciones";
        reponseJson.status = false;
    }

    res.json(reponseJson);
}

mechanicController.updateNotification = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);
    
    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    const notificationsUser = await notifications.findByIdAndUpdate(id, {status: true});

    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "notification actualizada exitosamente";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }else{
        reponseJson.code = 400;
        reponseJson.message = "error al actualizar notificacion";
        reponseJson.status = false;
    }

    res.json(reponseJson);
}

mechanicController.notificationById = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);
    
    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    const notificationsUser = await notifications.findById(id);

    if (notificationsUser) {
        reponseJson.code = 200;
        reponseJson.message = "notificacion encontrada exitosamente";
        reponseJson.status = true;
        reponseJson.data = notificationsUser;
    }else{
        reponseJson.code = 400;
        reponseJson.message = "no se encontro notificacion";
        reponseJson.status = false;
    }

    res.json(reponseJson);
}

mechanicController.countNotifications = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id_user } = req.body;
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["mechanic"]);
    
    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    const countNotifies = await notifications.countDocuments({id_user: id_user, status: false});

    if (countNotifies) {
        reponseJson.code = 200;
        reponseJson.message = "conteo de notificaciones";
        reponseJson.status = true;
        reponseJson.data = countNotifies;
    }else{

        reponseJson.code = 400;
        reponseJson.message = "no se encontro notificacion";
        reponseJson.status = false;
    }

    res.json(reponseJson);

}

const sendNotification = async (id_seller:string, data: any, title: string) => {
    // const jsonRes: ResponseModel = new ResponseModel();

    const userInfo = await sellers.findOne({_id: id_seller});

    if(userInfo){
        const notify = new notifications({
            id_user: userInfo.id_user,
            title: title,
            data: data,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            status: false
        });

        await notify.save();


    }

}

export default mechanicController;
