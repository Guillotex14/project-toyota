"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//controller
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authRouter = (0, express_1.Router)();
authRouter.post("/login", auth_controller_1.default.login);
authRouter.post("/addImgProfile", auth_controller_1.default.addImgProfile);
authRouter.post("/updateImgProfile", auth_controller_1.default.updateImgProfile);
// authRouter.get("/sharpMetods", async (req: Request, res: Response) => {
//     // const reponseJson: ResponseModel = new ResponseModel();
//     // const { image } = req.body;
//     // if (image.length > 0) {
//     //     for (let i = 0; i < image.length; i++) {
//     //         // const sharpImg = await Sharp(Buffer.from(image[i].image,'base64')).resize(150, 80).toBuffer();
//     //         const imgResult = await desgloseImg(image[i].image);
//     //         // const img2 = imgResult.toString('base64');
//     //         const filename = await uploadImageVehicle(imgResult);
//     //         console.log(filename)
//     //     }
//     // }
//     const deleteMechanicalFiles = await mechanicalsFiles.deleteMany({});
//     const delVehicles = await Vehicles.deleteMany({});
//     const delimgvehicles = await ImgVehicle.deleteMany({});
//     if (deleteMechanicalFiles) {
//         console.log("eliminados")
//     }else{
//         console.log("no eliminados")
//     }
// });
// const desgloseImg = async (image: any) => {
//     let posr = image.split(";base64").pop();
//     let imgBuff = Buffer.from(posr, 'base64');
//     const resize = await Sharp(imgBuff).resize(150, 80).toBuffer().then((data) => {
//         return data;
//     }).catch((err) => {
//         console.log("error",err)
//         return "";
//     })
//     return 'data:image/jpeg;base64,'+resize.toString('base64');
// }
// authRouter.get("/sendNotify", authController.sendEmail)
exports.default = authRouter;
//# sourceMappingURL=auth.route.js.map