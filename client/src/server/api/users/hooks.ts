import axiosInstance from "@/config/api/axios.config"

export const userApi = {
     getUserData : async() => {
        const response = await axiosInstance.get("/users/me")
        return response.data;
    },
    updateUserData: async(data: any) => { 
        const response = await axiosInstance.patch("/users/update-user-profile", data)  
        return response.data;
    },
    updateUploadAvatar :async(data: string) => {
        const response = await axiosInstance.patch("/users/update-avatar",data,
             {
      headers: {
        "Content-Type": "multipart/form-data",
      },}
        )
        return response.data;
    }
}