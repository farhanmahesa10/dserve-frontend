import { fetchContacts, setContactsUpdatedAt } from "@/store/slice";
import axios from "axios";

export const checkAndfetchContacts = () => async (dispatch, getState) => {
  try {
    const localUpdatedAt = getState().counter.contactsUpdateAt;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/contact/OUT5759/meta`);
    const serverUpdatedAt = res.data.updatedAt;

    if (localUpdatedAt !== serverUpdatedAt) {
      const fetchResult = await dispatch(fetchContacts());
      if (fetchResult.meta.requestStatus === "fulfilled") {
        dispatch(setContactsUpdatedAt(serverUpdatedAt));
      }
    } else {
      console.log("✅ AllMenus masih up to date, tidak perlu fetch ulang.");
    }
  } catch (err) {
    console.error(err);
    await dispatch(fetchContacts());
  }
};
