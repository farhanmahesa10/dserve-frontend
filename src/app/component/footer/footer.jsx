"use client";

import { checkAndfetchContacts } from "@/utils/checkContacts";
import { checkAndfetchOutlets } from "@/utils/checkOutlet";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Footer(outletCode) {
  const dispatch = useDispatch();
  const { outlets, contacts, statusContacts, statusOutlets, error } = useSelector((state) => state.counter);
  const codeOutlet = outletCode.outletCode;

  useEffect(() => {
    if (codeOutlet) {
      dispatch(checkAndfetchOutlets(codeOutlet));
      dispatch(checkAndfetchContacts(codeOutlet));
    }
  }, [dispatch, codeOutlet]);

  if (statusOutlets === "failed" || statusContacts === "failed") {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  return (
    <footer className="bg-yellow-700 pt-10">
      <div className="flex flex-wrap container">
        <div className="w-full px-4 mb-5 flex justify-center text-white font-medium md:w-1/3">
          <div className="w-full ml-8">
            <h3 className="font-bold text-2xl mb-2">History</h3>
            <p>{outlets.history || "lorem ipsum"}</p>
          </div>
        </div>
        <div className="w-full px-4 mb-5 flex justify-center text-white font-medium md:w-1/3">
          <div className="w-full ml-8 xl:ml-32">
            <h3 className="font-bold text-2xl mb-2">Alamat</h3>
            <p>{outlets.address || "lorem ipsum"}</p>
          </div>
        </div>
        <div className="w-full px-4 mb-5 flex flex-wrap text-white font-medium md:w-1/3">
          <div className="w-full ml-8 xl:ml-32">
            <h3 className="font-bold text-2xl mb-2">Media Sosial</h3>
            <div className="flex w-36 flex-wrap gap-2 mb-2">
              {Array.isArray(contacts) &&
                contacts.map((item) => (
                  <a key={item.id} href={item.link} target="_blank" className="w-7 h-7 mr-3 rounded-full flex justify-center items-center mb-3">
                    <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${item.logo}`} alt={item.contact_name} className="w-7 h-7 object-cover" />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
