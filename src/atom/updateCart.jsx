import { useDispatch } from "react-redux";

export const handleUpdateCart = async (mn) => {
  const dispatch = useDispatch();
  if (!mn?.title || !mn?.price) {
    console.warn("Data tidak lengkap, menunggu data...");
    while (!mn?.title || !mn?.price) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  console.log("Data sudah lengkap, lanjut dispatch:", mn);
  dispatch(increment({ id: mn.id, title: mn.title, price: mn.price }));
};
