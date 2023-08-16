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
const ImgVehicle_1 = __importDefault(require("../models/ImgVehicle"));
const imgUser_1 = __importDefault(require("../models/imgUser"));
const adminRouter = (0, express_1.Router)();
adminRouter.post('/allVehicles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //aqui declaramos las respuestas
    const reponseJson = new Response_1.ResponseModel();
    let query = {};
    //aqui declaramos las variables que vamos a recibir
    const { minYear, maxYear, minKm, maxKm, minPrice, maxPrice, brand, model, ubication, type_vehicle } = req.body;
    //aqui creamos las condiciones para el filtro de los vehículos y las querys
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
    const vehiclesFiltered = yield Vehicles_1.default.find(query).sort({ date_create: -1 });
    if (vehiclesFiltered) {
        let arrayVehicles = [];
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
                image: (yield ImgVehicle_1.default.findOne({ id_vehicle: vehiclesFiltered[i]._id })) ? yield ImgVehicle_1.default.findOne({ id_vehicle: vehiclesFiltered[i]._id }) : "",
            };
            arrayVehicles.push(data);
        }
        reponseJson.code = 200;
        reponseJson.message = "Vehiuclos encontrados";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "No se encontraron vehículos";
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
            jsonRes.message = "Vendedores encontrados";
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
                            _id: res[j]._id,
                            id_seller: infoSellers[k]._id,
                            fullName: infoSellers[k].fullName,
                            city: infoSellers[k].city,
                            concesionary: infoSellers[k].concesionary,
                            username: res[j].username,
                            email: res[j].email,
                            type_user: res[j].type_user,
                            date_created: infoSellers[k].date_created,
                            image: (yield imgUser_1.default.findOne({ id_user: res[j]._id })) ? yield imgUser_1.default.findOne({ id_user: res[j]._id }) : "",
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
            jsonRes.message = "No se encontraron vendedores";
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
    const exist = yield Users_1.default.findOne({ email: reqAdd.email });
    if (exist) {
        reponseJson.code = 400;
        reponseJson.message = "El usuario se encuentra registrado";
        reponseJson.status = false;
        reponseJson.data = "";
    }
    else {
        const newUser = new Users_1.default({ email: reqAdd.email, password: hash, username: reqAdd.username, type_user: "seller" });
        const newSeller = new Sellers_1.default({ fullName: reqAdd.fullName, city: reqAdd.city, concesionary: reqAdd.concesionary, date_created: date_created, phone: reqAdd.phone });
        yield newUser.save();
        if (newUser) {
            newSeller.id_user = newUser._id;
            yield newSeller.save();
        }
        if (newSeller && newUser) {
            reponseJson.code = 200;
            reponseJson.message = "Vendedor agregado exitosamente";
            reponseJson.status = true;
            reponseJson.data = "";
        }
        else {
            reponseJson.code = 400;
            reponseJson.message = "Error al agregar vendedor";
            reponseJson.status = false;
            reponseJson.data = "";
        }
    }
    res.json(reponseJson);
}));
adminRouter.post("/sellerById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id } = req.body;
    const seller = yield Sellers_1.default.findOne({ id_user: id });
    const userSeller = yield Users_1.default.findOne({ _id: seller.id_user });
    if (seller) {
        let data = {
            _id: seller._id,
            fullName: seller.fullName,
            city: seller.city,
            concesionary: seller.concesionary,
            phone: seller.phone,
            date_created: seller.date_created,
            id_user: userSeller._id,
            username: userSeller.username,
            email: userSeller.email,
            type_user: userSeller.type_user,
        };
        jsonRes.code = 200;
        jsonRes.message = "Usuario encontrado";
        jsonRes.status = true;
        jsonRes.data = data;
    }
    else if (!seller) {
        jsonRes.code = 400;
        jsonRes.message = "Usuario no registrado";
        jsonRes.status = false;
    }
    res.json(jsonRes);
}));
adminRouter.post("/updateSeller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { _id, email, username, fullName, city, concesionary, password, id_user, phone } = req.body;
    console.log(req.body);
    const seller = { _id: _id };
    const user = { _id: id_user };
    const sellerUpdate = { fullName: fullName, city: city, concesionary: concesionary, phone: phone };
    if (password != "") {
        const hash = yield bcrypt_1.default.hash(password, 10);
        const userUpdate = { email: email, username: username, password: hash };
        yield Users_1.default.findOneAndUpdate(user, userUpdate);
    }
    else {
        const userUpdate = { email: email, username: username };
        yield Users_1.default.findOneAndUpdate(user, userUpdate);
    }
    yield Sellers_1.default.findOneAndUpdate(seller, sellerUpdate);
    console.log("seller", Sellers_1.default);
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
            jsonRes.message = "usuario eliminado exitosamente";
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
            jsonRes.message = "No se encontro el usuario";
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
    const infoVehicle = yield Vehicles_1.default.findOne({ _id: id });
    const imgsVehicle = yield ImgVehicle_1.default.find({ id_vehicle: id });
    const mechanicFile = yield mechanicalsFiles_1.default.findOne({ id_vehicle: id });
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
            general_condition: mechanicFile ? mechanicFile.general_condition : "",
            images: imgsVehicle ? imgsVehicle : []
        };
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "no se encontro el vehículo";
        jsonRes.status = false;
    }
    res.json(jsonRes);
}));
adminRouter.post("/mechanicalFileByIdVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const ress = yield mechanicalsFiles_1.default.findOne({ id_vehicle: id_vehicle });
    if (ress) {
        jsonRes.code = 200;
        jsonRes.message = "ficha mécanica encontrada exitosamente";
        jsonRes.status = true;
        jsonRes.data = ress;
        return jsonRes;
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "no se encontro la ficha mécanica";
        jsonRes.status = false;
        return jsonRes;
    }
    res.json(jsonRes);
}));
adminRouter.post("/addBrand", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { name } = req.body;
    const exist = yield brands_1.default.findOne({ name: name });
    if (exist) {
        jsonRes.code = 400;
        jsonRes.message = "La marca ya existe";
        jsonRes.status = false;
    }
    else {
        const newBrand = new brands_1.default({ name: name });
        yield newBrand.save();
        if (newBrand) {
            jsonRes.code = 200;
            jsonRes.message = "Marca agregada exitosamente";
            jsonRes.status = true;
            jsonRes.data = "";
        }
        else {
            jsonRes.code = 400;
            jsonRes.message = "Error al agregar marca";
            jsonRes.status = false;
        }
    }
    res.json(jsonRes);
}));
adminRouter.get("/allBrands", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = new Response_1.ResponseModel();
    const allBrands = yield brands_1.default.find();
    if (allBrands) {
        jsonResponse.code = 200;
        jsonResponse.message = "Todas las marcas";
        jsonResponse.status = true;
        jsonResponse.data = allBrands;
    }
    else {
        jsonResponse.code = 400;
        jsonResponse.message = "No hay marcas";
        jsonResponse.status = false;
    }
    res.json(jsonResponse);
}));
adminRouter.get("/allModels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const models = yield modelVehicle_1.default.find();
    if (models) {
        jsonRes.code = 200;
        jsonRes.message = "Modelos encontrados exitosamente";
        jsonRes.status = true;
        jsonRes.data = models;
    }
    else {
        jsonRes.code = 400;
        jsonRes.message = "No se encontraron modelos";
        jsonRes.status = false;
    }
    res.json(jsonRes);
}));
adminRouter.post("/addModelVehicle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonRes = new Response_1.ResponseModel();
    const { model, brand, type_vehicle } = req.body;
    const exist = yield modelVehicle_1.default.findOne({ model: model });
    if (exist) {
        jsonRes.code = 400;
        jsonRes.message = "El modelo ya existe";
        jsonRes.status = false;
    }
    else {
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
            jsonRes.message = "Error al agregar el modelo";
            jsonRes.status = false;
        }
    }
    res.json(jsonRes);
}));
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map