import React from 'react';
import { Outlet } from 'react-router';
import ScrollToTop from '../Pages/shared/ScrollToTop';
import Lottie from 'lottie-react';
import lottieAnimation from '.././assets/lottieFiles/login.json'

const AuthLayout = () => {
    return (
        <div className="md:p-12 bg-base-200">
            <ScrollToTop />
            <div className="flex items-center justify-center">
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
                <div className='flex-1 hidden md:block'>
                    <Lottie animationData={lottieAnimation} loop={true} className="w-full  " />

                </div>

            </div>
        </div>
    );
};

export default AuthLayout;