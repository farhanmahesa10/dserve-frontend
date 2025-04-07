"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutlets } from "@/store/slice";

export default function Header({ urlCode }) {
  const pathname = usePathname();
  const [url, setUrl] = useState("");
  const [tiktok, setTiktok] = useState(null);
  const [tiktokLogo, setTiktokLogo] = useState(null);

  useEffect(() => {
    setUrl(pathname);
  }, [pathname]);

  const dispatch = useDispatch();
  const { outlets, statusOutlets, contacts, statusContacts, error } = useSelector((state) => state.counter);

  useEffect(() => {
    if (statusOutlets === "idle") {
      dispatch(fetchOutlets());
    }
  }, [statusOutlets, dispatch]);

  useEffect(() => {
    if (contacts?.length > 0) {
      const instaContact = contacts.find((contact) => contact.contact_name.toLowerCase() === "tiktok");
      setTiktok(instaContact);

      if (instaContact?.logo) {
        setTiktokLogo(instaContact.logo);
      }
    }
  }, [contacts]);

  if (statusOutlets === "failed") return <p className="text-red-500 text-center">Error: {error}</p>;
  if (statusContacts === "failed") return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <header className="bg-white shadow z-50 fixed w-full">
      <div className="container mx-auto">
        <div className="flex justify-between items-center p-2">
          <div className="w-16 h-10">
            {outlets?.logo ? (
              <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${encodeURI(outlets.logo)}`} className="w-full h-full object-contain" alt="Logo" />
            ) : (
              <h1 className="text-sm text-yellow-700 font-pacifico">{outlets?.outlet_name || "MenuCafeKu"}</h1>
            )}
          </div>

          <nav className="flex gap-4">
            <Link href={`/${urlCode || ""}`}>
              {" "}
              <span className={`${url === `/${urlCode || ""}` ? "text-black" : "text-slate-400"} capitalize font-semibold text-xl py-2 hover:text-black`}>Home</span>
            </Link>
            <Link href={`/menu/${urlCode || ""}`}>
              <span className={`${url === `/menu/${urlCode || ""}` ? "text-black" : "text-slate-400"} capitalize font-semibold text-xl py-2 hover:text-black`}>Menu</span>
            </Link>
          </nav>

          {tiktok?.link && tiktokLogo ? (
            <a href={tiktok.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10">
              <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${tiktokLogo}`} className="w-full h-full object-contain" alt="tiktok" />
            </a>
          ) : (
            <h1 className="text-xl text-yellow-700 font-pacifico">Contact</h1>
          )}
        </div>
      </div>
    </header>
  );
}
