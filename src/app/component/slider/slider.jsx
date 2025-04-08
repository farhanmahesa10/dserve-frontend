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

const Slider = () => {
  const dispatch = useDispatch();
  const { outlets, statusOutlets, events, statusEvents, error } = useSelector((state) => state.counter);

  useEffect(() => {
    dispatch(checkAndfetchOutlets());
    dispatch(checkAndfetchEvents());
  }, [dispatch]);

  if (statusOutlets === "failed") return <p className="text-red-500 text-center">Error: {error}</p>;
  if (statusEvents === "failed") return <p className="text-red-500 text-center">Error: {error}</p>;
  return (
    <div className="flex justify-between mt-32">
      <div className="w-1/2  p-10">
        <h1 className="text-2xl capitalize font-semibold mb-5">{outlets.outlet_name}</h1>
        {outlets.history ? (
          outlets.history
        ) : (
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sequi esse veniam adipisci dolores quisquam ullam architecto cum praesentium, quo ipsam quidem dolor libero qui rerum, ducimus cupiditate sed repellat?</p>
        )}

        <button href="#" className="border-2 mt-4 w-32 mb-5">
          <p className="m-1">maps to hotel</p>
        </button>

        <div className=" flex gap-5">
          <div className="text-center">
            <p className="text-lg">Room</p>
            <h1 className="text-2xl font-semibold">100</h1>
          </div>
          <div className="text-center">
            <p className="text-lg">Total Order</p>
            <h1 className="text-2xl font-semibold">20k +</h1>
          </div>
          <div className="text-center">
            <p className="text-lg">Google Review</p>
            <h1 className="text-2xl font-semibold">4.5</h1>
          </div>
        </div>
      </div>
      <div className="w-96 mr-24  h-80">
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
            events.map((item) => {
              return (
                <SwiperSlide key={item.id} className="w-full h-full text-center text-[18px] bg-black flex justify-center items-center">
                  <div
                    className="min-w-full h-[400px] bg-cover bg-center flex items-center justify-center"
                    style={{
                      backgroundImage: `url(${process.env.NEXT_PUBLIC_PHOTOS}/${item.image})`,
                    }}
                  >
                    <div className="text-center text-white p-2 bg-black bg-opacity-50 rounded-lg">
                      <h2 className="text-2xl  font-bold capitalize mb-1">{item.title}</h2>
                      <p className="max-w-xl mx-auto text-sm md:text-lg">{item.descriptions}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default Slider;
