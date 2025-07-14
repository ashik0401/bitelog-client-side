import React, { useEffect } from 'react';
import useUserRole from '../Pages/User/useUserRole';
import { useNavigate } from 'react-router';

const DashboardSplite = () => {
    const { roleUser, loading } = useUserRole()
    const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (roleUser?.role === 'admin') {
        navigate('/dashboard/meals', { replace: true });
      } else {
        navigate('/dashboard/myReviews', { replace: true });
      }
    }
  }, [loading, roleUser, navigate]);

    return <p className="text-center py-10 text-lg font-medium">Loading dashboard...</p>
}

export default DashboardSplite;