
import { useQuery } from "@tanstack/react-query"
import useAuth from "../../hooks/useAuth"
import useAxiosSecure from "../../hooks/useAxiosSecure"


const useUserRole = () => {
  const { user, loading: authLoading } = useAuth()
  const axiosSecure = useAxiosSecure()

  const {
    data: roleUser,
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`)
      return res.data
    },
    enabled: !!user?.email && !authLoading,
  })

  const loading = authLoading || roleLoading
  return { roleUser, loading, refetch }
}

export default useUserRole
