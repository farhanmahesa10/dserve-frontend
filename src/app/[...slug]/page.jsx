"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "../component/header/header";
import Slider from "../component/slider/slider";
import Gallery from "../component/gallery/gallery";
import About from "../component/about/about";
import Contact from "../component/contact/contact";
import Error from "../component/error/error";
import { setOutletCode } from "@/store/slice";
import { useDispatch } from "react-redux";
import { SkeletonAbout, SkeletonContact, SkeletonGallery, SkeletonHeader, SkeletonSlider } from "../component/skeleton/homeSkeleton";

export default function Home() {
  const params = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [urlCode, setUrlCode] = useState();
  const [code, setCode] = useState();

  useEffect(() => {
    if (!params || !params.slug || params.slug.length < 2) {
      setError(true);
      return Error;
    }
    const lastTwoSegments = params.slug.slice(-2).join("/");

    setUrlCode(params.slug.slice(-2).join("/"));
    setCode(params.slug[0]);

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/table/checktablecode/${lastTwoSegments}`)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((err) => {
        setError(true);
        console.error("Fetch error:", err);
      });
  }, [params]);

  useEffect(() => {
    if (code) {
      dispatch(setOutletCode(code));
    }
  }, [code]);

  if (error) {
    return <Error />;
  }

  return (
    <div className="bg-slate-50">
      {code ? <Header urlCode={urlCode} outletCode={code} /> : <SkeletonHeader />}
      <div className="pt-[1px] container p-0">
        {code ? <Slider outletCode={code} /> : <SkeletonSlider />}
        <div id="gallery" className="mt-10">
          {code ? <Gallery outletCode={code} /> : <SkeletonGallery />}
        </div>
        <div id="about" className="mt-10 scroll-smooth">
          {code ? <About outletCode={code} /> : <SkeletonAbout />}
        </div>
        <div id="contact" className="mt-10">
          {code ? <Contact outletCode={code} /> : <SkeletonContact />}
        </div>
      </div>
    </div>
  );
}
