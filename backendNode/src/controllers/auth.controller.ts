import { Request, Response, response } from "express";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import sellers from "../schemas/Sellers.schema";
import mechanics from "../schemas/Mechanics.schema";
import imgUser from "../schemas/imgUser.schema";
import notifications from "../schemas/notifications.schema";
import { sendEmail } from '../../nodemailer';
import bcrypt from "bcrypt";
import { deleteImageUser, uploadImageUser } from "../../cloudinaryMetods";
import Jwt from "../helpers/generar-jwt";
import moment from "moment";

const authController: any  = {};

authController.login = async (req: Request, res: Response) => {

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
                let token=Jwt.generateToken(jsonRes.data);
                jsonRes.data.token=token;
                return jsonRes;
            } else {
                jsonRes.code = 400;
                jsonRes.message = "Contraseña incorrecta";
                jsonRes.status = false;
                return jsonRes;
            }
        } else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "Ususario no registrado";
            jsonRes.status = false;
            return jsonRes;
        }
    }).catch((err: any) => {
        console.log(err)
    });

    res.json(jsonRes);
}

authController.addImgProfile = async (req: Request, res: Response) => {
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
}

authController.updateImgProfile = async (req: Request, res: Response) => {
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
}

// authController.sendEmail = async (req: Request, res: Response) => {
//     const reponseJson: ResponseModel = new ResponseModel();

//     const dataVehicle = {
//         model: "model",
//         year: "year",
//         vehicle_plate: "vehicle_plate",
//         fullName: "infoSeller!.fullName",
//         concesionary: "infoSeller!.concesionary",
//         city: "infoSeller!.city",
//     }
//         sendNotification("mvarelavasquez@gmail.com", dataVehicle, "Revisión de vehículo");

//         reponseJson.message = "Imagen actualizada exitosamente";
//         reponseJson.status = true;
//         reponseJson.data = {};


//     res.json(reponseJson);
    
// }

// const sendNotification = async (
//     id_seller: string,
//     data: any,
//     title: string
//   ) => {
//     // const jsonRes: ResponseModel = new ResponseModel();
  
//     const userInfo = await Users.findOne({ email: id_seller });
  
//     if (userInfo) {
//       const notify = new notifications({
//         id_user: userInfo._id,
//         title: title,
//         data: data,
//         date: moment().format("YYYY-MM-DD HH:mm:ss"),
//         status: false,
//       });
  
//       await notify.save();
//     }
//   };

export default authController;