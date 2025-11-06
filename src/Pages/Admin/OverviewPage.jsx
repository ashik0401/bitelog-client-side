import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const OverviewPage = () => {
  const axiosInstance = useAxiosSecure();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMeals: 0,
    totalMembers: 0,
    mealsPerDay: [],
    userRoles: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await axiosInstance.get('/users');
        const mealsRes = await axiosInstance.get('/meals');
        const membersRes = await axiosInstance.get('/membership/packages');

        const totalUsers = usersRes.data.totalCount || 0;
        const totalMeals = mealsRes.data.totalCount || 0;
        const totalMembers = membersRes.data.length || 0;

        const mealsPerDayData = mealsRes.data.meals.reduce((acc, meal) => {
          const date = new Date(meal.postTime).toISOString().split('T')[0];
          const existing = acc.find(d => d.date === date);
          if (existing) existing.count += 1;
          else acc.push({ date, count: 1 });
          return acc;
        }, []);

        const userRolesData = [
          { role: 'admin', count: usersRes.data.users.filter(u => u.role === 'admin').length },
          { role: 'user', count: usersRes.data.users.filter(u => u.role === 'user').length }
        ];

        setStats({
          totalUsers,
          totalMeals,
          totalMembers,
          mealsPerDay: mealsPerDayData,
          userRoles: userRolesData
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const pieColors = ['#f87171', '#60a5fa'];

  return (
    <div className="p-6  dark:text-white  rounded-lg shadow-md lg:max-w-11/12 lg:mx-auto mx-4 my-4">
      <h1 className="text-2xl font-bold mb-6 text-center  dark:text-white ">Dashboard Overview</h1>

      <div className="grid grid-cols-3 sm:gap-6 gap-2 mb-10 bg-green-50 dark:bg-transparent">
        <div className="p-4  bg-green-100 dark:bg-transparent border border-gray-400 rounded-lg text-center">
          <h2 className="sm:text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold dark:text-[#0ec708] ">{stats.totalUsers}</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-transparent border border-gray-400 rounded-lg text-center">
          <h2 className="sm:text-xl font-semibold">Total Meals</h2>
          <p className="text-3xl font-bold dark:text-[#0ec708] ">{stats.totalMeals}</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-transparent border border-gray-400 rounded-lg text-center">
          <h2 className="sm:text-xl font-semibold">Total Members</h2>
          <p className="text-3xl font-bold dark:text-[#0ec708] ">{stats.totalMembers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4  rounded-lg shadow-md md:shadow-none">
          <h2 className="text-lg font-semibold mb-4 text-center ">Meals Added Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.mealsPerDay} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4  rounded-lg shadow-md md:shadow-none">
          <h2 className="text-lg font-semibold mb-4 text-center ">User Roles Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.userRoles}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.userRoles.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
