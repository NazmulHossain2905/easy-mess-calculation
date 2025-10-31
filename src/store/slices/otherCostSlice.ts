import type { IMarket } from "@/interfaces/IMarket";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MarketerState {
  otherCosts: IMarket[];
}

const initialState: MarketerState = {
  otherCosts: [],
};

export const otherCostSlice = createSlice({
  name: "otherCosts",
  initialState,
  reducers: {
    addOtherCost: (state, action: PayloadAction<IMarket>) => {
      state.otherCosts.push(action.payload);
    },
    editOtherCost: (
      state,
      action: PayloadAction<{ id: string; editedOtherCost: IMarket }>,
    ) => {
      const index = state.otherCosts.findIndex(
        (cost) => cost.id === action.payload.id,
      );
      if (index !== -1) {
        state.otherCosts[index] = action.payload.editedOtherCost;
      }
    },
    deleteOtherCost: (state, action: PayloadAction<string>) => {
      state.otherCosts = state.otherCosts.filter(
        (cost) => cost.id !== action.payload,
      );
    },
    deleteAllOtherCosts: (state) => {
      state.otherCosts = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOtherCost,
  deleteOtherCost,
  editOtherCost,
  deleteAllOtherCosts,
} = otherCostSlice.actions;

export default otherCostSlice.reducer;
