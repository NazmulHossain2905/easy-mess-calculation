import type { IMarket } from "@/interfaces/IMarket";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MarketerState {
  marketers: IMarket[];
}

const initialState: MarketerState = {
  marketers: [],
};

export const marketersSlice = createSlice({
  name: "marketers",
  initialState,
  reducers: {
    addMarketer: (state, action: PayloadAction<IMarket>) => {
      state.marketers.push(action.payload);
    },
    editMarketer: (
      state,
      action: PayloadAction<{ id: string; editedMarketer: IMarket }>,
    ) => {
      const index = state.marketers.findIndex(
        (marketer) => marketer.id === action.payload.id,
      );
      if (index !== -1) {
        state.marketers[index] = action.payload.editedMarketer;
      }
    },
    deleteMarketer: (state, action: PayloadAction<string>) => {
      state.marketers = state.marketers.filter(
        (marketer) => marketer.id !== action.payload,
      );
    },
    deleteAllMarketers: (state) => {
      state.marketers = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addMarketer, deleteMarketer, editMarketer, deleteAllMarketers } =
  marketersSlice.actions;

export default marketersSlice.reducer;
