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
      <li><NavLink to="/" className={({ isActive }) => isActive ? 'text-white font-bold border-b ' : ''}>Home</NavLink></li>

      <li><NavLink to="/Meals" className={({ isActive }) => isActive ? 'text-white font-bold border-b' : ''}>All Meal</NavLink></li>

      {user && <li><NavLink to="/upComingMeal" className={({ isActive }) => isActive ? 'text-white font-bold border-b' : ''}>Upcoming Meals</NavLink></li>}

      {user && <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-white font-bold border-b' : ''}>Dashboard</NavLink></li>}

       <li><NavLink to="/aboutUs" className={({ isActive }) => isActive ? 'text-white font-bold border-b' : ''}>About Us</NavLink></li>
    </>

  );

  return (
    <div className='fixed shadow-md top-0 left-0 bg-[#012200] z-100 w-full'>
      <div className="navbar  lg:w-10/12 md:mx-auto  ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden px-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content  rounded-box z-1 mt-3 w-52 p-2 shadow bg-[#012200]  ">
              {links}
            </ul>
          </div>
          <Link to='/'>
            <img className='w-8 h-8' src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 ">{links}</ul>
        </div>
        <div className="navbar-end flex items-center">
          {authLoading ? (
            <span className="loading loading-ring loading-xs"></span>
          ) : user ? (
            <>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full ">
                    <img alt="User profile" src={photoURL} />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content  rounded-box z-1 mt-3 w-52  shadow">
                  <li>
                    <button className='font-bold  py-3 bg-green-100 text-[#043f02] ' onClick={handleLogOut}>Logout</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link to='/login' className="btn  shadow-none rounded-md bg-transparent hover:bg-[#043f02] border-none text-white ">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
