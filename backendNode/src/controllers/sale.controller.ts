import { Request, Response, response } from "express";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import sellers from "../schemas/Sellers.schema";
import notifications from "../schemas/notifications.schema";
import { sendEmail } from '../../nodemailer';
import jwt from "../helpers/generar-jwt";
import vehicles from "../schemas/Vehicles.schema";
import moment from "moment";


const saleController: any  = {};

saleController.buyVehicle = async (req: Request, res: Response) => {
    const responseJson: ResponseModel = new ResponseModel();
    const date_sell = moment().format("YYYY-MM-DD");
    const {
      id_vehicle,
      id_seller,
      name_new_owner,
      dni_new_owner,
      phone_new_owner,
      email_new_owner,
      price_ofert,
    } = req.body;
  
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["seller", "admin"]);
  
    if (decode == false) {
      responseJson.code = jwt.code;
      responseJson.message = jwt.message;
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
  
    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
      id_seller_buyer: id_seller,
      name_new_owner: name_new_owner,
      dni_new_owner: dni_new_owner,
      phone_new_owner: phone_new_owner,
      email_new_owner: email_new_owner,
      price_ofert: price_ofert,
      date_sell: date_sell,
      sold: false,
    });
  
    const getVehicle = await vehicles.findById(id_vehicle);
  
    const infoBuyer = await sellers.findById(id_seller);
  
    const infoSeller = await sellers.findById(getVehicle!.id_seller);
  
    const email = await Users.findById(infoSeller!.id_user);
  
    const emailBuyer = await Users.findById(infoBuyer!.id_user);
  
    const mailOptions = {
      from: "Toyousado Notifications",
      to: email!.email,
      subject: "Oferta de vehículo",
      html: `<div>
          <p>Tienes una oferta de compra para:</p>
      </div>
      <div class="div-table" style="width: 100%;">
          <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
                getVehicle?.model
              }</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
                getVehicle?.year
              }</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
                getVehicle?.plate
              }</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
                infoSeller?.fullName
              }</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
                infoSeller!.concesionary
              }</div>
          </div>
          <div style=" display: table-row;border: 1px solid #000;">
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
              <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${
                infoSeller?.city
              }</div>
          </div>
          </div>
          </div>`,
    };
  
    const dataVehicle = {
      model: getVehicle!.model,
      year: getVehicle!.year,
      plate: getVehicle!.plate,
      fullName: infoSeller!.fullName,
      concesionary: infoSeller!.concesionary,
      city: infoSeller!.city,
      title: "Tienes una oferta de compra para:",
    };
  
    await sendEmail(mailOptions);
  
    sendNotification(
      infoSeller!._id.toString(),
      dataVehicle,
      "Oferta de vehículo"
    );
  
    responseJson.code = 200;
    responseJson.message =
      "Compra realizada, esperar confirmación o rechazo del vendedor";
    responseJson.status = true;
    // }
  
    res.json(responseJson);
};

saleController.approveBuyVehicle = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const date_sell = moment().format("YYYY-MM-DD");
  const { id_vehicle } = req.body;

  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const infoVehicle = await vehicles.findById(id_vehicle);

  const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
    price_ofert: infoVehicle!.price_ofert,
    date_sell: date_sell,
    final_price_sold: infoVehicle!.price_ofert,
    sold: false,
  });

  const infoBuyer = await sellers.findById(vehicle!.id_seller_buyer);

  const userbuyer = await Users.findById(infoBuyer!.id_user);

  const infoSeller = await sellers.findById(vehicle!.id_seller);

  const Userseller = await Users.findById(infoSeller!.id_user);

  if (vehicle) {
    reponseJson.code = 200;
    reponseJson.message = "aprobacion de oferta exitosa";
    reponseJson.status = true;
    reponseJson.data = vehicle;

    const mailOptions = {
      from: "Toyousado Notifications",
      to: userbuyer!.email,
      subject: "Oferta de vehículo aprobada",
      text: `Tu oferta del vehículo ${vehicle!.model} del concesionario ${
        vehicle!.concesionary
      } ha sido aceptada, para mas información comunicate con el vendedor al correo ${
        Userseller!.email
      } o al número telefono ${infoSeller!.phone}`,
    };

    await sendEmail(mailOptions);

    sendNotification(
      userbuyer!._id.toString(),
      mailOptions.text,
      mailOptions.subject
    );
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
  } else {
    reponseJson.code = 400;
    reponseJson.message = "error al aprobar la oferta";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

saleController.rejectBuyVehicle = async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const { id_vehicle } = req.body;
  const token: any = req.header("Authorization");
  let decode = await jwt.getAuthorization(token, ["seller", "admin"]);

  if (decode == false) {
    reponseJson.code = jwt.code;
    reponseJson.message = jwt.message;
    reponseJson.status = false;
    reponseJson.data = null;
    return res.json(reponseJson);
  }

  const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {
    id_seller_buyer: null,
    sold: false,
    price_ofert: null,
    date_sell: null,
    name_new_owner: null,
    dni_new_owner: null,
    phone_new_owner: null,
    email_new_owner: null,
  });

  const infoBuyer = await sellers.findById(vehicle!.id_seller_buyer);

  const userbuyer = await Users.findById(infoBuyer!.id_user);

  const infoSeller = await sellers.findById(vehicle!.id_seller);

  const userSeller = await Users.findById(infoSeller!.id_user);

  if (vehicle) {
    reponseJson.code = 200;
    reponseJson.message = "oferta rechazada exitosamente";
    reponseJson.status = true;
    reponseJson.data = vehicle;

    const mailOptions = {
      from: "Toyousado Notifications",
      to: userbuyer!.email,
      subject: "Compra de vehículo rechazada",
      text: `Tu compra del vehículo ${vehicle!.model} del concesionario ${
        vehicle!.concesionary
      } fue rechazada, para más información comunicaté con el vendedor al correo ${
        userSeller!.email
      } o al número de teléfono ${infoSeller!.phone}`,
    };

    await sendEmail(mailOptions);

    sendNotification(
      userbuyer!._id.toString(),
      mailOptions.text,
      mailOptions.subject
    );
  } else {
    reponseJson.code = 400;
    reponseJson.message = "error al rechazar la oferta";
    reponseJson.status = false;
  }

  res.json(reponseJson);
};

const sendNotification = async (
  id_seller: string,
  data: any,
  title: string
) => {
  // const jsonRes: ResponseModel = new ResponseModel();

  const userInfo = await sellers.findOne({ _id: id_seller });

  if (userInfo) {
    const notify = new notifications({
      id_user: userInfo.id_user,
      title: title,
      data: data,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      status: false,
    });

    await notify.save();
  }
};


export default saleController;
