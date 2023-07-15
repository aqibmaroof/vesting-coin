import { useState, useEffect } from "react";
import useConnector from "./Connectors/Connectors";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Modal, Button, ModalTitle } from "react-bootstrap";
import "./MultiWallet.module.scss";
import Image from "next/image";
import MultiWalletData from "./MultiWalletData";
import { useDispatch, useSelector } from "react-redux";
import { walletCredentials } from "../../store/metamask/reducer";
import { setProvider } from "../../store/metamask/provider";
import DisConnect from "./DisConnect";
import { toast } from "react-toastify";
import { stakeTransactionCredential } from "../../store/metamask/stakeTransaction";
import Web3 from "web3";

const MultiWallet = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [changeModal, setChangeModal] = useState(false);
  const [chainChanged, setChainChanged] = useState(false);
  const [walletName, setWalletName] = useState("");
  const dispatch = useDispatch();
  const { connectorType } = useConnector();

  const connectedWallet = useSelector(
    (state: any) => state.persistedReducer.reducer.connectedWallet
  );
  const userConnected = useSelector(
    (state: any) => state.persistedReducer.reducer.userConnected
  );
  const addresses = useSelector(
    (state: any) => state.persistedReducer.providerReducer.address
  );
  const switchNetworkHandle = useSelector(
    (state: any) => state.stakeTransactionReducer.switchNetworkInProgess
  );

  
  let metaMaskAccounts;
  const { activate, library, account, deactivate,chainId }: any = useWeb3React();
  const [webreact, setWebReact] = useState();
  useEffect(() => {
    if (typeof library !== "undefined") {
      const payload: any = {
        userConnected: true,
        connectedWallet: webreact,
      };

      if (library?.provider?.signer?.connection.wc) {
        dispatch(walletCredentials(payload));
        dispatch(setProvider({ provider: library.provider, address: account }));
        handleClose();
      } else {
        dispatch(walletCredentials(payload));
        dispatch(setProvider({ provider: library.provider, address: account }));
        handleClose();
      }
    }
  }, [library, account]);

  useEffect(() => {
    if (userConnected && connectedWallet) {
      connectToWallet(connectedWallet);
    }
  }, [userConnected, connectedWallet]);

  useEffect(() => {
    if (chainChanged || walletName.length > 0) {
      connectToWallet(walletName);
    } else {
    }
  }, [chainChanged, walletName]);
  // const signHandle = () => {
  //   const signMessage =
  //     "Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!";
  //   const signature = library?.getSigner().signMessage(signMessage);
  //   return signature;
  // };

  const connectToWallet = (title: any) => {
    const { ethereum } = window as any;

    let obj: any;
    if (title === "MetaMask") {
      obj = connectorType("inject");
    } else if (title === "WalletConnect") {
      obj = connectorType("walletconnect");
    }
    if (obj) {
      activate(obj, async (error: any) => {
        try {
          if (
            error instanceof UnsupportedChainIdError &&
            title === "MetaMask"
          ) {
            if (!userConnected && library === undefined && ethereum) {
              await ethereum?.request({
                method: "wallet_switchEthereumChain",
                params: [
                  {
                    chainId: `0x${Number(
                      process.env.NEXT_PUBLIC_CHAINID
                    ).toString(16)}`,
                  },
                ],
              });

              const payload = {
                switchNetworkHandle: true,
              };
              setWalletName(title);
              dispatch(stakeTransactionCredential(payload));
              // setChainChanged(true);
              return true;
            } else {
              setChangeModal(true);
              const payload = {
                switchNetworkHandle: true,
              };
              dispatch(stakeTransactionCredential(payload));
              // setChainChanged(true);
            }
          } else {
            if (userConnected) {
              toast.error(`Disconnected`);
            } else {
              toast.error(`Connection Denied Network not supported`);
            }
            localStorage.clear();
            deactivate();
            dispatch(
              walletCredentials({
                address: null,
                active: false,
                provideType: null,
                provider: null,
              })
            );
          }
          setModalOpen(false);

          return false;
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              const { ethereum } = window as any;
              let availableProvider;
              availableProvider = ethereum;
              // if user not have any chain present
              await availableProvider?.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: `0x${Number(process.env.NEXT_PUBLIC_CHAINID).toString(
                      16
                    )}`,
                    chainName:
                      process.env.NEXT_PUBLIC_NETWORK_TYPE == "testnet"
                        ? "XANAChain Testnet"
                        : "XANAChain",
                    nativeCurrency: {
                      name:
                        process.env.NEXT_PUBLIC_NETWORK_TYPE == "testnet"
                          ? "XANAChain Testnet"
                          : "XANAChain",
                      symbol: "XETA",
                      decimals: 18,
                    },
                    rpcUrls: [process.env.NEXT_PUBLIC_RPC],
                    blockExplorerUrls: [
                      process.env.NEXT_PUBLIC_NETWORK_TYPE == "testnet"
                        ? "https://testnet.xanachain.xana.net/"
                        : "https://xanachain.xana.net/",
                    ],
                  },
                ],
              });
              connectToWallet(connectedWallet);
              setChangeModal(false);
            } catch (err) {}
          } else {
          }
        }
        // finally {() => {
        //   setChangeModal(false);
        // }}
      });
    }
    setWebReact(title);
    setTimeout(() => {
      const payload = {
        switchNetworkHandle: false,
      };
      dispatch(stakeTransactionCredential(payload));
      // setChainChanged(false);

      setWalletName("");
    }, 2000);
  };

  // Modal handled
  const handelModal = () => {
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };
  const handleChangeModal = () => {
    setChangeModal(false);
  };
  setInterval(() => {
    if (
      connectedWallet === "MetaMask" &&
      library?.provider._state.isUnlocked === false
    ) {
      const payload: any = {
        userConnected: false,
      };
      dispatch(walletCredentials(payload));
      dispatch(setProvider({ provider: {}, address: "" }));
    }
  }, 1000);
  // if same chainid founded then modal will be close
  setInterval(() => {
    if (
      connectedWallet === "MetaMask" &&
      library?.provider?.networkVersion === "97"
    ) {
      setChangeModal(false);
    }
  }, 1000);

  const switchNetwork = async () => {
    try {
      const { ethereum } = window as any;
      let availableProvider;
      if (library !== undefined && library.provider)
        availableProvider = library.provider;
      else if (ethereum) availableProvider = ethereum;
      await availableProvider?.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${Number(process.env.NEXT_PUBLIC_CHAINID).toString(
              16
            )}`,
          },
        ],
      });
      setChangeModal(false);
      connectToWallet(connectedWallet);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          const { ethereum } = window as any;
          let availableProvider;
          if (library !== undefined && library.provider)
            availableProvider = library.provider;
          else if (ethereum) availableProvider = ethereum;
          await availableProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${Number(process.env.NEXT_PUBLIC_CHAINID).toString(
                  16
                )}`,
                chainName:
                  process.env.NEXT_PUBLIC_NETWORK_TYPE == "testnet"
                    ? "XANAChain Testnet"
                    : "XANAChain",
                nativeCurrency: {
                  name:
                    process.env.NEXT_PUBLIC_NETWORK_TYPE == "testnet"
                      ? "XANAChain Testnet"
                      : "XANAChain",
                  symbol: "XETA",
                  decimals: 18,
                },
                rpcUrls: [process.env.NEXT_PUBLIC_RPC],
                blockExplorerUrls: [
                  process.env.NEXT_PUBLIC_NETWORK_TYPE == "testnet"
                    ? "https://testnet.xanachain.xana.net/"
                    : "https://xanachain.xana.net/",
                ],
              },
            ],
          });
        } catch (err) {}
      } else {
      }
    }
  };

  return (
    <>
      <Button>
        {userConnected && addresses ? (
          <DisConnect />
        ) : (
          <span onClick={handelModal} className="wallet" id="connectWalletModal">
            <svg
              width="30"
              height="26"
              viewBox="0 0 30 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 0.9H27C28.1598 0.9 29.1 1.8402 29.1 3V23C29.1 24.1598 28.1598 25.1 27 25.1H3C1.8402 
                            25.1 0.9 24.1598 0.9 23V3C0.9 1.8402 1.8402 0.9 3 0.9Z"
                stroke="black"
                strokeWidth="1.8"
              ></path>
              <path
                d="M21 6.9H29.1V18.1H21C19.8402 18.1 18.9 17.1598 18.9 16V9C18.9 7.8402 19.8402 6.9 21 6.9Z"
                stroke="black"
                strokeWidth="1.8"
              ></path>
              <path
                d="M26.1 12C26.1 13.1598 25.1598 14.1 24 14.1C22.8402 14.1 21.9 13.1598 21.9 12C21.9 10.8402 22.8402 9.9 24 9.9C25.1598 9.9 
                            26.1 10.8402 26.1 12Z"
                stroke="black"
                strokeWidth="1.8"
              ></path>
            </svg>
          </span>
        )}
      </Button>

      <Modal show={modalOpen} onHide={handleClose}>
        <Modal.Body>
          <div className="modal-body-inner">
            {MultiWalletData.map((obj, i) => (
              <div key={i} className="box-wrapper">
                <div onClick={() => setWalletName(obj.title)} className="box">
                  <div className="box-inner">
                    <div className="box-image">
                      {obj.title === "MetaMask" ? (
                        <img
                          src="https://ik.imagekit.io/xanalia/Images/metamask-logo.png"
                          alt="image"
                          height={50}
                          width={50}
                        />
                      ) : (
                        <img
                          src="https://ik.imagekit.io/xanalia/Images/wallet-connect.jpeg"
                          alt="image"
                          height={50}
                          width={50}
                        />
                      )}
                    </div>
                    <Modal.Title> {obj.title}</Modal.Title>
                    <p className="box-description">{obj.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* <Modal show={changeModal}>
        <Modal.Body>
          <Modal.Title>
            <Button onClick={switchNetwork}>Switch Network</Button>
          </Modal.Title>
        </Modal.Body>
      </Modal> */}

      <Modal show={changeModal} className="switch-net">
        <Modal.Body>
          <div className="modal-body-inner">
            <div className="box-wrapper">
              <h4 className="modal-custom-heading">Switch Network</h4>
              <div className="box" onClick={switchNetwork}>
                <div className="box-inner">
                  <div className="box-image">
                  <img className='avaxLogo' src={'/assets/images/avalancheAvax.svg'}/>
                    {/* <svg
                      viewBox="0 0 37 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.637 36.122c9.94 0 18-8.059 18-18s-8.06-18-18-18c-9.941 0-18 8.059-18 18s8.059 18 18 18Z"
                        fill="#4D4D4D"
                      ></path>
                      <path
                        d="m10.35 18.122-3.418 3.415-3.415-3.415 3.415-3.415 3.418 3.415Zm8.287-8.293 5.852 5.855 3.415-3.415-9.267-9.267-9.268 9.267 3.415 3.415 5.853-5.855Zm11.708 4.878-3.415 3.415 3.415 3.415 3.412-3.415-3.412-3.415ZM18.637 26.414l-5.853-5.852-3.415 3.412 9.268 9.268 9.267-9.268-3.415-3.412-5.852 5.852Zm0-4.877 3.415-3.415-3.415-3.415-3.415 3.415 3.415 3.415Z"
                        fill="#F3BA2F"
                      ></path>
                    </svg> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MultiWallet;
