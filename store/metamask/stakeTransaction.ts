import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  transactionInProgress: false,
};

export const stakeTransactionSlice = createSlice({
  name: "stakeTransaction",
  initialState,
  reducers: {
    stakeTransactionCredential: (state: any, action: PayloadAction<any>) => {
      state.transactionInProgress = action?.payload?.transactionInProgress;
    },
  },
});

export const { stakeTransactionCredential } = stakeTransactionSlice.actions;

export const stakeTransactionReducer = stakeTransactionSlice.reducer;
