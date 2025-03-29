"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import Error from "@/app/component/error/error";
import { removeItem, resetPesanan } from "@/store/slice";
import { io } from "socket.io-client";
import { formatToRupiah } from "@/atom/formatRupiah";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default function Checkout() {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState(null);
  const [byName, setByName] = useState("");
  const params = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [urlCode, setUrlCode] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const pesanan = useSelector((state) => state.counter.pesanan);

  useEffect(() => {
    if (!params?.slug?.length || params.slug.length < 2) {
      setError(true);
      return;
    }

    const lastTwoSegments = params.slug.slice(-2).join("/");
    setUrlCode(lastTwoSegments);

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/table/checktablecode/${lastTwoSegments}`)
      .then((response) => {
        if (response.data?.data) {
          setData(response.data.data);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        setError(true);
        console.error("Fetch error:", err);
      });
  }, [params.slug]);

  useEffect(() => {
    if (!data?.id) return;

    socket.emit("joinCafe", data.id);
    console.log(`Bergabung ke cafe_${data.id}`);

    return () => {
      socket.off("joinCafe");
    };
  }, [data?.id]);

  if (error) return <Error />;

  const totalPrice = pesanan.reduce((acc, item) => acc + item.price * item.qty, 0);

  const createTransaction = async () => {
    try {
      if (!data?.Tables?.[0]?.id) {
        alert("Table data is missing!");
        return null;
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/create`, {
        id_outlet: data.id,
        id_table: data.Tables[0].id,
        status: "not pay",
        pays_method: "cash",
        by_name: byName.trim() || "Guest",
        comment: comment.trim() || null,
        note: "please pay at the cashier",
      });

      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      setLoading(false);
      return null;
    }
  };

  const sendOrder = async () => {
    if (!data?.id) {
      alert("Enter your ID!");
      return;
    }

    setLoading(true);
    const newTransaction = await createTransaction();

    if (!newTransaction) {
      alert("Failed to create transaction!");
      setLoading(false);
      return;
    }

    socket.emit(
      "order",
      {
        id_outlet: data.id,
        id_transaction: newTransaction.data.id,
        orderData: pesanan,
      },
      (serverResponse) => {
        console.log("Response dari server:", serverResponse);
        setResult(serverResponse);
        setLoading(false);
      }
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-12 lg:px-20 min-h-screen flex flex-col">
      <h1 className="text-2xl text-center font-bold text-slate-700 mt-6">Checkout</h1>

      {pesanan.length === 0 ? (
        <p className="text-slate-500 mt-4">Keranjang kosong.</p>
      ) : (
        <div className="mt-6">
          {pesanan.map((item) => (
            <div key={item.id_menu} className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-sm text-slate-500">
                  {item.qty} x {formatToRupiah(item.price)}
                </p>
              </div>
              <button onClick={() => dispatch(removeItem(item.id_menu))} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold">Total Price:</h2>
        <p className="text-2xl font-bold">{formatToRupiah(totalPrice)}</p>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">Comment</label>
        <input type="text" className="border-2 w-full p-2 rounded" placeholder="Extra sauce, etc." value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium">By Name</label>
        <input type="text" className="border-2 w-full p-2 rounded" value={byName} onChange={(e) => setByName(e.target.value)} />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Payment Method</h2>
        <p>please pay at the cashier</p>
      </div>

      <button onClick={sendOrder} disabled={loading} className="mt-6 bg-blue-500 text-white py-2 px-4 rounded w-full">
        {loading ? "Processing..." : "Confirm & Pay"}
      </button>

      <Link href={`/menu/${urlCode}`} className="mt-4 text-blue-500 text-center">
        Back To Menu
      </Link>

      {result?.data?.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold">{result.message}!</h2>
            <p className="mt-2 text-gray-600">Please pay at cashier.</p>
            <Link href={`/menu/${urlCode}`}>
              <button
                onClick={() => {
                  setResult(null), dispatch(resetPesanan());
                }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                OK
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
