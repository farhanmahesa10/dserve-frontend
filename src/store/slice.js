import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// export const getData = createAsyncThunk(
//   "user/getData",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/category/showall/cecep/true`
//       );

//       return response.data; // Mengembalikan data langsung
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       return rejectWithValue(err.response?.data || "Terjadi kesalahan");
//     }
//   }
// );

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    pesanan: [],
    outlet: [{ id: "", outlet_name: "" }],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    increment: (state, action) => {
      const item = state.pesanan.find((p) => p.id === action.payload.id);
      if (item) {
        item.qty += 1;
      }
    },
    decrement: (state, action) => {
      const item = state.pesanan.find((p) => p.id === action.payload.id);
      if (item) {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          state.pesanan = state.pesanan.filter(
            (p) => p.id !== action.payload.id
          );
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
      const { id, outlet_name } = action.payload;

      // Ganti data outlet lama dengan data baru
      if (id && outlet_name) {
        state.outlet[0] = { id, outlet_name };
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, toggleMenuId, addOutlet } =
  counterSlice.actions;

export default counterSlice.reducer;
