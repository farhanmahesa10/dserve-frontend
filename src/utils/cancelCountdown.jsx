import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal, resetPesanan, updateTransactions } from "@/store/slice";
import { toast } from "react-toastify";
import Link from "next/link";
import socket from "@/lib/socket";

const CancelButton = ({ room, transaction, totalPrice, order, transactionId, createdAt, status, redirect }) => {
  const dispatch = useDispatch();
  const [secondsLeft, setSecondsLeft] = useState(60);

  if (!transaction) return null;

  let segment1 = "";
  let segment2 = "";

  if (redirect) {
    [segment1, segment2] = redirect.split("/");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const timeDiff = Date.now() - new Date(createdAt).getTime();
      const diff = 60000 - timeDiff;
      setSecondsLeft(Math.max(Math.floor(diff / 1000), 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const handleCancel = () => {
    if (order) {
      const ordered = JSON.stringify(order.orderData);
      const payload = {
        id: transactionId,
        id_outlet: transaction.id_outlet,
        outletCode: segment1,
        outlet_name: order.outlet_name,
        by_name: transaction.byName,
        total_pay: totalPrice,
        status: "failed",
        createdAt: new Date(),
        Table: {
          table_code: segment2,
          number_table: room,
        },
        Orders: ordered,
      };

      socket.emit("joinCafe", transaction.id_outlet);
      socket.emit("cancelOrderByUser", { payload }, (response) => {
        if (response.status === "success") {
          toast.success("Successfully canceled order");
          localStorage.removeItem("lastOrderData");
          dispatch(updateTransactions({ redirect, id: transactionId, status: "failed" }));
          dispatch(resetPesanan());
          dispatch(closeModal());
        } else {
          toast.error("Order cancellation failed");
        }
      });
    }
    dispatch(resetPesanan());
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
