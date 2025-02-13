"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Mendapatkan path saat ini, misalnya "/home/cecep"
  const lastPath = pathname.split("/").pop();

  const onClickHeader = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white  shadow z-50 fixed w-full">
      <div className="mx-auto container  ">
        <div className="flex  justify-between relative  ">
          <div className="flex p-1 w-16 h-10 ">
            {/* Ganti placeholder dengan logo jika ada */}
            {profile.logo ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${profile.logo}`}
                className="w-full h-full object-contain"
                alt="Logo"
              />
            ) : (
              <h1 className=" text-xl text-yellow-700 font-pacifico">
                {profile.cafe_name ? profile.cafe_name : "MenuCafeKu"}
              </h1>
            )}
          </div>
          <div className="flex mr-8 w-28 gap-4 ">
            <div className="  cursor-pointer">
              <Link
                href={`/`}
                className="text-black capitalize font-semibold text-xl md:text-black py-2 flex hover:text-yellow-700 hover:border-yellow-700 hover:border-b-2"
              >
                Home
              </Link>
            </div>
            <div className=" md:flex md:justify-star cursor-pointer">
              <Link
                href={`/menu`}
                className="text-black capitalize font-semibold text-xl md:text-black py-2 flex hover:text-yellow-700 hover:border-yellow-700 hover:border-b-2"
              >
                Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
