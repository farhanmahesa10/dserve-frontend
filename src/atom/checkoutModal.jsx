import { useSelector, useDispatch } from "react-redux";
import CounterButtonCheckOut from "./counterButton";
import { increment } from "@/store/slice";
import Link from "next/link";
import { formatToRupiah } from "./formatRupiah";
import { FaTimesCircle } from "react-icons/fa";
const CheckoutModal = ({ onClose, urlCode }) => {
  const pesanan = useSelector((state) => state.counter.pesanan);
  const dispatch = useDispatch();

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

  const totalPrice = pesanan.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  return (
    <div className="fixed shadow-sm-reverse text-base sm:text-lg bottom-0 left-0 w-full bg-white p-4">
      <div className="flex justify-between items-center border-b border-gray-300 pb-2">
        <h3 className=" sm:text-lg font-bold ">Your Orders</h3>
        <button onClick={onClose} className="text-red-500 clickable">
          <FaTimesCircle />
        </button>
      </div>
      <ul className="mt-2 max-h-[20vh] overflow-auto">
        {[...pesanan].reverse().map((item) => (
          <li
            key={item.id_menu}
            className="flex justify-between items-center py-2 px-2 border-b border-gray-200"
          >
            <div className="grid sm:grid-cols-2  items-center md:gap-3 w-full">
              <span className="w-2/3 text-md">{item.title}</span>
              <span className="pr-4 text-xs font-semibold mt-1">
                {formatToRupiah(item.price * item.qty)}
              </span>
            </div>
            <div className="pe-2">
              <CounterButtonCheckOut
                checkoutModal="checkout"
                id_menu={item.id_menu}
                onIncrement={() => handleUpdateCart(item)}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-4 border-t pt-2">
        <h4 className="text-lg font-bold">Total</h4>
        <span className="text-xl  font-semibold text-yellow-700">
          {formatToRupiah(totalPrice)}
        </span>
      </div>
      <Link href={`/checkout/${urlCode}`}>
        <button className="w-full bg-yellow-700 text-white p-2 mt-4 rounded-md">
          Checkout
        </button>
      </Link>
    </div>
  );
};

export default CheckoutModal;
