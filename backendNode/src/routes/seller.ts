import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import moment from "moment";
import multer from 'multer';

import Users from "../models/Users";
import vehicles from "../models/Vehicles";
import mechanics from "../models/Mechanics";
import zones from "../models/Zones";
import concesionary from "../models/Concesionaries";
import { ResponseModel } from "../models/Response";
import mechanicalsFiles from "../models/mechanicalsFiles";
import Sellers from "../models/Sellers";
import brands from "../models/brands";
import notifications from "../models/notifications";

const sellerRouter = Router();

sellerRouter.post("/addMechanic", async (req: Request, res: Response) => {
    
    const reponseJson:ResponseModel = new ResponseModel();
    const date_created = moment().format('DD/MM/YYYY');
    const {email,password,username,fullName,city,concesionary} = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    const newUser = new Users({email,password:hash,username,type_user: "mechanic"});
    const newMechanic = new mechanics({fullName,city,concesionary,date_created});

    await newUser.save().then((res:any) => {
        if (res) {
            newMechanic.id_user = res._id;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    await newMechanic.save()
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jefersonmujica@gmail.com',
            pass: 'qtthfkossxcahyzo',
        }
    });
    
    const mailOptions = {
        from: 'Toyousado',
        to: email,
        subject: 'Bienvenido',
        text: 'Bienvenido a Toyousado, tu usuario es: ' + email + ' y tu contraseña es: ' + password + '',
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        };
    });


    reponseJson.code = 200;
    reponseJson.message = "Mecanico agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";

    res.json(reponseJson);
    
});

sellerRouter.post("/addVehicle", async (req: Request, res: Response) => {
    
    const reponseJson:ResponseModel = new ResponseModel();
    let emailmechanic = "";
    let infoSeller: any = {};
    let dateNow = moment().format('DD/MM/YYYY');

    const {model,brand,year,displacement,km,engine_model,titles,fuel,transmission,transmission_2,city,dealer,concesionary,traction_control,performance,comfort,technology, price, id_seller, id_mechanic, type_vehicle, images} = req.body;

    const newVehicle =  new vehicles({model,year,brand,displacement,km,engine_model,titles,fuel,transmission,transmission_2,city,dealer,concesionary,traction_control,performance,comfort,technology, mechanicalFile: false, sold: false,date:dateNow,price:null,id_seller, id_mechanic, id_seller_buyer: null, type_vehicle});
    
    await newVehicle.save()

    await mechanics.findOne({_id: id_mechanic}).then(async (res:any) => {
        
        if (res) {
            await Users.findOne({_id: res.id_user}).then((res:any) => {
                if (res) {
                    emailmechanic = res.email;
                }
            }).catch((err: any) => {
                console.log(err)
            });
        }
    }).catch((err: any) => {
        console.log(err)
    });

    infoSeller = await Sellers.findOne({_id: id_seller})

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jefersonmujica@gmail.com',
            pass: 'qtthfkossxcahyzo',
        }
    });
    
    const mailOptions = {
        from: 'Toyousado',
        to: emailmechanic,
        subject: 'Revisión de vehiculo',
        text: 'El vendedor ' + infoSeller!.fullName +' del concesionario ' + infoSeller!.concesionary + ' de la ciudad de ' + infoSeller!.city + ' ha agregado un vehiculo para que sea revisado, por favor ingresa a la plataforma para revisarlo',
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    sendNotificationMechanic(id_mechanic, mailOptions.text, mailOptions.subject);

    reponseJson.code = 200;
    reponseJson.message = "Vehiculo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";

    res.json(reponseJson);

});

