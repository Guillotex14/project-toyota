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
exports.connectToDB = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("./config");
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_1.connect)(config_1.mongoDBUri);
            console.log("Connected to MongoDB");
            const collect = yield mongoose_1.connection.db.collection('Users').find().toArray();
            // const { db } = mongoose.connection;
            // const result = await db.collection('Users').find().toArray();
            console.log("DB Name:", collect);
        }
        catch (error) {
            console.log("Error connecting to MongoDB");
            console.log(error);
        }
    });
}
exports.connectToDB = connectToDB;
mongoose_1.connection.on("connected", () => {
    console.log("Mongoose connected to DB Cluster", mongoose_1.connection.db.databaseName);
});
mongoose_1.connection.on("error", (error) => {
    console.log("Mongoose connection error", error);
});
mongoose_1.connection.on("disconnected", () => {
});
console.log("Mongoose disconnected");
//# sourceMappingURL=database.js.map