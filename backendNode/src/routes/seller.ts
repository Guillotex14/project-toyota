import { Router, Request, Response, json } from "express";
import bcrypt from "bcrypt";
import moment from "moment";

import Users from "../models/Users";
import vehicles from "../models/Vehicles";
import mechanics from "../models/Mechanics";
import zones from "../models/Zones";
import concesionary from "../models/Concesionaries";
import { ResponseModel } from "../models/Response";
import mechanicalsFiles from "../models/mechanicalsFiles";
import Sellers from "../models/Sellers";
import brands from "../models/brands";
import notifications from "../models/notifications";
import ImgVehicle from "../models/ImgVehicle";
import modelVehicle from "../models/modelVehicle";
import { deleteImageVehicle, uploadImageVehicle } from "../../cloudinaryMetods";
import { sendEmail } from '../../nodemailer';

const sellerRouter = Router();

sellerRouter.post("/addMechanic", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  const date_created = moment().format("YYYY-MM-DD");
  const { email, password, username, fullName, city, concesionary } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const newUser = new Users({
    email,
    password: hash,
    username,
    type_user: "mechanic",
  });
  const newMechanic = new mechanics({
    fullName,
    city,
    concesionary,
    date_created,
  });

  await newUser
    .save()
    .then((res: any) => {
      if (res) {
        newMechanic.id_user = res._id;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });

  await newMechanic.save();

  const mailOptions = {
    from: "Toyousado",
    to: email,
    subject: "Bienvenido",
    text:
      "Bienvenido a Toyousado, tu usuario es: " +
      email +
      " y tu contraseña es: " +
      password +
      "",
  };

  await sendEmail(mailOptions);

  reponseJson.code = 200;
  reponseJson.message = "Mecanico agregado exitosamente";
  reponseJson.status = true;
  reponseJson.data = "";

  res.json(reponseJson);
});

sellerRouter.post("/addVehicle", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  let emailmechanic = "";
  let infoSeller: any = {};
  let dateNow = moment().format("YYYY-MM-DD");

  const {model,brand,year,displacement,km,engine_model,titles,fuel,transmission,traction,city,dealer,concesionary,traction_control,performance,comfort,technology, id_seller, id_mechanic, type_vehicle, images, vin, vehicle_plate} = req.body;

  const newVehicle =  new vehicles({model, year, brand, displacement, km, engine_model, titles, fuel, transmission, traction, city, dealer, concesionary, traction_control, performance, comfort, technology, mechanicalFile: false, sold: false, date_create: dateNow, price: null,id_seller, id_mechanic, id_seller_buyer: null, type_vehicle, vin, vehicle_plate});
  
  await newVehicle.save()

  await mechanics.findOne({ _id: id_mechanic }).then(async (res: any) => {
      if (res) {
        await Users.findOne({ _id: res.id_user }).then((res: any) => {
            if (res) {
              emailmechanic = res.email;
            }
          }).catch((err: any) => {
            console.log(err);
          });
      }
    }).catch((err: any) => {
      console.log(err);
    });

  infoSeller = await Sellers.findOne({ _id: id_seller });

  if (images) {
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        
        const filename = await uploadImageVehicle(images[i].image);

        const imgVehi = new ImgVehicle({
          img: filename.secure_url,
          id_vehicle: newVehicle._id,
          public_id: filename.public_id,
        });
        await imgVehi.save();
      }
    }
  }

  const mailOptions = {
    from: "Toyousado",
    to: emailmechanic,
    subject: "Revisión de vehiculo",
    text:
      "El vendedor " +
      infoSeller!.fullName +
      " del concesionario " +
      infoSeller!.concesionary +
      " de la ciudad de " +
      infoSeller!.city +
      " ha agregado un vehiculo para que sea revisado, por favor ingresa a la plataforma para revisarlo",
  };

  await sendEmail(mailOptions);

  sendNotificationMechanic(id_mechanic, mailOptions.text, mailOptions.subject);

  reponseJson.code = 200;
  reponseJson.message = "Vehiculo agregado exitosamente";
  reponseJson.status = true;
  reponseJson.data = "";

  res.json(reponseJson);
});

