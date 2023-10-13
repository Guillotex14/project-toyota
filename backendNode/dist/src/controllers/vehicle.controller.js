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
const generar_jwt_1 = __importDefault(require("../helpers/generar-jwt"));
const Vehicles_schema_1 = __importDefault(require("../schemas/Vehicles.schema"));
const vehicleController = {};
vehicleController.insert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    const data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = data;
    res.json(reponseJson);
});
vehicleController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    const data = req.body;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = data;
    res.json(reponseJson);
});
vehicleController.all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = data;
    res.json(reponseJson);
});
vehicleController.filterGraphySale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    let now = new Date();
    let anioActual = now.getFullYear();
    let monthActual = now.getMonth() + 1;
    if (data.yearSold) {
        anioActual = data.yearSold;
    }
    if (!data.month) {
        data.month = monthActual;
    }
    if (!data.rangMonths) {
        data.rangMonths = 1;
    } //
    let firtsMonth = new Date(anioActual, data.month - 1, 1);
    let last = new Date(anioActual, 11);
    let lastDayLasyMont = getLastDayOfMonth(anioActual, 11);
    let lastMonth = new Date(anioActual, 11, lastDayLasyMont.getDate());
    let rangArrayMonth = [];
    if (data.rangMonths < 12) {
        rangArrayMonth = getMonthRange(data.month, data.rangMonths);
        firtsMonth = new Date(anioActual, data.month - 1, 1);
        if (rangArrayMonth.length > 1) {
            last = new Date(anioActual, rangArrayMonth.length - 1);
            lastDayLasyMont = getLastDayOfMonth(anioActual, rangArrayMonth.length - 1);
            lastMonth = new Date(anioActual, rangArrayMonth.length - 1, lastDayLasyMont.getDate());
        }
        else {
            last = new Date(anioActual, data.month - 1);
            lastDayLasyMont = getLastDayOfMonth(anioActual, data.month - 1);
            lastMonth = new Date(anioActual, data.month - 1, lastDayLasyMont.getDate());
        }
    }
    let from = `${firtsMonth.getFullYear()}-${firtsMonth.getMonth() + 1 < 10
        ? "0" + (firtsMonth.getMonth() + 1)
        : firtsMonth.getMonth() + 1}-${firtsMonth.getDate() < 10
        ? "0" + firtsMonth.getDate()
        : firtsMonth.getDate()}`;
    let to = `${lastMonth.getFullYear()}-${lastMonth.getMonth() + 1 < 10
        ? "0" + (lastMonth.getMonth() + 1)
        : lastMonth.getMonth() + 1}-${lastMonth.getDate() < 10 ? "0" + lastMonth.getDate() : lastMonth.getDate()}`;
    let mongQuery = {
        date_sell: {
            $gte: from,
            $lte: to, // Filtrar documentos hasta el 31 de diciembre del año
        },
        sold: true,
        dispatched: true, // Campo de búsqueda adicional
    };
    if (data.yearCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { year: parseInt(data.yearCar) });
    }
    if (data.brandCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { brand: { $regex: data.brandCar, $options: "i" } });
    }
    if (data.modelCar) {
        mongQuery = Object.assign(Object.assign({}, mongQuery), { model: { $regex: data.modelCar, $options: "i" } });
    }
    let user = null;
    if (decode.type_user == "seller") {
        user = yield Users_schema_1.default.findOne({ _id: decode.id });
        if (user) {
            mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: user.concesionary, $options: "i" } });
        }
        else {
            if (data.concesionary) {
                mongQuery = Object.assign(Object.assign({}, mongQuery), { concesionary: { $regex: data.concesionary, $options: "i" } });
            }
        }
    }
    let sendData = [];
    let chartData = {};
    let datos = {};
    let optionset = {
        label: "Cantidad de autos vendido Mensuales",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        spanGaps: false,
        data: {}, // Montos en el eje y
    };
    if (!data.triple_m) {
        const vehiclesFiltered = yield Vehicles_schema_1.default.aggregate([
            {
                $match: mongQuery,
            },
            {
                $group: {
                    _id: "$date_sell",
                    total: { $sum: 1 },
                },
            },
            {
                $project: {
                    mes: "$_id",
                    total: 1,
                    _id: 0,
                },
            },
            { $sort: { _id: 1 } },
        ]);
        sendData = getQuantityTotals(vehiclesFiltered);
        let cantMonth = calcularMeses(from, to);
        if (cantMonth == 1 || sendData.length == 1) {
            let groupByWeek = [];
            let groupByOneMonth = [];
            groupByWeek = agruparPorSemana(sendData);
            groupByOneMonth = agruparPorWeek(groupByWeek);
            const labels = groupByOneMonth.map((item) => item.semana);
            const total = groupByOneMonth.map((item) => item.total);
            datos = {
                labels: labels,
                datasets: [
                    Object.assign(Object.assign({}, optionset), { data: total }),
                ],
            };
        }
        else {
            const labels = sendData.map((dato) => dato.mes);
            let nameArray = [];
            for (let i = 0; i < labels.length; i++) {
                nameArray[i] = getNameMonth(labels[i]); // devuelve el nombre del mes
            }
            const total = sendData.map((dato) => dato.total);
            datos = {
                labels: nameArray,
                datasets: [
                    Object.assign(Object.assign({}, optionset), { data: total }),
                ],
            };
        }
    }
    else {
        let conditionGroup = {
            _id: "$date_sell",
            minAmount: { $min: "$price" },
            avgAmount: { $avg: "$price" },
            maxAmount: { $max: "$price" },
        };
        if (data.triple_m == "max") {
            conditionGroup = {
                _id: "$date_sell",
                maxAmount: { $max: "$price" },
                // avgAmount: { $literal: 0 },
                // minAmount: { $literal: 0 },
            };
        }
        else if (data.triple_m == "mid") {
            conditionGroup = {
                _id: "$date_sell",
                // maxAmount: { $literal: 0 },
                avgAmount: { $avg: "$price" },
                // minAmount: { $literal: 0 },
            };
        }
        else if (data.triple_m == "min") {
            conditionGroup = {
                _id: "$date_sell",
                // maxAmount: { $literal: 0 },
                // avgAmount: { $literal: 0 },
                minAmount: { $min: "$price" },
            };
        }
        else if (data.triple_m == "all") {
            conditionGroup = {
                _id: "$date_sell",
                minAmount: { $min: "$price" },
                avgAmount: { $avg: "$price" },
                maxAmount: { $max: "$price" },
            };
        }
        console.log(conditionGroup);
        const cardsgroupmodel = yield Vehicles_schema_1.default.aggregate([
            {
                $match: mongQuery,
            },
            {
                $group: conditionGroup,
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        const result = groupAndSumByMonth(cardsgroupmodel);
        var labels = [];
        var minData = [];
        var avgData = [];
        var maxData = [];
        result.forEach(function (item) {
            labels.push(getNameMonth(item.month)); // Agregar el mes como etiqueta
            minData.push(item.minAmount); // Agregar el monto mínimo
            avgData.push(item.avgAmount); // Agregar el monto promedio
            maxData.push(item.maxAmount); // Agregar el monto máximo
        });
        chartData = {
            labels: labels,
            datasets: [
                {
                    label: "Monto Mínimo",
                    data: minData,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Monto Promedio",
                    data: avgData,
                    borderColor: "green",
                    fill: false,
                },
                {
                    label: "Monto Máximo",
                    data: maxData,
                    borderColor: "red",
                    fill: false,
                },
            ],
        };
        datos = chartData;
    }
    if (datos) {
        reponseJson.code = 200;
        reponseJson.message = "success";
        reponseJson.status = true;
        reponseJson.data = datos;
    }
    else {
        reponseJson.code = 200;
        reponseJson.message = "sin resultado";
        reponseJson.status = false;
    }
    res.json(reponseJson);
});
vehicleController.exportExcell = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reponseJson = new Response_1.ResponseModel();
    const token = req.header("Authorization");
    let decode = yield generar_jwt_1.default.getAuthorization(token, ["admin", "seller"]);
    let data = req.query;
    if (decode == false) {
        reponseJson.code = generar_jwt_1.default.code;
        reponseJson.message = generar_jwt_1.default.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = data;
    res.json(reponseJson);
});
function groupAndSumByMonth(data) {
    const result = {};
    data.forEach((item) => {
        const dateParts = item._id.split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const monthKey = `${year}-${month}`;
        if (!result[monthKey]) {
            result[monthKey] = {
                minAmount: 0,
                avgAmount: 0,
                maxAmount: 0,
            };
        }
        result[monthKey].minAmount += item.minAmount ? item.minAmount : 0;
        result[monthKey].avgAmount += item.avgAmount ? item.avgAmount : 0;
        result[monthKey].maxAmount += item.maxAmount ? item.maxAmount : 0;
    });
    return Object.entries(result).map(([key, value]) => ({
        month: key,
        minAmount: value.minAmount,
        avgAmount: value.avgAmount,
        maxAmount: value.maxAmount,
    }));
}
function getQuantityTotals(data) {
    const quantityTotals = [];
    for (let i = 0; i < data.length; i++) {
        const document = data[i];
        const mes = document.mes.substring(0, 7); // Extrae el año y mes de la fecha
        if (quantityTotals[mes]) {
            quantityTotals[mes] += document.total; // Si el mes ya existe en el objeto, acumula el canitdad
        }
        else {
            quantityTotals[mes] = document.total; // Si el mes no existe en el objeto, crea la propiedad y asigna el cantidad
        }
    }
    const result = [];
    for (const mes in quantityTotals) {
        result.push({ mes: mes + "-01", total: quantityTotals[mes] }); // Convierte el objeto en un array
    }
    return result;
}
const calcularMeses = (fechaInicial, fechaFinal) => {
    const inicio = new Date(fechaInicial);
    const fin = new Date(fechaFinal);
    const diferenciaMeses = (fin.getFullYear() - inicio.getFullYear()) * 12 +
        (fin.getMonth() - inicio.getMonth());
    return diferenciaMeses;
};
const agruparPorSemana = (datos) => {
    const semanas = [];
    for (const dato of datos) {
        const fecha = new Date(dato.mes);
        const semana = getWeekNumber(fecha);
        if (semanas[semana]) {
            semanas[semana] += dato.total;
        }
        else {
            semanas[semana] = dato.total;
        }
    }
    const result = [];
    for (const semana in semanas) {
        result.push({ semana: Number(semana), total: semanas[semana] });
    }
    return result;
};
// Función para obtener el número de semana de una fecha
const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil(((date - onejan) / 86400000 + onejan.getDay()) / 7);
    return week;
};
const agruparPorWeek = (datos) => {
    const semanas = [];
    let contador = 1;
    for (const dato of datos) {
        if (!semanas[contador]) {
            semanas[contador] = 0;
        }
        semanas[contador] += dato.total;
        contador++;
    }
    const result = [];
    for (const semana in semanas) {
        result.push({ semana: "Semana " + Number(semana), total: semanas[semana] });
    }
    return result;
};
function getMonthRange(startMonth, rangeMonths) {
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
function getLastDayOfMonth(year, month) {
    // Ajustar el mes para que sea el siguiente
    const nextMonth = month + 1;
    // Crear una nueva fecha con el primer día del mes siguiente
    const firstDayOfNextMonth = new Date(year, nextMonth, 1);
    // Restar un día para obtener el último día del mes actual
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 24 * 60 * 60 * 1000);
    return lastDayOfMonth;
}
const getNameMonth = (date) => {
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
exports.default = vehicleController;
//# sourceMappingURL=vehicle.controller.js.map