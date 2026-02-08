import { useQuery } from "@tanstack/react-query";
import { statsApi } from "./hooks";

export const useGetStats = () => {
  const query = useQuery({
    queryKey: ["statsOverview"],
    queryFn: statsApi.getOverviewStats,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    statsData: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export const useGetQuestionsCount = () => {
  const query = useQuery({
    queryKey: ["questionCount"],
    queryFn: statsApi.getQuestionsCount,
    refetchOnWindowFocus: false,
  });
  return {
    statsData: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
};
export const useGetActiveUsersCount = () => {
  const query = useQuery({
    queryKey: ["activeUsers"],
    queryFn: statsApi.getActiveUsersCount,
    refetchOnWindowFocus: false,
  });
  return {
    statsData: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useGetDetailedStats = () => {
  const query = useQuery({
    queryKey: ["detailedStats"],
    queryFn: statsApi.getDetailedStats,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });

  return {
    statsData: query.data,
    stats: query.data?.data,
    overview: query.data?.data?.overview,
    topContributors: query.data?.data?.topContributors,
    recentActivity: query.data?.data?.recentActivity,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