sellerRouter.post("/addMechanicalFile", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const {
    part_emblems_complete,
    wiper_shower_brushes_windshield,
    hits,
    scratches,
    paint_condition,
    bugle_accessories,
    air_conditioning_system,
    radio_player,
    courtesy_lights,
    upholstery_condition,
    gts,
    board_lights,
    tire_pressure,
    tire_life,
    battery_status_terminals,
    transmitter_belts,
    motor_oil,
    engine_coolant_container,
    radiator_status,
    exhaust_pipe_bracket,
    fuel_tank_cover_pipes_hoses_connections,
    distribution_mail,
    spark_plugs_air_filter_fuel_filter_anti_pollen_filter,
    fuel_system,
    parking_break,
    brake_bands_drums,
    brake_pads_discs,
    brake_pipes_hoses,
    master_cylinder,
    brake_fluid,
    bushings_plateaus,
    stumps,
    terminals,
    Stabilizer_bar,
    bearings,
    tripoids_rubbe_bands,
    shock_absorbers_coils,
    dealer_maintenance,
    id_vehicle,
    id_mechanic,
  } = req.body;

  const newMechanicFile = new mechanicalsFiles({
    part_emblems_complete,
    wiper_shower_brushes_windshield,
    hits,
    scratches,
    paint_condition,
    bugle_accessories,
    air_conditioning_system,
    radio_player,
    courtesy_lights,
    upholstery_condition,
    gts,
    board_lights,
    tire_pressure,
    tire_life,
    battery_status_terminals,
    transmitter_belts,
    motor_oil,
    engine_coolant_container,
    radiator_status,
    exhaust_pipe_bracket,
    fuel_tank_cover_pipes_hoses_connections,
    distribution_mail,
    spark_plugs_air_filter_fuel_filter_anti_pollen_filter,
    fuel_system,
    parking_break,
    brake_bands_drums,
    brake_pads_discs,
    brake_pipes_hoses,
    master_cylinder,
    brake_fluid,
    bushings_plateaus,
    stumps,
    terminals,
    Stabilizer_bar,
    bearings,
    tripoids_rubbe_bands,
    shock_absorbers_coils,
    dealer_maintenance,
    approve: false,
    reject: false,
    edit: false,
    id_vehicle,
    id_mechanic,
  });

  const newMechanicFileSaved = await newMechanicFile.save();

  const vehicleUpdated = await vehicles.findByIdAndUpdate(id_vehicle, {
    mechanicalFile: true,
  });

  if (newMechanicFileSaved) {
    reponseJson.code = 200;
    reponseJson.status = true;
    reponseJson.message = "Ficha mecanica creada correctamente";
    reponseJson.data = newMechanicFileSaved;
  } else {
    reponseJson.code = 400;
    reponseJson.status = false;
    reponseJson.message = "No se pudo crear la Ficha mecanica";
  }

  res.json(reponseJson);
});

sellerRouter.post("/updateVehicle", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_vehicle, price } = req.body;

  const vehicleUpdated = await vehicles.findByIdAndUpdate(id_vehicle, {
    price: price,
  });

  if (vehicleUpdated) {
    reponseJson.code = 200;
    reponseJson.status = true;
    reponseJson.message = "Vehiculo actualizado correctamente";
    reponseJson.data = vehicleUpdated;
  } else {
    reponseJson.code = 400;
    reponseJson.status = false;
    reponseJson.message = "No se pudo actualizar el vehiculo";
  }

  res.json(reponseJson);
});

sellerRouter.post("/addImgVehicle", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_vehicle, image } = req.body;

    const filename = await uploadImageVehicle(image);

    const newImage = new ImgVehicle({ img: filename.secure_url, id_vehicle: id_vehicle, public_id: filename.public_id });

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

sellerRouter.post("/deleteImgVehicle", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { public_id } = req.body;

  const delImag = await deleteImageVehicle(public_id);

  const delImg = await ImgVehicle.findOneAndDelete({ public_id: public_id });

  if (delImg) {
    reponseJson.code = 200;
    reponseJson.message = "Imagen eliminada exitosamente";
    reponseJson.status = true;
  }else{
    reponseJson.code = 400;
    reponseJson.message = "No se pudo eliminar la imagen";
    reponseJson.status = false;
  }

  res.json(reponseJson);
});

sellerRouter.post("/updateImgVehicle", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_vehicle, image, public_id } = req.body;

  const delImg = await ImgVehicle.findOneAndDelete({ public_id: public_id});

  const delImag = await deleteImageVehicle(public_id);
  
  if (delImg) {
    let filename = await uploadImageVehicle(image);

    const newImage = new ImgVehicle({
      img: filename.secure_url,
      id_vehicle: id_vehicle,
      public_id: filename.public_id
    });
    await newImage.save();

    const arrayImages = await ImgVehicle.find({ id_vehicle: id_vehicle });

    let data = {
      images: arrayImages,
      imgEdit: newImage
    }

    reponseJson.code = 200;
    reponseJson.message = "Imagen actualizada exitosamente";
    reponseJson.data = data;
    reponseJson.status = true;
  }else{

    reponseJson.code = 400;
    reponseJson.message = "No se pudo actualizar la imagen";
    reponseJson.status = false;
  }

  res.json(reponseJson);

});

sellerRouter.get("/allVehicles", async (req: Request, res: Response) => {
  const jsonRes: ResponseModel = new ResponseModel();

  const { id_seller } = req.body;

  const ress = await vehicles
    .find({
      mechanicalFile: true,
      sold: false,
      id_seller: { $ne: id_seller },
      price: { $ne: null },
    })
    .sort({ date: -1 })
    .then((res: any) => {
      console.log("carros a la venta", res);
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
    })
    .catch((err: any) => {
      console.log(err);
    });

  res.json(ress);
});

