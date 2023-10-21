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
exports.deleteIgmVechicleDocumentation = exports.uploadIgmVechicleDocumentation = exports.deleteImageVehicle = exports.uploadImageVehicle = exports.deleteImageUser = exports.uploadImageUser = void 0;
const cloudinary_1 = require("cloudinary");
const enviroments_1 = require("./enviroments");
cloudinary_1.v2.config({
    cloud_name: enviroments_1.ENV_CLOUD_NAME_CLOUDINARY,
    api_key: enviroments_1.ENV_API_KEY_CLOUDINARY,
    api_secret: enviroments_1.ENV_API_SECRET_CLOUDINARY
});
const uploadImageUser = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cloudinary_1.v2.uploader.upload(file, {
        folder: "users"
    });
});
exports.uploadImageUser = uploadImageUser;
const deleteImageUser = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cloudinary_1.v2.uploader.destroy(public_id);
});
exports.deleteImageUser = deleteImageUser;
const uploadImageVehicle = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cloudinary_1.v2.uploader.upload(file, {
        folder: "vehicles"
    });
});
exports.uploadImageVehicle = uploadImageVehicle;
const deleteImageVehicle = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cloudinary_1.v2.uploader.destroy(public_id);
});
exports.deleteImageVehicle = deleteImageVehicle;
const uploadIgmVechicleDocumentation = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cloudinary_1.v2.uploader.upload(file, {
        folder: "vehicles_documentation"
    });
});
exports.uploadIgmVechicleDocumentation = uploadIgmVechicleDocumentation;
const deleteIgmVechicleDocumentation = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cloudinary_1.v2.uploader.destroy(public_id);
});
exports.deleteIgmVechicleDocumentation = deleteIgmVechicleDocumentation;
//# sourceMappingURL=cloudinaryMetods.js.map