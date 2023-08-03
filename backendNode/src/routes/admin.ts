import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";

import Users from "../models/Users";
import Vehicles from "../models/Vehicles";
import sellers from "../models/Sellers";
import { ResponseModel } from "../models/Response";
import { AddSellerModel } from "../models/adminModel";
import mechanicalsFiles from "../models/mechanicalsFiles";
import moment from "moment";
import brands from "../models/brands";
import modelVehicle from "../models/modelVehicle";
import ImgVehicle from "../models/ImgVehicle";

const adminRouter = Router();

// adminRouter.get("/allVehicles", async (req: Request, res: Response) => {
//     const jsonRes: ResponseModel = new ResponseModel();

//     const listVehicles = await Vehicles.find({sold: false,price:{$ne:null}}).sort({date: -1});

//     if (listVehicles) {
//         jsonRes.code = 200;
//         jsonRes.message = "success";
//         jsonRes.status = true;
//         jsonRes.data = listVehicles;
//     }else{
//         jsonRes.code = 400;
//         jsonRes.message = "no existe";
//         jsonRes.status = false;
//     }

//     res.json(jsonRes);
// });

adminRouter.post('/allVehicles', async (req: Request, res: Response) => {
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
        query.price = {$gte: minPrice, $lte: maxPrice, $en:null};
    }

    query.city = {$regex: ubication, $options: 'i'};
    query.brand = {$regex: brand, $options: 'i'};
    query.model = {$regex: model, $options: 'i'};
    query.type_vehicle = {$regex: type_vehicle, $options: 'i'};
    query.sold = false;
    query.id_seller_buyer = null;

    const vehiclesFiltered = await Vehicles.find(query).sort({date_create:-1});

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

adminRouter.get("/allSellers", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();
    let arraySellers: any[] = [];
    let infoSellers: any[] = [];

    const ress = await Users.find({type_user: "seller"}).sort({date_created:-1}).then(async (res:any) => {
        if (res) {

            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;

            for (let i = 0; i < res.length; i++) {
                await sellers.find({id_user: res[i]._id}).then((res2:any) => {
                    
                    if (res2) {
                        res2.forEach((element: any) => {
                            infoSellers.push(element);
                        });
                    } else if (!res2) {
                        infoSellers = [];
                        return res2;
                    }
                }).catch((err: any) => {
                    console.log(err)
                });
                
            }

            for (let j = 0; j < res.length; j++) {
                for (let k = 0; k < infoSellers.length; k++) {
                    if (res[j]._id.toString() == infoSellers[k].id_user.toString()) {
                        let seller = {
                            id: res[j]._id,
                            id_seller: infoSellers[k]._id,
                            fullName: infoSellers[k].fullName,
                            city: infoSellers[k].city,
                            concesionary: infoSellers[k].concesionary,
                            username: res[j].username,
                            email: res[j].email,
                            type_user: res[j].type_user,
                        }
                        arraySellers.push(seller);
                    }
                }
                
            }

            jsonRes.data = arraySellers;

            return jsonRes;
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


    res.json(ress);
});

adminRouter.post("/addSeller", async (req: Request, res: Response) => {
    
    const reponseJson:ResponseModel = new ResponseModel();
    
    const date_created = moment().format("YYYY-MM-DD HH:mm:ss");

    const reqAdd: AddSellerModel = req.body;

    const hash = await bcrypt.hash(reqAdd.password, 10);

    const newUser = new Users({email:reqAdd.email, password:hash, username:reqAdd.username, type_user: "seller"});
    const newSeller = new sellers({fullName: reqAdd.fullName,city: reqAdd.city,concesionary: reqAdd.concesionary, date_created: date_created, phone: reqAdd.phone});

    await newUser.save().then((res:any) => {
        if (res) {
            newSeller.id_user = res._id;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    await newSeller.save()

    reponseJson.code = 200;
    reponseJson.message = "Vendedor agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";

    res.json(reponseJson);
});

adminRouter.post("/sellerById", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();
    const {id} = req.body;
    let infoSeller:any={};
    const ress = await Users.findOne({_id: id}).then(async (res:any) => {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;

            await sellers.findOne({id_user: res._id}).then((res2:any) => {
                if (res2) {
                    infoSeller.id = res._id;
                    infoSeller.id_seller = res2._id;
                    infoSeller.fullName = res2.fullName;
                    infoSeller.city = res2.city;
                    infoSeller.concesionary = res2.concesionary;
                    infoSeller.username = res.username;
                    infoSeller.email = res.email;
                    infoSeller.type_user = res.type_user;
                } else if (!res2) {
                    infoSeller= {};
                    return res2;
                }
            }).catch((err: any) => {
                console.log(err)
            });

            jsonRes.data = infoSeller;

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

adminRouter.post("/updateSeller", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();
    const {id, email, username, fullName, city, concesionary,id_seller,password} = req.body;
    
    const _id = {_id:id};
    const seller = {_id: id_seller}
    const sellerUpdate = { fullName:fullName,city:city,concesionary:concesionary}

    if (password != "") {
        const hash = await bcrypt.hash(password, 10);
        const userUpdate = {email:email,username:username,password:hash};
        await Users.findOneAndUpdate(_id,userUpdate);
    }else{
        const userUpdate = {email:email,username:username};
        await Users.findOneAndUpdate(_id,userUpdate);
    }

    await sellers.findOneAndUpdate(seller,sellerUpdate);

    jsonRes.code = 200;
    jsonRes.message = "Vendedor actualizado exitosamente"
    jsonRes.status = true;

    res.json(jsonRes);
});

adminRouter.post("/deleteSeller", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();
    const {id} = req.body;
    const ress = await Users.findOneAndDelete({_id: id}).then(async (res:any) => {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;

            await sellers.findOneAndDelete({id_user: res._id}).then((res2:any) => {
                if (res2) {
                    return res2;
                } else if (!res2) {
                    return res2;
                }
            }).catch((err: any) => {
                console.log(err)
            });

            return jsonRes;
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

    res.json(ress);
});

adminRouter.post("/vehicleById", async (req: Request, res: Response) => {

    const jsonRes: ResponseModel = new ResponseModel();

    const {id} = req.body;

    const infoVehicle = await Vehicles.findOne({_id: id})

    const imgsVehicle = await ImgVehicle.find({id_vehicle: id});

    const mechanicFile = await mechanicalsFiles.findOne({id_vehicle: id});

    if (infoVehicle) {

        jsonRes.code = 200;
        jsonRes.message = "success";
        jsonRes.status = true;

        jsonRes.data = {
            _id: infoVehicle._id,
            model: infoVehicle.model,
            year: infoVehicle.year,
            brand: infoVehicle.brand,
            displacement: infoVehicle.displacement,
            km: infoVehicle.km,
            engine_model: infoVehicle.engine_model,
            titles: infoVehicle.titles,
            fuel: infoVehicle.fuel,
            transmission: infoVehicle.transmission,
            traction: infoVehicle.traction,
            city: infoVehicle.city,
            dealer: infoVehicle.dealer,
            concesionary: infoVehicle.concesionary,
            traction_control: infoVehicle.traction_control,
            performance: infoVehicle.performance,
            price: infoVehicle.price,
            comfort: infoVehicle.comfort,
            technology: infoVehicle.technology,
            mechanicalFile: infoVehicle.mechanicalFile,
            sold: infoVehicle.sold,
            date_create: infoVehicle.date_create,
            type_vehicle: infoVehicle.type_vehicle,
            id_seller: infoVehicle.id_seller,
            id_mechanic: infoVehicle.id_mechanic,
            id_seller_buyer: infoVehicle.id_seller_buyer,
            general_condition: mechanicFile!.general_condition,
            images: imgsVehicle ? imgsVehicle : []
        }
    }else{
        jsonRes.code = 400;
        jsonRes.message = "no existe";
        jsonRes.status = false;
    }
        

    // const ress = await Vehicles.findOne({_id: id}).then(async (res:any) => {

    //     if (res) {
    //         await mechanicalsFiles.findOne({id_vehicle: res._id}).then((res2:any) => {
    //             if (res2) {

    //                 let vehicle = {
    //                     _id: res._id,
    //                     model: res.model,
    //                     year: res.year,
    //                     brand: res.brand,
    //                     displacement: res.displacement,
    //                     km: res.km,
    //                     engine_model: res.engine_model,
    //                     titles: res.titles,
    //                     fuel: res.fuel,
    //                     transmission: res.transmission,
    //                     traction: res.traction,
    //                     city: res.city,
    //                     dealer: res.dealer,
    //                     concesionary: res.concesionary,
    //                     traction_control: res.traction_control,
    //                     performance: res.performance,
    //                     price: res.price,
    //                     comfort: res.comfort,
    //                     technology: res.technology,
    //                     mechanicalFile: res.mechanicalFile,
    //                     sold: res.sold,
    //                     date_create: res.date_create,
    //                     type_vehicle: res.type_vehicle,
    //                     id_seller: res.id_seller,
    //                     id_mechanic: res.id_mechanic,
    //                     id_seller_buyer: res.id_seller_buyer,
    //                     general_condition: res2.general_condition
    //                 }

    //                 jsonRes.code = 200;
    //                 jsonRes.message = "success";
    //                 jsonRes.status = true;
    //                 jsonRes.data = vehicle;
    //                 return jsonRes;
    //             }else{
    //                 jsonRes.code = 400;
    //                 jsonRes.message = "no existe";
    //                 jsonRes.status = false;
    //                 return jsonRes;
    //             }

    //         }).catch((err: any) => {
    //             console.log(err)
    //         });

    //     } else if (!res) {
    //         jsonRes.code = 400;
    //         jsonRes.message = "no existe";
    //         jsonRes.status = false;
    //         return jsonRes;
    //     }
    // }
    // ).catch((err: any) => {
    //     console.log(err)
    // });

    res.json(jsonRes);
});

adminRouter.post("/mechanicalFileByIdVehicle", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();

    const {id_vehicle} = req.body;

    const ress = await mechanicalsFiles.findOne({id_vehicle: id_vehicle});

    if (ress) {
        jsonRes.code = 200;
        jsonRes.message = "success";
        jsonRes.status = true;
        jsonRes.data = ress;
        return jsonRes;
    }else{
        jsonRes.code = 400;
        jsonRes.message = "no existe";
        jsonRes.status = false;
        return jsonRes;
    }

    res.json(jsonRes);

});

adminRouter.post("/addBrand", async (req: Request, res: Response) => {
    
    const jsonRes: ResponseModel = new ResponseModel();

    const {name} = req.body;

    const newBrand = new brands({name: name});

    await newBrand.save();

    jsonRes.code = 200;
    jsonRes.message = "Marca agregada exitosamente";
    jsonRes.status = true;
    jsonRes.data = "";

    res.json(jsonRes);

});

adminRouter.get("/allBrands", async (req: Request, res: Response) => {
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

adminRouter.post("/addModelVehicle", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();

    const {model, brand, type_vehicle} = req.body;

    const newModel = new modelVehicle({model: model, brand: brand, type_vehicle: type_vehicle});

    await newModel.save();
    
    if (newModel) {
        jsonRes.code = 200;
        jsonRes.message = "Modelo agregado exitosamente";
        jsonRes.status = true;
        // jsonRes.data = "";
    }else{
        jsonRes.code = 400;
        jsonRes.message = "no existe";
        jsonRes.status = false;
    }

    res.json(jsonRes);

});

export default adminRouter;