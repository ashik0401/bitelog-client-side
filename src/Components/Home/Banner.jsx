import React from 'react';
import bannerImg from '../../assets/banner.png';

const Banner = () => {
    return (
        <div
            className="lg:h-[70vh] md:h-[60vh]  bg-cover bg-center flex items-center text-black relative"
            style={{
                backgroundImage: ` url(${bannerImg})`,
            }}
        >
            <div className="w-full sm:p-20 p-10 text-white text-center h-full bg-black/30 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the BiteLog!</h1>
                <p className="text-lg md:text-xl mb-6">
                    Find meals, manage reviews, and enjoy smart living.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search meals ..."
                        className="px-4 py-3 rounded-md w-64 outline-none text-white border border-white/40 "
                    />
                    <button className="px-6 py-3 rounded-md e  font-semibold bg-primary hover:bg-secondary text-white transition cursor-pointer">
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
