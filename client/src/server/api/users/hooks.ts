import axiosInstance from "@/config/api/axios.config"

export const userApi = {
     getUserData : async() => {
        const response = await axiosInstance.get("/users/me")
        return response.data;
    }
}