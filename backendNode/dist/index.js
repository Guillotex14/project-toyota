"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./database");
//declarando cronjobs
const cronjobs_1 = require("./cronjobs");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = new app_1.App();
        yield (0, database_1.connectToDB)();
        (0, cronjobs_1.cronInit)();
        app.start();
    });
}
main();
//# sourceMappingURL=index.js.map