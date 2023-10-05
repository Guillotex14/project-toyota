import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";

import Users from "../schemas/Users.schema";
import Vehicles from "../schemas/Vehicles.schema";
import sellers from "../schemas/Sellers.schema";
import { ResponseModel } from "../models/Response";
import { AddSellerModel } from "../models/adminModel";
import mechanicalsFiles from "../schemas/mechanicalsFiles.schema";
import moment from "moment";
import brands from "../schemas/brands.schema";
import modelVehicle from "../schemas/modelVehicle.schema";
import ImgVehicle from "../schemas/ImgVehicle.schema";
import imgUser from "../schemas/imgUser.schema";

const adminRouter = Router();

adminRouter.post('/allVehicles', async (req: Request, res: Response) => {
    //aqui declaramos las respuestas
    const reponseJson: ResponseModel = new ResponseModel();
    let query: any = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle} = req.body;

    //aqui creamos las condiciones para el filtro de los vehículos y las querys

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
        reponseJson.message = "Vehiuclos encontrados";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;

    }else{

        reponseJson.code = 400;
        reponseJson.message = "No se encontraron vehículos";
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
            jsonRes.message = "Vendedores encontrados";
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
                            _id: res[j]._id,
                            id_seller: infoSellers[k]._id,
                            fullName: infoSellers[k].fullName,
                            city: infoSellers[k].city,
                            concesionary: infoSellers[k].concesionary,
                            username: res[j].username,
                            email: res[j].email,
                            type_user: res[j].type_user,
                            date_created: infoSellers[k].date_created,
                            image: await imgUser.findOne({ id_user: res[j]._id }) ? await imgUser.findOne({ id_user: res[j]._id }) : "",
                        }
                        arraySellers.push(seller);
                    }
                }
                
            }

            jsonRes.data = arraySellers;

            return jsonRes;
        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "No se encontraron vendedores";
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

    const exist = await Users.findOne({email: reqAdd.email});

    if (exist) {
        reponseJson.code = 400;
        reponseJson.message = "El usuario se encuentra registrado";
        reponseJson.status = false;
        reponseJson.data = "";
    }else{

        const newUser = new Users({email:reqAdd.email, password:hash, username:reqAdd.username, type_user: "seller"});
        const newSeller = new sellers({fullName: reqAdd.fullName,city: reqAdd.city,concesionary: reqAdd.concesionary, date_created: date_created, phone: reqAdd.phone});

        await newUser.save()

        if (newUser) {
            newSeller.id_user = newUser._id;
            await newSeller.save();
        }


        if (newSeller && newUser) {
            reponseJson.code = 200;
            reponseJson.message = "Vendedor agregado exitosamente";
            reponseJson.status = true;
            reponseJson.data = "";
        }else{
            reponseJson.code = 400;
            reponseJson.message = "Error al agregar vendedor";
            reponseJson.status = false;
            reponseJson.data = "";
        }
    }

    res.json(reponseJson);
});

adminRouter.post("/sellerById", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();
    const {id} = req.body;

    const seller = await sellers.findOne({id_user: id});

    const userSeller = await Users.findOne({_id: seller!.id_user});
    if (seller) {

        let data = {
            _id: seller!._id,
            fullName: seller!.fullName,
            city: seller!.city,
            concesionary: seller!.concesionary,
            phone: seller!.phone,
            date_created: seller!.date_created,
            id_user: userSeller!._id,
            username: userSeller!.username,
            email: userSeller!.email,
            type_user: userSeller!.type_user,
        }

        jsonRes.code = 200;
        jsonRes.message = "Usuario encontrado";
        jsonRes.status = true;
        jsonRes.data = data;
    } else if (!seller) {
        jsonRes.code = 400;
        jsonRes.message = "Usuario no registrado";
        jsonRes.status = false;
    }

    res.json(jsonRes);
});

