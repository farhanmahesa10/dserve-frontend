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
import { closeModal, openModal, setOrderCanceled, clearCanceledOrders } from "@/store/slice";
import socket from "@/lib/socket";
import { IoMdNotificationsOutline } from "react-icons/io";
import { toast } from "react-toastify";

export default function Header({ urlCode, outletCode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { outlets, cancelOrder, transactions, contacts, isModalOpen } = useSelector((state) => state.counter);

  const [url, setUrl] = useState("");
  const [tiktok, setTiktok] = useState(null);
  const [tiktokLogo, setTiktokLogo] = useState(null);
  const [showCancelList, setShowCancelList] = useState(false);
  const [segment1, segment2] = urlCode.split("/");

  useEffect(() => {
    setUrl(pathname);
  }, [pathname]);

  useEffect(() => {
    if (outletCode) {
      dispatch(checkAndfetchOutlets(outletCode));
      dispatch(checkAndfetchContacts(outletCode));
      dispatch(checkAndfetchTransactions({ outletCode, urlCode }));
    }
  }, [dispatch, outletCode, urlCode]);

  useEffect(() => {
    if (contacts?.length > 0) {
      const whatsappContact = contacts.find((c) => c.contact_name?.toLowerCase() === "whatsapp");
      if (whatsappContact) {
        setTiktok(whatsappContact);
        setTiktokLogo(whatsappContact.logo || null);
      }
    }
  }, [contacts]);

  useEffect(() => {
    if (socket && segment2) {
      socket.emit("joinRoom", `room_${segment2}`);
    }
  }, [segment2]);

  useEffect(() => {
    const handleUserReceiveConfirm = (data) => {
      if (data.roomCode === segment2) {
        if (data.status === "failed") {
          dispatch(setOrderCanceled(data));
        } else if (data.status === "onprocess") {
          toast.info("Your order is on process");
        } else if (data.status === "success") {
          toast.success("Your order is finished");
        }
      }
    };

    socket.on("UserReceiveConfirm", handleUserReceiveConfirm);
    return () => {
      socket.off("UserReceiveConfirm", handleUserReceiveConfirm);
    };
  }, [segment2, dispatch]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleClickNotification = () => {
    const nextShow = !showCancelList;

    setShowCancelList(nextShow);

    if (!nextShow) {
      dispatch(clearCanceledOrders());
    } else if (cancelOrder.length > 0) {
      cancelOrder.forEach((order) => {
        toast.info(`Order in room ${order.number_table} is canceled.`);
      });
    }
  };

  return (
    <header className="bg-white shadow z-50 fixed w-full">
      <div className="container mx-auto py-2">
        <div className="flex justify-between items-center p-2 relative">
          <div className="w-16 h-10">
            {outlets?.logo ? (
              <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${encodeURI(outlets.logo)}`} className="w-full h-full object-contain" alt="Logo" />
            ) : (
              <h1 className="text-sm text-yellow-700 font-pacifico">{outlets?.outlet_name || "MenuCafeKu"}</h1>
            )}
          </div>

          <nav className="flex gap-4">
            <Link href={`/${urlCode || ""}`}>
              <span className={`${url === `/${urlCode || ""}` ? "text-yellow-700" : "text-slate-400"} capitalize font-semibold py-2 hover:text-yellow-600`}>Home</span>
            </Link>
            <Link href={`/menu/${urlCode || ""}`}>
              <span className={`${url === `/menu/${urlCode || ""}` ? "text-yellow-700" : "text-slate-400"} capitalize font-semibold py-2 hover:text-yellow-600`}>Menu</span>
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

            <div className="flex items-center gap-4 relative">
              <div onClick={() => dispatch(openModal())} className="relative cursor-pointer">
                <GrTransaction className="text-2xl" />
                {transactions.length > 0 && <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center absolute -top-1 -right-1">{transactions.length}</span>}
              </div>

              <div className="relative cursor-pointer" onClick={handleClickNotification}>
                <IoMdNotificationsOutline className="text-2xl" />
                {cancelOrder.length > 0 && <span className="w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center absolute -top-1 -right-1">{cancelOrder.length}</span>}
              </div>
            </div>

            {showCancelList && cancelOrder.length > 0 && (
              <div className="absolute right-4 top-20 bg-white border rounded shadow-md w-72 z-50 p-3 transition-all duration-300 ease-in-out opacity-100">
                <h3 className="text-sm font-semibold mb-2">Canceled Orders</h3>
                <ul className="text-sm max-h-60 overflow-auto space-y-2">
                  {cancelOrder.map((order, idx) => (
                    <li key={idx} className="border-b pb-1">
                      Order in room <strong>{order.number_table}</strong> is canceled.
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && <ModalNotification outletCode={outletCode} onClose={() => dispatch(closeModal())} />}
      </div>
    </header>
  );
}
