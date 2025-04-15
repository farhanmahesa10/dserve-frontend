"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import Error from "@/app/component/error/error";
import { increment, removeItem, resetPesanan } from "@/store/slice";
import { formatToRupiah } from "@/atom/formatRupiah";
import socket from "@/lib/socket";
import CheckoutForm from "@/utils/checkoutForm";
import CounterButton from "@/atom/counterButton";

export default function Checkout() {
  const [result, setResult] = useState(null);
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

  const createTransaction = async (byName, comment) => {
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
    if (!data?.id || !data?.Tables?.[0]?.number_table) {
      alert("Data table tidak lengkap!");
      return;
    }

    if (!pesanan.length) {
      alert("Keranjang masih kosong!");
      return;
    }

    try {
      setLoading(true);
      const newTransaction = await createTransaction(values.byName, values.comment);

      if (!newTransaction?.data?.id) {
        alert("Gagal membuat transaksi!");
        return;
      }

      const payload = {
        id_outlet: data.id,
        outlet_name: data.outlet_name,
        by_name: values.byName,
        id_transaction: newTransaction.data.id,
        total_pay: totalPrice,
        status: "not pay",
        orderData: pesanan.map((item) => ({
          id_menu: item.id_menu,
          title: item.title,
          price: item.price,
          qty: item.qty,
          total_price: item.qty * item.price,
        })),
      };

      socket.emit("order", payload, (serverResponse) => {
        console.log("Response dari server:", serverResponse);
        setResult(serverResponse);
      });
    } catch (error) {
      console.error("Error while sending order:", error);
      alert("Terjadi kesalahan saat mengirim pesanan.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Listener saat socket menerima data
    socket.on("newOrder", (data) => {
      console.log("newOrder:", data);
      // dispatch ke Redux jika perlu
    });

    // Cleanup listener saat komponen unmount
    return () => {
      socket.off("newOrder");
    };
  }, []);
  // const sendOrder = async (values) => {
  //   if (!data?.id) {
  //     alert("Enter your ID!");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const newTransaction = await createTransaction(values.byName, values.comment);

  //     if (!newTransaction) {
  //       alert("Failed to create transaction!");
  //       return;
  //     }

  //     socket.emit(
  //       "order",
  //       {
  //         id_outlet: data.id,
  //         id_transaction: newTransaction.data.id,
  //         orderData: pesanan,
  //         dataTransaction: id_transaction, outlet_name, by_name, number_table, menu.title , total_price, menu.price, total_pay, status
  //       },
  //       (serverResponse) => {
  //         console.log("Response dari server:", serverResponse);
  //         setResult(serverResponse);
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error while sending order:", error);
  //     alert("Something went wrong while sending your order.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleUpdateCart = (mn) => {
    dispatch(increment({ id_menu: mn.id_menu, title: mn.title, price: mn.price, qty: mn.qty || 1, total_price: mn.price * (mn.qty || 1) }));
  };

  return (
    <div className="container mx-auto px-4 md:px-12 lg:px-20 min-h-screen flex flex-col">
      <h1 className="text-2xl text-center font-bold text-slate-700 mt-6">Checkout</h1>

      {pesanan.length === 0 ? (
        <p className="text-slate-500 mt-4">Keranjang kosong.</p>
      ) : (
        <div className="mt-6">
          {pesanan.map((item) => (
            <div key={item.id_menu} className="flex border-2 gap-8 justify-between items-center p-4 border-b">
              <div>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-sm text-slate-500">
                  {item.qty} x {formatToRupiah(item.price)}
                </p>
              </div>
              <CounterButton checkoutModal="checkout" id_menu={item.id_menu} onIncrement={() => handleUpdateCart(item)} />
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

      <CheckoutForm onSubmit={sendOrder} isLoading={loading} />

      <Link href={`/menu/${urlCode}`} className="mt-4 text-blue-500 text-center">
        Back To Menu
      </Link>

      {result && result.success && (
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
