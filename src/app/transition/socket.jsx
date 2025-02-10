"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const getSocket = (id_cafe) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (id_cafe) {
      socket.emit("joinCafe", id_cafe);
    }

    socket.on("newOrder", (order) => {
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    return () => {
      socket.off("newOrder");
    };
  }, [id_cafe]);

  return { socket, orders };
};

export default getSocket;