sellerRouter.post("/myVehicles", async (req: Request, res: Response) => {
  const jsonRes: ResponseModel = new ResponseModel();
  const { id_seller } = req.body;

  const ress = await vehicles
    .find({ id_seller: id_seller })
    .then((res: any) => {
      console.log("carros a la venta", res);
      if (res) {
        jsonRes.code = 200;
        jsonRes.message = "success";
        jsonRes.status = true;
        jsonRes.data = res;
      } else if (!res) {
        jsonRes.code = 400;
        jsonRes.message = "no existe";
        jsonRes.status = false;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });

  res.json(ress);
});

sellerRouter.post("/vehicleById", async (req: Request, res: Response) => {
  const jsonRes: ResponseModel = new ResponseModel();

  const { id } = req.body;

  const infoVehicle = await vehicles.findOne({ _id: id });

  const imgsVehichle = await ImgVehicle.find({ id_vehicle: id });

  const mechanicalFile = await mechanicalsFiles.findOne({ id_vehicle: id });

  if (infoVehicle) {
    
    let data = {
      _id: infoVehicle._id,
      model: infoVehicle.model,
      brand: infoVehicle.brand,
      year: infoVehicle.year,
      displacement: infoVehicle.displacement,
      km: infoVehicle.km,
      engine_model: infoVehicle.engine_model,
      titles: infoVehicle.titles,
      fuel: infoVehicle.fuel,
      transmission: infoVehicle.transmission,
      city:  infoVehicle.city,
      dealer: infoVehicle.dealer,
      concesionary: infoVehicle.concesionary,
      traction_control: infoVehicle.traction_control,
      performance: infoVehicle.performance,
      price: infoVehicle.price,
      comfort: infoVehicle.comfort,
      technology: infoVehicle.technology,
      mechanicalFile: infoVehicle.mechanicalFile,
      sold: infoVehicle.sold,
      type_vehicle: infoVehicle.type_vehicle,
      id_seller: infoVehicle.id_seller,
      id_mechanic: infoVehicle.id_mechanic,
      id_seller_buyer: infoVehicle.id_seller_buyer,
      traction: infoVehicle.traction,
      date_create:infoVehicle.date_create,
      plate:  infoVehicle.plate,
      vin: infoVehicle.vin,
      price_ofert: infoVehicle.price_ofert,
      final_price_sold: infoVehicle.final_price_sold,
      general_condition: mechanicalFile!.general_condition,
      images: imgsVehichle ? imgsVehichle : [],
    }

    jsonRes.code = 200;
    jsonRes.message = "success";
    jsonRes.status = true;
    jsonRes.data = data;

  }else{
    jsonRes.code = 400;
    jsonRes.message = "No se pudo obtener la información del vehículo";
    jsonRes.status = false;
  }

  res.json(jsonRes);
});

sellerRouter.post("/mechanicalFileByIdVehicle",async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const { id_vehicle } = req.body;

    const mecFile = await mechanicalsFiles.findOne({ id_vehicle: id_vehicle });
    if (mecFile) {
      reponseJson.code = 200;
      reponseJson.status = true;
      reponseJson.message = "Ficha mecanica encontrada";
      reponseJson.data = mecFile;
    } else {
      reponseJson.code = 400;
      reponseJson.status = false;
      reponseJson.message = "No se encontro la ficha mecanica";
    }

    res.json(reponseJson);
  }
);

