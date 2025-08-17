import React from 'react';
import Navbar from '../Pages/shared/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Pages/shared/Footer';
import ScrollToTop from '../Pages/shared/ScrollToTop';

const RootLayout = () => {
    return (
        <div className='bg-orange-50 dark:bg-transparent'>
            <ScrollToTop />
            <Navbar />
            <div className='min-h-[93vh]'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default RootLayout;
