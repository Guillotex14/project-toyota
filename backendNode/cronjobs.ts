import cron from 'node-cron';
import Vehicles from "./src/models/Vehicles";
import moment from 'moment';

export function cronInit(){

    //creando cronjob para que sea cada 7 dias
    //cronjob cada 24 horas
    // cron.schedule('0 0 * * *',  async() => {
    //     await cronJobs();
    // });

    cron.schedule('0 0 * * 0',  async() => {
        console.log("cronjob cada 7 dias")
        await cronJobs();
    });
} 

const cronJobs = async () => {
    //captando de mongo todolos los vehiculos que tienen una oferta activa
    const dateNow = moment().format('YYYY-MM-DD');

    const info = await Vehicles.find({id_seller_buyer:{$ne:null},sold:true, date_sell: { $ne: null },price_ofert:{$ne:null},final_price_sold:{$ne:null}});

    // for para comparar la fecha actual sea mayor a la fecha de venta
    for (let i = 0; i < info.length; i++) {
        
        const dateSell = moment(info[i].date_sell).format('YYYY-MM-DD');

        if (dateNow > dateSell) {
            await Vehicles.findOneAndUpdate({_id:info[i]._id},{sold:false, id_seller_buyer:null, date_sell:null, price_ofert:null, final_price_sold:null, name_new_owner: null, email_new_owner: null, phone_new_owner: null, dni_new_owner: null });
        }
        
    }
}