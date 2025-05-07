import { fetchContacts, setContactsUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchContacts = (outletCode) => async (dispatch, getState) => {
  if (!outletCode || typeof outletCode !== "string" || outletCode.trim() === "") {
    console.warn("❌ checkAndfetchContacts: outletCode belum tersedia atau tidak valid.");
    return;
  }

  try {
    const localUpdatedAt = getState().counter.contactsUpdatedAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/contact/${outletCode}/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const fetchResult = await dispatch(fetchContacts(outletCode));
      if (fetchResult.meta.requestStatus === "fulfilled") {
        dispatch(setContactsUpdatedAt(serverUpdatedAt));
      }
    } else {
      console.log("✅ AllMenus masih up to date, tidak perlu fetch ulang.");
    }
  } catch (err) {
    console.error(err);
    await dispatch(fetchContacts(outletCode));
  }
};
