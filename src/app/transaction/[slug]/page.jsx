"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

export default function ({ params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState([]);
  const [outlet, setOutlet] = useState([]);
  const { slug } = React.use(params);
  const router = useRouter();
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (slug) {
        try {
          // Mengambil data transaksi menggunakan axios dengan query params
          const response = await axios.get(
            ` ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/transaction/show/${slug}`
          );

          const data = response.data.transactions[0];
          setTransaction(data);
          setOutlet(response.data);
        } catch (error) {
          console.error("Error fetching transaction data:", error);
        }
      }
    };

    setIsLoading(false);

    fetchData();
  }, [slug]);
  //function mengubah angka menjadi IDR
  const formatIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleMenu = () => {
    router.push(`/menu`);
  };

  return (
    <div className="max-w-sm mx-auto p-6 mt-20 bg-white shadow-lg border rounded-lg font-mono text-sm">
      {/* Notifikasi Pesanan Berhasil */}
      <div className="flex items-center gap-2 mb-4">
        <IoCheckmarkDoneCircleSharp className="text-green-500 text-2xl" />
        <p className="text-green-500 font-semibold">Pesanan Berhasil</p>
      </div>

      {/* Garis Pembatas */}
      <div className="border-t border-dashed my-3"></div>

      {/* Detail Pesanan */}
      {transaction.orders &&
        transaction.orders.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between">
              <p>{item.menu.title}</p>
              <p>{formatIDR(item.total_price)}</p>
            </div>
            <p>
              {item.qty} x {formatIDR(item.menu.price)}
            </p>
          </div>
        ))}

      {/* Garis Pembatas */}
      <div className="border-t border-dashed my-3"></div>

      {/* Total Pembayaran */}
      <div className="flex justify-between font-bold text-lg">
        <p>Total</p>
        <p>{formatIDR(transaction.total_pay)}</p>
      </div>

      {/* Notifikasi Pembayaran */}
      <div className="flex justify-center mt-5 text-center">
        <p className="text-red-500 font-medium">
          Lakukan pembayaran di tempat sebesar{" "}
          <span className="font-bold">{formatIDR(transaction.total_pay)}</span>
        </p>
      </div>

      {/* Tombol Kembali ke Menu */}
      <button
        onClick={handleMenu}
        className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
      >
        Kembali ke Menu
      </button>
    </div>
  );
}
