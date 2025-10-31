import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ManagerInfo {
  name: string;
  phone: string;
}

export interface MessInfo {
  name: string;
  address: string;
}

export interface MoreInfoState {
  fixedMealPerPerson: number;
  khalarRicePerPerson: number;
  managerInfo: ManagerInfo;
  messInfo: MessInfo;
  layout: "single-page" | "tabs" | string;
}

const initialState: MoreInfoState = {
  fixedMealPerPerson: 1,
  khalarRicePerPerson: 0,
  managerInfo: {
    name: "",
    phone: "",
  },
  messInfo: {
    name: "",
    address: "",
  },
  layout: "single-page",
};

export const moreInfoSlice = createSlice({
  name: "moreInfo",
  initialState,
  reducers: {
    changeFixedMeal: (state: MoreInfoState, action: PayloadAction<number>) => {
      state.fixedMealPerPerson = action.payload;
    },
    changeKhalarRice: (state: MoreInfoState, action: PayloadAction<number>) => {
      state.khalarRicePerPerson = action.payload;
    },
    updateManagerInfo: (
      state: MoreInfoState,
      action: PayloadAction<ManagerInfo>,
    ) => {
      state.managerInfo = action.payload;
    },
    updateMessInfo: (state: MoreInfoState, action: PayloadAction<MessInfo>) => {
      state.messInfo = action.payload;
    },
    changeLayout: (state: MoreInfoState, action: PayloadAction<any>) => {
      state.layout = action.payload;
    },
    deleteAllMoreInfo: (state) => {
      state.fixedMealPerPerson = 1;
      state.khalarRicePerPerson = 0;
      state.managerInfo = { name: "", phone: "" };
      state.messInfo = { address: "", name: "" };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  changeFixedMeal,
  changeKhalarRice,
  updateManagerInfo,
  updateMessInfo,
  deleteAllMoreInfo,
  changeLayout,
} = moreInfoSlice.actions;

export default moreInfoSlice.reducer;
