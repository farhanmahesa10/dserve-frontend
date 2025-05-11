"use client";
import React, { useState, useEffect } from "react";
import { HomeSkeleton } from "../skeleton/homeSkeleton";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchContacts } from "@/store/slice";
import { checkAndfetchContacts } from "@/utils/checkContacts";

export default function Contact(outletCode) {
  const dispatch = useDispatch();
  const { contacts, outlets } = useSelector((state) => state.counter);
  const codeOutlet = outletCode.outletCode;

  useEffect(() => {
    dispatch(checkAndfetchContacts(codeOutlet));
  }, [codeOutlet, dispatch]);

  return (
    <div className="">
      <div className=" ">
        <h2 className="text-center font-semibold font-display text-2xl md:text-4xl  ">Contact</h2>
      </div>
      <div className=" pt-14  flex flex-wrap">
        <div className="w-full flex justify-center gap-10">
          {contacts &&
            contacts.map((dr, index) => (
              <a key={index} href={`${dr.link}`} target="_blank" className=" ">
                <div className=" rounded">
                  <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${dr.logo}`} alt={dr.contact_name} className="mx-auto w-[44px] h-[50px]" />
                </div>
              </a>
            ))}
        </div>
        <div className="w-full text-center mt-5 text-slate-400">
          <h1>{outlets.outlet_name}</h1>
          <h2>magened by {outlets.outlet_name}</h2>
          <p>{outlets.address ? outlets.address : "lorem ipsum"}</p>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
