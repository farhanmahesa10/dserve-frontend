import { fetchOutlets, setOutletsUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchOutlets = (outletCode) => async (dispatch, getState) => {
  if (!outletCode) return;
  try {
    const localUpdatedAt = getState().counter.outletsUpdatedAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/outlet/${outletCode}/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const fetchResult = await dispatch(fetchOutlets(outletCode));
      if (fetchResult.meta.requestStatus === "fulfilled") {
        dispatch(setOutletsUpdatedAt(serverUpdatedAt));
      }
    } else {
      console.log("✅ AllMenus masih up to date, tidak perlu fetch ulang.");
    }
  } catch (err) {
    console.error(err);
    await dispatch(fetchOutlets(outletCode));
  }
};