adminRouter.post("/updateSeller", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();
    const {_id, email, username, fullName, city, concesionary,password, id_user, phone} = req.body;
<<<<<<< HEAD
    console.log(req.body)
=======
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
    const seller = {_id: _id}
    const user = {_id: id_user}
    const sellerUpdate = { fullName:fullName, city:city,concesionary:concesionary, phone:phone}

    if (password != "") {
        const hash = await bcrypt.hash(password, 10);
        const userUpdate = {email:email,username:username,password:hash};
        await Users.findOneAndUpdate(user,userUpdate);
    }else{
        const userUpdate = {email:email,username:username};
        await Users.findOneAndUpdate(user,userUpdate);
    }

    await sellers.findOneAndUpdate(seller,sellerUpdate);

    console.log("seller",sellers)

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
            jsonRes.message = "usuario eliminado exitosamente";
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
            jsonRes.message = "No se encontro el usuario";
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
        jsonRes.message = "Vehículo encontrado exitosamente";
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
            general_condition: mechanicFile ? mechanicFile!.general_condition : "",
            images: imgsVehicle ? imgsVehicle : []
        }
    }else{
        jsonRes.code = 400;
        jsonRes.message = "no se encontro el vehículo";
        jsonRes.status = false;
    }

    res.json(jsonRes);
});

adminRouter.post("/mechanicalFileByIdVehicle", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();

    const {id_vehicle} = req.body;

    const ress = await mechanicalsFiles.findOne({id_vehicle: id_vehicle});

    if (ress) {
        jsonRes.code = 200;
        jsonRes.message = "ficha mécanica encontrada exitosamente";
        jsonRes.status = true;
        jsonRes.data = ress;
        return jsonRes;
    }else{
        jsonRes.code = 400;
        jsonRes.message = "no se encontro la ficha mécanica";
        jsonRes.status = false;
        return jsonRes;
    }

    res.json(jsonRes);

});

adminRouter.post("/addBrand", async (req: Request, res: Response) => {
    
    const jsonRes: ResponseModel = new ResponseModel();

    const {name} = req.body;

    const exist = await brands.findOne({name: name});


    if (exist) {
        jsonRes.code = 400;
        jsonRes.message = "La marca ya existe";
        jsonRes.status = false;
    }else{

        const newBrand = new brands({name: name});
    
        await newBrand.save();
        
        if (newBrand) {
            
            jsonRes.code = 200;
            jsonRes.message = "Marca agregada exitosamente";
            jsonRes.status = true;
            jsonRes.data = "";
        }else{
            jsonRes.code = 400;
            jsonRes.message = "Error al agregar marca";
            jsonRes.status = false;
        }
    }

    res.json(jsonRes);

});

adminRouter.get("/allBrands", async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();

    const allBrands = await brands.find() 

    if (allBrands) {
        jsonResponse.code = 200;
        jsonResponse.message = "Todas las marcas";
        jsonResponse.status = true;
        jsonResponse.data = allBrands;
    }else{
        jsonResponse.code = 400;
        jsonResponse.message = "No hay marcas";
        jsonResponse.status = false;
    }

    res.json(jsonResponse);

});

adminRouter.get("/allModels", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();

    const models = await modelVehicle.find();

    if (models) {
        jsonRes.code = 200;
        jsonRes.message = "Modelos encontrados exitosamente";
        jsonRes.status = true;
        jsonRes.data = models;
    }else{
        jsonRes.code = 400;
        jsonRes.message = "No se encontraron modelos";
        jsonRes.status = false;
    }

    res.json(jsonRes);
});

adminRouter.post("/addModelVehicle", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();

    const {model, brand, type_vehicle} = req.body;


    const exist = await modelVehicle.findOne({model: model});


    if (exist) {
        jsonRes.code = 400;
        jsonRes.message = "El modelo ya existe";
        jsonRes.status = false;
    }else{
    
        const newModel = new modelVehicle({model: model, brand: brand, type_vehicle: type_vehicle});
    
        await newModel.save();
        
        if (newModel) {
            jsonRes.code = 200;
            jsonRes.message = "Modelo agregado exitosamente";
            jsonRes.status = true;
            // jsonRes.data = "";
        }else{
            jsonRes.code = 400;
            jsonRes.message = "Error al agregar el modelo";
            jsonRes.status = false;
        }
    }

    

    res.json(jsonRes);

});

export default adminRouter;