import { config } from "dotenv";

config();

export const mongoDBUri = process.env.MONGODB_URI || "mongodb+srv://jefersonmujica:SkibCc1nKFNmcfb1@cluster0.luvml6n.mongodb.net/toyotaShopDB?retryWrites=true&w=majority";

export const port = process.env.PORT || 3000;

