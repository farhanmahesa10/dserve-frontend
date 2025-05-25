import CounterButton from "@/atom/counterButton";
import { formatToRupiah } from "@/atom/formatRupiah";

const Card = ({ menu, onIncrement }) => {
  return (
    <div className="bg-white shadow-md rounded-md  p-2 flex gap-2 md:flex-col w-full">
      <div className="flex-shrink-0">
        <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${menu.photo}`} alt={menu.title} className="md:w-full w-32 md:h-[200px] h-[100px] object-cover rounded-[4px] md:rounded-bl-none md:rounded-br-none" />
      </div>
      <div className="flex justify-between flex-col">
        <div className=" ">
          <div>
            <h1 className="capitalize text-slate-800 font-semibold text-sm sm:text-lg md:text-base ">{menu.title}</h1>
            <p className="text-slate-700 line-clamp-2 text-xs md:py-1   " title={menu.details}>
              {menu.details}
            </p>
          </div>
        </div>
        <div className="flex justify-between pe-2  items-center w-full md:mt-4 md:pb-2">
          <p className="text-slate-700 text-sm md:text-base font-semibold ">{formatToRupiah(menu.price)}</p>
          <div className="flex items-center justify-center gap-2  ">{menu.status === "Ready" ? <CounterButton id_menu={menu.id} onIncrement={onIncrement} /> : <p className="text-red-500"> Sold Out</p>}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:flex-row bg-white shadow rounded-xl border-2 overflow-hidden w-[300px] sm:w-full max-w-[700px] p-2 md:p-4">
      <img src={`${process.env.NEXT_PUBLIC_PHOTOS}/${menu.photo}`} alt={menu.title} className="md:w-full w-32 md:h-[200px] h-[100px] object-cover rounded-lg" />

      <div className="flex flex-col  justify-between  flex-1">
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
