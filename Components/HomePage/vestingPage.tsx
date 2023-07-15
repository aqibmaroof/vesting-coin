import React, {  } from "react";
import { useSelector } from "react-redux";
const vestingPage = () => {
  const addresses = useSelector((state: any) => state.providerReducer.address);
  const provider = useSelector((state: any) => state.providerReducer.provider);
  const userConnected = useSelector(
    (state: any) => state.reducer.userConnected
  );
  return <></>;
};

export default vestingPage;
