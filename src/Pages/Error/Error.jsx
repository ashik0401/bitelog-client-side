import React from 'react';
import img from '../../assets/error-4O4.png'
import { Link } from 'react-router';

const Error = () => {
    return (
        <div className=''>
            <div className='flex bg-white flex-col  items-center  space-y-3 p-15 min-h-screen'>
                <div className=''>
                    <img className='w-96 bg-transparent bg-none' src={img}
                        alt="4O4" />
                </div>
                <h2 className='text-2xl md:text-5xl font-bold text-red-500'>4O4 - Page Not Found</h2>
                <p className='font-bold text-lg opacity-80 text-black'>Oops! The page you are looking for was not found.</p>
                <Link to='/'>
                    <button className='btn text-primary border border-primary text-xl rounded-md hover:text-white hover:bg-primary'>Back to Home page </button>
                </Link>
            </div>
        </div>
    );
};

export default Error;