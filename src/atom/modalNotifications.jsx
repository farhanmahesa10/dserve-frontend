import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { formatToRupiah } from "./formatRupiah";
import { checkAndfetchTransactions } from "@/utils/checkTransactions";
import CancelButton from "@/utils/cancelCountdown";
import { useParams } from "next/navigation";
import { FaTimesCircle } from "react-icons/fa";

const ModalNotification = ({ onClose }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const [urlCode, setUrlCode] = useState();
  const { transactions } = useSelector((state) => state.counter);
  useEffect(() => {
    if (!params?.slug?.length || params.slug.length < 2) {
      console.log(error);
      true;
      return;
    }

    const lastTwoSegments = params.slug.slice(-2).join("/");
    setUrlCode(lastTwoSegments);
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

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="fixed z-50 h-screen top-0 left-0 w-full bg-slate-50 shadow-md p-4 overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="text-lg font-bold text-slate-700">Orders Not Pay Yet</h3>
        <button onClick={onClose} className="text-red-500 font-medium">
          <FaTimesCircle />
        </button>
      </div>

      {sortedTransactions.length === 0 ? (
        <p className="text-center text-slate-500">Nothing orders yet.</p>
      ) : (
        sortedTransactions.map((trx, index) => {
          return (
            <div
              key={trx.id || index}
              className="mb-6 border border-gray-300 p-4 rounded bg-white"
            >
              <h4 className="text-sm text-slate-500 mb-2 flex justify-between">
                <span>
                  Transaksi #{trx.id} - {trx.by_name}
                </span>{" "}
                <span className="bg-green-500 ml-2 pb-1 px-2 rounded-sm text-white capitalize">
                  {trx.status}
                </span>
              </h4>
              {trx.Orders?.map((order, subIndex) => (
                <div
                  key={order.id || subIndex}
                  className="mb-3 border-t pt-2 border-gray-200"
                >
                  {order.Menu ? (
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-left">
                        <h5 className="font-semibold text-slate-700">
                          {order.Menu.title}
                        </h5>
                        <p className="text-slate-500">
                          {order.qty} x {formatToRupiah(order.Menu.price)}
                        </p>
                      </div>
                      <span className="text-slate-700 font-medium">
                        {formatToRupiah(order.Menu.price * (order.qty || 1))}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">Menu tidak ditemukan</p>
                  )}
                </div>
              ))}
              {/* <p className="text-sm my-3">
                Status:{" "}
                <span className="bg-green-500 ml-2 pb-1 px-2 rounded-sm text-white capitalize">
                  {trx.status}
                </span>
              </p> */}
              {/* <p className="text-sm">By Name: {trx.by_name}</p> */}
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <h4 className="text-lg font-bold text-slate-700">Total</h4>
                <span className="text-xl font-semibold text-blue-600">
                  {formatToRupiah(getTotalHarga(trx.Orders))}
                </span>
              </div>

              <CancelButton
                redirect={urlCode}
                transactionId={trx.id}
                createdAt={trx.createdAt}
                status={trx.status}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default ModalNotification;
