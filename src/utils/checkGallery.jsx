import { fetchGalleries, setGalleriesUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchGalleries = () => async (dispatch, getState) => {
  try {
    const localUpdatedAt = getState().counter.galleriesUpdateAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/gallery/OUT5759/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const fetchResult = await dispatch(fetchGalleries());
      if (fetchResult.meta.requestStatus === "fulfilled") {
        dispatch(setGalleriesUpdatedAt(serverUpdatedAt));
      }
    } else {
      console.log("✅ gallery masih up to date, tidak perlu fetch ulang.");
    }
  } catch (err) {
    console.error(err);
    await dispatch(fetchGalleries());
  }
};
