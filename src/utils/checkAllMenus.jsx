import { fetchAllMenus, fetchMenusBestSeller, setMenusUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndFetchAllMenus = (outletCode) => async (dispatch, getState) => {
  console.log(outletCode, "cek di allmenus");

  try {
    if (!outletCode) return;
    const localUpdatedAt = getState().counter.menusUpdatedAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/menu/${outletCode}/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const result = await dispatch(fetchAllMenus(outletCode));

      await dispatch(fetchMenusBestSeller(outletCode));

      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setMenusUpdatedAt(serverUpdatedAt));
      }
    } else {
      await dispatch(fetchMenusBestSeller(outletCode));
      console.log("✅ AllMenus masih up to date, hanya fetch BestSeller.");
    }
  } catch (err) {
    console.error("❌ Error saat cek atau fetch:", err);

    await dispatch(fetchAllMenus(outletCode));
    await dispatch(fetchMenusBestSeller(outletCode));
  }
};
