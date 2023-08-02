import { Router, Request, Response } from "express";

//models
import Users from "../models/Users";
import { ResponseModel } from "../models/Response";
import sellers from "../models/Sellers";
import mechanics from "../models/Mechanics";
import bcrypt from 'bcrypt';
import fs from "fs";
import imgUser from "../models/imgUser";

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
                                img: userImg ? userImg?.img : ""
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
                                img: userImg ? userImg?.img : ""
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

authRouter.post("/addImgProfile", async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_user, image } = req.body;
    //creamos un ramdom para el nombre de la imagen
    const random = Math.floor(Math.random() * 1000000);

    const ramStr = await generateString(7);

    const filename = await saveBse64ImageInPublicDirectoryUser(image, `${ramStr}${random}`);

    const newImage = new imgUser({ img: filename, id_user: id_user });

    await newImage.save();

    if (newImage) {
    reponseJson.code = 200;
    reponseJson.message = "Imagen agregada exitosamente";
    reponseJson.status = true;
    reponseJson.data = newImage.img;
    } else {
    reponseJson.code = 400;
    reponseJson.message = "No se pudo agregar la imagen";
    reponseJson.status = false;
    }

    res.json(reponseJson);
});

authRouter.post("/updateImgProfile", async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_user, image, old_image } = req.body;

    const random = Math.floor(Math.random() * 100000);

    const ramStr = await generateString(5);

    const delImag = await delBse64ImageInPublicDirectoryUser(old_image);

    const delImg = await imgUser.findOneAndDelete({ img: old_image });

    if (delImg ) {
    
    const filename = await saveBse64ImageInPublicDirectoryUser(
        image,
        `${ramStr}${random}`
    );

    const newImage = new imgUser({ img: filename, id_user: id_user });

    if (newImage) {
        reponseJson.message = "Imagen actualizada exitosamente";
        reponseJson.status = true;
        reponseJson.data = newImage.img;
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

const saveBse64ImageInPublicDirectoryUser = async (image: any, name: any) => {
    const posr = image.split(";")[0];
    const base64 = image.split(";base64,").pop();
    const mime_type = posr.split(":")[1];
    const type = mime_type.split("/")[1];
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    const imgBin = Buffer.from(base64Data, "base64");

    fs.writeFile("public/images/users/"+name+"."+type,imgBin, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Imagen guardada");
    }
    });

    return name + "." + type;
};

const delBse64ImageInPublicDirectoryUser = async (name: any) => {

    await fs.unlink("public/images/users/" + name, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Imagen eliminada")
    }
    });
    
};

const generateString = async (length:any) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += await characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export default authRouter;