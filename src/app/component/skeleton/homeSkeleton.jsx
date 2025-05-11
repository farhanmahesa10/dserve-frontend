"use client";

import React, { useEffect } from "react";
import "nprogress/nprogress.css";

export function SkeletonHeader() {
  return (
    <div className="animate-pulse bg-white p-4 shadow">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/4" />
    </div>
  );
}

export function SkeletonSlider() {
  return <div className="animate-pulse bg-gray-200 h-64 rounded-md w-full" />;
}

export function SkeletonGallery() {
  return (
    <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-300 h-32 rounded" />
      ))}
    </div>
  );
}

export function SkeletonAbout() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 w-1/2 rounded" />
      <div className="h-4 bg-gray-200 w-3/4 rounded" />
      <div className="h-4 bg-gray-200 w-2/3 rounded" />
    </div>
  );
}

export function SkeletonContact() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-6 bg-gray-300 w-1/4 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="flex">
      <div className="w-full rounded-lg shadow-md h-40 bg-gray-200 animate-pulse"></div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="flex">
      <div className="w-full rounded-lg shadow-md h-80 bg-gray-200 animate-pulse"></div>
    </div>
  );
}
