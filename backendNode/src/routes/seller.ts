import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";

import Users from "../models/Users";
import vehicles from "../models/Vehicles";
import mechanics from "../models/Mechanics";
import { ResponseModel } from "../models/Response";


const sellerRouter = Router();

sellerRouter.post("/addMechanic", async (req: Request, res: Response) => {
    
    const reponseJson:ResponseModel = new ResponseModel();
    const {email,password,username,fullName,city,concesionary} = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    const newUser = new Users({email,password:hash,username,type_user: "mechanic"});
    const newMechanic = new mechanics({fullName,city,concesionary});

    await newUser.save().then((res:any) => {
        if (res) {
            newMechanic.id_user = res._id;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    await newMechanic.save()

    reponseJson.code = 200;
    reponseJson.message = "Mecanico agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";

    res.json(reponseJson);
    
});

sellerRouter.post("/addVehicle", async (req: Request, res: Response) => {
    
    const reponseJson:ResponseModel = new ResponseModel();

    const {model,year,displacement,km,engine_model,titles,fuel,transmission,transmission_2,city,dealer,traction_control,performance,comfort,technology} = req.body;

    const newVehicle =  new vehicles({model,year,displacement,km,engine_model,titles,fuel,transmission,transmission_2,city,dealer,traction_control,performance,comfort,technology});

    await newVehicle.save()

    reponseJson.code = 200;
    reponseJson.message = "Vehiculo agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";

    res.json(reponseJson);

});

sellerRouter.get("/allVehicles", async (req: Request, res: Response) => {
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const ress = await vehicles.find().then((res:any) => {
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

sellerRouter.get("/vehicleById", async (req: Request, res: Response) => {

    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };

    const {_id} = req.body;

    const ress = await vehicles.findOne({_id: _id}).then((res:any) => {
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

    res.json(ress);
});

sellerRouter.get("/mechanicalFile", async (req: Request, res: Response) => {
});


export default sellerRouter;