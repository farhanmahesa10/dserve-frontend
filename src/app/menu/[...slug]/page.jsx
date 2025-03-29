"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMenus, fetchMenusBestSeller, increment } from "@/store/slice";
import Link from "next/link";
import Error from "@/app/component/error/error";
import Header from "@/app/component/header/header";
import HeaderMenu from "@/app/component/header/headerMenu";
import { HomeSkeleton } from "@/app/component/skeleton/homeSkeleton";
import MenuSkeleton from "@/app/component/skeleton/menuSkeleton";
import CounterButton from "@/atom/counterButton";
import CheckoutModal from "@/atom/checkoutModal";
import Footer from "@/app/component/footer/footer";
import axios from "axios";
import { formatToRupiah } from "@/atom/formatRupiah";

export default function Menu() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [pageError, setPageError] = useState(false);
  const [urlCode, setUrlCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const id = searchParams.get("id");
  const { allMenus, menus, statusAllMenus, statusMenus, pesanan } = useSelector((state) => state.counter);

  useEffect(() => {
    if (!params?.slug || params.slug.length < 2) {
      setPageError(true);
      return;
    }

    const lastTwoSegments = params.slug.slice(-2).join("/");
    setUrlCode(lastTwoSegments);

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/table/checktablecode/${lastTwoSegments}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setPageError(true);
        console.error("Fetch error:", err);
      });
  }, [params]);

  useEffect(() => {
    if (!allMenus.length) {
      dispatch(fetchAllMenus());
    }
    if (!menus.length) {
      dispatch(fetchMenusBestSeller());
    }
  }, [dispatch, allMenus.length, menus.length]);

  useEffect(() => {
    if (id && allMenus.length) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 110;
          const topPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: topPosition - offset,
            behavior: "smooth",
          });
        }
      }, 500);
    }
  }, [id, allMenus]);

  useEffect(() => {
    if (pesanan.length > 0) {
      setIsModalOpen(true);
    }
  }, [pesanan]);

  const handleUpdateCart = (mn) => {
    if (!mn?.title || !mn?.price) {
      console.warn("Data tidak lengkap, menunggu data...");
      return;
    }
    dispatch(increment({ id_menu: mn.id, title: mn.title, price: mn.price, qty: mn.qty || 1, total_price: mn.price * (mn.qty || 1) }));
    setIsModalOpen(true);
  };

  if (pageError) {
    return <Error />;
  }

  return (
    <>
      {statusAllMenus === "error" && statusMenus === "error" ? (
        <Error />
      ) : (
        <div className="bg-slate-50 min-h-screen flex flex-col">
          <Header urlCode={urlCode} />
          <HeaderMenu />
          <div className="container mx-auto px-4 md:px-12 lg:px-20 flex-grow">
            <div id="menu" className="pt-10">
              <div className="mt-5 rounded-md p-6 md:p-10">
                <div className="text-center">
                  <h4 className="text-sm md:text-lg font-semibold text-slate-700">Taste the deliciousness and freshness of our best seller menu!</h4>
                  <h2 className="text-slate-700 mt-4 font-bold text-2xl md:text-4xl">OUR MENU BEST SELLER</h2>
                </div>
                {statusMenus === "loading" ? (
                  <HomeSkeleton />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3  gap-6 justify-items-center mt-6">
                    {menus.map((menu, index) => (
                      <div key={index + 1} className="flex flex-row sm:flex-col items-center gap-4 w-full max-w-[400px] p-3 border border-gray-300 rounded-lg shadow-md">
                        <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${menu.photo}`} alt={menu.title} className="w-[100px] h-[100px] object-cover rounded-md" />
                        <div className="flex flex-col justify-between w-full text-center sm:text-left">
                          <h1 className="capitalize text-slate-700 text-center font-semibold text-lg md:text-xl">{menu.title}</h1>
                          <p className="text-slate-700 text-center font-medium">{formatToRupiah(menu.price)}</p>
                          <div className="mt-2">
                            <CounterButton id_menu={menu.id} onIncrement={() => handleUpdateCart(menu)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {statusAllMenus === "loading" ? (
                  <MenuSkeleton />
                ) : (
                  <div className="container mx-auto py-8">
                    {allMenus.map((menu, index) => (
                      <div key={menu.id || index} className="py-8 text-center">
                        <h1 className="font-bold capitalize text-2xl md:text-3xl text-slate-700">{menu.type}</h1>
                        <p className="text-slate-500 mt-2">{menu.descriptions}</p>

                        {menu.SubCategories &&
                          menu.SubCategories.map((sub, subIndex) => (
                            <div key={sub.id || subIndex} className="mt-6">
                              <h2 className="text-lg font-semibold text-slate-700">{sub.title}</h2>
                              <div className="mt-4 grid   grid-cols-1 mx-auto sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-start">
                                {sub.Menus?.map((mn, index) => (
                                  <div key={index + 2} className="flex flex-row sm:flex-col items-center gap-4 w-full max-w-[400px] p-3 border border-gray-300 rounded-lg shadow-md">
                                    <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${mn.photo}`} alt={mn.title} className="w-[100px] h-[100px] object-cover rounded-md" />
                                    <div className="flex flex-col justify-between w-full text-center sm:text-left">
                                      <h1 className="capitalize text-center text-slate-700 font-semibold text-lg md:text-xl">{mn.title}</h1>
                                      <p className="text-slate-700 text-center font-medium">{formatToRupiah(mn.price)}</p>
                                      <div className="mt-2">
                                        <CounterButton id_mn={mn.id} onIncrement={() => handleUpdateCart(mn)} />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {isModalOpen && <CheckoutModal urlCode={urlCode} cartItems={pesanan} onClose={() => setIsModalOpen(false)} />}
          </div>
          <Footer />
          <div onClick={() => setIsModalOpen(true)} className={`${isModalOpen ? "hidden" : "" || pesanan.length > 0 ? "" : "hidden"} cursor-pointer fixed right-8 w-10 h-10 bottom-8`}>
            <img src="/img/keranjang.png" alt="" />
          </div>
        </div>
      )}
    </>
  );
}
