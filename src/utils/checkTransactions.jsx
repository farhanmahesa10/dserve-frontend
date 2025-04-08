import { fetchTransactions, setTransactionsUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchTransactions = () => async (dispatch, getState) => {
  try {
    const localUpdatedAt = getState().counter.transactionsUpdateAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/OUT5759/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const fetchResult = await dispatch(fetchTransactions());
      if (fetchResult.meta.requestStatus === "fulfilled") {
        dispatch(setTransactionsUpdatedAt(serverUpdatedAt));
      }
    } else {
      console.log("✅ transactions masih up to date, tidak perlu fetch ulang.");
    }
  } catch (err) {
    console.error(err);
    await dispatch(fetchTransactions());
  }
};
