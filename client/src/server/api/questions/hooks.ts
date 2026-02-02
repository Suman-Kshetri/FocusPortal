import axiosInstance from "@/config/api/axios.config"

export const questionApis = {
    createQuestion: async(data:FormData) => {
        const response = await axiosInstance.post("/question/create-questions",data,{
      headers: {
        "Content-Type": "multipart/form-data",
      }})
        return response.data;
    },
    getAllQuestions: async() => {
      const response = await axiosInstance.get("/question/get-all-questions");
        return response.data;
    }
}