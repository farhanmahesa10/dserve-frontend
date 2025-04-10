import CounterButton from "@/atom/counterButton";
import { formatToRupiah } from "@/atom/formatRupiah";

const Card = ({ menu, onIncrement }) => {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:flex-row bg-white shadow rounded-xl border-2 overflow-hidden w-[300px] sm:w-full max-w-[700px] p-2 md:p-4">
      <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${menu.photo}`} alt={menu.title} className="md:w-full w-32 md:h-[200px] h-[100px] object-cover rounded-lg" />

      <div className="flex flex-col  justify-between mt-3 md:mt-0 flex-1">
        <div className="flex items-center md:text-center justify-between ">
          <h1 className="capitalize text-slate-800 font-semibold text-sm sm:text-lg md:text-base ">{menu.title}</h1>
          <p className="text-slate-700 text-sm md:text-base hidden md:block">{formatToRupiah(menu.price)}</p>
        </div>

        <div className="flex items-center gap-2  justify-between mt-3">
          <p className="text-slate-700 text-xs sm:text-sm  md:hidden">{formatToRupiah(menu.price)}</p>
          <CounterButton id_menu={menu.id} onIncrement={onIncrement} />
        </div>
      </div>
    </div>
  );
};

export default Card;
