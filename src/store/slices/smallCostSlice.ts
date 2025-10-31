import type { IMarket } from "@/interfaces/IMarket";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MarketerState {
  smallCosts: IMarket[];
}

const initialState: MarketerState = {
  smallCosts: [],
};

export const smallCostSlice = createSlice({
  name: "smallCosts",
  initialState,
  reducers: {
    addSmallCost: (state, action: PayloadAction<IMarket>) => {
      state.smallCosts.push(action.payload);
    },
    editSmallCost: (
      state,
      action: PayloadAction<{ id: string; editedSmallCost: IMarket }>,
    ) => {
      const index = state.smallCosts.findIndex(
        (cost) => cost.id === action.payload.id,
      );
      if (index !== -1) {
        state.smallCosts[index] = action.payload.editedSmallCost;
      }
    },
    deleteSmallCost: (state, action: PayloadAction<string>) => {
      state.smallCosts = state.smallCosts.filter(
        (cost) => cost.id !== action.payload,
      );
    },
    deleteAllSmallCost: (state) => {
      state.smallCosts = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addSmallCost,
  deleteSmallCost,
  editSmallCost,
  deleteAllSmallCost,
} = smallCostSlice.actions;

export default smallCostSlice.reducer;
