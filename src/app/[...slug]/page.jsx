"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";
import Header from "../component/header/header";
import Slider from "../component/slider/slider";
import Gallery from "../component/gallery/gallery";
import About from "../component/about/about";
import Contact from "../component/contact/contact";
import Error from "../component/error/error";

export default function Home() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [urlCode, setUrlCode] = useState();

  useEffect(() => {
    if (!params || !params.slug || params.slug.length < 2) {
      setError(true);
      return Error;
    }

    const lastTwoSegments = params.slug.slice(-2).join("/");
    setUrlCode(params.slug.slice(-2).join("/"));

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/table/checktablecode/${lastTwoSegments}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(true);
        console.error("Fetch error:", err);
      });
  }, [params]);

  if (error) {
    return <Error />;
  }

  return (
    <div className="bg-slate-50">
      <Header urlCode={urlCode} />
      <div className="pt-[1px] container p-0">
        <Slider />
        <div id="gallery" className="mt-10">
          <Gallery />
        </div>
        <div id="about" className="mt-10 scroll-smooth">
          <About />
        </div>
        <div id="contact" className="mt-10">
          <Contact />
        </div>
      </div>
    </div>
  );
}
