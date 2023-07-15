import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  userConnected: false,
  connectedWallet: "",
};

export const metaMaskSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    walletCredentials: (state: any, action: PayloadAction<any>) => {
      state.userConnected = action?.payload?.userConnected;
      state.connectedWallet = action?.payload?.connectedWallet;
    },
  },
});

export const { walletCredentials } = metaMaskSlice.actions;

export const metaMaskReducer = metaMaskSlice.reducer;