sellerRouter.get("/allMechanics", async (req: Request, res: Response) => {
  const responseJson: ResponseModel = new ResponseModel();
  let arrayMechanics: any[] = [];
  let infoMechanic: any[] = [];

  const ress = await Users.find({ type_user: "mechanic" })
    .then(async (res: any) => {
      if (res) {
        responseJson.code = 200;
        responseJson.message = "success";
        responseJson.status = true;

        for (let i = 0; i < res.length; i++) {
          await mechanics
            .find({ id_user: res[i]._id })
            .then((res2: any) => {
              if (res2) {
                res2.forEach((element: any) => {
                  infoMechanic.push(element);
                });
              } else {
                infoMechanic = [];
                return res2;
              }
            })
            .catch((err: any) => {
              console.log(err);
            });
        }

        for (let j = 0; j < res.length; j++) {
          for (let k = 0; k < infoMechanic.length; k++) {
            if (res[j]._id.toString() === infoMechanic[k].id_user.toString()) {
              let mechanic = {
                id: res[j]._id,
                id_mechanic: infoMechanic[k]._id,
                fullName: infoMechanic[k].fullName,
                city: infoMechanic[k].city,
                concesionary: infoMechanic[k].concesionary,
                email: res[j].email,
                username: res[j].username,
                type_user: res[j].type_user,
              };
              arrayMechanics.push(mechanic);
            }
          }
        }

        responseJson.data = arrayMechanics;
        return responseJson;
      } else {
        responseJson.code = 400;
        responseJson.message = "no existe";
        responseJson.status = false;
        return responseJson;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });

  res.json(ress);
});

sellerRouter.post("/mechanicByConcesionary", async (req: Request, res: Response) => {
    const jsonResponse: ResponseModel = new ResponseModel();
    const { concesionary } = req.body;

    const ress = await mechanics
      .find({ concesionary: concesionary })
      .then((res: any) => {
        if (res) {
          jsonResponse.code = 200;
          jsonResponse.message = "success";
          jsonResponse.status = true;
          jsonResponse.data = res;
          return jsonResponse;
        } else if (!res) {
          jsonResponse.code = 400;
          jsonResponse.message = "no existe";
          jsonResponse.status = false;
          return jsonResponse;
        }
      })
      .catch((err: any) => {
        console.log(err);
      });

    res.json(ress);
  }
);

sellerRouter.get("/allZones", async (req: Request, res: Response) => {
  const jsonResponse: ResponseModel = new ResponseModel();
  const ress = await zones
    .find()
    .then((res: any) => {
      if (res) {
        jsonResponse.code = 200;
        jsonResponse.message = "success";
        jsonResponse.status = true;
        jsonResponse.data = res;
        return jsonResponse;
      } else if (!res) {
        jsonResponse.code = 400;
        jsonResponse.message = "no existe";
        jsonResponse.status = false;
        return jsonResponse;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
  res.json(ress);
});

sellerRouter.get("/allConcesionaries", async (req: Request, res: Response) => {
  const jsonResponse: ResponseModel = new ResponseModel();

  const ress = await concesionary
    .find()
    .then(async (res: any) => {
      console.log(res);
      if (res) {
        jsonResponse.code = 200;
        jsonResponse.message = "success";
        jsonResponse.status = true;
        jsonResponse.data = res;
        return jsonResponse;
      } else if (!res) {
        jsonResponse.code = 400;
        jsonResponse.message = "no existe";
        jsonResponse.status = false;
        return jsonResponse;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });

  res.json(ress);
});

sellerRouter.get("/allBrands", async (req: Request, res: Response) => {
  const jsonResponse: ResponseModel = new ResponseModel();

  const brand = await brands.find()

  if (brand) {

    jsonResponse.code = 200;
    jsonResponse.message = "success";
    jsonResponse.status = true;
    jsonResponse.data = brand;
    
  } else {
    jsonResponse.code = 400;
    jsonResponse.message = "no existe";
    jsonResponse.status = false;
    
  }

  res.json(jsonResponse);
});

sellerRouter.get("/allModels", async (req: Request, res: Response) => {
  const jsonResponse: ResponseModel = new ResponseModel();

  const model = await modelVehicle.find();

  if (model) {
    jsonResponse.code = 200;
    jsonResponse.message = "todos los modelos";
    jsonResponse.status = true;
    jsonResponse.data = model;
  }else{
    jsonResponse.code = 400;
    jsonResponse.message = "no hay modelos";
    jsonResponse.status = false;
  }

  res.json(jsonResponse);

});

sellerRouter.post('/buyVehicle', async (req: Request, res: Response) => {
    const responseJson: ResponseModel = new ResponseModel();
    
    const { id_vehicle, id_seller, name_new_owner, dni_new_owner, phone_new_owner, email_new_owner, price_ofert } = req.body;

    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {id_seller_buyer: id_seller, name_new_owner:name_new_owner, dni_new_owner:dni_new_owner, phone_new_owner:phone_new_owner, email_new_owner:email_new_owner, price_ofert:price_ofert})

  const getVehicle = await vehicles.findById(id_vehicle);

  const infoBuyer = await Sellers.findById(id_seller);

  const infoSeller = await Sellers.findById(getVehicle!.id_seller);

  const email = await Users.findById(infoSeller!.id_user);

  const emailBuyer = await Users.findById(infoBuyer!.id_user);

  const mailOptions = {
    from: "Toyousado Notifications",
    to: email!.email,
    subject: "Compra de vehiculo",
    text: `el vendedor ${
      infoBuyer!.fullName
    } quiere comprar tu vehiculo, para mas información comunicate con el vendedor al correo ${
      emailBuyer!.email
    } o al numero telefono ${infoBuyer!.phone}`,
  };

  await sendEmail(mailOptions);

  sendNotification(
    infoSeller!._id.toString(),
    mailOptions.text,
    mailOptions.subject
  );

  responseJson.code = 200;
  responseJson.message =
    "Compra realizada, esperar confirmación o rechazo del vendedor";
  responseJson.status = true;

  res.json(responseJson);
});

sellerRouter.post("/approveBuyVehicle", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_vehicle } = req.body;

  const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, { sold: true });

  const infoBuyer = await Sellers.findById(vehicle!.id_seller_buyer);

  const userbuyer = await Users.findById(infoBuyer!.id_user);

  const infoSeller = await Sellers.findById(vehicle!.id_seller);

  const userSeller = await Users.findById(infoSeller!.id_user);

  if (vehicle) {
    reponseJson.code = 200;
    reponseJson.message = "Compra realizada, esperar confirmación o rechazo del vendedor";
    reponseJson.status = true;
    reponseJson.data = vehicle;

    const mailOptions = {
      from: "Toyousado Notifications",
      to: userbuyer!.email,
      subject: "Compra de vehiculo aprobada",
      text: `Tu compra del vehiculo ${vehicle!.model} del concesionario ${
        vehicle!.concesionary
      } ha sido aprobada, para mas información comunicate con el vendedor al correo ${
        userSeller!.email
      } o al numero telefono ${infoSeller!.phone}`,
    };

    await sendEmail(mailOptions);

    sendNotification(
      userbuyer!._id.toString(),
      mailOptions.text,
      mailOptions.subject
    );
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }

    res.json(reponseJson);

})

sellerRouter.post('/approveBuyVehicle', async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const date_sell = moment().format('YYYY-MM-DD');
    const { id_vehicle } = req.body;

    const infoVehicle = await vehicles.findById(id_vehicle);

    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {price_ofert: infoVehicle!.price_ofert, date_sell: date_sell, final_price_sold: infoVehicle!.price_ofert});

    const infoBuyer = await Sellers.findById(vehicle!.id_seller_buyer);

    const userbuyer = await Users.findById(infoBuyer!.id_user);

    const infoSeller = await Sellers.findById(vehicle!.id_seller);

    const userSeller = await Users.findById(infoSeller!.id_user);

    if (vehicle) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = vehicle;

        const mailOptions = {
            from: 'Toyousado Notifications',
            to: userbuyer!.email,
            subject: 'Oferta de vehiculo aprobada',
            text: `Tu oferta del vehiculo ${vehicle!.model} del concesionario ${vehicle!.concesionary} ha sido aceptada, para mas información comunicate con el vendedor al correo ${userSeller!.email} o al numero telefono ${infoSeller!.phone}`,
        }
        
        await sendEmail(mailOptions);

        sendNotification(userbuyer!._id.toString(), mailOptions.text, mailOptions.subject)

    }else{
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
    }

    res.json(reponseJson);
});

