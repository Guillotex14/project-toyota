import { Request, Response } from "express";
import { ResponseModel } from "../models/Response";
import jwt from "../helpers/generar-jwt";
import states from "../schemas/states.schema";

const statesController: any = {};

statesController.all = async (req: Request, res: Response) => {
    const reponseJson: ResponseModel = new ResponseModel();
    const token: any = req.header("Authorization");
    let decode = await jwt.getAuthorization(token, ["admin","seller","mechanic","admin_concesionary"]);
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
            { name: { $regex: ".*" + data.s + ".*",$options: "i" } },
        ],
    };

    project = {
        _id: "$_id",
        name: 1,
    };
    let list = await states.aggregate([
        {
            $match: search,
        },
        {
            $project: project,
        },
    ]);

    reponseJson.code = 200;
    reponseJson.message = "";
    reponseJson.status = true;
    reponseJson.data = list;

    res.json(reponseJson);
};

export default statesController;