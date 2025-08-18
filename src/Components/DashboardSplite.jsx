import React, { useEffect } from 'react';
import useUserRole from '../Pages/User/useUserRole';
import { useNavigate } from 'react-router';

const DashboardSplite = () => {
    const { roleUser, loading } = useUserRole()
    const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (roleUser?.role === 'admin') {
        navigate('/dashboard/overview', { replace: true });
      } else {
        navigate('/dashboard/myReviews', { replace: true });
      }
    }
  }, [loading, roleUser, navigate]);

    return <p className="text-center py-10 text-lg font-medium"><span className="loading loading-ring loading-sm"></span>
</p>
}

export default DashboardSplite;