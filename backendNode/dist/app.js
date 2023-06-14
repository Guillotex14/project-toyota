"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const admin_1 = __importDefault(require("./src/routes/admin"));
const path_1 = __importDefault(require("path"));
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
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use("/auth", auth_1.default);
        this.app.use("/admin", admin_1.default);
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
    }
    start() {
        this.app.listen(config_1.port, () => {
            console.log("Server listening on port", config_1.port);
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map