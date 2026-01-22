// src/hooks/useSession.ts
import axiosInstance from "@/config/api/axios.config";
import { useQuery } from "@tanstack/react-query";


export interface User {
  _id: string;
  email: string;
  role: "student" | "admin";
  fullName: string;
  avatar?: string;
}

export const useSession = () => {
  return useQuery<User | null, Error>({
    queryKey: ["session"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const {data} = await axiosInstance.get("/auth/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
    retry: false, 
  });
};
