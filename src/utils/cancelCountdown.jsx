import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal, resetPesanan, updateTransactions } from "@/store/slice";
import { toast } from "react-toastify";
import Link from "next/link";
import socket from "@/lib/socket";

const CancelButton = ({ room, transaction, transactionId, createdAt, status, redirect }) => {
  const dispatch = useDispatch();
  const [secondsLeft, setSecondsLeft] = useState(60);

  if (!transaction || !transaction.id_outlet) return null;

  let segment1 = "";
  let segment2 = "";

  if (redirect) {
    [segment1, segment2] = redirect.split("/");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = 60000 - (Date.now() - new Date(createdAt).getTime());
      setSecondsLeft(Math.max(Math.floor(diff / 1000), 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const handleCancel = () => {
    socket.emit("joinCafe", transaction.id_outlet);
    socket.emit(
      "cancelOrderByUser",
      {
        roomCode: segment2,
        outletCode: segment1,
        status: "failed",
        date: new Date(),
        number_table: room,
      },
      (response) => {
        if (response.status === "success") {
          toast.success("Successfully canceled order");
          dispatch(updateTransactions({ redirect, id: transactionId, status: "failed" }));
          dispatch(resetPesanan());
          dispatch(closeModal());
        } else {
          toast.error("Order cancellation failed");
        }
      }
    );
    socket.on("AdminReceiveCanceled", (response) => {
      if (response.status === "success") {
        localStorage.setItem("cancelOrder", response.data);
      }
    });
  };

  const isCancelable = Date.now() - new Date(createdAt).getTime() < 60000 && status !== "failed";

  if (!isCancelable) return null;

  return (
    <Link href={`/menu/${redirect}`}>
      <button onClick={handleCancel} className={`mt-4 w-full p-2 text-center border-2 rounded text-base font-semibold ${secondsLeft === 0 ? "hidden" : ""}`}>
        You can cancel in ({secondsLeft}s)
      </button>
    </Link>
  );
};

export default CancelButton;
