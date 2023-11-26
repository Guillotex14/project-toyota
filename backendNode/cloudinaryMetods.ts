import { v2 as cloudinary } from 'cloudinary';
import { ENV_API_KEY_CLOUDINARY, ENV_API_SECRET_CLOUDINARY, ENV_CLOUD_NAME_CLOUDINARY } from './enviroments';

cloudinary.config({
    cloud_name: ENV_CLOUD_NAME_CLOUDINARY,
    api_key: ENV_API_KEY_CLOUDINARY,
    api_secret: ENV_API_SECRET_CLOUDINARY
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

export const uploadDocuments = async (file: any) =>{
    return await cloudinary.uploader.upload(file,{
        folder: "vehicles_documentation"
    });
}

export const deleteDocuments = async (public_id: string) =>{
    return await cloudinary.uploader.destroy(public_id);
}

export const uploadPdf = async (file: any) =>{
    //guardar en la carpeta pdf_files con tiempo de expiracion de 1 hora
    return await cloudinary.uploader.upload(file,{
        folder: "pdf_files",
    });
}