sellerRouter.post("/rejectBuyVehicle", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_vehicle } = req.body;

    const vehicle = await vehicles.findByIdAndUpdate(id_vehicle, {id_seller_buyer: null, sold: false, price_ofert: null, date_sell: null, name_new_owner: null, dni_new_owner: null, phone_new_owner: null, email_new_owner: null});

  const infoBuyer = await Sellers.findById(vehicle!.id_seller_buyer);

  const userbuyer = await Users.findById(infoBuyer!.id_user);

  const infoSeller = await Sellers.findById(vehicle!.id_seller);

  const userSeller = await Users.findById(infoSeller!.id_user);

  if (vehicle) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = vehicle;

    const mailOptions = {
      from: "Toyousado Notifications",
      to: userbuyer!.email,
      subject: "Compra de vehiculo rechazada",
      text: `Tu compra del vehiculo ${vehicle!.model} del concesionario ${
        vehicle!.concesionary
      } fue rechazada, para mas información comunicate con el vendedor al correo ${
        userSeller!.email
      } o al numero telefono ${infoSeller!.phone}`,
    };

    await sendEmail(mailOptions);

    sendNotification(
      userbuyer!._id.toString(),
      mailOptions.text,
      mailOptions.subject
    );
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }

  res.json(reponseJson);
});

sellerRouter.post("/getNotifications", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id_user } = req.body;

  const notificationsUser = await notifications
    .find({ id_user: id_user, status: false })
    .sort({ date: -1 });

  if (notificationsUser) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = notificationsUser;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }

  res.json(reponseJson);
});

sellerRouter.post("/updateNotification", async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id } = req.body;

    const notificationsUser = await notifications.findByIdAndUpdate(id, {
      status: true,
    });

    if (notificationsUser) {
      reponseJson.code = 200;
      reponseJson.message = "success";
      reponseJson.status = true;
      reponseJson.data = notificationsUser;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "no existe";
      reponseJson.status = false;
    }

    res.json(reponseJson);
  }
);

sellerRouter.post("/notificationById", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id } = req.body;

  const notificationsUser = await notifications.findById(id);

  if (notificationsUser) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = notificationsUser;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }

  res.json(reponseJson);
});

sellerRouter.post("/countNotifications", async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();

    const { id_user } = req.body;

    const countNotifies = await notifications.countDocuments({
      id_user: id_user,
      status: false,
    });

    if (countNotifies) {
      reponseJson.code = 200;
      reponseJson.message = "success";
      reponseJson.status = true;
      reponseJson.data = countNotifies;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "no existe";
      reponseJson.status = false;
    }

    res.json(reponseJson);
  }
);

