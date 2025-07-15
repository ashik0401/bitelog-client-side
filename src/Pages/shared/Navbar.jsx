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
      <li><NavLink to="/" className={({ isActive }) => isActive ? 'text-white font-bold' : ''}>Home</NavLink></li>
      <li><NavLink to="/Meals" className={({ isActive }) => isActive ? 'text-white font-bold' : ''}>All Meal</NavLink></li>
      <li><NavLink to="/upComingMeal" className={({ isActive }) => isActive ? 'text-white font-bold' : ''}>Upcoming Meals</NavLink></li>
      {user && <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-white font-bold' : ''}>Dashboard</NavLink></li>}
    </>
  );

  return (
    <div className='fixed top-0 left-0 z-100 w-full'>
      <div className="navbar shadow-md lg:px-20 bg-primary min-h-[60px]">
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
        <div className="navbar-end">
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
