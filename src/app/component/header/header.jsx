"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { checkAndfetchOutlets } from "@/utils/checkOutlet";
import { checkAndfetchContacts } from "@/utils/checkContacts";
import ModalNotification from "@/atom/modalNotifications";
import { checkAndfetchTransactions } from "@/utils/checkTransactions";
import { GrTransaction } from "react-icons/gr";
import { closeModal, openModal } from "@/store/slice";
export default function Header({ urlCode }) {
  const pathname = usePathname();
  const [url, setUrl] = useState("");
  const [tiktok, setTiktok] = useState(null);
  const [tiktokLogo, setTiktokLogo] = useState(null);

  useEffect(() => {
    setUrl(pathname);
  }, [pathname]);

  const dispatch = useDispatch();
  const { outlets, outletCode, transactions, statusOutlets, contacts, isModalOpen, statusContacts, error } = useSelector((state) => state.counter);
  useEffect(() => {
    dispatch(checkAndfetchOutlets(outletCode));
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkAndfetchContacts(outletCode));
    dispatch(checkAndfetchTransactions(outletCode));
  }, [dispatch, outletCode]);
  console.log(outletCode, "cek kode", typeof outletCode == "string");
  console.log(outlets.address, "cek ini");

  useEffect(() => {
    if (contacts?.length > 0) {
      const instaContact = contacts.find((contact) => contact.contact_name.toLowerCase() === "whatsapp");
      setTiktok(instaContact);

      if (instaContact?.logo) {
        setTiktokLogo(instaContact.logo);
      }
    }
  }, [contacts]);

  // if (statusOutlets === "failed") return <p className="text-red-500 text-center">Error: {error}</p>;
  // if (statusContacts === "failed") return <p className="text-red-500 text-center">Error: {error}</p>;
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <header className="bg-white shadow z-50 fixed w-full">
      <div className="container mx-auto">
        <div className="flex justify-between items-center p-2 relative">
          <div className="w-16 h-10">
            {outlets && outlets?.logo ? (
              <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${encodeURI(outlets && outlets.logo)}`} className="w-full h-full object-contain" alt="Logo" />
            ) : (
              <h1 className="text-sm text-yellow-700 font-pacifico">{(outlets && outlets?.outlet_name) || "MenuCafeKu"}</h1>
            )}
          </div>

          <nav className="flex gap-4">
            <Link href={`/${urlCode || ""}`}>
              <span className={`${url === `/${urlCode || ""}` ? "text-black" : "text-slate-400"} capitalize font-semibold py-2 hover:text-black`}>Home</span>
            </Link>
            <Link href={`/menu/${urlCode || ""}`}>
              <span className={`${url === `/menu/${urlCode || ""}` ? "text-black" : "text-slate-400"} capitalize font-semibold py-2 hover:text-black`}>Menu</span>
            </Link>
          </nav>

          <div className="flex items-center gap-4 relative">
            {tiktok?.link && tiktokLogo ? (
              <a href={tiktok.link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10">
                <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${tiktokLogo}`} className="w-full h-full object-contain" alt="whatsapp" />
              </a>
            ) : (
              <h1 className="text-base text-yellow-700 font-pacifico hidden sm:block">Contact</h1>
            )}

            <div onClick={() => dispatch(openModal())} className="relative cursor-pointer w-8 h-8 sm:w-10 sm:h-10">
              <GrTransaction className="text-4xl" />
              {transactions.length > 0 && <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center absolute -top-1 -right-1">{transactions.length}</span>}
            </div>
          </div>
        </div>

        {isModalOpen && <ModalNotification onClose={() => dispatch(closeModal())} />}
      </div>
    </header>
  );
}
