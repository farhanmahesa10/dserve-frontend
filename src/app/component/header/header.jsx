"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { checkAndfetchOutlets } from "@/utils/checkOutlet";
import { checkAndfetchContacts } from "@/utils/checkContacts";
import { checkAndfetchTransactions } from "@/utils/checkTransactions";
import { closeModal, openModal, setOrderCanceled, clearCanceledOrders } from "@/store/slice";
import { GrTransaction } from "react-icons/gr";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdOutlineSmsFailed } from "react-icons/md";
import ModalNotification from "@/atom/modalNotifications";
import socket from "@/lib/socket";
import { toast } from "react-toastify";
import { FormatDateAndTime } from "@/utils/formatDAte";
import { formatToRupiah } from "@/atom/formatRupiah";

export default function Header({ urlCode, outletCode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { outlets, cancelOrder, transactions, contacts, isModalOpen } = useSelector((state) => state.counter);

  const [currentUrl, setCurrentUrl] = useState("");
  const [contactInfo, setContactInfo] = useState(null);
  const [contactLogo, setContactLogo] = useState(null);
  const [showCancelList, setShowCancelList] = useState(false);
  const [hoveredNotification, setHoveredNotification] = useState(null);

  const [segment1, segment2] = urlCode.split("/");

  useEffect(() => {
    setCurrentUrl(pathname);
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
      const waContact = contacts.find((c) => c.contact_name?.toLowerCase() === "whatsapp");
      if (waContact) {
        setContactInfo(waContact);
        setContactLogo(waContact.logo || null);
      }
    }
  }, [contacts]);

  useEffect(() => {
    if (socket && segment2) {
      socket.emit("joinRoom", `${segment2}`);
    }
  }, [segment2]);

  useEffect(() => {
    const handleUserReceiveConfirm = (data) => {
      const tableCode = data?.data?.Table?.table_code;
      const status = data?.data?.status;

      if (tableCode === segment2) {
        if (status === "failed") {
          dispatch(setOrderCanceled(data));
        } else if (status === "onprocess") {
          toast.info("Your order is on process");
        } else if (status === "success") {
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
    const willShow = !showCancelList;
    setShowCancelList(willShow);
    if (!willShow) dispatch(clearCanceledOrders());
  };
  const notificationOrders = cancelOrder?.data?.Orders || [];
  const data = cancelOrder?.data;

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
              <span className={`${currentUrl === `/${urlCode}` ? "text-yellow-700" : "text-slate-400"} capitalize font-semibold py-2 hover:text-yellow-600`}>Home</span>
            </Link>
            <Link href={`/menu/${urlCode || ""}`}>
              <span className={`${currentUrl === `/menu/${urlCode}` ? "text-yellow-700" : "text-slate-400"} capitalize font-semibold py-2 hover:text-yellow-600`}>Menu</span>
            </Link>
          </nav>

          <div className="flex items-center gap-4 relative">
            {contactInfo?.link && contactLogo ? (
              <a href={contactInfo.link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10">
                <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${contactLogo}`} className="w-full h-full object-contain" alt="Contact" />
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
                {notificationOrders.length > 0 && <span className="w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center absolute -top-1 -right-1">{notificationOrders.length}</span>}
              </div>
            </div>

            {showCancelList && (
              <div className="absolute -right-7 top-[50px] w-80 max-h-72 bg-white border border-gray-300 shadow-lg rounded-lg z-20">
                <div className="p-2">
                  <h3 className="font-semibold mb-2">Notification Orders</h3>
                  {notificationOrders && notificationOrders.length === 0 ? (
                    <p className="text-sm text-gray-500">No notification yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {" "}
                      <div className="mt-2 max-h-52 overflow-y-auto custom-scrollbar space-y-2">
                        {notificationOrders?.map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-3 p-2 rounded-xl shadow-sm hover:bg-gray-50 transition ${!item.seen ? "bg-gray-200/70" : "bg-white"}`}
                            onMouseEnter={() => setHoveredNotification(data)}
                            onMouseLeave={() => setHoveredNotification(null)}
                          >
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-lg ${item.status === "failed" ? "bg-red-100 text-red-600" : "bg-red-100 text-red-600"}`}>
                                {item.status === "failed" ? <MdOutlineSmsFailed /> : <IoChatboxEllipsesOutline />}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold text-black">Room {data?.Table?.number_table}</span> {item?.status === "failed" ? "cancel" : ""} Canceled
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{FormatDateAndTime(item.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white p-4 border rounded-xl min-h-52">
                        {hoveredNotification ? (
                          <>
                            <h4 className="font-semibold text-slate-700 mb-2">Order Room {hoveredNotification?.Table?.number_table}</h4>
                            {hoveredNotification?.Orders?.length > 0 ? (
                              hoveredNotification.Orders.map((order, i) => (
                                <div key={i} className="text-sm mb-2 border-b pb-1">
                                  <div className="flex justify-between">
                                    <span>{order.Menu?.title}</span>
                                    <span>{order.qty}x</span>
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    {formatToRupiah(order.Menu?.price)} / Total: {formatToRupiah(order.Menu?.price * order.qty)}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-400">Order not found.</p>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && <ModalNotification outletCode={outletCode} onClose={() => dispatch(closeModal())} />}
      </div>
    </header>
  );
}
