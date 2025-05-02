import { fetchGalleries, setGalleriesUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchGalleries = (outletCode) => async (dispatch, getState) => {
  if (!outletCode) return;
  try {
    const localUpdatedAt = getState().counter.galleriesUpdatedAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/gallery/${outletCode}/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const fetchResult = await dispatch(fetchGalleries(outletCode));
      if (fetchResult.meta.requestStatus === "fulfilled") {
        dispatch(setGalleriesUpdatedAt(serverUpdatedAt));
      }
    } else {
      console.log("✅ gallery masih up to date, tidak perlu fetch ulang.");
    }
  } catch (err) {
    console.error(err);
    await dispatch(fetchGalleries(outletCode));
  }
};
