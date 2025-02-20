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
import { IoAddCircleOutline } from "react-icons/io5";
import { CiCircleMinus } from "react-icons/ci";
import HeaderMenu from "../component/header/headerMenu";
import Header from "../component/header/header";
import { HomeSkeleton } from "../component/skeleton/homeSkeleton";

export default function Home({ params }) {
  const [category, setCategory] = useState([]);
  const [profile, setProfile] = useState([]);
  const [outlet, setOutlet] = useState([]);
  const [contact, setContact] = useState([]);
  const [rekomendation, setRekomendation] = useState([]);
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
        setContact(response.data[0].contacts);
      } catch (err) {
        setIsError(true);
        console.log(err);
      }
    };
    fetchDrinks();
  }, []);

  //cari menu rekomendation
  useEffect(() => {
    const fetchRekomendation = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/category/showall/${process.env.NEXT_PUBLIC_COMPANY_NAME}/true`
        );

        const data = response.data;
        setRekomendation(data[0].categories);
      } catch (err) {
        setIsError(true);
      }
    };
    fetchRekomendation();
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

  //function mengubah angka menjadi IDR
  const formatIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  console.log(pesanan);

  return (
    <>
      {isError ? (
        <Error />
      ) : (
        <div className="bg-slate-50">
          {" "}
          <Header profile={profile} contact={contact} />
          <HeaderMenu category={category} />
          <div className="container ">
            <div id="menu" className="pt-[40px]">
              <div className="mt-[20px]">
                {/* <div className=" py-6">
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
                </div> */}
                <div className="px-[20px] md:px-[50px] lg:px-[100px]">
                  <div className=" py-6">
                    <h4 className="text-center text-sm md:text-lg font-semibold text-slate-700">
                      Taste the deliciousness and freshness of our best seller
                      menu with every extraordinary bite and sip!
                    </h4>
                    <h2 className="text-center text-slate-700 mt-4 font-bold font-display text-2xl md:text-4xl">
                      OUR MENU BEST SELLER
                    </h2>
                  </div>
                  {rekomendation.length == 0 ? (
                    <HomeSkeleton />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
                      {rekomendation.map((dr) => {
                        return (
                          <div key={dr.id} className="flex justify-center ">
                            {dr.subcategories.map((item) => (
                              <div key={item.id}>
                                {item.menus.map((item) => (
                                  <div
                                    key={item.id}
                                    className="text-center w-[160px] md:w-[200px] mb-10"
                                  >
                                    <div className="">
                                      <Link
                                        href={`/menu/?id=${encodeURIComponent(
                                          item.title
                                        )}`}
                                      >
                                        <img
                                          src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo}`}
                                          alt=""
                                          className="w-full h-[140px] md:h-[160px] object-cover"
                                        />
                                      </Link>
                                    </div>
                                    <h1 className="text-center capitalize text-slate-700 font-semibold text-xl md:text-2xl mt-5">
                                      {dr.type}
                                    </h1>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                            <h1 className="font-bold capitalize text-center text-2xl md:text-4xl text-slate-700">
                              {item.type}
                            </h1>
                            <p className="text-center text-sm md:text-lg text-slate-700 mt-4">
                              Providing a variety of coffee and non-coffee
                              drinks, with quality coffee beans. Coffee adds
                              energy as caffeine stimulates the central nervous
                              system, fighting fatigue and increasing energy.
                            </p>
                            {/* {error && <p className="text-red-500 text-center mt-4">{error}</p>} */}
                            {item.subcategories.map((item) => (
                              <div key={item.id}>
                                <div className="mt-10 gap-8 flex flex-wrap  md:gap-28  ">
                                  {item.menus.map((item) => {
                                    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo}`;
                                    const isSelected = pesanan.some(
                                      (order) => order.id === item.id
                                    );

                                    return (
                                      <div
                                        key={item.id}
                                        id={`${item.title}`}
                                        className="flex min-w-[300px] md:min-w-[200px] md:block overflow-hidden duration-300 "
                                      >
                                        <div className="  cursor-pointer w-[100px] md:w-[200px]">
                                          <img
                                            src={imageUrl}
                                            alt={item.title}
                                            onClick={() =>
                                              handleImageClick(
                                                imageUrl,
                                                item.details
                                              )
                                            }
                                            className="h-[80px] md:h-[160px] w-full object-cover hover:scale-105 transition-transform duration-300"
                                          />
                                        </div>
                                        <div className="w-full md:w-full ">
                                          <div className=" pl-2 md:flex  justify-between">
                                            <h1 className="text-sm  font-semibold text-slate-700 capitalize truncate">
                                              {item.title}
                                            </h1>
                                            <p className="text-sm  font-semibold md:block text-slate-700 mt-1">
                                              {formatToRupiah(item.price)}
                                            </p>
                                          </div>
                                          {/* <div className="flex justify-between items-center mt-8 md:mt-4 px-2 gap-4 text-slate-700">
                                            <h3 className="hidden md:block text-sm  font-semibold">
                                              Jumlah
                                            </h3>
                                            <div className="flex justify-center gap-3 text-lg font-semibold">
                                              <button>
                                                <CiCircleMinus />
                                              </button>

                                              <span>0</span>
                                              <button>
                                                <IoAddCircleOutline />
                                              </button>
                                            </div>
                                          </div> */}
                                          <div className="w-full flex justify-end">
                                            <button
                                              className={`mt-2 p-1 px-5 text-center text-sm rounded-xl font-semibold transition-colors duration-300 ${
                                                isSelected
                                                  ? "border-red-600 border text-red-600 hover:bg-red-600 hover:text-white"
                                                  : "border-primary50 border text-primary50 hover:bg-primary50 hover:text-white"
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
              <div className="fixed inset-x-0 w-[500px] mx-auto bottom-0 border-2 p-2 border-t border-gray-300 shadow-lg z-50">
                {/* Total Checkout */}
                <Link
                  href={`/transaction`}
                  className="p-1 border-2  flex flex-wrap hover:bg-primary50"
                >
                  <div className=" flex w-full  justify-between ">
                    <h4 className="font-semibold text-sm text-gray-800">
                      Total item: {pesanan.length}
                    </h4>
                    <h4>
                      {" "}
                      {formatIDR(
                        pesanan.reduce(
                          (total, item) => total + item.qty * item.price,
                          0
                        )
                      )}
                    </h4>
                  </div>
                  <div className="w-full overflow-hidden">
                    <p className="truncate w-full whitespace-nowrap overflow-hidden text-ellipsis">
                      {pesanan.map((item) => item.title).join(", ")}
                    </p>
                  </div>
                </Link>
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
          {/* <Footer outlet={outlet} /> */}
        </div>
      )}
    </>
  );
}