sellerRouter.post("/getVehicleByType", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { type_vehicle } = req.body;

  const arrayVehicles = await vehicles.find({
    type_vehicle: type_vehicle,
    mechanicalFile: true,
    sold: false,
    id_seller_buyer: null,
  });

  if (arrayVehicles) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = arrayVehicles;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }

  res.json(reponseJson);
});

sellerRouter.post("/filterVehiclesWithMongo", async (req: Request, res: Response) => {
    //aqui declaramos las respuestas
    const reponseJson: ResponseModel = new ResponseModel();
    let query: any = {};
    //aqui declaramos las variables que vamos a recibir
    const {
      minYear,
      maxYear,
      minKm,
      maxKm,
      minPrice,
      maxPrice,
      brand,
      model,
      ubication,
      type_vehicle,
    } = req.body;

    //aqui creamos las condiciones para el filtro de los vehiculos y las querys

    if (minYear === 0 && maxYear === 0) {
      query.year = { $gte: 0 };
    } else if (minYear !== 0 && maxYear === 0) {
      query.year = { $gte: minYear };
    } else if (minYear === 0 && maxYear !== 0) {
      query.year = { $lte: maxYear };
    } else {
      query.year = { $gte: minYear, $lte: maxYear };
    }

    if (minKm === 0 && maxKm === 0) {
      query.km = { $gte: 0 };
    } else if (minKm !== 0 && maxKm === 0) {
      query.km = { $gte: minKm };
    } else if (minKm === 0 && maxKm !== 0) {
      query.km = { $lte: maxKm };
    } else {
      query.km = { $gte: minKm, $lte: maxKm };
    }

    if (minPrice === 0 && maxPrice === 0) {
      query.price = { $gte: 0, $ne: null };
    } else if (minPrice !== 0 && maxPrice === 0) {
      query.price = { $gte: minPrice, $ne: null };
    } else if (minPrice === 0 && maxPrice !== 0) {
      query.price = { $lte: maxPrice, $ne: null };
    } else {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    query.city = { $regex: ubication, $options: "i" };
    query.brand = { $regex: brand, $options: "i" };
    query.model = { $regex: model, $options: "i" };
    query.type_vehicle = { $regex: type_vehicle, $options: "i" };
    query.mechanicalFile = true;
    query.sold = false;
    // query.id_seller_buyer = null;

    const vehiclesFiltered = await vehicles.find(query).sort({date_create:-1});

    if (vehiclesFiltered) {
      let arrayVehicles: any[] = [];

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
                image: await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id }) ? await ImgVehicle.findOne({ id_vehicle: vehiclesFiltered[i]._id }) : "",
            }
            arrayVehicles.push(data);
        }

        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = arrayVehicles;
    } else {
      reponseJson.code = 400;
      reponseJson.message = "no existe";
      reponseJson.status = false;
    }

    res.json(reponseJson);
  }
);

