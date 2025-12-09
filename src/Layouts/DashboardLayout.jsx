import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import logo from "../assets/B.png";
import {
  FaHome,
  FaUtensils,
  FaStar,
  FaConciergeBell,
  FaPlusCircle,
  FaClipboardList,
  FaUsersCog,
  FaMoneyCheckAlt,
  FaClipboardCheck,
} from "react-icons/fa";
import { GrOverview } from "react-icons/gr";

import { CgProfile } from "react-icons/cg";
import { GiHotMeal } from "react-icons/gi";
import useUserRole from "../Pages/User/useUserRole";
import DashboardHome from "../Components/DashboardHome/DashboardHome";

const DashboardLayout = () => {
  const { roleUser, loading } = useUserRole();
  const isAdmin = roleUser?.role === "admin";

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-2");
    if (drawer) drawer.checked = false;
  };

  const menuClass = ({ isActive }) =>
    isActive
      ? "text-[#0ec708] font-bold flex items-center gap-2"
      : "font-semibold flex items-center gap-2";

  if (loading)
    return (
      <div className="text-center mt-20">
        <span className="loading loading-ring loading-sm"></span>
      </div>
    );

  const adminMenu = [
    { to: "/dashboard/overview", icon: <GrOverview />, label: "Overview" },
    { to: "/dashboard/meals", icon: <FaUtensils />, label: "All Meals" },
    {
      to: "/dashboard/upcomingMeals",
      icon: <GiHotMeal />,
      label: "Upcoming Meals",
    },
    { to: "/dashboard/addMeal", icon: <FaPlusCircle />, label: "Add Meal" },
    {
      to: "/dashboard/allReviews",
      icon: <FaClipboardList />,
      label: "Reviews",
    },
    {
      to: "/dashboard/serveMeals",
      icon: <FaConciergeBell />,
      label: "Serve Meals",
    },
    {
      to: "/dashboard/manageUsers",
      icon: <FaUsersCog />,
      label: "Manage Users",
    },
  ];

  const userMenu = [
    { to: "/dashboard/userOverview", icon: <FaUtensils />, label: "Overview" },
    { to: "/dashboard/myReviews", icon: <FaStar />, label: "My Reviews" },
    {
      to: "/dashboard/requestedMeals",
      icon: <FaClipboardCheck />,
      label: "Requested Meals",
    },
    {
      to: "/dashboard/paymentHistory",
      icon: <FaMoneyCheckAlt />,
      label: "Payment History",
    },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="navbar shadow-md w-full bg-[#012200] lg:hidden fixed top-0 left-0 right-0 z-50">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-square btn-ghost bg-transparent border-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <Link to="/">
            <img className="w-8 h-8" src={logo} alt="logo" />
          </Link>
        </div>

        <div className="bg-green-50 text-black min-h-screen pt-16">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side overflow-hidden">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <div className="w-80 bg-[#012200] h-screen flex flex-col">
          <DashboardHome />

          <ul className="menu bg-[#012200] text-base-content w-80 p-4">
            {(isAdmin ? adminMenu : userMenu).map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  onClick={closeDrawer}
                  className={menuClass}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}

            <li>
              <NavLink
                to="/dashboard/profile"
                onClick={closeDrawer}
                className={menuClass}
              >
                <CgProfile />
                My Profile
              </NavLink>
            </li>

            <li>
              <NavLink to="/" onClick={closeDrawer} className={menuClass}>
                <FaHome /> Home
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
