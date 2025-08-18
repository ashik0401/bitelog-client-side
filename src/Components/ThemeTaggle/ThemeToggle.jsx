import React, { useEffect, useState } from 'react';
import { FaRegMoon } from 'react-icons/fa';
import { TiWeatherSunny } from "react-icons/ti";

const ThemeToggle = () => {
 const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 "
    >
      {dark ? <TiWeatherSunny size={25} />
 :  <FaRegMoon  />
}
    </button>
  );
}

export default ThemeToggle;