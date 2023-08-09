import { Router, Request, Response } from "express";

//models
import Users from "../models/Users";
import { ResponseModel } from "../models/Response";
import sellers from "../models/Sellers";
import mechanics from "../models/Mechanics";
import bcrypt from 'bcrypt';
import fs from "fs";
import imgUser from "../models/imgUser";
import { uploadImageUser, deleteImageUser } from '../../cloudinaryMetods';
import Vehicles from "../models/Vehicles";

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

                const userImg = await imgUser.findOne({id_user: res._id});

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
                                type_user: res.type_user,
                                img: userImg ? userImg : null
                            }
                            jsonRes.data = seller;
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
                                type_user: res.type_user,
                                img: userImg ? userImg : null
                            }

                            jsonRes.data = mechanic;
                            // return jsonRes;
                        }
                    }).catch((err: any) => {
                        console.log(err)
                    });
                    
                }else{

                    let mechanic = {
                        id: res._id,
                        email: res.email,
                        username: res.username,
                        type_user: res.type_user,
                        img: null
                    }
                    jsonRes.data = mechanic;
                }

                return jsonRes;
            } else {
                jsonRes.code = 400;
                jsonRes.message = "Contraseña incorrecto";
                jsonRes.status = false;
                return jsonRes;
            }
        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "ususario no registrado";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    res.json(jsonRes);
});

authRouter.post("/addImgProfile", async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_user, image } = req.body;

    const filename = await uploadImageUser(image);

    const newImage = new imgUser({ img: filename.secure_url, id_user: id_user, public_id: filename.public_id });

    await newImage.save();

    if (newImage) {
    reponseJson.code = 200;
    reponseJson.message = "Imagen agregada exitosamente";
    reponseJson.status = true;
    reponseJson.data = newImage;
    } else {
    reponseJson.code = 400;
    reponseJson.message = "No se pudo agregar la imagen";
    reponseJson.status = false;
    }

    res.json(reponseJson);
});

authRouter.post("/updateImgProfile", async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_user, image, public_id } = req.body;

    const delImg = await deleteImageUser(public_id);

    const delImgdb = await imgUser.findOneAndDelete({ public_id: public_id });

    if (delImg.result == "ok" ) {
    
    const filename = await uploadImageUser(image);

    const newImage = new imgUser({ img: filename.secure_url, id_user: id_user, public_id: filename.public_id });

    if (newImage) {
        reponseJson.message = "Imagen actualizada exitosamente";
        reponseJson.status = true;
        reponseJson.data = newImage;
    } else {
        reponseJson.code = 400;
        reponseJson.message = "No se pudo actualizar la imagen";
        reponseJson.status = false;
    }
    } else {
    reponseJson.code = 400;
    reponseJson.message = "No se pudo eliminar la imagen";
    reponseJson.status = false;
    }

    res.json(reponseJson);
});

export default authRouter;