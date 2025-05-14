"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { checkAndfetchOutlets } from "@/utils/checkOutlet";
import { checkAndfetchEvents } from "@/utils/checkEvent";
import Link from "next/link";

const Slider = ({ outletCode }) => {
  const dispatch = useDispatch();
  const { outlets, events } = useSelector((state) => state.counter);
  const codeOutlet = outletCode;

  useEffect(() => {
    if (codeOutlet) {
      dispatch(checkAndfetchOutlets(codeOutlet));
      dispatch(checkAndfetchEvents(codeOutlet));
    }
  }, [codeOutlet, dispatch]);

  return (
    <div className="flex flex-col lg:flex-row mt-10 lg:mt-32">
      <div className="w-full lg:w-1/2 p-10">
        <h1 className="text-2xl capitalize font-semibold mb-5">{outlets?.outlet_name}</h1>
        {outlets?.history ? (
          <p>{outlets.history}</p>
        ) : (
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sequi esse veniam adipisci dolores quisquam ullam architecto cum praesentium, quo ipsam quidem dolor libero qui rerum, ducimus cupiditate sed repellat?</p>
        )}

        <Link href={`${outlets?.linkMap}`} target="_blank" className=" mt-4 w-32 mb-5 text-center text-white ">
          <p className="border-2 p-1 mt-3 text-black capitalize">Maps to hotel</p>
        </Link>
      </div>

      <div className="w-full lg:w-1/2 lg:mr-24 h-80 lg:h-auto">
        <Swiper
          pagination={true}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="w-full h-full"
        >
          {events &&
            events.map((item) => (
              <SwiperSlide key={item.id} className="w-full h-full text-center text-[18px] bg-black flex justify-center items-center">
                <div
                  className="min-w-full h-[400px] bg-cover bg-center flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_PHOTOS}/${item.image})`,
                  }}
                >
                  <div className="text-center text-white p-2 bg-black bg-opacity-50 rounded-lg">
                    <h2 className="text-2xl font-bold capitalize mb-1">{item.title}</h2>
                    <p className="max-w-xl mx-auto text-sm md:text-lg">{item.descriptions}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Slider;
