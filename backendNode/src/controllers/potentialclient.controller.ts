
import { Request, Response, response } from "express";
import { ResponseModel } from "../models/Response";
import Users from "../schemas/Users.schema";
import Sellers from "../schemas/Sellers.schema";
import jwt from "../helpers/generar-jwt";
import moment from "moment";
import client from "../schemas/potentialClients.schema";
import mongoose from "mongoose";
import { sendEmail } from '../../nodemailer';
import vehicles from "../schemas/Vehicles.schema";
import { templatesMails } from "../templates/mails/templates.mails";
import notifications from "../schemas/notifications.schema";


const potentialclient: any = {}


potentialclient.add = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data: any = req.body;
    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }
    const exist = await client.findOne({ email: data.email });
    let now = moment().format("YYYY-MM-DD");
    if (exist) {
        reponseJson.code = 400;
        reponseJson.message = "El cliente: " + exist.name + " " + exist.last_name + " ya existe";
        reponseJson.status = false;
    } else {
        const newClient = new client({
            email: data.email,
            name: data.name,
            last_name: data.last_name,
            interested_car_model: data.interested_car_model,
            phone: data.phone,
            date_created: now,
            approximate_budget: data.approximate_budget,
            id_user: decode.id_user? decode.id_user : decode.id,
            concesionary: decode.concesionary,
            status: 1
        });

        await newClient.save();

        if (newClient) {
            data._id = newClient._id;
            data.date_created = newClient.date_created;
            reponseJson.code = 200;
            reponseJson.message = "El cliente: " + data.name + " " + data.last_name + " agregada exitosamente";
            reponseJson.status = true;
            reponseJson.data = data;
        } else {
            reponseJson.code = 400;
            reponseJson.message = "Error al agregar al cliente" + data.name + " " + data.last_name;
            reponseJson.status = false;
        }
    }

    res.json(reponseJson);

}

potentialclient.update = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data: any = req.body;

    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    if (data._id) {
        const clienteUpdate = { _id: data._id };
        await client.findOneAndUpdate(clienteUpdate, data);

        reponseJson.code = 200;
        reponseJson.message = "El cliente " + data.name + " " + data.last_name + " actualizado con exito";
        reponseJson.status = true;
        reponseJson.data = data;
    } else {
        reponseJson.code = 400;
        reponseJson.message = "Error al agregar al cliente" + data.name + " " + data.last_name;
        reponseJson.status = false;
    }

    res.json(reponseJson);

}

potentialclient.delete = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data: any = req.body;

    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    const clientDelete = await client.findOne({ _id: data._id });
    if (clientDelete) {
        const ress = await client.findOneAndDelete({ _id: data._id });

    } else {
        reponseJson.code = 400;
        reponseJson.message = "Cliente no encontrado";
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    reponseJson.code = 200;
    reponseJson.message = "Cliente borrada con exito";
    reponseJson.status = true;

    res.json(reponseJson);

}

potentialclient.get = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data: any = req.query;

    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    let getClient: any;
    if (data._id) {
        getClient = await client.findOne({ _id: data._id });
    } else if (data.name) {
        getClient = await client.findOne({ name: data.name });
    }

    if (getClient) {
        let user = await Users.findOne({_id:getClient.id_user});
        let seller = await Sellers.findOne({id_user:user?._id});
        getClient.seller=seller;
        getClient.user=user;
        
    }

    reponseJson.code = 200;
    reponseJson.message = "Cliente encontrada con exito";
    reponseJson.data = getClient;
    reponseJson.status = true;
    res.json(reponseJson);

}

potentialclient.all = async (req: Request, res: Response) => {

    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data: any = req.query;


    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }

    if (!data) {
        data = {
            s: "",
        };
    }

    let search: any;
    let project: any;

    search = {
        $or: [
            { _id: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { name: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { last_name: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { email: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { interested_car_model: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { phone: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { approximate_budget: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { concesionary: decode.concesionary ? decode.concesionary : "" }
        ],
    };

    project = {
        _id: "$_id",
        name: 1,
        last_name: 1,
        email: 1,
        interested_car_model: 1,
        phone: 1,
        approximate_budget: 1,
    };

    let list = await client.aggregate([
        {
            $match: search,
        },
        {
            $project: project,
        },
    ]);

    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        let user = await Users.findOne({_id:element.id_user});
        let seller = await Sellers.findOne({id_user:user?._id});
        element.seller=seller;
        element.user=user;
        
    }

    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = list;
    res.json(reponseJson);

}


potentialclient.allPaginator = async (req: Request, res: Response) => {

    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["admin", "seller", "admin_concesionary"]);
    let data: any = req.query;


    if (decode == false) {
        reponseJson.code = jwt.code;
        reponseJson.message = jwt.message;
        reponseJson.status = false;
        reponseJson.data = null;
        return res.json(reponseJson);
    }


    if (!data) {
        data = {
            s: "",
            pos: 0,
            lim: 10,
        };
    }

    let search: any;
    let project: any;

    search = {
        $or: [
            { _id: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { name: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { last_name: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { email: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { interested_car_model: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { phone: { $regex: ".*" + data.s + ".*", $options: "i" } },
            { approximate_budget: { $regex: ".*" + data.s + ".*", $options: "i" } },
        ],
    };

    if (decode.type_user === "admin_concesionary" ) {
        search.$and = [{ concesionary: decode.concesionary }];
    }

    if (decode.type_user === "seller") {
        search.$and = [{ id_user: new mongoose.Types.ObjectId(decode.id) }];
    }

    project = {
        _id: "$_id",
        name: 1,
        last_name: 1,
        email: 1,
        interested_car_model: 1,
        phone: 1,
        approximate_budget: 1,
    };

    let sendata: any = {};

    let list = await client.aggregate([
        {
            $match: search,
        },
        {
            $skip: parseInt(data.lim) * parseInt(data.pos),
        },
        {
            $limit: parseInt(data.lim),
        },
        {
            $project: project,
        },
    ]);

    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        let user = await Users.findOne({_id:element.id_user});
        let seller = await Sellers.findOne({id_user:user?._id});
        element.seller=seller;
        element.user=user;
        
    }

    sendata.rows = list;
    let count: any;

    if (list.length > 0) {
        count = await client.aggregate([
            {
                $match: search,
            },
            {
                $count: "totalCount",
            },
        ]);
        reponseJson.code = 200;
        reponseJson.message = "Cliente encontrado con exito";
        reponseJson.status = true;
    } else {
        reponseJson.code = 400;
        reponseJson.message = "sin resultado";
        reponseJson.status = true;
    }

    let totalItems = 0;

    if (count) {
        totalItems = count[0].totalCount;
    }

    let totalPages = Math.ceil(totalItems / data.lim);

    sendata.count = totalItems;
    sendata.pages = totalPages;

    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = sendata;

    res.json(reponseJson);

}

export default potentialclient;
