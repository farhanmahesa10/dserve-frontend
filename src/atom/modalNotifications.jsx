import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { formatToRupiah } from "./formatRupiah";
import { checkAndfetchTransactions } from "@/utils/checkTransactions";
import { updateTransactions } from "@/store/slice";

const ModalNotification = ({ onClose }) => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.counter);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(checkAndfetchTransactions());
  }, [dispatch]);

  const getTotalHarga = (orders) => {
    let total = 0;
    orders?.forEach((order) => {
      if (order.Menu) {
        total += (order.qty || 1) * order.Menu.price;
      }
    });
    return total;
  };

  return (
    <div className="fixed z-50 h-screen top-0 left-0 w-full bg-white shadow-md p-4 overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="text-lg font-bold text-slate-700">Orders Not Pay Yet</h3>
        <button onClick={onClose} className="text-red-500 font-medium">
          Close
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-center text-slate-500">Nothing orders yet.</p>
      ) : (
        transactions.map((trx, index) => (
          <div key={trx.id || index} className="mb-6 border-2 p-4">
            <h4 className="text-sm text-slate-500 mb-2">Transaksi #{trx.id}</h4>
            {trx.Orders?.map((order, subIndex) => (
              <div key={order.id || subIndex} className="mb-3">
                {order.Menu ? (
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-left">
                      <h5 className="font-semibold text-slate-700">{order.Menu.title}</h5>
                      <p className="text-slate-500">
                        {order.qty} x {formatToRupiah(order.Menu.price)}
                      </p>
                    </div>
                    <span className="text-slate-700 font-medium">{formatToRupiah(order.Menu.price * (order.qty || 1))}</span>
                  </div>
                ) : (
                  <p className="text-sm text-red-500">Menu tidak ditemukan</p>
                )}
              </div>
            ))}
            <p className="text-sm  my-3">
              Status: <span className="bg-red-500 p-1 rounded text-white capitalize"> {trx.status}</span>
            </p>
            <p className="text-sm ">By Name: {trx.by_name}</p>
            {Date.now() - new Date(trx.createdAt).getTime() < 60000 && trx.status !== "failed" && (
              <button onClick={() => dispatch(updateTransactions({ id: trx.id, status: "failed" }))} className="mt-2 px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Cancel
              </button>
            )}

            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <h4 className="text-lg font-bold text-slate-700">Total</h4>
              <span className="text-xl font-semibold text-blue-600">{formatToRupiah(getTotalHarga(trx.Orders))}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ModalNotification;
