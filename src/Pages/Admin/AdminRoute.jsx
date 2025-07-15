import { Navigate } from "react-router"
import useUserRole from "../User/useUserRole"

const AdminRoute = ({ children }) => {
  const { roleUser, loading } = useUserRole()

  if (loading) return <div><span className="loading loading-ring loading-sm"></span>
</div>

  if (roleUser?.role !== "admin") {
    return
  }

  return children
}

export default AdminRoute


