import React from 'react';
import Navbar from '../Pages/shared/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Pages/shared/Footer';

const RootLayout = () => {
    return (
        <div className=' h-screen'>
            <Navbar />
           <div className=' min-h-[93vh]'>
             <Outlet />
           </div>
            <Footer />
        </div>
    );
};

export default RootLayout;