sellerRouter.post("/addMechanicalFile", async (req: Request, res: Response) => {
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
        approve: false,
        reject: false,
        edit: false,
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

sellerRouter.get("/allVehicles", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();

    const {id_seller} = req.body;
    
    const ress = await vehicles.find({mechanicalFile:true,sold:false,id_seller:{$ne: id_seller},price:{$ne:null}}).sort({date:-1}).then((res:any) => {
        console.log("carros a la venta", res)
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            jsonRes.data = res;
            return jsonRes;
        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err: any) => {
        console.log(err)
    });


    res.json(ress);
});

sellerRouter.post("/myVehicles", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();
    const {id_seller} = req.body;

    const ress = await vehicles.find({id_seller: id_seller}).then((res:any) => {
        console.log("carros a la venta", res)
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            jsonRes.data = res;
            return jsonRes;
        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    res.json(ress);
});

sellerRouter.post("/vehicleById", async (req: Request, res: Response) => {

    const jsonRes: ResponseModel = new ResponseModel();

    const {id} = req.body;

    const ress = await vehicles.findOne({_id: id}).then(async (res:any) => {
        
        if (res) {
            await mechanicalsFiles.findOne({id_vehicle: res._id}).then((res2:any) => {
                if (res2) {

                    let vehicle = {
                        _id: res._id,
                        model: res.model,
                        year: res.year,
                        brand: res.brand,
                        displacement: res.displacement,
                        km: res.km,
                        engine_model: res.engine_model,
                        titles: res.titles,
                        fuel: res.fuel,
                        transmission: res.transmission,
                        transmission_2: res.transmission_2,
                        city: res.city,
                        dealer: res.dealer,
                        concesionary: res.concesionary,
                        traction_control: res.traction_control,
                        performance: res.performance,
                        price: res.price,
                        comfort: res.comfort,
                        technology: res.technology,
                        mechanicalFile: res.mechanicalFile,
                        sold: res.sold,
                        date: res.date,
                        type_vehicle: res.type_vehicle,
                        id_seller: res.id_seller,
                        id_mechanic: res.id_mechanic,
                        id_seller_buyer: res.id_seller_buyer,
                        general_condition: res2.general_condition
                    }

                    jsonRes.code = 200;
                    jsonRes.message = "success";
                    jsonRes.status = true;
                    jsonRes.data = vehicle;
                    return jsonRes;
                }else{
                    jsonRes.code = 400;
                    jsonRes.message = "no existe";
                    jsonRes.status = false;
                    return jsonRes;
                }

            }).catch((err: any) => {
                console.log(err)
            });

        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }
    ).catch((err: any) => {
        console.log(err)
    });

    res.json(jsonRes);
});

sellerRouter.post("/mechanicalFileByIdVehicle", async (req: Request, res: Response) => {
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

sellerRouter.get("/allMechanics", async (req: Request, res: Response) => {
    const responseJson:ResponseModel = new ResponseModel();
    let arrayMechanics: any[] = [];
    let infoMechanic: any[] = [];

    const ress = await Users.find({type_user: "mechanic"}).then(async (res:any) => {
        if (res) {
            responseJson.code = 200;
            responseJson.message = "success";
            responseJson.status = true;

            for (let i = 0; i < res.length; i++) {
                await mechanics.find({id_user: res[i]._id}).then((res2:any) => {
                    if (res2) {
                        res2.forEach((element:any) => {
                            infoMechanic.push(element);
                        });
                    }else{
                        infoMechanic = [];
                        return res2;
                    }
                }).catch((err: any) => {
                    console.log(err)
                });    
            }

            for (let j = 0; j < res.length; j++) {
                for (let k = 0; k < infoMechanic.length; k++) {
                    if (res[j]._id.toString() === infoMechanic[k].id_user.toString()) {
                        let mechanic = {
                            id: res[j]._id,
                            id_mechanic: infoMechanic[k]._id,
                            fullName: infoMechanic[k].fullName,
                            city: infoMechanic[k].city,
                            concesionary: infoMechanic[k].concesionary,
                            email: res[j].email,
                            username: res[j].username,
                            type_user: res[j].type_user
                        }
                        arrayMechanics.push(mechanic);
                    }
                }
            }

            responseJson.data = arrayMechanics;
            return responseJson;
        }else{
            responseJson.code = 400;
            responseJson.message = "no existe";
            responseJson.status = false;
            return responseJson;
        }
    }).catch((err: any) => {
        console.log(err)
    }
    );

    res.json(ress);

});

sellerRouter.post("/mechanicByConcesionary", async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();
    const {concesionary} = req.body;

    const ress = await mechanics.find({concesionary: concesionary}).then((res:any) => {
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        } else if (!res) {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    res.json(ress);

});

sellerRouter.get("/allZones", async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();
    const ress = await zones.find().then((res:any) => {
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        } else if (!res) {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }).catch((err: any) => {
        console.log(err)
    });
    res.json(ress);
});

sellerRouter.get("/allConcesionaries", async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();

    const ress = await concesionary.find().then(async (res:any) => {
        console.log(res)
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        } else if (!res) {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    res.json(ress);

});

sellerRouter.get("/allBrands", async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();

    const brand = await brands.find().then((res:any) => {
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        } else {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    res.json(jsonResponse);

});

sellerRouter.post('/buyVehicle', async (req: Request, res: Response) => {
    const responseJson: ResponseModel = new ResponseModel();
    
    const { id_vehicle, id_seller } = req.body;

    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {id_seller_buyer: id_seller})

    const getVehicle = await vehicles.findById(id_vehicle);

    const infoBuyer = await Sellers.findById(id_seller);

    const infoSeller = await Sellers.findById(getVehicle!.id_seller);

    const email = await Users.findById(infoSeller!.id_user);

    const emailBuyer = await Users.findById(infoBuyer!.id_user);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jefersonmujica@gmail.com',
            pass: 'qtthfkossxcahyzo',
        },
    });

    const mailOptions = {
        from: 'Toyousado Notifications',
        to: email!.email,
        subject: 'Compra de vehiculo',
        text: `el vendedor ${infoBuyer!.fullName} quiere comprar tu vehiculo, para mas información comunicate con el vendedor al correo ${emailBuyer!.email} o al numero telefono ${infoBuyer!.phone}`,
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        };
    });

    sendNotification(infoSeller!._id.toString(), mailOptions.text, mailOptions.subject)

    responseJson.code = 200;
    responseJson.message = "Compra realizada, esperar confirmación o rechazo del vendedor";
    responseJson.status = true;

    res.json(responseJson);

})

sellerRouter.post('/approveBuyVehicle', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_vehicle } = req.body;

    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {sold: true});

    const infoBuyer = await Sellers.findById(vehicle!.id_seller_buyer);

    const userbuyer = await Users.findById(infoBuyer!.id_user);

    const infoSeller = await Sellers.findById(vehicle!.id_seller);

    const userSeller = await Users.findById(infoSeller!.id_user);

    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = vehicle;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jefersonmujica@gmail.com',
                pass: 'qtthfkossxcahyzo',
            },
        });
    
        const mailOptions = {
            from: 'Toyousado Notifications',
            to: userbuyer!.email,
            subject: 'Compra de vehiculo aprobada',
            text: `Tu compra del vehiculo ${vehicle!.model} del concesionario ${vehicle!.concesionary} ha sido aprobada, para mas información comunicate con el vendedor al correo ${userSeller!.email} o al numero telefono ${infoSeller!.phone}`,
        }
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            };
        });

        sendNotification(userbuyer!._id.toString(), mailOptions.text, mailOptions.subject)

    }else{
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);
});

