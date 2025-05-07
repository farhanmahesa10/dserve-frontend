import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  value: 0,
  outlets: [{ id: "", outlet_name: "", logo: "", history: "", address: "", outlet_code: "" }],
  pesanan: [],
  events: [],
  transactions: [],
  contacts: [],
  galleries: [],
  menus: [],
  categories: [],
  allMenus: [],
  outletCode: {},
  cancelOrder: [],
  menusUpdatedAt: null,
  transactionsUpdatedAt: null,
  contactsUpdatedAt: null,
  eventsUpdatedAt: null,
  galleriesUpdatedAt: null,
  outletsUpdatedAt: null,
  statusOutlets: "idle",
  statusTransactions: "idle",
  statusCategories: "idle",
  statusAllMenus: "idle",
  statusContacts: "idle",
  statusGalleries: "idle",
  statusEvents: "idle",
  statusMenus: "idle",
  statusPesanan: "idle",
  error: null,
  isModalOpen: false,
};

export const fetchOutlets = createAsyncThunk("counter/fetchOutlets", async (outletCode) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/outlet/showbyoutletcode/${outletCode}`);
  return response.data.data;
});
export const fetchTransactions = createAsyncThunk("counter/fetchTransactions", async (urlCode) => {
  console.log(urlCode, "cek url di slice");

  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/shownotpay/${urlCode}`);
  return response.data.data;
});
export const updateTransactions = createAsyncThunk("counter/updateTransactions", async ({ redirect, id, status }, { dispatch }) => {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/updateTr/${id}`, {
    status,
  });
  dispatch(fetchTransactions(redirect));
  return response.data.data;
});
export const fetchEvents = createAsyncThunk("counter/fetchEvents", async (outletCode) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/event/showbyoutletcode/${outletCode}`);
  return response.data.data;
});
export const fetchGalleries = createAsyncThunk("counter/fetchGalleries", async (outletCode) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/gallery/showbyoutletcode/${outletCode}`);
  return response.data.data;
});
export const fetchContacts = createAsyncThunk("counter/fetchContacts", async (outletCode) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/contact/showbyoutletcode/${outletCode}`);
  return response.data.data;
});

export const fetchMenusBestSeller = createAsyncThunk("counter/fetchMenusBestSeller", async (outletCode) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/menu/showbyoutletcodebestseller/${outletCode}/true`);
  return response.data.data;
});
export const fetchAllMenus = createAsyncThunk("counter/fetchAllMenus", async (outletCode) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/menu/showbyoutletcodedesc/${outletCode}`);
  return response.data.data;
});
export const fetchCategories = createAsyncThunk("counter/fetchCategories", async (outletCode) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/category/showbyoutletcode/${outletCode}`);
  return response.data.data;
});

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    clearCanceledOrders: (state) => {
      state.cancelOrder = [];
    },
    setOrderCanceled: (state, action) => {
      state.cancelOrder.push(action.payload);
    },
    setOutletCode: (state, action) => {
      state.outletCode = action.payload;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    setMenusUpdatedAt: (state, action) => {
      state.menusUpdatedAt = action.payload;
    },
    setTransactionsUpdatedAt: (state, action) => {
      state.transactionsUpdatedAt = action.payload;
    },
    setContactsUpdatedAt: (state, action) => {
      state.contactsUpdatedAt = action.payload;
    },
    setEventsUpdatedAt: (state, action) => {
      state.eventsUpdatedAt = action.payload;
    },
    setGalleriesUpdatedAt: (state, action) => {
      state.galleriesUpdatedAt = action.payload;
    },
    setOutletsUpdatedAt: (state, action) => {
      state.outletsUpdatedAt = action.payload;
    },
    increment: (state, action) => {
      if (!action.payload.id_menu || !action.payload.title || !action.payload.price) {
        console.warn("Data yang dikirim tidak lengkap:", action.payload);
        return;
      }

      const item = state.pesanan.find((i) => i.id_menu === action.payload.id_menu);

      if (item) {
        item.qty += 1;
        item.total_price = item.qty * item.price;
      } else {
        state.pesanan.push({
          ...action.payload,
          qty: 1,
          total_price: action.payload.price,
        });
      }
    },
    decrement: (state, action) => {
      const { id_menu } = action.payload;
      const item = state.pesanan.find((p) => p.id_menu === id_menu);

      if (item) {
        if (item.qty > 1) {
          item.qty -= 1;
          item.total_price = item.qty * item.price;
        } else {
          state.pesanan = state.pesanan.filter((p) => p.id_menu !== id_menu);
        }
      }
    },

    toggleMenuId: (state, action) => {
      const { id, title, price } = action.payload;
      const existingItem = state.pesanan.find((item) => item.id === id);

      if (existingItem) {
        // Jika ID sudah ada, hapus dari array
        state.pesanan = state.pesanan.filter((item) => item.id !== id);
      } else {
        // Jika ID belum ada, tambahkan ke array dengan qty = 1
        state.pesanan.push({ id, title, qty: 1, price });
      }
    },
    addOutlet: (state, action) => {
      const { id, outlet_name, profile, contacts } = action.payload;

      // Ganti data outlet lama dengan data baru
      if (id && outlet_name) {
        state.outlet[0] = { id, outlet_name, profile, contacts };
      }
    },
    resetPesanan: (state) => {
      state.pesanan = [];
    },
    removeItem: (state, action) => {
      state.pesanan = state.pesanan.filter((item) => item.id_menu !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutlets.pending, (state) => {
        state.statusOutlets = "loading";
      })
      .addCase(fetchOutlets.fulfilled, (state, action) => {
        state.statusOutlets = "succeeded";
        state.outlets = action.payload;
      })
      .addCase(fetchOutlets.rejected, (state, action) => {
        state.statusOutlets = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchMenusBestSeller.pending, (state) => {
        state.statusMenus = "loading";
      })
      .addCase(fetchMenusBestSeller.fulfilled, (state, action) => {
        state.statusMenus = "succeeded";
        state.menus = action.payload;
      })
      .addCase(fetchMenusBestSeller.rejected, (state, action) => {
        state.statusMenus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchEvents.pending, (state) => {
        state.statusEvents = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.statusEvents = "succeeded";
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.statusEvents = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.statusTransactions = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.statusTransactions = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.statusTransactions = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchGalleries.pending, (state) => {
        state.statusGalleries = "loading";
      })
      .addCase(fetchGalleries.fulfilled, (state, action) => {
        state.statusGalleries = "succeeded";
        state.galleries = action.payload;
      })
      .addCase(fetchGalleries.rejected, (state, action) => {
        state.statusGalleries = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchContacts.pending, (state) => {
        state.statusContacts = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.statusContacts = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.statusContacts = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllMenus.pending, (state) => {
        state.statusAllMenus = "loading";
      })
      .addCase(fetchAllMenus.fulfilled, (state, action) => {
        state.statusAllMenus = "succeeded";
        state.allMenus = action.payload;
      })
      .addCase(fetchAllMenus.rejected, (state, action) => {
        state.statusAllMenus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.statusCategories = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.statusCategories = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.statusCategories = "failed";
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setOutletCode,
  openModal,
  closeModal,
  increment,
  decrement,
  toggleMenuId,
  addOutlet,
  resetPesanan,
  removeItem,
  setMenusUpdatedAt,
  setContactsUpdatedAt,
  setEventsUpdatedAt,
  setGalleriesUpdatedAt,
  setOutletsUpdatedAt,
  setTransactionsUpdatedAt,
  setOrderCanceled,
  clearCanceledOrders,
} = counterSlice.actions;

export default counterSlice.reducer;
