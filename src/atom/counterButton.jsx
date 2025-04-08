import { decrement, increment } from "@/store/slice";
import { useDispatch, useSelector } from "react-redux";

const CounterButton = ({ id_menu, onIncrement, checkoutModal }) => {
  const dispatch = useDispatch();
  const pesanan = useSelector((state) => state.counter.pesanan.find((p) => p.id_menu === id_menu));

  return (
    <div className="flex min-w-3 items-center justify-between gap-2 w-full">
      {!checkoutModal && <span className="hidden md:inline-block text-slate-700 font-medium">Total</span>}

      <div className="flex items-center justify-end md:justify-items-start gap-2 sm:gap-3">
        <button onClick={() => dispatch(decrement({ id_menu }))} className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-600 text-white rounded-full hover:bg-slate-700 transition">
          -
        </button>
        <span className="text-base sm:text-lg font-semibold text-black">{pesanan?.qty || 0}</span>
        <button
          onClick={() => {
            dispatch(increment({ id_menu }));
            if (onIncrement) onIncrement();
          }}
          className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-600 text-white rounded-full hover:bg-slate-700 transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CounterButton;
