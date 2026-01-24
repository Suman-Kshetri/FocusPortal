import { useQuery } from "@tanstack/react-query";
import { userApi } from "./hooks";

export const useGetUserProfile = () => {
  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: userApi.getUserData,
  });

  return {
    userData: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
