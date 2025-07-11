import React from 'react';
import { Outlet } from 'react-router';
import ScrollToTop from '../Pages/shared/ScrollToTop';

const AuthLayout = () => {
    return (
        <div className="p-12 bg-base-200">
           <ScrollToTop />
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='flex-1'>
                    <img
                        src=''
                        className="max-w-sm rounded-lg shadow-2xl"
                    />
                </div>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;