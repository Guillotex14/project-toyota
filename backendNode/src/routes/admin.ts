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

const adminRouter = Router();

adminRouter.get("/allVehicles", async (req: Request, res: Response) => {
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const ress = await Vehicles.find({sold: false}).then((res:any) => {
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

adminRouter.get("/allSellers", async (req: Request, res: Response) => {
    const jsonRes: ResponseModel = new ResponseModel();
    let arraySellers: any[] = [];
    let infoSellers: any[] = [];

    const ress = await Users.find({type_user: "seller"}).then(async (res:any) => {
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

    console.log("id", id)

    const ress = await Vehicles.findOne({_id: id}).then(async (res:any) => {
        console.log(res)
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
    }
    ).catch((err: any) => {
        console.log(err)
    });

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

export default adminRouter;