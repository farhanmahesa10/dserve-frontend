import { fetchTransactions, setTransactionsUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchTransactions =
  ({ outletCode, urlCode }) =>
  async (dispatch, getState) => {
    if (!outletCode) return;
    console.log(urlCode, "cek url");

    try {
      const localUpdatedAt = getState().counter.transactionsUpdatedAt;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/${outletCode}/meta`);
      const serverUpdatedAt = res.data.updatedAt;

      if (localUpdatedAt !== serverUpdatedAt) {
        const fetchResult = await dispatch(fetchTransactions(urlCode));
        if (fetchResult.meta.requestStatus === "fulfilled") {
          dispatch(setTransactionsUpdatedAt(serverUpdatedAt));
        }
      } else {
        console.log("✅ transactions masih up to date, tidak perlu fetch ulang.");
      }
    } catch (err) {
      console.error(err);
      await dispatch(fetchTransactions(urlCode));
    }
  };
