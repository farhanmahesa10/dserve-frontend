import axios from "axios";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { checkAndfetchOutlets } from "@/utils/checkOutlet";

export default function About(outletCode) {
  const dispatch = useDispatch();
  const { outlets, statusOutlets, error } = useSelector((state) => state.counter);
  const codeOutlet = outletCode.outletCode;

  useEffect(() => {
    if (codeOutlet) {
      dispatch(checkAndfetchOutlets(codeOutlet));
    }
  }, [dispatch, codeOutlet]);

  if (statusOutlets === "failed") return <p className="text-red-500 text-center">Error: {error}</p>;
  return (
    <div className=" gap-4 grid px-[10px] sm:px-[30px] md:px-[50px]">
      <h4 className=" text-center text-2xl md:text-4xl my-5 font-semibold font-display">About Me</h4>
      <div>
        {outlets.history ? (
          outlets.history
        ) : (
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sequi esse veniam adipisci dolores quisquam ullam architecto cum praesentium, quo ipsam quidem dolor libero qui rerum, ducimus cupiditate sed repellat?</p>
        )}
      </div>
    </div>
  );
}
