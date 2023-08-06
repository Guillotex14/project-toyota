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
        await cronJobs();
    });

} 

const cronJobs = async () => {
    //captando de mongo todolos los vehiculos que tienen una oferta activa
    const dateNow = moment().format('YYYY-MM-DD');

    const info = await Vehicles.find({id_seller_buyer:{$ne:null},sold:false, date_sell: { $ne: null },price_ofert:{$ne:null},final_price_sold:{$ne:null}});

    // for para comparar la fecha actual sea mayor a la fecha de venta
    for (let i = 0; i < info.length; i++) {
        
        const dateSell = moment(info[i].date_sell).format('YYYY-MM-DD');

        if (dateNow > dateSell) {
            await Vehicles.findOneAndUpdate({_id:info[i]._id},{sold:true});
        }
        
    }
}