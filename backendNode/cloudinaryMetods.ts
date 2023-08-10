import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { ENV_API_KEY_CLOUDINARY, ENV_API_SECRET_CLOUDINARY, ENV_CLOUD_NAME_CLOUDINARY } from './enviroments';

cloudinary.config({
    cloud_name: ENV_CLOUD_NAME_CLOUDINARY,
    api_key: ENV_API_KEY_CLOUDINARY,
    api_secret: ENV_API_SECRET_CLOUDINARY
});

export const uploadImageUser = async (file: any) => {
    return await cloudinary.uploader.upload(file,{
        folder: "users",
        transformation: [
            { width: 115, height: 80, crop: "limit" },
            {quality:"auto:low", fetch_format: "auto"}
        ]
    });
}

export const deleteImageUser = async (public_id: string) => {
    return await cloudinary.uploader.destroy(public_id);
}

export const uploadImageVehicle = async (file: any) => {
    return await cloudinary.uploader.upload(file,{
        folder: "vehicles"
    });
}

export const deleteImageVehicle = async (public_id: string) => {
    return await cloudinary.uploader.destroy(public_id);
}
