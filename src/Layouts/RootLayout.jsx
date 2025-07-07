import React from 'react';
import Navbar from '../Pages/shared/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Pages/shared/Footer';

const RootLayout = () => {
    return (
        <div className='bg-red-500 h-screen'>
            <Navbar />
           <div className='w-10/12 mx-auto min-h-[93vh]'>
             <Outlet />
           </div>
            <Footer />
        </div>
    );
};

export default RootLayout;