"use client";
import React, { useState, useEffect } from "react";
import { HomeSkeleton } from "../skeleton/homeSkeleton";

export default function Contact({ contact }) {
  return (
    <div className="">
      <div className=" ">
        <h2 className="text-center font-semibold font-display text-2xl md:text-4xl  ">
          CONTACT
        </h2>
      </div>
      {contact.length == 0 ? (
        <div className="px-[20px] md:px-[50px] lg:px-[100px]">
          <HomeSkeleton />
        </div>
      ) : (
        <div className=" pt-14  flex flex-wrap">
          <div className="w-full flex justify-center gap-10">
            {contact.map((dr, index) => (
              <a key={index} href={`${dr.link}`} target="_blank" className=" ">
                <div className=" rounded">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${dr.logo}`}
                    alt={dr.contact_name}
                    className="mx-auto w-[44px] h-[50px]"
                  />
                </div>
              </a>
            ))}
          </div>
          <div className="w-full text-center mt-5 text-slate-400">
            <h1>Permata Hijau</h1>
            <h2>magened by pwermata hijau</h2>
            <p>jl.karamat rt.04</p>
          </div>
        </div>
      )}
    </div>
  );
}
