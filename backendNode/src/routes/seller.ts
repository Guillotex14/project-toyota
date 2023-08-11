import { Router, Request, Response, json } from "express";
import bcrypt from "bcrypt";
import moment from "moment";
import sharp from "sharp";

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
import { sendEmail } from "../../nodemailer";
import imgUser from "../models/imgUser";

const sellerRouter = Router();



sellerRouter.get("/filterGraphySell", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  let {
    month,
    yearSold,
    rangMonths,
    yearCar,
    brandCar,
    modelCar,
    id_user,
    concesionary,
  }: any = req.query;

  let now = new Date();
  let anioActual = now.getFullYear();
  if (yearSold) {
    anioActual = yearSold;
  }

  if (!month) {
    month = 1;
  }

  if (!rangMonths) {
    rangMonths = 1;
  }//

  let firtsMonth = new Date(anioActual,  month - 1, 1);
  let last = new Date(anioActual, 11);
  let lastDayLasyMont = getLastDayOfMonth(anioActual, 11);
  let lastMonth = new Date(anioActual, 11, lastDayLasyMont.getDate());
  let rangArrayMonth: any[] = [];

  if (rangMonths < 12) {
    rangArrayMonth = getMonthRange(month, rangMonths);

    firtsMonth = new Date(anioActual, month - 1, 1);
    
    if (rangArrayMonth.length > 1) {
      last = new Date(anioActual, rangArrayMonth.length - 1);
      lastDayLasyMont = getLastDayOfMonth(
        anioActual,
        rangArrayMonth.length - 1
      );
      lastMonth = new Date(
        anioActual,
        rangArrayMonth.length - 1,
        lastDayLasyMont.getDate()
        );
      } else {
      last = new Date(anioActual, month - 1);
      lastDayLasyMont = getLastDayOfMonth(anioActual, month - 1);
      lastMonth = new Date(anioActual, month - 1, lastDayLasyMont.getDate());
    }
  }

  let from = `${firtsMonth.getFullYear()}-${
    firtsMonth.getMonth() + 1 < 10
      ? "0" + (firtsMonth.getMonth() + 1)
      : firtsMonth.getMonth() + 1
  }-${
    firtsMonth.getDate() < 10
      ? "0" + firtsMonth.getDate()
      : firtsMonth.getDate()
  }`;

  let to = `${lastMonth.getFullYear()}-${
    lastMonth.getMonth() + 1 < 10
      ? "0" + (lastMonth.getMonth() + 1)
      : lastMonth.getMonth() + 1
  }-${
    lastMonth.getDate() < 10 ? "0" + lastMonth.getDate() : lastMonth.getDate()
  }`;
  let mongQuery: any = {
    date_sell: {
      $gte: from, // Filtrar documentos a partir del 1 de enero del año
      $lte: to, // Filtrar documentos hasta el 31 de diciembre del año
    },
    sold: true, // Campo de búsqueda adicional
  };

  if (yearCar) {
    mongQuery = {
      ...mongQuery,
      year: parseInt(yearCar),
    };
  }

  if (brandCar) {
    mongQuery = {
      ...mongQuery,
      brand: { $regex: brandCar, $options: "i" },
    };
  }

  if (modelCar) {
    mongQuery = {
      ...mongQuery,
      model: { $regex: modelCar, $options: "i" },
    };
  }

  let seller: any = null;
  if (id_user) {
    seller = await Sellers.findOne({ id_user: id_user });
    if (seller) {
      mongQuery = {
        ...mongQuery,
        concesionary: { $regex: seller.concesionary, $options: "i" },
      };
    } else {
      if (concesionary) {
        mongQuery = {
          ...mongQuery,
          concesionary: { $regex: concesionary, $options: "i" },
        };
      }
    }
  }

  const vehiclesFiltered = await vehicles.aggregate([
    {
      $match: mongQuery,
    },
    {
      $group: {
        _id: "$date_sell",
        monto: { $sum: "$price" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  let sendData = [];

  sendData = getMonthlyTotals(vehiclesFiltered);

  let datos: any = {};
  let cantMonth = calcularMeses(from, to);

  if (cantMonth == 1) {
    let groupByWeek = [];
    let groupByOneMonth = [];

    groupByWeek = agruparPorSemana(sendData);

    groupByOneMonth = agruparPorWeek(groupByWeek);

    const labels = groupByOneMonth.map((item) => item.semana);
    const montos = groupByOneMonth.map((item) => item.monto);
    datos = {
      labels: labels, // Meses en el eje x
      datasets: [
        {
          label: "Montos Mensuales",
          data: montos, // Montos en el eje y
        },
      ],
    };
  } else {
    const labels = sendData.map((dato) => dato._id);

    let nameArray = [];
    for (let i = 0; i < labels.length; i++) {
      nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
    }

    const montos = sendData.map((dato) => dato.monto);

    datos = {
      labels: nameArray, // Meses en el eje x
      datasets: [
        {
          label: "Montos Mensuales",
          data: montos, // Montos en el eje y
        },
      ],
      // vehicles:cards,
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


sellerRouter.get("/exportExcell", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  let {
    dateTo,
    dateFrom,
    yearCar,
    brandCar,
    modelCar,
    concesionary,
    id_user,
  }: any = req.query;
  const ExcelJS = require("exceljs");
  let now = new Date();

  let from_at = `${now.getFullYear()}-01-01`;
  let to_at = `${now.getFullYear()}-12-31`;

  let mongQuery: any = {
    date_sell: {
      $gte: from_at,
      $lte: to_at,
    },
  };

  if (dateFrom && dateTo) {
    let from = new Date(dateFrom).toISOString().substr(0, 10);
    let to = new Date(dateTo).toISOString().substr(0, 10);

    mongQuery = {
      ...mongQuery,
      date_sell: {
        $gte: from,
        $lte: to,
      },
    };
  }

  if (yearCar) {
    mongQuery = {
      ...mongQuery,
      year: parseInt(yearCar),
    };
  }

  if (brandCar) {
    mongQuery = {
      ...mongQuery,
      brand: { $regex: brandCar, $options: "i" },
    };
  }

  if (modelCar) {
    mongQuery = {
      ...mongQuery,
      model: { $regex: modelCar, $options: "i" },
    };
  }
  let seller: any = null;
  if (id_user) {
    seller = await Sellers.findOne({ id_user: id_user });
    if (seller) {
      mongQuery = {
        ...mongQuery,
        concesionary: { $regex: seller.concesionary, $options: "i" },
      };
    } else {
      if (concesionary) {
        mongQuery = {
          ...mongQuery,
          concesionary: { $regex: concesionary, $options: "i" },
        };
      }
    }
  }
  let cardsgroupmodel: any[] = [];
  if (!seller) {
    cardsgroupmodel = await vehicles.aggregate([
      {
        $match: mongQuery,
      },
      {
        $lookup: {
          from: "mechanicalfiles",
          localField: "_id",
          foreignField: "id_vehicle",
          as: "mechanicalfiles",
        },
      },
      {
        $unwind: "$mechanicalfiles",
      },
      {
        $group: {
          _id: "$model",
          minPrice: { $min: "$price" },
          avgPrice: { $avg: "$price" },
          maxPrice: { $max: "$price" },
          statusMalo: {
            $sum: {
              $cond: [
                { $eq: ["$mechanicalfiles.general_condition", "malo"] },
                1,
                0,
              ],
            },
          },
          statusRegular: {
            $sum: {
              $cond: [
                { $eq: ["$mechanicalfiles.general_condition", "regular"] },
                1,
                0,
              ],
            },
          },
          statusBueno: {
            $sum: {
              $cond: [
                { $eq: ["$mechanicalfiles.general_condition", "bueno"] },
                1,
                0,
              ],
            },
          },
          statusExcelente: {
            $sum: {
              $cond: [
                { $eq: ["$mechanicalfiles.general_condition", "excelente"] },
                1,
                0,
              ],
            },
          },
          vehicles: {
            $push: {
              $mergeObjects: [
                "$$ROOT",
                { general_condition: "$mechanicalfiles.general_condition" },
              ],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    for (let i = 0; i < cardsgroupmodel.length; i++) {
      for (let j = 0; j < cardsgroupmodel[i].vehicles.length; j++) {
        delete cardsgroupmodel[i].vehicles[j].mechanicalfiles;
      }
    }
  } else {
    cardsgroupmodel = await vehicles.aggregate([
      {
        $match: mongQuery,
      },
      {
        $group: {
          _id: "$model",
          minPrice: { $min: "$price" },
          avgPrice: { $avg: "$price" },
          maxPrice: { $max: "$price" },
          vehicles: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }

  let datos: any = {};
  datos = {
    grupocard: cardsgroupmodel,
  };

  // Crear un nuevo archivo Excel
  const workbook = new ExcelJS.Workbook();

  // Establecer el estilo para el encabezado
  const headerStyle = {
    font: { bold: true },
  };

  // Establecer el estilo para el pie de página
  const footerStyle = {
    font: { bold: true, color: { argb: "FFFFFFFF" } }, // Texto en blanco
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF000000" } }, // Fondo negro
  };

  datos.grupocard.forEach((grupo: any) => {
    const worksheet = workbook.addWorksheet(grupo._id);

    // Agregar los encabezados de las columnas
    let columns: any[] = [];
    columns = [
      { header: "Modelo", key: "modelo", width: 15, style: headerStyle },
      { header: "Marca", key: "marca", width: 15, style: headerStyle },
      { header: "Año", key: "anhio", width: 15, style: headerStyle },
      { header: "Precio", key: "precio", width: 15, style: headerStyle },
      {
        header: "Ficha mecanica",
        key: "ficha_mecanica",
        width: 15,
        style: headerStyle,
      },
      { header: "Fecha", key: "fecha", width: 15, style: headerStyle },
      {
        header: "Fecha de venta",
        key: "fecha_venta",
        width: 15,
        style: headerStyle,
      },
      {
        header: "Desplazamiento",
        key: "desplazamiento",
        width: 15,
        style: headerStyle,
      },
      { header: "KM", key: "km", width: 15, style: headerStyle },
      {
        header: "Modelo de motor",
        key: "modelo_motor",
        width: 15,
        style: headerStyle,
      },
      { header: "Titulo", key: "titulo", width: 15, style: headerStyle },
      {
        header: "Combustible",
        key: "combustible",
        width: 15,
        style: headerStyle,
      },
      {
        header: "Transmisión",
        key: "transmision",
        width: 15,
        style: headerStyle,
      },
      { header: "Ciudad", key: "ciudad", width: 15, style: headerStyle },
      {
        header: "Concesionario",
        key: "concesionario",
        width: 30,
        style: headerStyle,
      },
      {
        header: "Control de tracción",
        key: "control_traccion",
        width: 30,
        style: headerStyle,
      },
      {
        header: "Tipo de vehiculo",
        key: "tipo_de_vehiculo",
        width: 30,
        style: headerStyle,
      },
      { header: "Tracción", key: "traccion", width: 15, style: headerStyle },
      { header: "Lamina", key: "lamina", width: 15, style: headerStyle },
      { header: "Vino", key: "vino", width: 15, style: headerStyle },
    ];
    if (seller) {
      columns.splice(4, 1);
    }
    console.log(columns);
    worksheet.columns = columns;

    // Agregar los datos de los vehículos del grupo
    grupo.vehicles.forEach((vehiculo: any) => {
      let dataRow = {
        modelo: vehiculo.model,
        marca: vehiculo.brand,
        anhio: vehiculo.year,
        precio: vehiculo.price,
        ficha_mecanica: vehiculo.general_condition,
        fecha: vehiculo.date_create,
        fecha_venta: vehiculo.date_sell,
        desplazamiento: vehiculo.displacement,
        km: vehiculo.km,
        modelo_motor: vehiculo.engine_model,
        titulo: vehiculo.titles,
        combustible: vehiculo.fuel,
        transmision: vehiculo.transmission,
        ciudad: vehiculo.city,
        concesionario: vehiculo.concesionary,
        control_traccion: vehiculo.traction,
        tipo_de_vehiculo: vehiculo.type_vehicle,
        traccion: vehiculo.traction,
        lamina: vehiculo.plate,
        vino: vehiculo.vin,
      };
      if (seller) {
        delete dataRow.ficha_mecanica;
      }

      worksheet.addRow(dataRow);
    });

    // Separar las secciones de los datos
    worksheet.addRow({}); // Línea vacía
    worksheet.addRow({}); // Línea vacía

    // Agregar las secciones del mínimo, medio y máximo precio
    worksheet.addRow({
      modelo: "Mínimo Precio",
      precio: grupo.minPrice,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Promedio Precio",
      precio: grupo.avgPrice,
      style: footerStyle,
    });
    worksheet.addRow({
      modelo: "Máximo Precio",
      precio: grupo.maxPrice,
      style: footerStyle,
    });

    if (!seller) {
      worksheet.addRow({}); // Línea vacía
      worksheet.addRow({}); // Línea vacía

      // Agregar las secciones del mínimo, medio y máximo precio
      worksheet.addRow({
        modelo: "Condición general - Malo",
        precio: grupo.statusMalo,
        style: footerStyle,
      });
      worksheet.addRow({
        modelo: "Condición general - Regular",
        precio: grupo.statusRegular,
        style: footerStyle,
      });
      worksheet.addRow({
        modelo: "Condición general - Bueno",
        precio: grupo.statusBueno,
        style: footerStyle,
      });
      worksheet.addRow({
        modelo: "Condición general - Excelente",
        precio: grupo.statusExcelente,
        style: footerStyle,
      });
    }
  });

  const filePath = "./public/pdf/" + now.getTime() + ".xlsx";

  // workbook.xlsx
  //   .writeFile(filePath)
  //   .then(() => {
  //     // Envía la ruta del archivo al frontend para su descarga
  //     // (esto dependerá de cómo implementes la comunicación con tu aplicación Ionic)
  //     console.log("Archivo Excel generado:", filePath);
  //   })
  //   .catch((error: any) => {
  //     console.log("Error al generar el archivo Excel:", error);
  //   });

  // if (datos) {
  //   reponseJson.code = 200;
  //   reponseJson.message = "success";
  //   reponseJson.status = true;
  //   reponseJson.data = datos;
  // } else {
  //   reponseJson.code = 400;
  //   reponseJson.message = "no existe";
  //   reponseJson.status = false;
  // }
  // res.json(reponseJson);

  workbook.xlsx
    .writeBuffer()
    .then(async (buffer: any) => {
      // Convertir el buffer en base64
      const base64 = buffer.toString("base64");

      // Crear un objeto de respuesta con el archivo base64
      const datos = {
        fileName: now.getTime() + ".xlsx",
        base64Data:
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
          base64,
      };

      if (datos) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = datos;
      } else {
        reponseJson.code = 400;
        reponseJson.message = "no existe";
        reponseJson.status = false;
      }
      res.json(reponseJson);
    })
    .catch((error: any) => {
      console.log("Error al generar el archivo Excel:", error);
    });
});

sellerRouter.get("/listVehiclesSell", async (req: Request, res: Response) => {
  const reponseJson: ResponseModel = new ResponseModel();
  let {
    dateTo,
    dateFrom,
    yearCar,
    brandCar,
    modelCar,
    concesionary,
    id_user,
  }: any = req.query;
  let now = new Date();

  let from_at = `${now.getFullYear()}-01-01`;
  let to_at = `${now.getFullYear()}-12-31`;

  let mongQuery: any = {
    date_sell: {
      $gte: from_at,
      $lte: to_at,
    },
  };

  if (dateFrom && dateTo) {
    let from = new Date(dateFrom).toISOString().substr(0, 10);
    let to = new Date(dateTo).toISOString().substr(0, 10);

    mongQuery = {
      ...mongQuery,
      date_sell: {
        $gte: from,
        $lte: to,
      },
    };
  }

  if (yearCar) {
    mongQuery = {
      ...mongQuery,
      year: parseInt(yearCar),
    };
  }

  if (brandCar) {
    mongQuery = {
      ...mongQuery,
      brand: { $regex: brandCar, $options: "i" },
    };
  }

  if (modelCar) {
    mongQuery = {
      ...mongQuery,
      model: { $regex: modelCar, $options: "i" },
    };
  }
  let seller: any = null;
  if (id_user) {
    seller = await Sellers.findOne({ id_user: id_user });
    console.log(seller);
    if (seller) {
      mongQuery = {
        ...mongQuery,
        concesionary: { $regex: seller.concesionary, $options: "i" },
      };
    } else {
      if (concesionary) {
        mongQuery = {
          ...mongQuery,
          concesionary: { $regex: concesionary, $options: "i" },
        };
      }
    }
  }

  const cardsgroupmodel = await vehicles.aggregate([
    {
      $match: mongQuery,
    },
    {
      $group: {
        _id: "$model",
        minPrice: { $min: "$price" },
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        vehicles: { $push: "$$ROOT" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $lookup: {
        from: "imgvehicles",
        localField: "vehicles._id",
        foreignField: "id_vehicle",
        as: "vehiclesWithImages",
      },
    },
  ]);

  let otherQuery = {
    ...mongQuery,
    mechanicalFile: true,
  };
  let countMechanicaFile: any[] = [];
  if (!seller) {
    countMechanicaFile = await vehicles.aggregate([
      {
        $match: otherQuery,
      },
      {
        $lookup: {
          from: "mechanicalfiles",
          localField: "_id",
          foreignField: "id_vehicle",
          as: "mechanicalfiles",
        },
      },
      {
        $unwind: {
          path: "$mechanicalfiles",
        },
      },
      {
        $match: {
          "mechanicalfiles.general_condition": {
            $in: ["bueno", "malo", "regular", "excelente"],
          },
        },
      },
      {
        $group: {
          _id: "$mechanicalfiles.general_condition",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  let datos: any = {};
  datos = {
    grupocard: cardsgroupmodel,
    mechanicaFiles: countMechanicaFile,
  };

  if (datos) {
    reponseJson.code = 200;
    reponseJson.message = "success";
    reponseJson.status = true;
    reponseJson.data = datos;
  } else {
    reponseJson.code = 400;
    reponseJson.message = "no existe";
    reponseJson.status = false;
  }
  res.json(reponseJson);
});

function getMonthlyTotals(data: any) {
  const monthlyTotals: any = [];
  for (let i = 0; i < data.length; i++) {
    const document = data[i];
    const month = document._id.substring(0, 7); // Extrae el año y mes de la fecha
    if (monthlyTotals[month]) {
      monthlyTotals[month] += document.monto; // Si el mes ya existe en el objeto, acumula el monto
    } else {
      monthlyTotals[month] = document.monto; // Si el mes no existe en el objeto, crea la propiedad y asigna el monto
    }
  }
  const result = [];
  for (const month in monthlyTotals) {
    result.push({ _id: month + "-01", monto: monthlyTotals[month] }); // Convierte el objeto en un array
  }
  return result;
}

const calcularMeses = (fechaInicial: any, fechaFinal: any) => {
  const inicio = new Date(fechaInicial);
  const fin = new Date(fechaFinal);

  const diferenciaMeses =
    (fin.getFullYear() - inicio.getFullYear()) * 12 +
    (fin.getMonth() - inicio.getMonth());

  return diferenciaMeses;
};

const agruparPorSemana = (datos: any) => {
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
};

// Función para obtener el número de semana de una fecha
const getWeekNumber = (date: any) => {
  const onejan: any = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil(((date - onejan) / 86400000 + onejan.getDay()) / 7);
  return week;
};

const agruparPorWeek = (datos: any) => {
  const semanas = [];
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
  const endMonthIndex = Math.min(
    startMonthIndex + parseInt(rangeMonths) - 1,
    11
  );
  const monthRange = months.slice(startMonthIndex, endMonthIndex + 1);
  return monthRange;
}

function getLastDayOfMonth(year: any, month: any) {
  // Ajustar el mes para que sea el siguiente
  const nextMonth = month + 1;

  // Crear una nueva fecha con el primer día del mes siguiente
  const firstDayOfNextMonth = new Date(year, nextMonth, 1);

  // Restar un día para obtener el último día del mes actual
  const lastDayOfMonth = new Date(
    firstDayOfNextMonth.getTime() - 24 * 60 * 60 * 1000
  );

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
