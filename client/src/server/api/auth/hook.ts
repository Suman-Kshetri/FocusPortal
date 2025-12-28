import axiosInstance from "@/config/api/axios.config";
import type { userLoginDataType, userRegisterDataType } from "@/types/authType";

export const authApi = {
    login: async(Credentials: userLoginDataType) => {
        const response = await axiosInstance.post('/auth/login', Credentials)
        return response.data;
    },

    register : async (userData : userRegisterDataType ) => {
        const response = await axiosInstance.post('/auth/register', userData)
        return response.data;
    },
    logout: async() => {
        const response = await axiosInstance.post('/auth/logout')
        return response.data;
    }
}