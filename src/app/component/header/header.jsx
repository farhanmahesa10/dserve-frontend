"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header({ profile, contact }) {
  const pathname = usePathname();
  const [url, setUrl] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    setUrl(pathname);
  }, [pathname]);

  useEffect(() => {
    if (contact) {
      setWhatsapp(
        contact.find(
          (contact) => contact.contact_name.toLowerCase() === "whatsapp"
        )
      );
    }
  }, [contact]);

  console.log(whatsapp, "pppp");

  return (
    <header className="bg-white  shadow z-50 fixed w-full">
      <div className="mx-auto container  ">
        <div className="flex  justify-between relative  p-1 ">
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
          <div className="flex mr-8 w-40 gap-4 ">
            <div className="  cursor-pointer">
              <Link
                href={`/`}
                className={`${
                  url == "/" ? "text-black" : "text-slate-400"
                }  capitalize font-semibold text-xl  py-2 flex hover:text-black`}
              >
                Home
              </Link>
            </div>
            <div className=" md:flex md:justify-star cursor-pointer">
              <Link
                href={`/menu`}
                className={`${
                  url == "/menu" ? "text-black" : "text-slate-400"
                }  capitalize font-semibold text-xl   py-2 flex hover:text-black`}
              >
                Menu
              </Link>
            </div>
          </div>

          {whatsapp ? (
            <a href={whatsapp.link} target="_blank" className="w-10 h-10">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${whatsapp.logo}`}
                className="w-full h-full object-contain"
                alt="Logo"
              />
            </a>
          ) : (
            <h1 className=" text-xl text-yellow-700 font-pacifico">contact</h1>
          )}
        </div>
      </div>
    </header>
  );
}
