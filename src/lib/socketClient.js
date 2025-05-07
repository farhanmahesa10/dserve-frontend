"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "./socket";

export const SocketClient = () => {
  const { outlets } = useSelector((state) => state.counter);
  const id = outlets?.id;

  useEffect(() => {
    if (!id) return;

    socket.emit("joinOutlet", id);

    socket.on("orderFinished", (data) => {
      toast.success(`${data.message}: ${data.orderDetails?.by_name || "?"}`);
    });

    socket.on("orderCanceled", (data) => {
      toast.warn(`${data.message}: ${data.orderDetails?.by_name || "?"}`);
    });

    return () => {
      socket.off("orderFinished");
      socket.off("orderCanceled");
    };
  }, [id]);

  return null;
};
