import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'
import fs from 'fs'
import { promisify } from 'util'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const unlinkAsync = promisify(fs.unlink);

const uploadOnCloudinary = async(localFilePath: string) : Promise<UploadApiResponse | null> => {
    try {
        if(!localFilePath) return null;
        
        if (!fs.existsSync(localFilePath)) {
            console.error("File does not exist:", localFilePath);
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        
        console.log("File uploaded successfully to Cloudinary:", response.url);
        
        await unlinkAsync(localFilePath);
        console.log("Local file deleted successfully:", localFilePath);
        
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        
        try {
            if (fs.existsSync(localFilePath)) {
                await unlinkAsync(localFilePath);
                console.log("Local file deleted after failed upload:", localFilePath);
            }
        } catch (unlinkError) {
            console.error("Failed to delete local file after upload failure:", unlinkError);
        }
        
        return null;
    }
}

export const deleteFromCloudinary = async(publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from Cloudinary:", publicId, result);
        return result;
    } catch (error) {
        console.error(`Error deleting image from cloudinary: ${publicId}`, error);
        throw error;
    }
}

export default uploadOnCloudinary;