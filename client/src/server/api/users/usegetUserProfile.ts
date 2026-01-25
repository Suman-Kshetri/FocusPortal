import { useQuery } from "@tanstack/react-query";
import { userApi } from "./hooks";
import type { User } from "@/types/userType";

export const useGetUserProfile = () => {
  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: userApi.getUserData,
  });

  return {
    userData: query.data as User,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
