import React from "react";
import useUserRole from "../../Pages/User/useUserRole";
import useAuth from "../../hooks/useAuth"; 
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DashboardHome = () => {
  const { roleUser, loading } = useUserRole();
  const { user } = useAuth(); 
  const axiosSecure = useAxiosSecure();

  const email = roleUser?.email;
  const role = roleUser?.role;

  const {
    data: totalMeals = 0,
    isLoading: countLoading,
  } = useQuery({
    queryKey: ["adminMealCount", email],
    enabled: !!email && role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/count/${email}`);
      return res.data.count;
    },
  });

  if (loading)
    return (
      <div className="text-center mt-20">
        <span className="loading loading-ring loading-sm"></span>
      </div>
    );

  if (!roleUser)
    return (
      <div className="text-center mt-20 text-red-500">
        User data not found.
      </div>
    );

  const { name, badge } = roleUser;
  const image =
    roleUser.image || user?.photoURL || "https://i.ibb.co/V0bwF2W1/User-Profile-PNG-High-Quality-Image.png"; 

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-xl mt-20 lg:mt-0">
      <div className="flex flex-col items-center justify-center space-x-6">
        <img
          src={image}
          alt={`${name} profile`}
          className="w-35 h-35 rounded-full object-cover "
        />
        <div>
          <p className="mt-2 text-lg font-medium text-c  text-center">
            {name?.toUpperCase()}
          </p>
          <p className="text-sm text-gray-400 text-center">{email}</p>
          {role === "admin" ? (
            <p className="mt-3  text-center font-semibold">
              Meals Added:{" "}
              <span className="">
                {countLoading ? "..." : totalMeals}
              </span>
            </p>
          ) : (
            <div className="mt-3 flex items-center justify-center space-x-3">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-50 dark:bg-transparent text-yellow-900">
                {badge || "Bronze"}

              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