sellerRouter.post('/rejectBuyVehicle', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_vehicle } = req.body;

    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {id_seller_buyer: null, sold: false});
    
    const infoBuyer = await Sellers.findById(vehicle!.id_seller_buyer);

    const userbuyer = await Users.findById(infoBuyer!.id_user);

    const infoSeller = await Sellers.findById(vehicle!.id_seller);

    const userSeller = await Users.findById(infoSeller!.id_user);

    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = vehicle;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jefersonmujica@gmail.com',
                pass: 'qtthfkossxcahyzo',
            },
        });
    
        const mailOptions = {
            from: 'Toyousado Notifications',
            to: userbuyer!.email,
            subject: 'Compra de vehiculo rechazada',
            text: `Tu compra del vehiculo ${vehicle!.model} del concesionario ${vehicle!.concesionary} fue rechazada, para mas información comunicate con el vendedor al correo ${userSeller!.email} o al numero telefono ${infoSeller!.phone}`,
        }
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            };
        });

        sendNotification(userbuyer!._id.toString(), mailOptions.text, mailOptions.subject)

    }else{
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);

});

sellerRouter.post('/getNotifications', async (req: Request, res: Response) => {
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

sellerRouter.post('/updateNotification', async (req: Request, res: Response) => {
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

sellerRouter.post('/notificationById', async (req: Request, res: Response) => {
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

sellerRouter.post('/countNotifications', async (req: Request, res: Response) => {
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

sellerRouter.post('/getVehicleByType', async (req: Request, res: Response) => {

    const reponseJson: ResponseModel = new ResponseModel();

    const { type_vehicle } = req.body;

    const arrayVehicles = await vehicles.find({type_vehicle: type_vehicle, mechanicalFile: true, sold: false, id_seller_buyer: null});
    
    if (arrayVehicles) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;
    }else{
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);
});

const sendNotification = async (id_seller:string, message: string, title: string) => {
    // const jsonRes: ResponseModel = new ResponseModel();

    const userInfo = await Sellers.findOne({_id: id_seller});

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

const sendNotificationMechanic = async (id_mechanic:string, message: string, title: string) => {
    // const jsonRes: ResponseModel = new ResponseModel();

    const userInfo = await mechanics.findOne({_id: id_mechanic});

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

function saveImage(img: any,imgname: any) {
    let posr = img.split(';')[0];
    let base64 = img.split(';base64,').pop();
    let mime_type = posr.split(':')[1];
    let type = mime_type.split('/')[1];
    let directory = '../public/img/vehicles/';

    img.mv(__dirname + directory + imgname + "." + type);

    return imgname + "." + type;

}


// public function uploadBase64($image, $name)
//     {
//         $posr = explode(';', $image)[0];
//         $base64 = explode(";base64,", $image);
//         $mime_type = explode(':', $posr)[1];
//         $type = explode('/', $mime_type)[1];
//         $directory = '../public/img/recipes/';

//         file_put_contents($directory . $name . "." . $type, base64_decode($base64[1]));
//         return $name . "." . $type;
//     }

export default sellerRouter;