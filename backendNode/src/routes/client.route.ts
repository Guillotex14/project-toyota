import { Router, Request, Response } from "express";
import potentialclient from "../controllers/potentialclient.controller";

const clientRouter = Router();

// ------- clientes potenciales-----------
clientRouter.post("/add", potentialclient.add);

clientRouter.post("/update", potentialclient.update);

clientRouter.post("/delete", potentialclient.delete);

clientRouter.get("/get", potentialclient.get);

clientRouter.get("/all", potentialclient.all);

clientRouter.get("/allPaginator", potentialclient.allPaginator);


export default clientRouter;
