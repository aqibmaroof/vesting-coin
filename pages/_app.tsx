import type { AppProps } from "next/app";
import Head from "next/head";
// import AppleTouch from "../public/assets/apple-touch-icon.png"

// Style
import "../src/Styles/Global.scss";
import { ToastContainer, toast } from "react-toastify";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";
import store from "../store/metamask/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Web3Provider } from "@ethersproject/providers";
import "react-toastify/dist/ReactToastify.css";

import Header from "../Components/Header/header";

// import { ethers } from 'ethers'

export const getLibrary = (provider: any) => {
  //  const library = new ethers.providers.Web3Provider(provider)
  const library = new Web3Provider(provider);
  // library.pollingInterval = 12000
  return library;
};

let persistor = persistStore(store);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Head>
            <title>Xana-Vesting</title>
            {/* <link rel="shortcut icon" href="./public/assets/images/xana-Logo.svg" /> */}
            <link
              rel="apple-touch-icon"
              href="https://d3qx0e7p61mr7f.cloudfront.net/wp-content/uploads/2022/01/Logo-without-BG-1-300x300.png"
            />
            <link
              rel="icon"
              href="https://d3qx0e7p61mr7f.cloudfront.net/wp-content/uploads/2022/01/Logo-without-BG-1-45x45.png"
              sizes="32x32"
            />
            <link
              rel="icon"
              href="https://d3qx0e7p61mr7f.cloudfront.net/wp-content/uploads/2022/01/Logo-without-BG-1-300x300.png"
              sizes="192x192"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#5bbad5"
            />
          </Head>
          <Header />

          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            hideProgressBar={false}
            autoClose={2000}
            newestOnTop={true}
            closeOnClick={false}
            draggable={false}
            rtl={false}
          />
        </Web3ReactProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
