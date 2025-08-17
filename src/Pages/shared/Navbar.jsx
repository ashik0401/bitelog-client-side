import React from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../../assets/B.png'
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, loading: authLoading, logOut } = useAuth();

  const photoURL = user?.photoURL || 'https://i.ibb.co/V0bwF2W1/User-Profile-PNG-High-Quality-Image.png';

  const handleLogOut = () => {
    logOut()
      .then(result => { console.log(result) })
      .catch(error => console.log(error))
  }

  const links = (
    <>
      <li><NavLink to="/" className={({ isActive }) => isActive ? 'text-white font-bold bg-primary dark:bg-orange-500' : ''}>Home</NavLink></li>

      <li><NavLink to="/Meals" className={({ isActive }) => isActive ? 'text-white font-bold bg-primary dark:bg-orange-500' : ''}>All Meal</NavLink></li>

      {user && <li><NavLink to="/upComingMeal" className={({ isActive }) => isActive ? 'text-white font-bold bg-primary dark:bg-orange-500' : ''}>Upcoming Meals</NavLink></li>}

      {user && <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-white font-bold bg-primary dark:bg-orange-500' : ''}>Dashboard</NavLink></li>}

       <li><NavLink to="/aboutUs" className={({ isActive }) => isActive ? 'text-white font-bold bg-primary dark:bg-orange-500' : ''}>About Us</NavLink></li>
    </>

  );

  return (
    <div className='fixed shadow-md top-0 left-0 bg-primary dark:bg-orange-500 z-100 w-full'>
      <div className="navbar  md:w-11/12 md:mx-auto  ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden px-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              {links}
            </ul>
          </div>
          <Link to='/'>
            <img className='w-8 h-8' src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end flex items-center">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
              <span className="badge badge-xs badge-primary indicator-item bg-white "></span>
            </div>
          </button>
          {authLoading ? (
            <span className="loading loading-ring loading-xs"></span>
          ) : user ? (
            <>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full border border-green-500">
                    <img alt="User profile" src={photoURL} />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li>
                    <button className='font-bold text-primary' onClick={handleLogOut}>Logout</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link to='/login' className="btn border-primary  text-black rounded-md hover:bg-primary">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
