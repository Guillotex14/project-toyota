import { Router, Request, Response } from "express";

//modelss
import Users from "../models/Users";
import { ResponseModel } from "../models/Response";
import sellers from "../models/Sellers";
import mechanics from "../models/Mechanics";
import bcrypt from 'bcrypt';

const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {

    const jsonRes = new ResponseModel()

    const { email, password } = req.body;
    const ress =  await Users.findOne({email: email}).then(async(res:any) => {
        
        if (res) {
            const hash = bcrypt.compareSync(password, res.password);
            if (hash) {
                jsonRes.code = 200;
                jsonRes.message = "login success";
                jsonRes.status = true;

                if (res.type_user == "seller") {
                    await sellers.findOne({id_user: res._id}).then(async(res2:any) => {
                        if (res2) {

                            let seller = {
                                id: res._id,
                                id_sell: res2._id,
                                fullName: res2.fullName,
                                city: res2.city,
                                concesionary: res2.concesionary,
                                email: res.email,
                                username: res.username,
                                type_user: res.type_user
                            }

                            jsonRes.data = seller;
                            // return jsonRes;
                        }
                    }).catch((err: any) => {
                        console.log(err)
                    });
                }else if (res.type_user == "mechanic") {
                    await mechanics.findOne({id_user: res._id}).then(async(res2:any) => {
                        if (res2) {

                            let mechanic = {
                                id: res._id,
                                id_mechanic: res2._id,
                                fullName: res2.fullName,
                                city: res2.city,
                                concesionary: res2.concesionary,
                                email: res.email,
                                username: res.username,
                                type_user: res.type_user
                            }

                            jsonRes.data = mechanic;
                            // return jsonRes;
                        }
                    }).catch((err: any) => {
                        console.log(err)
                    });
                    
                }else{
                    jsonRes.data = res;
                }

                return jsonRes;
            } else {
                jsonRes.code = 400;
                jsonRes.message = "password incorrecto";
                jsonRes.status = false;
                return jsonRes;
            }
        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    res.json(jsonRes);
});

authRouter.post("/loginMedic", async (req: Request, res: Response) => {
    const jsonRes = {
        code: 0,
        data: {},
        message: "",
        status: false,
    };
    const { email, password } = req.body;
    const ress =  await Users.findOne({email: email}).then((res:any) => {
        if (res) {
            if (res.password == password) {
                jsonRes.code = 200;
                jsonRes.message = "login success";
                jsonRes.status = true;
                jsonRes.data = res;
                return jsonRes;
            } else if (res.password != password && res.password != null) {
                jsonRes.code = 400;
                jsonRes.message = "password incorrecto";
                jsonRes.status = false;
                return jsonRes;
            }
        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err: any) => {
        console.log(err)
    });
    console.log(ress)
    res.json(ress);
});

authRouter.get("/registerPatient", (req: Request, res: Response) => {
    console.log("Register")
    res.send("Register");
});

authRouter.get("/registerMedic", (req: Request, res: Response) => {
    console.log("Register")
    res.send("Register");
});


authRouter.get("/forgotPassword", (req: Request, res: Response) => {
    console.log("forgotPassword")
    res.send("forgotPassword");
});

authRouter.get("/verifyCode", (req: Request, res: Response) => {
    console.log("verifyCode")
    res.send("verifyCode");
});

authRouter.get("/resetPassword", (req: Request, res: Response) => {
    console.log("resetPassword")
    res.send("resetPassword");
});



export default authRouter;