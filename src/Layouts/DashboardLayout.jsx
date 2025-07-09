import React from 'react';
import logo from '../assets/B.png'
import { Link, NavLink, Outlet } from 'react-router';
import AdminProfile from '../Pages/Admin/AdminProfile';

const DashboardLayout = () => {
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col ">


                    <div className="navbar bg-base-100 shadow-md w-full lg:hidden">
                        <div className="flex-none ">
                            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
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
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <Link
                            to='/'
                        >
                            <img
                                className='w-8 h-8 '
                                src={logo} alt="" /></Link>

                    </div>
                    <Outlet />
                </div>

                <div className="drawer-side overflow-hidden">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

                    <div className="w-80 bg-orange-200 h-screen flex flex-col">
                        <div className="">
                            <AdminProfile />
                        </div>

                        <ul className="menu bg-orange-200 text-base-content  w-80 p-4 ">
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        isActive ? 'text-primary font-bold' : 'font-semibold'
                                    }
                                >
                                   Users
                                </NavLink>
                            </li>
                            <li><a>Sidebar Item 2</a></li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardLayout;