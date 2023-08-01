"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_1 = __importDefault(require("../models/Users"));
const Vehicles_1 = __importDefault(require("../models/Vehicles"));
const Sellers_1 = __importDefault(require("../models/Sellers"));
const Response_1 = require("../models/Response");
const mechanicalsFiles_1 = __importDefault(require("../models/mechanicalsFiles"));
const moment_1 = __importDefault(require("moment"));
const brands_1 = __importDefault(require("../models/brands"));
const modelVehicle_1 = __importDefault(require("../models/modelVehicle"));
const adminRouter = (0, express_1.Router)();
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
adminRouter.post('/allVehicles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //aqui declaramos las respuestas
    const reponseJson = new Response_1.ResponseModel();
    let query = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle } = req.body;
    //aqui creamos las condiciones para el filtro de los vehiculos y las querys
    if (minYear === 0 && maxYear === 0) {
        query.year = { $gte: 0 };
    }
    else if (minYear !== 0 && maxYear === 0) {
        query.year = { $gte: minYear };
    }
    else if (minYear === 0 && maxYear !== 0) {
        query.year = { $lte: maxYear };
    }
    else {
        query.year = { $gte: minYear, $lte: maxYear };
    }
    if (minKm === 0 && maxKm === 0) {
        query.km = { $gte: 0 };
    }
    else if (minKm !== 0 && maxKm === 0) {
        query.km = { $gte: minKm };
    }
    else if (minKm === 0 && maxKm !== 0) {
        query.km = { $lte: maxKm };
    }
    else {
        query.km = { $gte: minKm, $lte: maxKm };
    }
    if (minPrice === 0 && maxPrice === 0) {
        query.price = { $gte: 0, $ne: null };
    }
    else if (minPrice !== 0 && maxPrice === 0) {
        query.price = { $gte: minPrice, $ne: null };
    }
    else if (minPrice === 0 && maxPrice !== 0) {
        query.price = { $lte: maxPrice, $ne: null };
    }
    else {
        query.price = { $gte: minPrice, $lte: maxPrice, $en: null };
    }
    query.city = { $regex: ubication, $options: 'i' };
    query.brand = { $regex: brand, $options: 'i' };
    query.model = { $regex: model, $options: 'i' };
    query.type_vehicle = { $regex: type_vehicle, $options: 'i' };
    query.sold = false;
    query.id_seller_buyer = null;
    const vehiclesFiltered = yield Vehicles_1.default.find(query).sort({ date: -1 });
    if (vehiclesFiltered) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = vehiclesFiltered;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }
    res.json(reponseJson);
}));
adminRouter.get("/allSellers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    let arraySellers = [];
    let infoSellers = [];
    const ress = yield Users_1.default.find({ type_user: "seller" }).sort({ date_created: -1 }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            for (let i = 0; i < res.length; i++) {
                yield Sellers_1.default.find({ id_user: res[i]._id }).then((res2) => {
                    if (res2) {
                        res2.forEach((element) => {
                            infoSellers.push(element);
                        });
                    }
                    else if (!res2) {
                        infoSellers = [];
                        return res2;
                    }
                }).catch((err) => {
                    console.log(err);
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
                        };
                        arraySellers.push(seller);
                    }
                }
            }
            jsonRes.data = arraySellers;
            return jsonRes;
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    })).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
adminRouter.post("/addSeller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const date_created = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    const reqAdd = req.body;
    const hash = yield bcrypt_1.default.hash(reqAdd.password, 10);
    const newUser = new Users_1.default({ email: reqAdd.email, password: hash, username: reqAdd.username, type_user: "seller" });
    const newSeller = new Sellers_1.default({ fullName: reqAdd.fullName, city: reqAdd.city, concesionary: reqAdd.concesionary, date_created: date_created, phone: reqAdd.phone });
    yield newUser.save().then((res) => {
        if (res) {
            newSeller.id_user = res._id;
        }
    }).catch((err) => {
        console.log(err);
    });
    yield newSeller.save();
    reponseJson.code = 200;
    reponseJson.message = "Vendedor agregado exitosamente";
    reponseJson.status = true;
    reponseJson.data = "";
    res.json(reponseJson);
}));
adminRouter.post("/sellerById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    let infoSeller = {};
    const ress = yield Users_1.default.findOne({ _id: id }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            yield Sellers_1.default.findOne({ id_user: res._id }).then((res2) => {
                if (res2) {
                    infoSeller.id = res._id;
                    infoSeller.id_seller = res2._id;
                    infoSeller.fullName = res2.fullName;
                    infoSeller.city = res2.city;
                    infoSeller.concesionary = res2.concesionary;
                    infoSeller.username = res.username;
                    infoSeller.email = res.email;
                    infoSeller.type_user = res.type_user;
                }
                else if (!res2) {
                    infoSeller = {};
                    return res2;
                }
            }).catch((err) => {
                console.log(err);
            });
            jsonRes.data = infoSeller;
            return jsonRes;
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    })).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
adminRouter.post("/updateSeller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id, email, username, fullName, city, concesionary, id_seller, password } = req.body;
    const _id = { _id: id };
    const seller = { _id: id_seller };
    const sellerUpdate = { fullName: fullName, city: city, concesionary: concesionary };
    if (password != "") {
        const hash = yield bcrypt_1.default.hash(password, 10);
        const userUpdate = { email: email, username: username, password: hash };
        yield Users_1.default.findOneAndUpdate(_id, userUpdate);
    }
    else {
        const userUpdate = { email: email, username: username };
        yield Users_1.default.findOneAndUpdate(_id, userUpdate);
    }
    yield Sellers_1.default.findOneAndUpdate(seller, sellerUpdate);
    jsonRes.code = 200;
    jsonRes.message = "Vendedor actualizado exitosamente";
    jsonRes.status = true;
    res.json(jsonRes);
}));
adminRouter.post("/deleteSeller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    const ress = yield Users_1.default.findOneAndDelete({ _id: id }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            jsonRes.code = 200;
            jsonRes.message = "success";
            jsonRes.status = true;
            yield Sellers_1.default.findOneAndDelete({ id_user: res._id }).then((res2) => {
                if (res2) {
                    return res2;
                }
                else if (!res2) {
                    return res2;
                }
            }).catch((err) => {
                console.log(err);
            });
            return jsonRes;
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    })).catch((err) => {
        console.log(err);
    });
    res.json(ress);
}));
adminRouter.post("/vehicleById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    const ress = yield Vehicles_1.default.findOne({ _id: id }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (res) {
            yield mechanicalsFiles_1.default.findOne({ id_vehicle: res._id }).then((res2) => {
                if (res2) {
                    let vehicle = {
                        _id: res._id,
                        model: res.model,
                        year: res.year,
                        brand: res.brand,
                        displacement: res.displacement,
                        km: res.km,
                        engine_model: res.engine_model,
                        titles: res.titles,
                        fuel: res.fuel,
                        transmission: res.transmission,
                        traction: res.traction,
                        city: res.city,
                        dealer: res.dealer,
                        concesionary: res.concesionary,
                        traction_control: res.traction_control,
                        performance: res.performance,
                        price: res.price,
                        comfort: res.comfort,
                        technology: res.technology,
                        mechanicalFile: res.mechanicalFile,
                        sold: res.sold,
                        date: res.date,
                        type_vehicle: res.type_vehicle,
                        id_seller: res.id_seller,
                        id_mechanic: res.id_mechanic,
                        id_seller_buyer: res.id_seller_buyer,
                        general_condition: res2.general_condition
                    };
                    jsonRes.code = 200;
                    jsonRes.message = "success";
                    jsonRes.status = true;
                    jsonRes.data = vehicle;
                    return jsonRes;
                }
                else {
                    jsonRes.code = 400;
                    jsonRes.message = "no existe";
                    jsonRes.status = false;
                    return jsonRes;
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        else if (!res) {
            jsonRes.code = 400;
            jsonRes.message = "no existe";
            jsonRes.status = false;
            return jsonRes;
        }
    })).catch((err) => {
        console.log(err);
    });
    res.json(jsonRes);
}));
adminRouter.post("/mechanicalFileByIdVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const ress = yield mechanicalsFiles_1.default.findOne({ id_vehicle: id_vehicle });
    if (ress) {
        jsonRes.code = 200;
        jsonRes.message = "success";
        jsonRes.status = true;
        jsonRes.data = ress;
        return jsonRes;
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "no existe";
        jsonRes.status = false;
        return jsonRes;
    }
    res.json(jsonRes);
}));
adminRouter.post("/addBrand", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { name } = req.body;
    const newBrand = new brands_1.default({ name: name });
    yield newBrand.save();
    jsonRes.code = 200;
    jsonRes.message = "Marca agregada exitosamente";
    jsonRes.status = true;
    jsonRes.data = "";
    res.json(jsonRes);
}));
adminRouter.get("/allBrands", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const brand = yield brands_1.default.find().then((res) => {
        if (res) {
            jsonResponse.code = 200;
            jsonResponse.message = "success";
            jsonResponse.status = true;
            jsonResponse.data = res;
            return jsonResponse;
        }
        else {
            jsonResponse.code = 400;
            jsonResponse.message = "no existe";
            jsonResponse.status = false;
            return jsonResponse;
        }
    }).catch((err) => {
        console.log(err);
    });
    res.json(jsonResponse);
}));
adminRouter.post("/addModelVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { model, brand, type_vehicle } = req.body;
    const newModel = new modelVehicle_1.default({ model: model, brand: brand, type_vehicle: type_vehicle });
    yield newModel.save();
    if (newModel) {
        jsonRes.code = 200;
        jsonRes.message = "Modelo agregado exitosamente";
        jsonRes.status = true;
        // jsonRes.data = "";
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "no existe";
        jsonRes.status = false;
    }
    res.json(jsonRes);
}));
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map