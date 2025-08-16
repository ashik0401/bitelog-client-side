import React from 'react';
import logo from '../assets/B.png';
import { Link, NavLink, Outlet } from 'react-router';
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
import useUserRole from '../Pages/User/useUserRole';
import DashboardHome from '../Components/DashboardHome/DashboardHome';
import ScrollToTop from '../Pages/shared/ScrollToTop';

const DashboardLayout = () => {
  const { roleUser, loading } = useUserRole();
  const isAdmin = roleUser?.role === "admin";

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-2");
    if (drawer) drawer.checked = false;
  };

  if (loading) return <div className="text-center mt-20"><span className="loading loading-ring loading-sm"></span></div>;

  return (
    <div>
      
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar bg-base-100 shadow-md w-full lg:hidden">
            <div className="flex-none">
              <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <Link to='/'><img className='w-8 h-8' src={logo} alt="logo" /></Link>
          </div>
          <div>
            <Outlet />
          </div>
        </div>

        <div className="drawer-side overflow-hidden">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="w-80 bg-orange-200 h-screen flex flex-col">
            <div>
              <DashboardHome />
            </div>
            <ul className="menu bg-orange-200 text-base-content w-80 p-4">
              <li>
                <NavLink
                  to="/"
                  onClick={closeDrawer}
                  className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                >
                  <FaHome /> Home
                </NavLink>
              </li>

              {isAdmin ? (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/meals"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaUtensils /> All Meals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/upcomingMeals"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaUtensils /> Upcoming Meals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/addMeal"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaPlusCircle /> Add Meal
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/allReviews"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaClipboardList /> Reviews
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/serveMeals"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaConciergeBell /> Serve Meals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/manageUsers"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaUsersCog /> Manage Users
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/myReviews"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaStar /> My Reviews
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/requestedMeals"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaClipboardCheck /> Requested Meals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/paymentHistory"
                      onClick={closeDrawer}
                      className={({ isActive }) => isActive ? "text-primary font-bold flex items-center gap-2" : "font-semibold flex items-center gap-2"}
                    >
                      <FaMoneyCheckAlt /> Payment History
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
