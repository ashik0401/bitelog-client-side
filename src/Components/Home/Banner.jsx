import React, { useState, useEffect } from "react";
import BImage from '../../assets/banner.png';

const Banner = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const handler = setTimeout(() => {
      onSearch(input.trim());
    }, 500);
    setDebounceTimer(handler);
    return () => clearTimeout(handler);
  }, [input]);

  const handleSearchClick = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    onSearch(input.trim());
  };

  return (
    <div className="h-[100vh]  flex flex-col lg:flex-row items-center text-black relative mt-15 bg-[#012200] overflow-hidden">
      
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#88b34b]/30 to-transparent rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#a2c56c]/40 to-transparent rounded-full bottom-[-80px] right-[-80px] animate-pulse"></div>

      <div className="flex flex-col lg:flex-row items-center lg:w-10/12 w-full mx-auto p-10 sm:p-20">
        
        <div className="text-white flex flex-col justify-center items-center lg:items-start mb-6 lg:mb-0 lg:mr-10 relative z-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center lg:text-left">
            Welcome to the <span className="text-[#0ab304]">
              BiteLog
            </span>
            !
          </h1>
          <p className="text-lg md:text-xl mt-2 text-center lg:text-left">
            Find meals, manage reviews, and enjoy smart living.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <input
              type="text"
              placeholder="Search meals ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="px-4 py-3 rounded-md md:w-64 h-10 md:h-full outline-none text-white border border-white/60 bg-transparent"
            />
            <button
              onClick={handleSearchClick}
              className=" md:px-6 md:py-3 rounded-md font-semibold ] bg-[#066303] hover:text-white transition cursor-pointer btn md:h-full"
            >
              Search
            </button>
          </div>
        </div>

       
        <div className="w-full lg:w-auto flex justify-center">
          <img
            className="max-w-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-full object-contain mt-25 lg:mt-0"
            src={BImage}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
