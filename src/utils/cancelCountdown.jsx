import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal, resetPesanan, updateTransactions } from "@/store/slice";
import { toast } from "react-toastify";
import Link from "next/link";

const CancelButton = ({ transactionId, createdAt, status, redirect }) => {
  const dispatch = useDispatch();
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = 60000 - (Date.now() - new Date(createdAt).getTime());
      setSecondsLeft(Math.max(Math.floor(diff / 1000), 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const handleCancel = () => {
    dispatch(updateTransactions({ id: transactionId, status: "failed" }));
    dispatch(resetPesanan());
    dispatch(closeModal());
    toast.success("Successfully to cancel order");
  };

  const isCancelable =
    Date.now() - new Date(createdAt).getTime() < 60000 && status !== "failed";

  if (!isCancelable) return null;

  return (
    <>
      <Link href={`/menu/${redirect}`}>
        <button
          onClick={handleCancel}
          className={`${
            secondsLeft === 0 ? "hidden" : ""
          } mt-4 w-full p-2 text-center border-2  rounded   text-base font-semibold`}
        >
          You can cancel in ( {secondsLeft} )
        </button>
      </Link>
    </>
  );
};

export default CancelButton;
