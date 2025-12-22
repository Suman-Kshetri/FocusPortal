import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async(localFilePath: string) : Promise<UploadApiResponse | null> => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error)
        return null;
    } finally{
        fs.unlink(localFilePath, (err)=> {
            if(err){
                console.error("Failed to delete local file: ",err)
            }
        })
    }
}

export const deleteFromCloudinary = async(publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(`Error delting image from cloudinary: ${publicId}`, error);
    }
}

export default uploadOnCloudinary;