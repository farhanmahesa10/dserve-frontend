import axios from "axios";

import React, { useState, useEffect } from "react";
import { AboutSkeleton } from "../skeleton/homeSkeleton";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchOutlets } from "@/store/slice";

export default function About() {
  const dispatch = useDispatch();
  const { outlets, statusOutlets, error } = useSelector((state) => state.counter);

  useEffect(() => {
    if (statusOutlets === "idle") {
      dispatch(fetchOutlets());
    }
  }, [statusOutlets, dispatch]);

  if (statusOutlets === "failed") return <p className="text-red-500 text-center">Error: {error}</p>;
  return (
    <div className=" gap-4 grid px-[10px] sm:px-[30px] md:px-[50px]">
      <h4 className=" text-center text-2xl md:text-4xl my-5 font-semibold font-display">About Me</h4>
      <p>
        {outlets.history ? (
          outlets.history
        ) : (
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sequi esse veniam adipisci dolores quisquam ullam architecto cum praesentium, quo ipsam quidem dolor libero qui rerum, ducimus cupiditate sed repellat?</p>
        )}
      </p>

      {/* <div className="bg-custom w-full bg-cover rounded h-[500px] justify-center p-2 grid grid-cols-2 gap-2">
        {profile.length == 0 ? <AboutSkeleton /> : <h1> {profile.history}</h1>}
        {profile.length == 0 ? (
          <AboutSkeleton />
        ) : (
          <img
            className="w-[300px] "
            src={process.env.NEXT_PUBLIC_BASE_API_URL + "/" + profile.logo}
          />
        )}
      </div> */}
    </div>
  );
}
