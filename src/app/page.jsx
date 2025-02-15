"use client";

import React, { useState, useEffect } from "react";
import About from "./about";
import Contact from "./contact";
import Gallery from "./gallery";
import axios from "axios";
import Link from "next/link";
import { HomeSkeleton } from "./homeSkeleton";
import Slider from "./slider";
import Header from "./header";

export default function Home({ params }) {
  const [outlet, setOutlet] = useState([]);
  const [event, setEvent] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [profile, setProfile] = useState([]);
  const [contact, setContact] = useState([]);
  const [rekomendation, setRekomendation] = useState([]);

  //buka semua table
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/outlet/showalltable/${process.env.NEXT_PUBLIC_COMPANY_NAME}`
        );

        const data = response.data;
        setOutlet(data);
        setEvent(data[0].events);
        setGallery(data[0].galleries);
        setProfile(data[0].profile);
        setContact(data[0].contacts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAll();
  }, []);

  //cari menu rekomendation
  useEffect(() => {
    const fetchRekomendation = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/category/showall/${process.env.NEXT_PUBLIC_COMPANY_NAME}/true`
        );

        const data = response.data;
        setRekomendation(data[0].categories);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRekomendation();
  }, []);

  return (
    <div className="bg-gradient-to-br  from-white to-yellow-100">
      <Header profile={profile} />
      <div className="pt-[1px] container p-0 ">
        <Slider events={event} />
        <div className="px-[20px] md:px-[50px] lg:px-[100px]">
          <div className=" py-6">
            <h4 className="text-center text-sm md:text-lg font-semibold text-yellow-700">
              Taste the deliciousness and freshness of our best seller menu with
              every extraordinary bite and sip!
            </h4>
            <h2 className="text-center mt-4 font-bold font-display text-2xl md:text-4xl">
              OUR MENU BEST SELLER
            </h2>
            <div className="border-t-8 mt-2 border-yellow-700 w-[80px] mx-auto"></div>
          </div>
          {rekomendation.length == 0 ? (
            <HomeSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
              {rekomendation.map((dr) => {
                return (
                  <div key={dr.id} className="flex justify-center ">
                    {dr.subcategories.map((item) => (
                      <div key={item.id}>
                        {item.menus.map((item) => (
                          <div
                            key={item.id}
                            className="text-center w-[160px] md:w-[200px] mb-10"
                          >
                            <div className="">
                              <Link
                                href={`/menu/?id=${encodeURIComponent(
                                  item.title
                                )}`}
                              >
                                <img
                                  src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo}`}
                                  alt=""
                                  className="w-full h-[140px] md:h-[160px] object-cover"
                                />
                              </Link>
                            </div>
                            <h1 className="text-center capitalize text-yellow-700 font-semibold text-xl md:text-2xl mt-5">
                              {dr.type}
                            </h1>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div id="about" className="mt-10 bg-yellow-100 scroll-smooth ">
          <About profile={profile} />
        </div>
        <div id="gallery" className="mt-10">
          <Gallery gallery={gallery} />
        </div>
        <div id="contact" className="mt-10">
          <Contact contact={contact} />
        </div>
      </div>
    </div>
  );
}
