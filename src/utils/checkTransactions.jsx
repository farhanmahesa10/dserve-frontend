import { fetchTransactions, resetTransactions, setTransactionsUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchTransactions =
  ({ outletCode, urlCode }) =>
  async (dispatch, getState) => {
    if (!outletCode || !urlCode) return;

    try {
      await dispatch(resetTransactions());
      const fetchResult = await dispatch(fetchTransactions(urlCode));
      if (fetchResult.meta.requestStatus === "fulfilled") {
      }
    } catch (err) {
      console.error("❌ Error fetching metadata or transactions", err);
      await dispatch(fetchTransactions(urlCode));
    }
  };
