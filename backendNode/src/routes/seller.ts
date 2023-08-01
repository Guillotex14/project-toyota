import { Router, Request, Response, json } from "express";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import moment from "moment";
import fs from 'fs';

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
import imgUser from "../models/imgUser";
import ImgVehicle from "../models/ImgVehicle";

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

    const {model,brand,year,displacement,km,engine_model,titles,fuel,transmission,traction,city,dealer,concesionary,traction_control,performance,comfort,technology, id_seller, id_mechanic, type_vehicle, images} = req.body;

    const newVehicle =  new vehicles({model,year,brand,displacement,km,engine_model,titles,fuel,transmission,traction,city,dealer,concesionary,traction_control,performance,comfort,technology, mechanicalFile: false, sold: false,date:dateNow,price:null,id_seller, id_mechanic, id_seller_buyer: null, type_vehicle});
    
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

    if (images) {
        if(images.length > 0){
            for (let i = 0; i < images.length; i++) {
                const filename = await saveBse64ImageInPublicDirectory(images[i].image, `${newVehicle._id}-${i}`);
                const imgVehi = new ImgVehicle({img: filename, id_vehicle: newVehicle._id});
                await imgVehi.save();
            }
        }
    }

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

sellerRouter.post("/addImgProfile", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();

    const { id_user, image } = req.body;

    const filename = await saveBse64ImageInPublicDirectory(image, `${id_user}`);

    const newImage = new imgUser({img: filename, id_user: id_user});

    await newImage.save();

    if (newImage) {
        reponseJson.code = 200;
        reponseJson.message = "Imagen agregada exitosamente";
        reponseJson.status = true;
        reponseJson.data = newImage;
        
    }else{
        reponseJson.code = 400;
        reponseJson.message = "No se pudo agregar la imagen";
        reponseJson.status = false;
    }

    res.json(reponseJson);

});

sellerRouter.post("/updateImgProfile", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();

    const { id_user, image, old_image } = req.body;

    const delImag = await delBse64ImageInPublicDirectoryUser(old_image);

    if (delImag) {
        const filename = await saveBse64ImageInPublicDirectoryUser(image, `${id_user}`);
        const newImage = await imgUser.findOneAndUpdate({id_user: id_user},{img: filename});

        if (newImage) {
            reponseJson.code = 200;
            reponseJson.message = "Imagen actualizada exitosamente";
            reponseJson.status = true;
            reponseJson.data = newImage;
            
        }else{
            reponseJson.code = 400;
            reponseJson.message = "No se pudo actualizar la imagen";
            reponseJson.status = false;
        }
        
    }else{
        reponseJson.code = 400;
        reponseJson.message = "No se pudo eliminar la imagen";
        reponseJson.status = false;
    }

    res.json(reponseJson);

});

sellerRouter.post("/updateVehicle", async (req: Request, res: Response) => {
    const reponseJson:ResponseModel = new ResponseModel();

    const { id_vehicle, price, images, old_image} = req.body;

    const vehicleUpdated = await vehicles.findByIdAndUpdate(id_vehicle,{price: price});

    // if (images) {
    //     if(images.length > 0){
    //         // const vehicleUpdated = await vehicles.findByIdAndUpdate(id_vehicle,{images: images});
    //     }
    // }

    if (old_image) {
        if(old_image.length > 0){

            await ImgVehicle.deleteMany({id_vehicle: id_vehicle});

            for (let i = 0; i < old_image.length; i++) {
                delBse64ImageInPublicDirectory(old_image[i].img);
            }

            if (images) {
                if(images.length > 0){
                    for (let i = 0; i < images.length; i++) {
                        let filename = saveBse64ImageInPublicDirectory(images[i].img, `${id_vehicle}`+i);
    
                        const newImage = new ImgVehicle({img: filename, id_vehicle: id_vehicle});
                        await newImage.save();
                        
                    }
                }
            }
        }
    }else{
        if (images) {
            if(images.length > 0){
                for (let i = 0; i < images.length; i++) {
                    let filename = saveBse64ImageInPublicDirectory(images[i].img, `${id_vehicle}`+i);

                    const newImage = new ImgVehicle({img: filename, id_vehicle: id_vehicle});
                    await newImage.save();
                }
            }
        }
    }

    if(vehicleUpdated){
        reponseJson.code = 200;
        reponseJson.status = true;
        reponseJson.message = "Vehiculo actualizado correctamente";
        reponseJson.data = vehicleUpdated;
    }else{
        reponseJson.code = 400;
        reponseJson.status = false;
        reponseJson.message = "No se pudo actualizar el vehiculo";
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
            await mechanicalsFiles.findOne({id_vehicle: res._id}).then(async (res2:any) => {
                if (res2) { 
                    await ImgVehicle.find({id_vehicle: res._id}).then((res3:any) => {
                        if (res3) {
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
                                general_condition: res2.general_condition,
                                images: res3
                            }
        
                            jsonRes.code = 200;
                            jsonRes.message = "success";
                            jsonRes.status = true;
                            jsonRes.data = vehicle;
                            return jsonRes;
                        }else{
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
                                general_condition: res2.general_condition,
                                images: []
                            }
        
                            jsonRes.code = 200;
                            jsonRes.message = "success";
                            jsonRes.status = true;
                            jsonRes.data = vehicle;
                            return jsonRes;
                        }
                    }).catch((err:any) => {
                        console.log(err)
                    });
                }else{
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
                        general_condition: "",
                        images: []
                    }

                    jsonRes.code = 200;
                    jsonRes.message = "auto sin ficha mecanica";
                    jsonRes.status = true;
                    jsonRes.data = vehicle;
                    return jsonRes;
                }

            }).catch((err: any) => {
                console.log(err)
            });

        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe 1";
            jsonRes.status = false;
            return jsonRes;
        }
    }
    ).catch((err: any) => {
        console.log(err)
    });

    // const ress2 = await ImgVehicle.find({id_vehicle: id});
    // console.log("imagenes", ress2)
    // if (ress2){
    //     jsonRes.data.images = ress2;
    // }else{
    //     jsonRes.data.images = [];
    // }

    // jsonRes.data.images = ress2;

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

