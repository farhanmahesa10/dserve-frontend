import { decrement, increment } from "@/store/slice";
import { useDispatch, useSelector } from "react-redux";

const CounterButton = ({ id_menu, onIncrement, checkoutModal }) => {
  const dispatch = useDispatch();
  const pesanan = useSelector((state) => state.counter.pesanan.find((p) => p.id_menu === id_menu));

  return (
    <div className="flex items-center gap-3 justify-between   ">
      <span className={`text-slate-700 font-medium ${checkoutModal ? "hidden" : ""}`}>Total</span>
      <div className="flex gap-4">
        <button onClick={() => dispatch(decrement({ id_menu }))} className="w-8 h-8 flex focus:border-red-500  items-center justify-center bg-slate-600  rounded-full hover:bg-slate-700 transition">
          -
        </button>
        <span className="text-lg font-semibold">{pesanan?.qty || 0}</span>
        <button
          onClick={() => {
            dispatch(increment({ id_menu }));
            if (onIncrement) onIncrement();
          }}
          className="w-8 h-8 flex  items-center justify-center bg-slate-600  rounded-full hover:bg-slate-700 transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CounterButton;
