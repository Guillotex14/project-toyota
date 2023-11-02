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
const Response_1 = require("../models/Response");
const Users_schema_1 = __importDefault(require("../schemas/Users.schema"));
const Sellers_schema_1 = __importDefault(require("../schemas/Sellers.schema"));
const notifications_schema_1 = __importDefault(require("../schemas/notifications.schema"));
const nodemailer_1 = require("../../nodemailer");
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const Vehicles_schema_1 = __importDefault(require("../schemas/Vehicles.schema"));
const moment_1 = __importDefault(require("moment"));
const saleController = {};
saleController.buyVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = new Response_1.ResponseModel();
    const date_sell = (0, moment_1.default)().format("YYYY-MM-DD");
    const { id_vehicle, id_seller, name_new_owner, dni_new_owner, phone_new_owner, email_new_owner, price_ofert, } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        responseJson.code = generar_jwt_1.default.code;
        responseJson.message = generar_jwt_1.default.message;
        responseJson.status = false;
        responseJson.data = null;
        return res.json(responseJson);
    }
    // const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
    //   id_seller_buyer: id_seller,
    //   name_new_owner: name_new_owner,
    //   dni_new_owner: dni_new_owner,
    //   phone_new_owner: phone_new_owner,
    //   email_new_owner: email_new_owner,
    //   price_ofert: price_ofert,
    // });
    // const sameIdSeller = await vehicles.findById(id_vehicle);
    // if (sameIdSeller!.id_seller?.toString() === id_seller) {
    //   console.log('soy el comprador')
    //   const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
    //     id_seller_buyer: id_seller,
    //     name_new_owner: name_new_owner,
    //     dni_new_owner: dni_new_owner,
    //     phone_new_owner: phone_new_owner,
    //     email_new_owner: email_new_owner,
    //     price_ofert: price_ofert,
    //     price: price_ofert,
    //     sold: true,
    //     date_sell: date_sell,
    //     final_price_sold: price_ofert,
    //     dispatched: true,
    //   });
    //   if (vehicle) {
    //     responseJson.code = 200;
    //     responseJson.message = "vehículo comprado exitosamente";
    //     responseJson.status = true;
    //     responseJson.data = vehicle;
    //   } else {
    //     responseJson.code = 400;
    //     responseJson.message = "no se pudo comprar el vehículo";
    //     responseJson.status = false;
    //   }
    // } else {
    const vehicle = yield Vehicles_schema_1.default.findByIdAndUpdate(id_vehicle, {
        id_seller_buyer: id_seller,
        name_new_owner: name_new_owner,
        dni_new_owner: dni_new_owner,
        phone_new_owner: phone_new_owner,
        email_new_owner: email_new_owner,
        price_ofert: price_ofert,
        date_sell: date_sell,
        sold: false,
    });
    const getVehicle = yield Vehicles_schema_1.default.findById(id_vehicle);
    const infoBuyer = yield Sellers_schema_1.default.findById(id_seller);
    const infoSeller = yield Sellers_schema_1.default.findById(getVehicle.id_seller);
    const email = yield Users_schema_1.default.findById(infoSeller.id_user);
    const emailBuyer = yield Users_schema_1.default.findById(infoBuyer.id_user);
    const mailOptions = {
        from: "Toyousado Notifications",
        to: email.email,
        subject: "Oferta de vehículo",
        html: `<div>
          <p>Tienes una oferta de compra para:</p>
      </div>
      <div class="div-table" style="width: 100%;">
          <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle === null || getVehicle === void 0 ? void 0 : getVehicle.model}</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle === null || getVehicle === void 0 ? void 0 : getVehicle.year}</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${getVehicle === null || getVehicle === void 0 ? void 0 : getVehicle.plate}</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller === null || infoSeller === void 0 ? void 0 : infoSeller.fullName}</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller.concesionary}</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${infoSeller === null || infoSeller === void 0 ? void 0 : infoSeller.city}</div>
          </div>
          </div>
          </div>`,
    };
    const dataVehicle = {
        model: getVehicle.model,
        year: getVehicle.year,
        plate: getVehicle.plate,
        fullName: infoSeller.fullName,
        concesionary: infoSeller.concesionary,
        city: infoSeller.city,
        title: "Tienes una oferta de compra para:",
    };
    yield (0, nodemailer_1.sendEmail)(mailOptions);
    sendNotification(infoSeller._id.toString(), dataVehicle, "Oferta de vehículo");
    responseJson.code = 200;
    responseJson.message =
        "Compra realizada, esperar confirmación o rechazo del vendedor";
    responseJson.status = true;
    // }
    res.json(responseJson);
});
saleController.approveBuyVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const date_sell = (0, moment_1.default)().format("YYYY-MM-DD");
    const { id_vehicle } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const infoVehicle = yield Vehicles_schema_1.default.findById(id_vehicle);
    const vehicle = yield Vehicles_schema_1.default.findByIdAndUpdate(id_vehicle, {
        price_ofert: infoVehicle.price_ofert,
        date_sell: date_sell,
        final_price_sold: infoVehicle.price_ofert,
        sold: false,
    });
    const infoBuyer = yield Sellers_schema_1.default.findById(vehicle.id_seller_buyer);
    const userbuyer = yield Users_schema_1.default.findById(infoBuyer.id_user);
    const infoSeller = yield Sellers_schema_1.default.findById(vehicle.id_seller);
    const Userseller = yield Users_schema_1.default.findById(infoSeller.id_user);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "aprobacion de oferta exitosa";
        reponseJson.status = true;
        reponseJson.data = vehicle;
        const mailOptions = {
            from: "Toyousado Notifications",
            to: userbuyer.email,
            subject: "Oferta de vehículo aprobada",
            text: `Tu oferta del vehículo ${vehicle.model} del concesionario ${vehicle.concesionary} ha sido aceptada, para mas información comunicate con el vendedor al correo ${Userseller.email} o al número telefono ${infoSeller.phone}`,
        };
        yield (0, nodemailer_1.sendEmail)(mailOptions);
        sendNotification(userbuyer._id.toString(), mailOptions.text, mailOptions.subject);
        // const dataVehicle = {
        //   model: vehicle!.model,
        //   year: vehicle!.year,
        //   plate: vehicle!.plate ? vehicle!.plate : "",
        //   fullName: Userseller!.fullName,
        //   concesionary: vehicle!.concesionary,
        //   city: vehicle!.city,
        //   title: "Oferta de vehículo aprobada",
        //   link: `car-detail/${vehicle!._id}/home-seller`
        // };
        // sendNotification(
        //   userbuyer!._id.toString(),
        //   mailOptions.text,
        //   "Oferta de vehículo aprobada"
        // );
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "error al aprobar la oferta";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
saleController.rejectBuyVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const { id_vehicle } = req.body;
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["seller", "admin"]);
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const vehicle = yield Vehicles_schema_1.default.findByIdAndUpdate(id_vehicle, {
        id_seller_buyer: null,
        sold: false,
        price_ofert: null,
        date_sell: null,
        name_new_owner: null,
        dni_new_owner: null,
        phone_new_owner: null,
        email_new_owner: null,
    });
    const infoBuyer = yield Sellers_schema_1.default.findById(vehicle.id_seller_buyer);
    const userbuyer = yield Users_schema_1.default.findById(infoBuyer.id_user);
    const infoSeller = yield Sellers_schema_1.default.findById(vehicle.id_seller);
    const userSeller = yield Users_schema_1.default.findById(infoSeller.id_user);
    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "oferta rechazada exitosamente";
        reponseJson.status = true;
        reponseJson.data = vehicle;
        const mailOptions = {
            from: "Toyousado Notifications",
            to: userbuyer.email,
            subject: "Compra de vehículo rechazada",
            text: `Tu compra del vehículo ${vehicle.model} del concesionario ${vehicle.concesionary} fue rechazada, para más información comunicaté con el vendedor al correo ${userSeller.email} o al número de teléfono ${infoSeller.phone}`,
        };
        yield (0, nodemailer_1.sendEmail)(mailOptions);
        sendNotification(userbuyer._id.toString(), mailOptions.text, mailOptions.subject);
    }
    else {
        reponseJson.code = 400;
        reponseJson.message = "error al rechazar la oferta";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
const sendNotification = (id_seller, data, title) => __awaiter(void 0, void 0, void 0, function* () {
    // const jsonRes: ResponseModel = new ResponseModel();
    const userInfo = yield Sellers_schema_1.default.findOne({ _id: id_seller });
    if (userInfo) {
        const notify = new notifications_schema_1.default({
            id_user: userInfo.id_user,
            title: title,
            data: data,
            date: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
            status: false,
        });
        yield notify.save();
    }
});
exports.default = saleController;
//# sourceMappingURL=sale.controller.js.map