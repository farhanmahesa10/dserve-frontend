"use client";
import React, { useState, useEffect } from "react";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import MenuSkeleton from "../component/skeleton/menuSkeleton";
import Footer from "../component/footer/footer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addOutlet, toggleMenuId } from "@/store/slice";
import Link from "next/link";
import Error from "../component/error/error";

import HeaderMenu from "../component/header/headerMenu";
import Header from "../component/header/header";

export default function Home({ params }) {
  const [category, setCategory] = useState([]);
  const [profile, setProfile] = useState([]);
  const [outlet, setOutlet] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [detail, setDetail] = useState("");
  const searchParams = useSearchParams(); // Mengambil search params dari URL
  const id = searchParams.get("id"); // Mendapatkan parameter 'id' dari query
  const dispatch = useDispatch();
  const pesanan = useSelector((state) => state.counter.pesanan);

  useEffect(() => {
    if (outlet) {
      dispatch(
        addOutlet({
          id: outlet.id,
          outlet_name: outlet.outlet_name,
          profile: {
            address: profile.address,
            cafe_name: profile.cafe_name,
            logo: profile.logo,
          },
          contacts: outlet.contacts,
        })
      );
    }
  }, [outlet, profile, dispatch]);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/showall/${process.env.NEXT_PUBLIC_COMPANY_NAME}`
        );
        setCategory(response.data[0].categories);
        setProfile(response.data[0].profile);
        setOutlet(response.data[0]);
      } catch (err) {
        setIsError(true);
        console.log(err);
      }
    };
    fetchDrinks();
  }, []);

  useEffect(() => {
    if (id || category) {
      const element = document.getElementById(id);
      if (element) {
        const offset = 110;
        const topPosition =
          element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: topPosition - offset,
          behavior: "smooth",
        });
      }
    }
  }, [id, category]);

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleImageClick = (imageUrl, detail) => {
    setCurrentImage(imageUrl);
    setDetail(detail);
    setIsModalOpen(true);
  };

  //handle close gambar besar
  const closeModal = () => {
    setIsModalOpen(false); // Tutup modal
    setCurrentImage(""); // Reset gambar saat modal ditutup
  };

  return (
    <>
      {isError ? (
        <Error />
      ) : (
        <div className="bg-gradient-to-br  from-white to-yellow-100">
          {" "}
          <Header profile={profile} />
          <HeaderMenu category={category} />
          <div className="container ">
            <div id="menu" className="pt-[40px]">
              <div className="mt-[20px]">
                <div className=" py-6">
                  <h4 className="text-center text-sm text-yellow-700">
                    Assortments
                  </h4>
                  <h2 className="text-center font-bold text-2xl md:text-4xl">
                    MENU BOOK
                  </h2>
                  <div className="border-t-8 mt-2 border-yellow-700 w-[80px] mx-auto"></div>
                  <p className="text-center mt-1">
                    Various kinds of food and drinks as well as snacks.
                  </p>
                </div>
                {category.length == 0 ? (
                  <MenuSkeleton />
                ) : (
                  <>
                    {category.map((item) => {
                      return (
                        <div
                          id={item.type}
                          key={item.id}
                          className="px-4 py-8 "
                        >
                          <div className=" w-full rounded-lg">
                            <h1 className="font-bold capitalize text-center text-2xl md:text-4xl text-black">
                              {item.type}
                            </h1>
                            <div className="border-t-4 mx-auto mt-2 border-yellow-700 w-[80px]"></div>
                            <p className="text-center text-sm md:text-lg text-black mt-4">
                              Providing a variety of coffee and non-coffee
                              drinks, with quality coffee beans. Coffee adds
                              energy as caffeine stimulates the central nervous
                              system, fighting fatigue and increasing energy.
                            </p>
                            {/* {error && <p className="text-red-500 text-center mt-4">{error}</p>} */}
                            {item.subcategories.map((item) => (
                              <div key={item.id}>
                                <h1 className="font-bold capitalize mt-4 md-mt-8 text-2xl md:text-4xl text-neutral-400">
                                  {item.title}
                                </h1>
                                <div className="border-t-4 mt-2 border-yellow-700 w-[80px]"></div>
                                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                                  {item.menus.map((item) => {
                                    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo}`;
                                    const isSelected = pesanan.some(
                                      (order) => order.id === item.id
                                    );

                                    return (
                                      <div
                                        key={item.id}
                                        id={`${item.title}`}
                                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                                      >
                                        <div className="relative group cursor-pointer">
                                          <img
                                            src={imageUrl}
                                            alt={item.title}
                                            onClick={() =>
                                              handleImageClick(
                                                imageUrl,
                                                item.details
                                              )
                                            }
                                            className="w-full h-40 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                          />
                                          {isSelected && (
                                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                                              Dipilih
                                            </div>
                                          )}
                                        </div>

                                        <div className="p-4 text-center">
                                          <h1 className="text-lg md:text-xl font-bold text-gray-800 capitalize truncate">
                                            {item.title}
                                          </h1>
                                          <p className="text-sm md:text-lg text-gray-600 mt-1">
                                            {formatToRupiah(item.price)}
                                          </p>

                                          <button
                                            className={`mt-4 w-full py-2 rounded-xl font-semibold transition-colors duration-300 ${
                                              isSelected
                                                ? "bg-red-600 text-white"
                                                : "bg-primary50 text-black hover:bg-primary60"
                                            }`}
                                            onClick={() =>
                                              dispatch(
                                                toggleMenuId({
                                                  id: item.id,
                                                  title: item.title,
                                                  price: item.price,
                                                })
                                              )
                                            }
                                          >
                                            {isSelected ? "Hapus" : "Tambah"}
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            {pesanan.length > 0 && (
              <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-300 shadow-lg p-4 z-50">
                {/* Total Checkout */}
                <div className="container flex items-center justify-between ">
                  <p className="font-semibold text-lg text-gray-800">
                    Total item: {pesanan.length}
                  </p>
                  <Link
                    href={`/transaction`}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className=" flex flex-col items-center justify-center w-40 md:w-60 lg:w-80 p-2 rounded-lg shadow-lg bg-slate-100">
                  <div className="w-full flex justify-center mb-4 rounded-lg  ">
                    <img
                      src={currentImage}
                      alt="Gambar Besar"
                      className="w-full h-[140px] md:h-[220px] rounded-t-lg object-cover"
                    />
                  </div>
                  <h1 className="text-center text-gray-800">{detail}</h1>
                </div>

                <button
                  onClick={closeModal}
                  className="absolute top-6 h-8 w-8 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full right-10 text-red-600 text-2xl flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
          <Footer outlet={outlet} />
        </div>
      )}
    </>
  );
}
