import { fetchAllMenus, fetchMenusBestSeller, setMenusUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndFetchAllMenus = () => async (dispatch, getState) => {
  try {
    const localUpdatedAt = getState().counter.menusUpdatedAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/menu/OUT5759/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const result = await dispatch(fetchAllMenus());

      await dispatch(fetchMenusBestSeller());

      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setMenusUpdatedAt(serverUpdatedAt));
      }
    } else {
      await dispatch(fetchMenusBestSeller());
      console.log("✅ AllMenus masih up to date, hanya fetch BestSeller.");
    }
  } catch (err) {
    console.error("❌ Error saat cek atau fetch:", err);

    await dispatch(fetchAllMenus());
    await dispatch(fetchMenusBestSeller());
  }
};
