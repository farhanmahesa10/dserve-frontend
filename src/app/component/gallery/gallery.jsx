"use client";

import React, { useState, useEffect } from "react";
import { HomeSkeleton } from "../skeleton/homeSkeleton";

export default function Gallery({ gallery }) {
  const [currentIndex, setCurrentIndex] = useState(null);

  const openImage = (index) => {
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setCurrentIndex(null);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="px-[20px] md:px-[50px] lg:px-[100px]">
      <div className="py-6">
        <h2 className="text-center font-semibold font-display text-3xl md:text-4xl">
          Gallery
        </h2>
      </div>
      {gallery.length === 0 ? (
        <HomeSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gallery.map((dr, index) => {
            const chunkIndex = Math.floor(index / 4);
            if (index % 4 === 0) {
              return (
                <div key={chunkIndex} className="grid grid-cols-2 gap-1">
                  <div className="flex gap-2 flex-wrap">
                    {gallery[index + 1] && (
                      <div className="h-[100px] md:h-[120px] w-full">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${
                            gallery[index + 1].image
                          }`}
                          alt={gallery[index + 1].alt}
                          onClick={() => openImage(index + 1)}
                          className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex w-full">
                      {gallery[index + 2] && (
                        <div className="h-[100px] md:h-[120px] w-1/2">
                          <img
                            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${
                              gallery[index + 2].image
                            }`}
                            alt={gallery[index + 2].alt}
                            onClick={() => openImage(index + 2)}
                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      {gallery[index + 3] && (
                        <div className="h-[100px] md:h-[120px] w-1/2">
                          <img
                            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${
                              gallery[index + 3].image
                            }`}
                            alt={gallery[index + 3].alt}
                            onClick={() => openImage(index + 3)}
                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:h-[250px] h-[208px] ">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${dr.image}`}
                      alt={dr.alt}
                      onClick={() => openImage(index)}
                      className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {currentIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 z-50">
          <button
            onClick={closeImage}
            className="absolute top-6 right-6 text-white text-4xl font-bold"
          >
            &times;
          </button>
          <button
            onClick={prevImage}
            className="absolute left-6 text-white text-5xl font-bold hover:scale-110"
          >
            &lt;
          </button>
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${gallery[currentIndex].image}`}
            alt={gallery[currentIndex].alt}
            className="max-w-[90%] max-h-[80%] rounded"
          />
          <button
            onClick={nextImage}
            className="absolute right-6 text-white text-5xl font-bold hover:scale-110"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
