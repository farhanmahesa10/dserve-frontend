"use client";

import { decrement, increment, resetPesanan } from "@/store/slice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});
export default function Transition() {
  const [transition, setTransition] = useState({
    id_table: "",
    by_name: "",
    number_table: "",
    status: "not yet paid",
    pays_method: "cashier",
    total_pay: "",
    note: "",
  });
  const [table, setTable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const dispatch = useDispatch();
  const pesanan = useSelector((state) => state.counter.pesanan);
  const dataOutlet = useSelector((state) => state.counter.outlet);
  const router = useRouter();

  // Mengambil data transaksi menggunakan axios dengan query params
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (dataOutlet[0].outlet_name) {
        try {
          const response = await axios.get(
            ` ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/table/showcafename/${dataOutlet[0].outlet_name}`
          );

          const data = response.data;
          setTable(data);
        } catch (error) {
          console.error("Error fetching transaction data:", error);
        }
      }
    };

    setIsLoading(false);

    fetchData();
  }, [dataOutlet[0].outlet_name]);

  useEffect(() => {
    if (pesanan.length === 0) {
      router.push(`/menu`);
    }
  }, [pesanan, router]);

  // Handle Checkout dengan Socket.io
  const handleCheckOut = async () => {
    if (!transition.id_table) {
      toast.error("please fill in the ");
      setLoadingButton(false);
      return;
    }
    if (!transition.by_name) {
      toast.error("please fill in the name");
      setLoadingButton(false);
      return;
    }
    setLoadingButton(true);
    try {
      const total = pesanan.reduce(
        (acc, item) => acc + item.qty * item.price,
        0
      );

      const dataCreateTransaksi = {
        id_table: dataOutlet[0].id,
        id_outlet: dataOutlet[0].id,
        by_name: transition.by_name,
        status: "not yet paid",
        pays_method: "cashier",
        total_pay: total,
        note: transition.note,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/transaction/create`,
        dataCreateTransaksi
      );

      const transaksiId = response.data.data.id;
      if (!transaksiId) {
        console.error("transaksi_id tidak tersedia");
        return;
      }

      const dataTransaksi = {
        id_transaction: transaksiId,
        outlet: dataOutlet[0],
        by_name: transition.by_name,
        table: {
          number_table: transition.number_table,
        },
        updatedAt: response.data.data.updatedAt,
        status: "not yet paid",
        pays_method: "cashier",
        total_pay: total,
        note: transition.note,
        orders: pesanan.map((item) => ({
          id_transaction: transaksiId,
          id_menu: item.id,
          menu: {
            title: item.title,
            price: item.price,
          },
          qty: item.qty,
          total_price: item.price * item.qty,
        })),
      };

      socket.emit("order", {
        id_outlet: dataOutlet[0].id,
        orderData: dataTransaksi,
      });

      await dispatch(resetPesanan());
      router.push(`/transaction/${transaksiId}`);
    } catch (error) {
      console.error("Error saat mengirim pesanan:", error);
      setLoadingButton(false);
    }
  };

  // Handler untuk perubahan nilai input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransition((transition) => ({
      ...transition,
      [name]: value,
    }));
  };

  //function mengubah angka menjadi IDR
  const formatIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="container p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-center text-xl font-bold mb-4">Rincian Pesanan</h1>

      {pesanan.length > 0 ? (
        pesanan.map((item) => (
          <div key={item.id} className="mb-4 p-4 border rounded-xl shadow-md">
            <div>
              {/* Nama Produk & Harga */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <h2 className="text-lg font-semibold text-green-600">
                  {formatIDR(item.price * item.qty)}
                </h2>
              </div>

              {/* Tombol Tambah & Kurang */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Qty</span>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => dispatch(decrement({ id: item.id }))}
                    className="px-3 py-1 border rounded-lg hover:bg-red-500 hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.qty}</span>
                  <button
                    onClick={() => dispatch(increment({ id: item.id }))}
                    className="px-3 py-1 border rounded-lg hover:bg-primary50 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Tidak ada pesanan</p>
      )}

      {/* Pilih Meja */}
      <div className="p-4 ">
        <div className="flex gap-4 ">
          <label htmlFor="id_table" className="min-w-20 font-medium">
            No. Table/ Room:
          </label>
          <select
            className="border p-2 rounded-lg border-gray-300 w-52 h-10"
            id="id_table"
            name="id_table"
            value={transition.id_table}
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              setTransition({
                ...transition,
                id_table: e.target.value,
                number_table: selectedOption.dataset.number, // Ambil number_table dari data-number
              });
            }}
          >
            <option value="" disabled>
              Select Table/Room Number
            </option>
            {table.map((value) => (
              <option
                key={value.id}
                value={value.id}
                data-number={value.number_table}
              >
                {value.number_table}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* nama */}
      <div className="p-4 ">
        <div>
          <div className="flex items-center gap-4">
            <label htmlFor="by_name" className="min-w-20 font-medium">
              nama:
            </label>
            <input
              type="text"
              placeholder="By name"
              name="by_name"
              value={transition.by_name}
              onChange={handleChange}
              className="border rounded-md p-2 w-full shadow-inner focus:outline-primary100"
              required
            />
          </div>
        </div>
      </div>

      {/* Catatan */}
      <div className="p-4 ">
        <div className="flex items-center gap-4">
          <label htmlFor="note" className="min-w-20 font-medium">
            Catatan:
          </label>
          <input
            type="text"
            placeholder="catatan"
            name="note"
            value={transition.note}
            onChange={handleChange}
            className="border rounded-md p-2 w-full shadow-inner focus:outline-primary100"
          />
        </div>
      </div>

      {/* Total Pembayaran */}
      <div className="p-4  bg-gray-100 mb-28">
        <div className="flex justify-between font-semibold text-lg">
          <h1>Total Pembayaran</h1>
          <h2 className="text-green-600">
            {formatIDR(
              pesanan.reduce((total, item) => total + item.qty * item.price, 0)
            )}
          </h2>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-300 shadow-lg p-4 z-50">
        <div className="container flex justify-center bg-primary50 rounded-lg">
          <button
            onClick={handleCheckOut}
            disabled={loadingButton}
            className="w-full py-3 text-lg text-white"
          >
            {loadingButton ? "Loading..." : "Pesan Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}