sellerRouter.get("/filterGraphySell", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  let { month, yearSold, rangMonths, yearCar, brandCar, modelCar }: any =req.query;

  //   yearSold = 2023; // A de venta
  //   rangMonths = 12; // Rango de meses
  //   month = 1; // Mes donde comienza el rango

  // yearCar = 2010; // Año del vehículo
  // brandCar = "Toyota"; // Marca del vehículo
  // modelCar = "TkT"; // Modelo del vehículo

  let now = new Date();
  let anioActual = now.getFullYear();
  if (yearSold) {
    anioActual=yearSold;
  }

  if (!month) {
    month=1;
  }

  if (!rangMonths) {
    rangMonths=12;
  }

  let firtsMonth = new Date(anioActual, 0, 1);
  let last = new Date(anioActual, 11);
  let lastDayLasyMont=getLastDayOfMonth(anioActual,11);
  let lastMonth = new Date(anioActual, 11,lastDayLasyMont.getDate());
  let rangArrayMonth: any[] = [];

  if (rangMonths &&  rangMonths < 12) {
    rangArrayMonth = getMonthRange(month, rangMonths);

    firtsMonth = new Date(anioActual, (month - 1), 1);
    if (rangArrayMonth.length > 1) {
      last = new Date(anioActual, (rangArrayMonth.length - 1));
      lastDayLasyMont=getLastDayOfMonth(anioActual,(rangArrayMonth.length - 1));   
      lastMonth = new Date(anioActual,(rangArrayMonth.length - 1),lastDayLasyMont.getDate());
    } else {
      
      last = new Date(anioActual, (month - 1));
      lastDayLasyMont=getLastDayOfMonth(anioActual,(month - 1));   
      lastMonth = new Date(anioActual,(month - 1),lastDayLasyMont.getDate());
    }
  }

  let from = `${firtsMonth.getFullYear()}-${firtsMonth.getMonth() + 1 < 10 ? "0" + (firtsMonth.getMonth() + 1): firtsMonth.getMonth() + 1}-${firtsMonth.getDate() < 10? "0" + firtsMonth.getDate(): firtsMonth.getDate()}`;
  
  let to = `${lastMonth.getFullYear()}-${lastMonth.getMonth() + 1 < 10 ? "0" + (lastMonth.getMonth() + 1): lastMonth.getMonth() + 1}-${lastMonth.getDate() < 10? "0" + lastMonth.getDate(): lastMonth.getDate()}`;
  let mongQuery:any={
    date_sell: {
      $gte: from, // Filtrar documentos a partir del 1 de enero del año
      $lte: to, // Filtrar documentos hasta el 31 de diciembre del año
    },
    sold: true, // Campo de búsqueda adicional

  };
  

  if (yearCar) {
    mongQuery={
      ...mongQuery,
        year:parseInt(yearCar)
    }
  }

  if (brandCar) {
    mongQuery={
      ...mongQuery,
        brand:{ $regex: brandCar, $options: "i" }
    }
  }

  if (modelCar) {
    mongQuery={
      ...mongQuery,
      model: { $regex: modelCar, $options: "i" }
    }
  }

  
  const vehiclesFiltered = await vehicles.aggregate([
    {
      $match: mongQuery
    },
    {
      $group: {
        _id: "$date_sell",
        monto: { $sum: "$price" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const cards = await vehicles.find(mongQuery);

  const cardsgroup = await vehicles.aggregate([
    {
      $match: mongQuery
    },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        medPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
      }
    }
  ]);

  let cardPriceGroup:any;

  cardPriceGroup= gruopCardPrice(cards,cardsgroup[0]);
  let otherQuery={
    ...mongQuery,
    mechanicalFile:true
  }

  

  const countMechanicaFile = await vehicles.aggregate([
    {
      $match:otherQuery
    },
    {
      $lookup: {
        from: "mechanicalfiles",
        localField: "_id",
        foreignField: "id_vehicle",
        as: "mechanicalfiles"
      }
    },
    {
      $unwind: {
        path: "$mechanicalfiles"
      }
    },
    {
      $match: {
        "mechanicalfiles.general_condition": { $in: ["bueno", "malo", "regular", "excelente"] }
      }
    },
    {
      $group: {
        _id: "$mechanicalfiles.general_condition",
        count: { $sum: 1 }
      }
    }
  ]);




let datos:any={};
let cantMonth=calcularMeses(from,to);

if(cantMonth==1){
  let groupByWeek=[];
  let groupByOneMonth=[];

  groupByWeek= agruparPorSemana(vehiclesFiltered);

  groupByOneMonth= agruparPorWeek(groupByWeek);

  const labels = groupByOneMonth.map(item => item.semana);
  const montos = groupByOneMonth.map(item => item.monto);
  datos = {
    labels: labels, // Meses en el eje x
    datasets: [
      {
        label: "Montos Mensuales",
        data: montos, // Montos en el eje y
      },
    ],
    grupocard:cardPriceGroup,
    mechanicaFiles:countMechanicaFile
  };

}else{
  const labels = vehiclesFiltered.map((dato) => dato._id);
  let nameArray = [];
  for (let i = 0; i < labels.length; i++) {
    nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
  }
  
  const montos = vehiclesFiltered.map((dato) => dato.monto);

  datos = {
    labels: nameArray, // Meses en el eje x
    datasets: [
      {
        label: "Montos Mensuales",
        data: montos, // Montos en el eje y
      },
    ],
    // vehicles:cards,
    grupocard:cardPriceGroup,
    mechanicaFiles:countMechanicaFile

  };
}


  if (datos) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = datos;
  } else {
    reponseJson.code = 200;
    reponseJson.message = "sin resultado";
    reponseJson.status = false;
  }

  res.json(reponseJson);
});

sellerRouter.post("/autocompleteModels", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { search } = req.body;

  const vehiclesFiltered = await modelVehicle.find({
    model: { $regex: search, $options: "i" },
  });

  if (vehiclesFiltered) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = vehiclesFiltered;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }

  res.json(reponseJson);




});

sellerRouter.post("/dispatchedCar", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id, final_price_sold } = req.body;

  const vehiclesFiltered = await vehicles.findOneAndUpdate({ _id: id },{ sold: true,price: final_price_sold });

  if (vehiclesFiltered) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = vehiclesFiltered;
  }else{
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }

  res.json(reponseJson);

});

sellerRouter.post("/repost", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();

  const { id } = req.body;

  const vehiclesFiltered = await vehicles.findOneAndUpdate({ _id: id },{ sold: false, price_ofert: null, final_price_sold: null,name_new_owner: null, dni_new_owner: null, phone_new_owner: null, email_new_owner: null, date_sell: null, id_seller_buyer: null });

  if (vehiclesFiltered) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = vehiclesFiltered;
  }else{
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }

  res.json(reponseJson);

});

