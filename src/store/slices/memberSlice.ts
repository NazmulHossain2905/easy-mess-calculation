import type { IUser } from "@/interfaces/IUser";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MemberState {
  members: IUser[];
}

const initialState: MemberState = {
  members: [],
};

export const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setMember: (state, action: PayloadAction<IUser[]>) => {
      state.members = action.payload;
    },
    addMember: (state, action: PayloadAction<IUser>) => {
      state.members.push(action.payload);
    },
    editMember: (
      state,
      action: PayloadAction<{ id: string; editedMember: IUser }>,
    ) => {
      const index = state.members.findIndex(
        (member) => member.id === action.payload.id,
      );
      if (index !== -1) {
        state.members[index] = action.payload.editedMember;
      }
    },
    deleteMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(
        (member) => member.id !== action.payload,
      );
    },
    deleteAllMember: (state) => {
      state.members = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addMember,
  deleteMember,
  editMember,
  setMember,
  deleteAllMember,
} = memberSlice.actions;

export default memberSlice.reducer;
