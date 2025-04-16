import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiServices } from "@/utils/api";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: authState, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: apiServices.getAuthState,
    staleTime: Infinity, // Auth state doesn't become stale
  });

  const logout = () => {
    apiServices.logout();
    queryClient.setQueryData(["auth"], {
      isAuthenticated: false,
      userId: null,
    });
    navigate("/");
  };

  return {
    isAuthenticated: authState?.isAuthenticated ?? false,
    userId: authState?.userId ?? null,
    profile: authState?.profile,
    isLoading,
    logout,
  };
}
