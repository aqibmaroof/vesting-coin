import React, { useCallback, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

function useConnector() {
  let connectorType = useCallback((type: string) => {
    let chainId = 0;
    let rpcUrl = ""
    if (process.env.NEXT_PUBLIC_RPC) rpcUrl = process.env.NEXT_PUBLIC_RPC
    if (process.env.NEXT_PUBLIC_CHAINID) chainId = parseInt(process.env.NEXT_PUBLIC_CHAINID)
    if (type === "walletconnect") {

      return new WalletConnectConnector({
        rpc: {
          [chainId]: rpcUrl
        },
        bridge: "https://bridge.walletconnect.org",
        qrcode: true,
        supportedChainIds: [chainId],
      });
    } else if (type === "inject") {
      return new InjectedConnector({
        supportedChainIds: [chainId],
      });
    }
  }, []);


  return { connectorType };
}

export default useConnector;
