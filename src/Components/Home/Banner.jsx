import React, { useState, useEffect } from 'react';
import bannerImg from '../../assets/banner.jpg';

const Banner = ({ onSearch }) => {
  const [input, setInput] = useState('');
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
    <div
      className="lg:h-[70vh] md:h-[60vh] bg-cover bg-center flex items-center text-black relative mt-15  "
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      <div className="w-full sm:p-20 p-10 text-white text-center h-full bg-black/30 flex flex-col justify-center">
        <h1 className="text-2xl md:text-5xl font-bold mb-4">Welcome to the BiteLog!</h1>
        <p className="text-lg md:text-xl mb-6">Find meals, manage reviews, and enjoy smart living.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="text"
            placeholder="Search meals ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-4 py-3 rounded-md w-64 outline-none text-white border border-white/40 bg-transparent"
          />
          <button
            onClick={handleSearchClick}
            className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-orange-500 hover:text-white transition cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
