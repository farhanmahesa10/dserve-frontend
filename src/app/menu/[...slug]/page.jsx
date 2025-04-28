"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "@/store/slice";
import Error from "@/app/component/error/error";
import Header from "@/app/component/header/header";
import HeaderMenu from "@/app/component/header/headerMenu";
import { HomeSkeleton } from "@/app/component/skeleton/homeSkeleton";
import MenuSkeleton from "@/app/component/skeleton/menuSkeleton";
import CheckoutModal from "@/atom/checkoutModal";
import Footer from "@/app/component/footer/footer";
import axios from "axios";
import Card from "@/utils/card";
import { checkAndFetchAllMenus } from "@/utils/checkAllMenus";

export default function Menu() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [pageError, setPageError] = useState(false);
  const [urlCode, setUrlCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const id = searchParams.get("id");
  const { allMenus, menus, statusAllMenus, statusMenus, pesanan } = useSelector(
    (state) => state.counter
  );

  useEffect(() => {
    if (!params?.slug || params.slug.length < 2) {
      setPageError(true);
      return;
    }

    const lastTwoSegments = params.slug.slice(-2).join("/");
    setUrlCode(lastTwoSegments);

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/table/checktablecode/${lastTwoSegments}`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setPageError(true);
        console.error("Fetch error:", err);
      });
  }, [params]);

  useEffect(() => {
    dispatch(checkAndFetchAllMenus());
  }, [dispatch]);

  useEffect(() => {
    if (id && allMenus.length) {
      setTimeout(() => {
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
      }, 500);
    }
  }, [id, allMenus]);

  useEffect(() => {
    if (pesanan.length > 0) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [pesanan]);

  const handleUpdateCart = (mn) => {
    if (!mn?.title || !mn?.price) {
      console.warn("Data tidak lengkap, menunggu data...");
      return;
    }
    dispatch(
      increment({
        ...mn,
        id_menu: mn.id,
        title: mn.title,
        price: mn.price,
        qty: mn.qty || 1,
        total_price: mn.price * (mn.qty || 1),
      })
    );
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
        <div className="bg-slate-50 min-h-screen flex flex-col ">
          <Header urlCode={urlCode} />
          <HeaderMenu />
          <div className="container  flex-grow pb-[200px] md:pb-[250px]">
            <div id="menu" className="pt-10">
              <div className="mt-14 rounded-md ">
                <div className=" flex flex-col items-center">
                  <h2 className="text-slate-700 mt-4 font-bold text-xl md:text-3xl">
                    OUR MENU BEST SELLER
                  </h2>
                  <h4 className="text-sm md:text-lg  text-slate-700 w-fit border-b border-gray-400">
                    Taste the deliciousness and freshness of our best seller
                    menu!
                  </h4>
                </div>
                {statusMenus === "loading" ? (
                  <HomeSkeleton />
                ) : (
                  <div className="grid grid-cols-1  md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mt-6">
                    {menus.map((menu, index) => (
                      <Card
                        menu={menu}
                        key={index}
                        onIncrement={() => handleUpdateCart(menu)}
                      />
                    ))}
                  </div>
                )}
                {statusAllMenus === "loading" ? (
                  <MenuSkeleton />
                ) : (
                  <div className="flex flex-col gap-12 mt-12">
                    {allMenus.map((menu, index) => (
                      <div key={menu.id || index} id={menu.type} className=" ">
                        <div className="flex flex-col items-center">
                          <h1 className="font-bold capitalize text-2xl md:text-3xl text-slate-700">
                            {menu.type}
                          </h1>
                          <p className="text-slate-700  border-b border-gray-400 w-fit">
                            {menu.descriptions}
                          </p>
                        </div>

                        {menu.SubCategories &&
                          menu.SubCategories.map((sub, subIndex) => (
                            <div key={sub.id || subIndex} className="mt-6">
                              <h2 className="text-lg md:text-xl font-semibold text-slate-700 border-b w-fit border-gray-400">
                                {sub.title}
                              </h2>
                              <div className="grid grid-cols-1  md:grid-cols-3 xl:grid-cols-4  gap-6 text-start justify-items-center mt-6">
                                {sub.Menus?.map((mn, index) => (
                                  <Card
                                    menu={mn}
                                    key={index}
                                    onIncrement={() => handleUpdateCart(mn)}
                                  />
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
            {isModalOpen && (
              <CheckoutModal
                urlCode={urlCode}
                cartItems={pesanan}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
          <Footer />
          <div
            onClick={() => setIsModalOpen(true)}
            className={`${
              isModalOpen ? "hidden" : "" || pesanan.length > 0 ? "" : "hidden"
            } cursor-pointer fixed right-8 w-10 h-10 bottom-8`}
          >
            <img src="/img/keranjang.png" alt="" />
          </div>
        </div>
      )}
    </>
  );
}
