import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

cloudinary.config({
    cloud_name: "dopy0eoxs",
    api_key: "812629755952768",
    api_secret: "KNT_x2aCuDt7GXH0-I4r5FUdLLQ"
});

export const uploadImageUser = async (file: any) => {
    return await cloudinary.uploader.upload(file,{
        folder: "users"
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
