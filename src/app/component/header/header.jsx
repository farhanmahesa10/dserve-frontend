"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { checkAndfetchOutlets } from "@/utils/checkOutlet";
import { checkAndfetchContacts } from "@/utils/checkContacts";
import ModalNotification from "@/atom/modalNotifications";
import { checkAndfetchTransactions } from "@/utils/checkTransactions";

export default function Header({ urlCode }) {
  const pathname = usePathname();
  const [url, setUrl] = useState("");
  const [tiktok, setTiktok] = useState(null);
  const [tiktokLogo, setTiktokLogo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setUrl(pathname);
  }, [pathname]);

  const dispatch = useDispatch();
  const { outlets, transactions, statusOutlets, contacts, statusContacts, error } = useSelector((state) => state.counter);

  useEffect(() => {
    dispatch(checkAndfetchOutlets());
    dispatch(checkAndfetchContacts());
    dispatch(checkAndfetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (contacts?.length > 0) {
      const instaContact = contacts.find((contact) => contact.contact_name.toLowerCase() === "whatsapp");
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
              <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${tiktokLogo}`} className="w-full h-full object-contain" alt="whatsapp" />
            </a>
          ) : (
            <h1 className="text-xl text-yellow-700 font-pacifico">Contact</h1>
          )}
        </div>
        <div onClick={() => setIsModalOpen(true)} className="cursor-pointer fixed top-2 z-30 right-8 w-10 h-10">
          <img src="/img/notificasi.png" alt="Notifikasi" />
          {transactions.length > 0 && <span className="w-5 h-5 bg-red-500 rounded-full absolute text-white text-xs flex items-center justify-center right-0 top-0">{transactions.length}</span>}
        </div>

        {isModalOpen && <ModalNotification onClose={() => setIsModalOpen(false)} />}
      </div>
    </header>
  );
}
