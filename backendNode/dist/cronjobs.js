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
exports.cronInit = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Vehicles_1 = __importDefault(require("./src/models/Vehicles"));
const moment_1 = __importDefault(require("moment"));
function cronInit() {
    //creando cronjob para que sea cada 7 dias
    //cronjob cada 24 horas
    // cron.schedule('0 0 * * *',  async() => {
    //     await cronJobs();
    // });
    node_cron_1.default.schedule('0 0 * * 0', () => __awaiter(this, void 0, void 0, function* () {
        yield cronJobs();
    }));
}
exports.cronInit = cronInit;
const cronJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    //captando de mongo todolos los vehiculos que tienen una oferta activa
    const dateNow = (0, moment_1.default)().format('YYYY-MM-DD');
    const info = yield Vehicles_1.default.find({ id_seller_buyer: { $ne: null }, sold: false, date_sell: { $ne: null }, price_ofert: { $ne: null }, final_price_sold: { $ne: null } });
    // for para comparar la fecha actual sea mayor a la fecha de venta
    for (let i = 0; i < info.length; i++) {
        const dateSell = (0, moment_1.default)(info[i].date_sell).format('YYYY-MM-DD');
        if (dateNow > dateSell) {
            yield Vehicles_1.default.findOneAndUpdate({ _id: info[i]._id }, { sold: true });
        }
    }
});
//# sourceMappingURL=cronjobs.js.map