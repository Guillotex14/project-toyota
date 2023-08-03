import { ConfigOptions, v2 as cloudinary } from "cloudinary";

export default class ImageCloudinary {
    private static _instance: ImageCloudinary;
    private _cloudinary: ConfigOptions;

    public static get instance() {
        return this._instance || (this._instance = new ImageCloudinary);
    }

    constructor() {
        this._cloudinary = cloudinary.config({
            cloud_name: "dopy0eoxs",
            api_key: "812629755952768",
            api_secret: "KNT_x2aCuDt7GXH0-I4r5FUdLLQ"
        });
        console.log("Cloudinary initialized")

    }

    public get cloudinary() {
        return cloudinary;
    }
}