sellerRouter.post('/filterVehiclesWithMongo', async (req: Request, res: Response) => {
    //aqui declaramos las respuestas
    const reponseJson: ResponseModel = new ResponseModel();
    let query: any = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle} = req.body;

    //aqui creamos las condiciones para el filtro de los vehiculos y las querys

    if(minYear === 0 && maxYear === 0){
        query.year = {$gte: 0};
    }else if(minYear !== 0 && maxYear === 0){
        query.year = {$gte: minYear};
    }else if(minYear === 0 && maxYear !== 0){
        query.year = {$lte: maxYear};
    }else{
        query.year = {$gte: minYear, $lte: maxYear};
    }

    if(minKm === 0 && maxKm === 0){
        query.km = {$gte: 0};
    }else if(minKm !== 0 && maxKm === 0){
        query.km = {$gte: minKm};
    }else if(minKm === 0 && maxKm !== 0){
        query.km = {$lte: maxKm};
    }else{
        query.km = {$gte: minKm, $lte: maxKm};
    }

    if(minPrice === 0 && maxPrice === 0){
        query.price = {$gte: 0, $ne:null};
    }else if(minPrice !== 0 && maxPrice === 0){
        query.price = {$gte: minPrice, $ne:null};
    }else if(minPrice === 0 && maxPrice !== 0){
        query.price = {$lte: maxPrice, $ne:null};
    }else{
        query.price = {$gte: minPrice, $lte: maxPrice};
    }

    query.city = {$regex: ubication, $options: 'i'};
    query.brand = {$regex: brand, $options: 'i'};
    query.model = {$regex: model, $options: 'i'};
    query.type_vehicle = {$regex: type_vehicle, $options: 'i'};
    query.mechanicalFile = true;
    query.sold = false;
    query.id_seller_buyer = null;

    const vehiclesFiltered = await vehicles.find(query).sort({date:-1});

    if (vehiclesFiltered) {

        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = vehiclesFiltered;

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

const saveBse64ImageInPublicDirectory = async (image: any, name: any) => {
    const posr = image.split(';')[0];
    const base64 = image.split(';base64,').pop();
    const mime_type = posr.split(':')[1];
    const type = mime_type.split('/')[1];
    const base64Data = image.replace(/^data:image\/png;base64,/, "")

    const imgBin = Buffer.from(base64Data, "base64");

    fs.writeFile("public/images/vehicle/"+ name+"."+type,imgBin, (err) => {
        if (err) {
        console.log(err);
        } else {
        console.log("Imagen guardada");
        }
    });

    return name + "." + type;
}

const saveBse64ImageInPublicDirectoryUser = async (image: any, name: any) => {
    const posr = image.split(';')[0];
    const base64 = image.split(';base64,').pop();
    const mime_type = posr.split(':')[1];
    const type = mime_type.split('/')[1];
    const base64Data = image.replace(/^data:image\/png;base64,/, "")

    const imgBin = Buffer.from(base64Data, "base64");

    fs.writeFile("public/images/users/"+ name+"."+type,imgBin, (err) => {
        if (err) {
        console.log(err);
        } else {
        console.log("Imagen guardada");
        }
    });

    return name + "." + type;
};

const delBse64ImageInPublicDirectory = async (name: any) => {
    let del = false;
    
    fs.unlink("public/images/vehicles/"+ name, (err) => {
        if (err) {
        console.log(err);
        del = false;
        } else {
            console.log("Imagen eliminada");
        del = true;
        }
    });

    return del;
};

const delBse64ImageInPublicDirectoryUser = async (name: any) => {
    let del = false;

    fs.unlink("public/images/users"+ name, (err) => {
        if (err) {
        console.log(err);
        del = false;
        } else {
            console.log("Imagen eliminada");
        del = true;
        }
    });
    
    return del;
}


export default sellerRouter;