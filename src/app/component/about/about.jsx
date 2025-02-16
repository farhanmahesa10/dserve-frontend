import axios from "axios";

import React, { useState, useEffect } from "react";
import { AboutSkeleton } from "../skeleton/homeSkeleton";

export default function About({ profile }) {
  return (
    <div className=" gap-4 grid px-[10px] sm:px-[30px] md:px-[50px]">
      <h4 className=" text-2xl md:text-4xl my-5 font-semibold font-display text-yellow-700">
        About Me
      </h4>

      <div className="bg-custom w-full bg-cover rounded h-[500px] justify-center p-2 grid grid-cols-2 gap-2">
        {profile.length == 0 ? <AboutSkeleton /> : <h1> {profile.history}</h1>}
        {profile.length == 0 ? (
          <AboutSkeleton />
        ) : (
          <img
            className="w-[300px] "
            src={process.env.NEXT_PUBLIC_BASE_API_URL + "/" + profile.logo}
          />
        )}
      </div>
    </div>
  );
}
