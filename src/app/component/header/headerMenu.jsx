"use client";

import { fetchCategories } from "@/store/slice";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
export default function HeaderMenu() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const dispatch = useDispatch();
  const { categories, statusCategories } = useSelector(
    (state) => state.counter
  );

  useEffect(() => {
    if (statusCategories === "idle") {
      dispatch(fetchCategories());
    }
  }, [statusCategories, dispatch]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 75;
      const topPosition =
        element.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({
        top: topPosition - offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className=" fixed left-0 mt-12 w-full z-40   ">
      <div className="container ">
        <div className="flex items-center justify-center text-sm gap-4 px-4 py-1  ">
          <div className="flex gap-6 bg-yellow-700   px-4 rounded-bl-md rounded-br-md justify-center h-8">
            <button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="hover:text-gray-300 cursor-pointer font-semibold text-white capitalize transition-colors duration-300"
            >
              Best Seller
            </button>
            {categories &&
              categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.type)}
                  className="hover:text-gray-300 cursor-pointer font-semibold text-white capitalize transition-colors duration-300"
                >
                  {item.type}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
