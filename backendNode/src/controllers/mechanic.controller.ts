import { Router, Request, Response } from 'express';
import { ResponseModel } from '../models/Response';
import moment from 'moment';

import vehicles from '../schemas/Vehicles.schema';
import mechanics from '../schemas/Mechanics.schema';
import sellers from '../schemas/Sellers.schema';
import users from '../schemas/Users.schema';
import mechanicalsFiles from '../schemas/mechanicalsFiles.schema';
import notifications from '../schemas/notifications.schema';
import ImgVehicle from '../schemas/ImgVehicle.schema';
import { sendEmail } from '../../nodemailer';
import brands from '../schemas/brands.schema';
import modelVehicle from '../schemas/modelVehicle.schema';


const mechanicRouter:any = {};




export default mechanicRouter;
