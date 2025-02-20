"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
export default function HeaderMenu({ category }) {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 75;
      const topPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: topPosition - offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className=" fixed left-0 mt-12 w-full z-50   ">
      {/* Navigation Section */}
      <div className="container ">
        <div className="flex items-center justify-center text-sm gap-4 px-4 py-1  ">
          {/* Navigation Buttons */}
          <div className="flex gap-6 border-2 w-52 justify-center h-8">
            {category.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.type)}
                className="hover:text-black cursor-pointer font-semibold text-slate-400 capitalize transition-colors duration-300"
              >
                {item.type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
