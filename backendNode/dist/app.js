"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const mechanic_route_1 = __importDefault(require("./src/routes/mechanic.route"));
const seller_route_1 = __importDefault(require("./src/routes/seller.route"));
const admin_route_1 = __importDefault(require("./src/routes/admin.route"));
const auth_route_1 = __importDefault(require("./src/routes/auth.route"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
<<<<<<< HEAD
=======
const user_route_1 = __importDefault(require("./src/routes/user.route"));
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        this.app.set("views", path_1.default.join(__dirname, "views"));
    }
    middlewares() {
        this.app.use(express_1.default.json({ limit: '512mb' }));
        this.app.use(express_1.default.urlencoded({ limit: '512mb', extended: true }));
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.use("/auth", auth_route_1.default);
<<<<<<< HEAD
=======
        this.app.use("/user", user_route_1.default);
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
        this.app.use("/admin", admin_route_1.default);
        this.app.use("/seller", seller_route_1.default);
        this.app.use("/mechanic", mechanic_route_1.default);
        this.app.use("/public", express_1.default.static("public"));
        this.app.use(express_1.default.static("public"));
    }
    start() {
        this.app.listen(config_1.port, () => {
            console.log("Server listening on port", config_1.port);
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map