const gruopCardPrice=(listCar:any[],groupPrice:any)=>{
    let caray:any={
      minPrice:{
        value:groupPrice.minPrice,
        cars:[],
      },
      medPrice:{
        value:groupPrice.medPrice,
        cars:[],
      },
      maxPrice:{
        value:groupPrice.maxPrice,
        cars:[],
      },
    };
    listCar.map(car=>{
      car.price= car.price ? car.price:0;
      if (car.price<=groupPrice.minPrice) {
          caray.minPrice.cars.push(car);
        }
        if (car.price>groupPrice.minPrice && car.price<=groupPrice.medPrice) {
          caray.medPrice.cars.push(car);
        }
        if (car.price>groupPrice.medPrice && car.price<=groupPrice.maxPrice) {
          caray.maxPrice.cars.push(car);
        }
    })

    return caray;
}

const calcularMeses=(fechaInicial:any, fechaFinal:any) =>{
  const inicio = new Date(fechaInicial);
  const fin = new Date(fechaFinal);
  
  const diferenciaMeses = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
  
  return diferenciaMeses;
}

const agruparPorSemana=(datos:any)=> {
  const semanas = [];
  
  for (const dato of datos) {
    const fecha = new Date(dato._id);
    const semana = getWeekNumber(fecha);
    if (semanas[semana]) {
      semanas[semana] += dato.monto;
    } else {
      semanas[semana] = dato.monto;
    }
  }
  
  const result = [];
  for (const semana in semanas) {
    result.push({ semana: Number(semana), monto: semanas[semana] });
  }
  
  return result;
}

// Función para obtener el número de semana de una fecha
const getWeekNumber=(date:any) =>{
  const onejan:any = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil((((date - onejan) / 86400000) + onejan.getDay()) / 7);
  return week;
}

const agruparPorWeek=(datos:any)=> {
  const semanas = []
  let contador = 1;
  
  for (const dato of datos) {
    if (!semanas[contador]) {
      semanas[contador] = 0;
    }
    semanas[contador] += dato.monto;
    contador++;
  }
  
  const result = [];
  for (const semana in semanas) {
    result.push({ semana: Number(semana), monto: semanas[semana] });
  }
  
  return result;
}

const sendNotification = async (
  id_seller: string,
  message: string,
  title: string
) => {
  // const jsonRes: ResponseModel = new ResponseModel();

  const userInfo = await Sellers.findOne({ _id: id_seller });

  if (userInfo) {
    const notify = new notifications({
      id_user: userInfo.id_user,
      title: title,
      message: message,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      status: false,
    });

    await notify.save();
  }
};

const sendNotificationMechanic = async (
  id_mechanic: string,
  message: string,
  title: string
) => {
  // const jsonRes: ResponseModel = new ResponseModel();

  const userInfo = await mechanics.findOne({ _id: id_mechanic });

  if (userInfo) {
    const notify = new notifications({
      id_user: userInfo.id_user,
      title: title,
      message: message,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      status: false,
    });

    await notify.save();
  }
};

function getMonthRange(startMonth: any, rangeMonths: any) {
  const months = [
    { month: "Enero", index: 1 },
    { month: "Febrero", index: 2 },
    { month: "Marzo", index: 3 },
    { month: "Abril", index: 4 },
    { month: "Mayo", index: 5 },
    { month: "Junio", index: 6 },
    { month: "Julio", index: 7 },
    { month: "Agosto", index: 8 },
    { month: "Septiembre", index: 9 },
    { month: "Octubre", index: 10 },
    { month: "Noviembre", index: 11 },
    { month: "Diciembre", index: 12 },
  ];

  const startMonthIndex = startMonth - 1;
  const endMonthIndex = Math.min(startMonthIndex + parseInt(rangeMonths) - 1, 11);
  const monthRange = months.slice(startMonthIndex, endMonthIndex + 1);
  return monthRange;
}

function getLastDayOfMonth(year:any, month:any) {
  // Ajustar el mes para que sea el siguiente
  const nextMonth = month + 1;
  
  // Crear una nueva fecha con el primer día del mes siguiente
  const firstDayOfNextMonth = new Date(year, nextMonth, 1);
  
  // Restar un día para obtener el último día del mes actual
  const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - (24 * 60 * 60 * 1000));
  
  return lastDayOfMonth;
}

const getNameMonth = (date: any) => {
  const partsDate = date.split("-");
  const months = [
    { month: "Enero", index: 1 },
    { month: "Febrero", index: 2 },
    { month: "Marzo", index: 3 },
    { month: "Abril", index: 4 },
    { month: "Mayo", index: 5 },
    { month: "Junio", index: 6 },
    { month: "Julio", index: 7 },
    { month: "Agosto", index: 8 },
    { month: "Septiembre", index: 9 },
    { month: "Octubre", index: 10 },
    { month: "Noviembre", index: 11 },
    { month: "Diciembre", index: 12 },
  ];

  return months.filter((mes) => mes.index === parseInt(partsDate[1]))[0].month;
};

export default sellerRouter;
