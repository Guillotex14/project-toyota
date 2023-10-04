"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
class ImageCloudinary {
    static get instance() {
        return this._instance || (this._instance = new ImageCloudinary);
    }
    constructor() {
        this._cloudinary = cloudinary_1.v2.config({
            cloud_name: "dopy0eoxs",
            api_key: "812629755952768",
            api_secret: "KNT_x2aCuDt7GXH0-I4r5FUdLLQ"
        });
        console.log("Cloudinary initialized");
    }
    get cloudinary() {
        return cloudinary_1.v2;
    }
}
exports.default = ImageCloudinary;
//# sourceMappingURL=cloudinary.js.map