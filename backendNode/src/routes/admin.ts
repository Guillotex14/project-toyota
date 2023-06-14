import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";

import Users from "../models/Users";
import Vehicles from "../models/Vehicles";
import sellers from "../models/Sellers";
import { ResponseModel } from "../models/Response";


const adminRouter = Router();

adminRouter.get("/allVehicles", async (req: Request, res: Response) => {
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const ress = await Vehicles.find().then((res:any) => {
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
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const ress = await Users.find({type_user: "seller"}).then((res:any) => {
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

adminRouter.post("/addSeller", async (req: Request, res: Response) => {
    
    const reponseJson:ResponseModel = new ResponseModel();

    const {email,password,username,fullName,city,concesionary} = req.body;
    
    const hash = await bcrypt.hash(password, 10);

    const newUser = new Users({email,password:hash,username,type_user: "seller"});
    const newSeller = new sellers({fullName,city,concesionary});
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

export default adminRouter;