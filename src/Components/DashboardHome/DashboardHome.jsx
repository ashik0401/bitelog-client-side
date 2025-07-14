import React from "react";
import useUserRole from "../../Pages/User/useUserRole";

const DashboardHome = () => {
  const { roleUser, loading } = useUserRole();

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!roleUser) return <div className="text-center mt-20 text-red-500">User data not found.</div>;

  const { name, email, image, role, badge } = roleUser;
  const mealsAdded = roleUser?.mealsAdded ?? 0;

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-xl shadow-lg">
      <div className="flex flex-col items-center justify-center space-x-6">
        <img
          src={image || "https://i.ibb.co/V0bwF2W1/User-Profile-PNG-High-Quality-Image.png"}
          alt={`${name} profile`}
          className="w-35 h-35 rounded-full object-cover border-4 border-orange-400"
        />
        <div>
          <p className="mt-2 text-lg font-medium text-c text-gray-700 text-center">{name?.toUpperCase()}</p>
          <p className="text-sm text-gray-500 text-center">{email}</p>
          {role === "admin" ? (
            <p className="mt-3 text-orange-600 text-center font-semibold">
              Meals Added: <span className="text-gray-900">{mealsAdded}</span>
            </p>
          ) : (
            <div className="mt-3 flex items-center justify-center space-x-3">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-300 text-yellow-900">
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
