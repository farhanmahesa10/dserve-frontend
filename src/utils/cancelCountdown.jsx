import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTransactions } from "@/store/slice";

const CancelButton = ({ transactionId, createdAt, status }) => {
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
  };

  const isCancelable = Date.now() - new Date(createdAt).getTime() < 60000 && status !== "failed";

  if (!isCancelable) return null;

  return (
    <button onClick={handleCancel} className={`${secondsLeft === 0 ? "hidden" : ""} mt-4 w-full py-2 text-center border-4 border-black rounded text-black text-base font-semibold`}>
      Cancel ( {secondsLeft} )
    </button>
  );
};

export default CancelButton;
