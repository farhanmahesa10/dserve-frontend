import { useSelector, useDispatch } from "react-redux";
import CounterButtonCheckOut from "./counterButton";
import { increment } from "@/store/slice";
import Link from "next/link";
import { formatToRupiah } from "./formatRupiah";

const CheckoutModal = ({ onClose, urlCode }) => {
  const pesanan = useSelector((state) => state.counter.pesanan);
  const dispatch = useDispatch();

  const handleUpdateCart = (mn) => {
    dispatch(increment({ id_menu: mn.id_menu, title: mn.title, price: mn.price, qty: mn.qty || 1, total_price: mn.price * (mn.qty || 1) }));
  };

  const totalPrice = pesanan.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="fixed text-base sm:text-lg bottom-0 left-0 w-full bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h3 className=" sm:text-lg font-bold">Orders</h3>
        <button onClick={onClose} className="text-red-500">
          Close
        </button>
      </div>
      <ul className="mt-2">
        {pesanan.map((item) => (
          <li key={item.id_menu} className="flex justify-between items-center py-2 px-2">
            <div className="grid grid-cols-2 w-1/2 items-center gap-3">
              <span className="w-2/3 ">{item.title}</span>
              <div className="">
                <CounterButtonCheckOut checkoutModal="checkout" id_menu={item.id_menu} onIncrement={() => handleUpdateCart(item)} />
              </div>
            </div>
            <span className="text-right pr-4">{formatToRupiah(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-4 border-t pt-2">
        <h4 className="text-lg font-bold">Total</h4>
        <span className="text-xl  font-semibold text-blue-600">{formatToRupiah(totalPrice)}</span>
      </div>
      <Link href={`/checkout/${urlCode}`}>
        <button className="w-full bg-blue-600 text-white p-2 mt-4 rounded-md">Checkout</button>
      </Link>
    </div>
  );
};

export default CheckoutModal;
