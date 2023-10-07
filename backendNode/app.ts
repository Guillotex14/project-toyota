import  Express  from "express";
import mechanicRouter from "./src/routes/mechanic.route"
import sellerRouter from "./src/routes/seller.route";
import adminRouter from "./src/routes/admin.route";
import authRouter from "./src/routes/auth.route";
import { port } from "./config";
import cors from "cors";
import path from "path"
import userRouter from "./src/routes/user.route";
import vehicleRouter from "./src/routes/vehicle.route";

export class App {
    app: Express.Application;

    constructor() {
        this.app = Express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    settings() {
        this.app.set("views", path.join(__dirname, "views"));
    }

    middlewares() {
        this.app.use(Express.json({limit: '512mb'}));
        this.app.use(Express.urlencoded({limit: '512mb', extended: true}));
        this.app.use(cors());
    }

    routes() {
        this.app.use("/auth", authRouter );
        this.app.use("/user", userRouter );
        this.app.use("/vehicle", vehicleRouter );
        this.app.use("/admin", adminRouter );
        this.app.use("/seller", sellerRouter);
        this.app.use("/mechanic", mechanicRouter)
        this.app.use("/public", Express.static("public"));
        this.app.use(Express.static("public"));
    }

    start(): void {
        this.app.listen(port, () => {
            console.log("Server listening on port", port);
        });
    }
}