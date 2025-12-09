import React from 'react';
import { Outlet } from 'react-router';
import ScrollToTop from '../Pages/shared/ScrollToTop';
import Lottie from 'lottie-react';
import Navbar from '../Pages/shared/Navbar';
import Footer from '../Pages/shared/Footer';

const AuthLayout = () => {
    return (
        <div className="  bg-green-50">
            <ScrollToTop />
            <Navbar />
            <div className="flex min-h-screen items-center justify-center">

                <div className='flex-1 '>
                    <Outlet></Outlet>
                </div>
             

            </div>
            <Footer />
        </div>
    );
};

export default AuthLayout;