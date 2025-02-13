"use client";

import React from "react";

export default function Footer({ outlet }) {
  console.log(outlet.contacts, "popopopo");

  return (
    <footer className="bg-slate-400 pt-10 ">
      <div className="flex flex-wrap container">
        <div className="w-full px-4 mb-5 flex justify-center  text-slate-300 font-medium md:w-1/3 ">
          <div className="w-full">
            <div className="w-full ml-8">
              <h3 className="font-bold text-2xl mb-2 ">History</h3>
              <p>{outlet.profile ? outlet.profile.history : "-"}</p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 mb-5 flex justify-center  text-slate-300 font-medium md:w-1/3 ">
          <div className="w-full">
            <div className="w-full ml-8 xl:ml-32">
              <h3 className="font-bold text-2xl mb-2 ">Alamat</h3>
              <p>{outlet.profile ? outlet.profile.address : "-"}</p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 mb-5 flex flex-wrap text-slate-300 font-medium md:w-1/3 ">
          <div className="w-full ml-8 xl:ml-32 ">
            <h3 className="font-bold text-2xl mb-2">Media Sosial</h3>
            <div className="flex   w-36 flex-wrap gap-2 mb-2 ">
              {outlet.contacts &&
                outlet.contacts.map((item) => {
                  return (
                    <a
                      key={item.id}
                      href="https://youtube.com"
                      target="_blank"
                      className="w-7 h-7 mr-3 rounded-full flex justify-center items-center mb-3"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.logo}`}
                        alt={"contacts"}
                        className="w-7 h-7 object-cover"
                      />
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
