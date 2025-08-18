import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';


const UserOverviewPage = () => {
  const { user } = useAuth();
  const axiosInstance = useAxiosSecure();
  const [stats, setStats] = useState({
    myOrders: [],
    myReviews: [],
    membership: null,
    ordersPerDay: []
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [ordersRes, reviewsRes, membershipRes] = await Promise.all([
          axiosInstance.get(`/meal-requests?email=${user.email}`),
          axiosInstance.get(`/reviews/user/${user.email}`),
          axiosInstance.get(`/user/membership/${user.email}`)
        ]);

        const orders = ordersRes.data.requests || [];
        const reviews = reviewsRes.data.reviews || [];
        const membership = membershipRes.data || null;

        const ordersPerDayData = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt).toISOString().split('T')[0];
          const existing = acc.find(d => d.date === date);
          if (existing) existing.count += 1;
          else acc.push({ date, count: 1 });
          return acc;
        }, []);

        ordersPerDayData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setStats({
          myOrders: orders,
          myReviews: reviews,
          membership,
          ordersPerDay: ordersPerDayData
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.email) fetchUserStats();
  }, [user?.email]);

  return (
    <div className="p-6 bg-orange-50 min-h-screen rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center ">My Overview</h1>

      <div className="grid grid-cols-3 sm:gap-6 gap-4 mb-10 ">
        <div className="p-4  flex flex-col items-center justify-center bg-orange-100  rounded-lg text-center">
          <h2 className="sm:text-xl font-semibold">My Orders</h2>
          <p className="text-3xl font-bold ">{stats.myOrders.length}</p>
        </div>
        <div className="p-4 bg-orange-100  rounded-lg text-center  flex flex-col items-center justify-center">
          <h2 className="sm:text-xl font-semibold">My Reviews</h2>
          <p className="text-3xl font-bold">{stats.myReviews.length}</p>
        </div>
        <div className="p-4 bg-orange-100  rounded-lg text-center flex flex-col items-center justify-center">
          <h2 className="sm:text-xl font-semibold">Membership</h2>
          <p className="text-3xl font-bold">{stats.membership?.badge || 'None'}</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-center ">My Orders Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.ordersPerDay} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#f87171" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserOverviewPage;
