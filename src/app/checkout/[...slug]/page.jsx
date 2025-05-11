"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import Error from "@/app/component/error/error";
import { increment, openModal, removeItem, resetPesanan } from "@/store/slice";
import { formatToRupiah } from "@/atom/formatRupiah";
import socket from "@/lib/socket";
import CheckoutForm from "@/utils/checkoutForm";
import CounterButton from "@/atom/counterButton";
import CancelButton from "@/utils/cancelCountdown";
import { toast } from "react-toastify";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function Checkout() {
  const [result, setResult] = useState(null);
  const [data, setData] = useState(null);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(false);
  const [urlCode, setUrlCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const dispatch = useDispatch();
  const pesanan = useSelector((state) => state.counter.pesanan);

  const params = useParams();

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
          setRoom(response.data.data.Tables[0].number_table);
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
    return () => socket.off("joinCafe");
  }, [data?.id]);

  useEffect(() => {
    socket.on("newOrder", (data) => console.log("newOrder:", data));
    return () => socket.off("newOrder");
  }, []);

  const totalPrice = pesanan.reduce((acc, item) => acc + item.price * item.qty, 0);

  const createTransaction = async (byName, comment) => {
    try {
      if (!data?.Tables?.[0]?.id) {
        alert("Table data is missing!");
        return null;
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/create`, {
        id_outlet: data.id,
        id_table: data.Tables[0].id,
        status: "active",
        pays_method: "cash",
        by_name: byName || "Guest",
        comment: comment || null,
        note: "please pay at the cashier",
        total_pay: totalPrice,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      setLoading(false);
      return null;
    }
  };

  const sendOrder = async (values) => {
    const [segment1, segment2] = urlCode.split("/");
    if (!data?.id || !data?.Tables?.[0]?.number_table) {
      return;
    }

    if (!pesanan.length) {
      toast.error("Keranjang masih kosong!");
      return;
    }

    try {
      setLoading(true);
      const newTransaction = await createTransaction(values.byName, values.comment);
      if (!newTransaction?.data?.id) {
        toast.error("Gagal membuat transaksi!");
        return;
      }
      setTransaction(newTransaction.data);

      const payload = {
        id_outlet: data.id,
        number_table: data.Tables[0].number_table,
        outletCode: segment1,
        roomCode: segment2,
        outlet_name: data.outlet_name,
        by_name: values.byName,
        id_transaction: newTransaction.data.id,
        total_pay: totalPrice,
        status: "active",
        orderData: pesanan.map((item) => ({
          id_menu: item.id_menu,
          title: item.title,
          price: item.price,
          qty: item.qty,
          total_price: item.qty * item.price,
        })),
      };

      socket.emit("joinCafe", data.id);
      socket.emit("order", payload, (serverResponse) => {
        setResult(serverResponse);
      });
    } catch (error) {
      console.error("Error while sending order:", error);
      alert("Terjadi kesalahan saat mengirim pesanan.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCart = (mn) => {
    dispatch(
      increment({
        ...mn,
        id_menu: mn.id_menu,
        title: mn.title,
        price: mn.price,
        qty: mn.qty || 1,
        total_price: mn.price * (mn.qty || 1),
      })
    );
  };

  if (error) return <Error />;
  return (
    <div className="bg-slate-50 pb-20">
      <div className="flex justify-between items-center ">
        <div className="px-2 w-full">
          <Link href={`/menu/${urlCode}`} className="mt-4  text-center flex items-center gap-2 clickable whitespace-nowrap">
            <FaArrowLeftLong className="mt-[1px]" /> <span className="hidden sm:block">Back to menu</span>
          </Link>
        </div>
        <h1 className="text-2xl text-center font-bold text-slate-700 pt-6 w-full ">
          <span className="border-b border-gray-300">Checkout</span>
        </h1>
        <div className="w-full"></div>
      </div>
      <div className="w-full  grid grid-cols-1 md:grid-cols-6  px-2 ">
        <div className="container  flex flex-col  md:col-span-4  ">
          {pesanan.length === 0 ? (
            <p className="text-slate-500 mt-4">Keranjang kosong.</p>
          ) : (
            <div className="mt-6  flex flex-col gap-8">
              {[...pesanan].reverse().map((item) => (
                <div key={item.id_menu} className="flex  gap-4 bg-white p-2 shadow-md">
                  <div className="flex-shrink-0 flex-grow-0">
                    <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${item.photo}`} alt={item.title} className="  aspect-video h-[100px]  object-cover rounded-[4px] md:rounded-bl-none md:rounded-br-none" />
                  </div>
                  <div className="flex flex-col justify-between w-full">
                    <div className="">
                      <h2 className="font-semibold text-lg">{item.title}</h2>
                      <p className="text-sm text-slate-500 line-clamp-2 lg:line-clamp-5">{item.details}</p>
                    </div>
                    <div className=" flex justify-between mt-2">
                      <p className="text-sm font-bold">{formatToRupiah(item.price)}</p>
                      <div>
                        <CounterButton checkoutModal="checkout" id_menu={item.id_menu} onIncrement={() => handleUpdateCart(item)} />
                      </div>
                    </div>
                  </div>
                  {/* <button
                  onClick={() => dispatch(removeItem(item.id_menu))}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button> */}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2 shadow-md bg-white p-4 h-fit mt-6 sticky top-20">
          <div className="   rounded-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">Total Price:</h2>
            <p className="text-lg font-bold">{formatToRupiah(totalPrice)}</p>
          </div>
          <div className="">
            <CheckoutForm onSubmit={sendOrder} isLoading={loading} />
          </div>

          <div className="text-center mt-2">
            <Link href={`/menu/${urlCode}`} className="mt-4 text-yellow-700 text-center">
              Back To Menu
            </Link>
          </div>
        </div>
      </div>
      {result?.success && (
        <div className="bg-black bg-opacity-50 fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-start">{result.message}!</h2>
            <p className="mt-2 text-gray-600">Order has been successfully created, we will send your order to your room.</p>
            <div className="flex gap-2 justify-end">
              {transaction?.id && transaction?.createdAt && transaction?.status === "active" && (
                <CancelButton redirect={urlCode} transaction={transaction} transactionId={transaction.id} createdAt={transaction.createdAt} room={room} status={transaction.status} />
              )}
              <Link href={`/menu/${urlCode}`}>
                <button
                  onClick={() => {
                    setResult(null);
                    dispatch(resetPesanan());
                    dispatch(openModal());
                  }}
                  className="mt-4 bg-yellow-700 px-7 text-white py-2 rounded"
                >
                  OK
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
