"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomeSkeleton } from "../skeleton/homeSkeleton";
import { checkAndfetchGalleries } from "@/utils/checkGallery";

export default function Gallery(outletCode) {
  const [currentIndex, setCurrentIndex] = useState(null);
  const dispatch = useDispatch();
  const { galleries, statusGalleries, error } = useSelector((state) => state.counter);
  const codeOutlet = outletCode.outletCode;

  useEffect(() => {
    if (codeOutlet) {
      dispatch(checkAndfetchGalleries(codeOutlet));
    }
  }, [codeOutlet, dispatch]);

  if (statusGalleries === "failed") {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  const openImage = (index) => setCurrentIndex(index);
  const closeImage = () => setCurrentIndex(null);
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? galleries.length - 1 : prev - 1));
  const nextImage = () => setCurrentIndex((prev) => (prev === galleries.length - 1 ? 0 : prev + 1));

  return (
    <div className="px-5 md:px-12 lg:px-24">
      <div className="py-6 text-center">
        <h2 className="font-semibold font-display text-3xl md:text-4xl">Gallery</h2>
      </div>

      {galleries?.length === 0 ? (
        <HomeSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleries.map((dr, index) => {
            if (index % 4 === 0) {
              return (
                <div key={index} className="grid grid-cols-2 gap-1">
                  <div className="flex flex-wrap gap-2">
                    {galleries[index + 1] && (
                      <div className="h-[100px] md:h-[120px] w-full">
                        <img
                          src={`${process.env.NEXT_PUBLIC_PHOTOS}/${galleries[index + 1].image}`}
                          alt={galleries[index + 1].alt}
                          onClick={() => openImage(index + 1)}
                          className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex gap-1 w-full">
                      {galleries[index + 2] && (
                        <div className="h-[100px] md:h-[120px] w-1/2">
                          <img
                            src={`${process.env.NEXT_PUBLIC_PHOTOS}/${galleries[index + 2].image}`}
                            alt={galleries[index + 2].alt}
                            onClick={() => openImage(index + 2)}
                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      {galleries[index + 3] && (
                        <div className="h-[100px] md:h-[120px] w-1/2">
                          <img
                            src={`${process.env.NEXT_PUBLIC_PHOTOS}/${galleries[index + 3].image}`}
                            alt={galleries[index + 3].alt}
                            onClick={() => openImage(index + 3)}
                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-[208px] md:h-[250px]">
                    <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${dr.image}`} alt={dr.alt} onClick={() => openImage(index)} className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform" />
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {currentIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <button onClick={closeImage} className="absolute top-6 right-6 text-white text-4xl font-bold">
            &times;
          </button>
          <button onClick={prevImage} className="absolute left-6 text-white text-5xl font-bold hover:scale-110">
            &lt;
          </button>
          <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${galleries[currentIndex].image}`} alt={galleries[currentIndex].alt} className="max-w-[90%] max-h-[80%] rounded" />
          <button onClick={nextImage} className="absolute right-6 text-white text-5xl font-bold hover:scale-110">
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
