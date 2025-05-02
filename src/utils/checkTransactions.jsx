import { fetchTransactions, setTransactionsUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchTransactions = (outletCode) => async (dispatch, getState) => {
  try {
    if (!outletCode) return;
    const localUpdatedAt = getState().counter.transactionsUpdatedAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/${outletCode}/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const fetchResult = await dispatch(fetchTransactions(outletCode));
      if (fetchResult.meta.requestStatus === "fulfilled") {
        dispatch(setTransactionsUpdatedAt(serverUpdatedAt));
      }
    } else {
      console.log("✅ transactions masih up to date, tidak perlu fetch ulang.");
    }
  } catch (err) {
    console.error(err);
    await dispatch(fetchTransactions(outletCode));
  }
};
