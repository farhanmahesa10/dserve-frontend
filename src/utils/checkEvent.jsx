import { fetchEvents, setEventsUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchEvents = (outletCode) => async (dispatch, getState) => {
  try {
    if (!outletCode) return;
    const localUpdatedAt = getState().counter.eventsUpdatedAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/event/${outletCode}/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const fetchResult = await dispatch(fetchEvents(outletCode));
      if (fetchResult.meta.requestStatus === "fulfilled") {
        dispatch(setEventsUpdatedAt(serverUpdatedAt));
      }
    } else {
      console.log("✅ AllMenus masih up to date, tidak perlu fetch ulang.");
    }
  } catch (err) {
    console.error(err);
    await dispatch(fetchEvents(outletCode));
  }
};
