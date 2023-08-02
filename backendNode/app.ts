import  Express  from "express";
import { port } from "./config";
import cors from "cors";
import authRouter from "./src/routes/auth";
import adminRouter from "./src/routes/admin";
import sellerRouter from "./src/routes/seller";
import mechanicRouter from "./src/routes/mechanic"
import path from "path"

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
        this.app.use(Express.json());
        this.app.use(cors())
        this.app.use(Express.urlencoded({ extended: false }));
    }

    routes() {
        this.app.use("/auth", authRouter );
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