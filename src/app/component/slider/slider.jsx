"use client";

import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";

const Slider = ({ events, profile }) => {
  console.log(profile);

  return (
    <div className="flex justify-between mt-32">
      <div className="w-1/2  p-10">
        <h1 className="text-2xl capitalize font-semibold mb-5">
          {profile.cafe_name}
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
          sequi esse veniam adipisci dolores quisquam ullam architecto cum
          praesentium, quo ipsam quidem dolor libero qui rerum, ducimus
          cupiditate sed repellat?
        </p>

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
          {events.map((item) => {
            return (
              <SwiperSlide
                key={item.id}
                className="w-full h-full text-center text-[18px] bg-black flex justify-center items-center"
              >
                <div
                  className="min-w-full h-[400px] bg-cover bg-center flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.image})`,
                  }}
                >
                  <div className="text-center text-white p-2 bg-black bg-opacity-50 rounded-lg">
                    <h2 className="text-2xl  font-bold capitalize mb-1">
                      {item.title}
                    </h2>
                    <p className="max-w-xl mx-auto text-sm md:text-lg">
                      {item.descriptions}
                    </p>
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
