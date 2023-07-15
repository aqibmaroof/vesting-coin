import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  provider: {},
  address: "",
};

export const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setProvider: (state: any, action: PayloadAction<any>) => {
      state.address = action?.payload?.address;
      state.provider = action.payload.provider;
    },
  },
});

export const { setProvider } = providerSlice.actions;

export default providerSlice.reducer;
