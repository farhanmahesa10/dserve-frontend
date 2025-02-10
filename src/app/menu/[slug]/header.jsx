"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
export default function Header({ category, profile }) {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 75; // Jarak tambahan ke atas
      const topPosition = element.getBoundingClientRect().top + window.scrollY; // Posisi elemen relatif ke viewport
      window.scrollTo({
        top: topPosition - offset, // Mengurangi offset untuk membuat posisi lebih tinggi
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
    <div className=" fixed left-0 w-full z-50  shadow-md bg-white text-white ">
      {/* Navigation Section */}
      <div className="container ">
        <div className="flex items-center justify-between text-sm gap-4 px-4 py-1 ">
          <div className="flex p-1 w-14 h-10">
            {/* Ganti placeholder dengan logo jika ada */}
            {profile.logo ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${profile.logo}`}
                className="w-full h-full object-contain"
                alt="Logo"
              />
            ) : (
              <h1 className=" text-xl  text-yellow-700 font-pacifico">
                {profile.cafe_name ? profile.cafe_name : "MenuCafeKu"}
              </h1>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-6">
            <Link
              href={`/`}
              className="font-semibold text-black capitalize py-2 flex hover:text-yellow-700 hover:border-yellow-700 hover:border-b-2"
            >
              Home
            </Link>
            {category.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.type)}
                className="hover:text-yellow-700 cursor-pointer font-semibold text-black capitalize transition-colors duration-300"
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
