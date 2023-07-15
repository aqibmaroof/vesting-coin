import { Container, Row, Col, Button, Spinner, Form } from "react-bootstrap";
import Cards from "../Components/Card/Cards";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Web3 from "web3";
import { stakeTransactionCredential } from "../store/metamask/stakeTransaction";
import { XanaVestingContractV1 } from "../Components/Common/XanaVestingContract_V1 ";
import { XanaVestingContract_V2 } from "../Components/Common/XanaVestingContract_V2";

import { XanaVestingContractServiceV1 } from "../services/XanaVestingContractV1.service";
import { XanaVestingContractServiceV2 } from "../services/XanaVestingContract_V2.service";
import { useRouter } from "next/router";
import PageNotFound from "../Components/PageNotFound/pageNotFound";
import { trimZeroFromTheEnd } from "../Utils/trimZeroFromValue";
import { insertComma } from "../Utils/insertComma";
import { BigNumber } from "ethers";

export default function claim() {
  const addresses = useSelector(
    (state: any) => state.persistedReducer.providerReducer.address
  );
  // const addresses = "0x8355BE6305f085B6891Fe69e114a284fC0b85143";

  const provider = useSelector(
    (state: any) => state.persistedReducer.providerReducer.provider
  );
  const userConnected = useSelector(
    (state: any) => state.persistedReducer.reducer.userConnected
  );
  const transactionInProgress = useSelector(
    (state: any) => state.stakeTransactionReducer.transactionInProgress
  );

  const [claimload, setClaimLoad] = useState(false);
  const [time, setTime] = useState(0);
  const [allocatedAmount, setAllocatedAmount] = useState<number>();
  const [isClaimable, setIsClaimable] = useState(0);
  const [claimed, setClaimed]: any = useState();
  const [remaining, setRemaining]: any = useState();
  const [getClaimable, setGetClaimble]: any = useState(0);
  const [v2Address, setV2Address]: any = useState("");
  const [claimableAmount, setClaimableAmount]: any = useState(0);

  const dispatch = useDispatch();
  const web3 = new Web3(provider);

  const vestingV2ConfigTestnet = [
    {
      name: "seed",
      address: "0xb327780d93D51da9936234A12846A7120F59505B",
    },
    {
      name: "public",
      address: "0x9C76De0B6c95C4E13555A60239345c4519dE9FCE",
    },
    {
      name: "private",
      address: "0xB539588a3906347c218017f5c125780b00aE20F7",
    },
    {
      name: "ecosystem",
      address: "0xdc984Aa228b8158aA9FE461bD6656385387d535B",
    },
    {
      name: "liquidity",
      address: "0xC82E6C4c6cC7fa99fC2b137d482883203ea8368b",
    },
    {
      name: "marketing",
      address: "0x0EF2B64CAcB0e8628DE2Ff682Ce0aF623E84f586",
    },
    {
      name: "foundation",
      address: "0x96D160cCFfbD1a62E979D91dd20b627de914b724",
    },
    {
      name: "advisors",
      address: "0x7722c2a430B5Cf3A70a321103C0DA5A5CF358C81",
    },
    {
      name: "development",
      address: "0xC2F2c3Fd0A9e43574aBadC63A1F45112D283A388",
    },
  ];

  const vestingV2ConfigMainnet = [
    {
      name: "seed",
      address: "0xDF9e3886DB12034C76d6A0eDc68517fa5408EcF8",
    },
    {
      name: "public",
      address: "0xc680ad9974b88BEBDe110EA20DB47fD2fA314DEB",
    },
    {
      name: "private",
      address: "0xc63c8F3a6e5046c9F0209a42a5C037106FafE833",
    },
    {
      name: "ecosystem",
      address: "0x829016317e097baC8491dc8066bc33aAcA0C6F02",
    },
    {
      name: "liquidity",
      address: "0x3BE70C3886ff234990981eee8191A6CB949a2211",
    },
    {
      name: "marketing",
      address: "0x77C1471573724fb64894eF0dEC5782131EC4523b",
    },
    {
      name: "foundation",
      address: "0x6412015993C5e2aaa21d24bb69ca919E3647c84B",
    },
    {
      name: "advisors",
      address: "0xA45754C24C75a40d78dcEd11b5cb9823e519eB0c",
    },
    {
      name: "development",
      address: "0x6E46d0e44F6D631a9799B98BC119d10060a94921",
    },
  ];

  const getRelatedV2Address = async () => {
    setAllocatedAmount(0);
    setClaimed(0);
    setRemaining(0);
    setV2Address("");
    let usersMethodArray = [];
    let vestingV2Config =
      process.env.NEXT_PUBLIC_NETWORK_TYPE == "testnet"
        ? vestingV2ConfigTestnet
        : vestingV2ConfigMainnet;

    for (let i = 0; i < vestingV2Config.length; i++) {
      let vestingV2Obj = new XanaVestingContractServiceV2(
        process.env.NEXT_PUBLIC_RPC,
        vestingV2Config[i].address
      );
      usersMethodArray.push(vestingV2Obj.users(addresses));
    }

    Promise.all([...usersMethodArray])
      .then((res) => {
        for (let j = 0; j < vestingV2Config.length; j++) {
          if (res[j].valid) {
            setV2Address(vestingV2Config[j].address);
            fetchDetails(vestingV2Config[j].address);
            getClaimCheck(vestingV2Config[j].address);
            break;
          }
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    if (userConnected && addresses) {
      getRelatedV2Address();
    }
  }, [userConnected, addresses, provider]);
  
  const fetchDetails = async (v2Address: string) => {
    let vestingV1Obj = new XanaVestingContractServiceV1(
      process.env.NEXT_PUBLIC_RPC,
      XanaVestingContractV1.address
    );

    let vestingV2Obj = new XanaVestingContractServiceV2(
      process.env.NEXT_PUBLIC_RPC,
      v2Address
    );
    
    let nameResponse = await vestingV2Obj.getName();
    
    if (nameResponse !== false) {
      let usersResponseV1 = await vestingV1Obj.users(nameResponse);
      let usersResponseV2 = await vestingV2Obj.users(addresses);
      let emissionResponse = await vestingV1Obj.emission();
    
      if (
        usersResponseV1 !== false &&
        usersResponseV2 !== false &&
        emissionResponse !== false
      ) {
       
        let maxSupplyParsed = parseFloat(
          web3.utils.fromWei(usersResponseV1.maxSupply)
        );
        let claimedParsed = parseFloat(
          web3.utils.fromWei(usersResponseV2.claimed)
        );
        // let percentageParsed = parseFloat(
        //   web3.utils.fromWei(usersResponseV2.percentage)
        // );
        let allocationAmount = 0;
        // if (percentageParsed) {
        // allocationAmount = (maxSupplyParsed * percentageParsed) / 100;
        // }
        allocationAmount = parseFloat(
          web3.utils.fromWei(usersResponseV2.amount)
        );

        let remainigAmount;
        remainigAmount = allocationAmount - claimedParsed;

        setAllocatedAmount(allocationAmount);
        setClaimed(claimedParsed);
        setRemaining(remainigAmount);

        // let parsedTotalEmission = parseInt(emissionResponse);
        // let parsedEmission = parseInt(usersResponseV2.emission);
        // let claimable = 0;
        // if (parsedEmission < parsedTotalEmission) {
        //   let distList = [];
        //   for (let step = parsedEmission; step < parsedTotalEmission; step++) {
        //     // distList.push(vestingV1Obj.distributionList(nameResponse, step));
        //     distList.push(vestingV1Obj.getPercentage(nameResponse, step));
        //   }
        //   let distResponse = await Promise.all(distList);
        //   if (distResponse.length > 0) {
        //     for (let step = 0; step < distResponse.length; step++) {
        //       if (parseFloat(distResponse[step]) > 0)
        //         claimable += parseFloat(distResponse[step]);
        //     }
        //   }
        //   let decimals = await vestingV1Obj.decimals();
        //   // claimable = (claimable * percentageParsed) / 10 ** decimals;
        //   claimable = (claimable * allocationAmount) / 10 ** decimals;
        // }
        // setIsClaimable(claimable);
      }
    }
  };

  const getClaimCheck = async (v2Address: any) => {
    console.log(v2Address);

    let StakingContractObj = new XanaVestingContractServiceV2(
      process.env.NEXT_PUBLIC_RPC,
      v2Address
    );

    StakingContractObj.getClaimableCheck(addresses)
      .then((claimCheckResponse: any) => {
        console.log(claimCheckResponse);
        if (claimCheckResponse !== false) {
          setIsClaimable(parseFloat(web3.utils.fromWei(claimCheckResponse[0])));
          setClaimableAmount(
            parseFloat(web3.utils.fromWei(claimCheckResponse[1]))
          );
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const claimTicket = async () => {
    if(!userConnected) return document.getElementById("connectWalletModal")?.click()
    setClaimLoad(true);
    if (transactionInProgress) {
      toast.info("Transaction is already in progess");
      return;
    }
    dispatch(stakeTransactionCredential({ transactionInProgress: true }));
    // if (isClaimable !== 0) {
    let StakingContractObj = new XanaVestingContractServiceV2(
      provider,
      v2Address
    );
    StakingContractObj.claim(addresses)
      .then((claimResponse: any) => {
        if (claimResponse !== false) {
          // toast.success(`${isClaimable} Claimed successfully.`);
          toast.success(` Claimed successfully.`);
          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));
          setClaimLoad(false);
          fetchDetails(v2Address);
          getClaimCheck(v2Address);
        }
      })
      .catch((err: any) => {
        console.log(err.message);
        toast.error(err.message);
        const payload = {
          transactionInProgress: false,
        };
        dispatch(stakeTransactionCredential(payload));
        setClaimLoad(false);
      });

    // else {

    //   toast.error(`You have ${isClaimable} to Claim`);
    //   const payload = {
    //     transactionInProgress: false,
    //   };
    //   dispatch(stakeTransactionCredential(payload));
    //   setClaimLoad(false);
    // }
  };
  const router = useRouter();
  const pathName = router.pathname;

  return (
    <div>
      {pathName === "/claim" ? (
        <PageNotFound />
      ) : (
        <Container fluid className="landingUI">
          <Container className="px-0">
            <Row className="homepage-title mx-0">
              <Col className="text-center px-0">
                <h1 className="heading-1"> VESTING</h1>
              </Col>
            </Row>

            <Row className="ticket-row mx-0">
              <Cards
                Title="ALLOCATION"
                Subtitle={
                  userConnected && allocatedAmount
                    ? insertComma(
                        trimZeroFromTheEnd(allocatedAmount.toFixed(5)),
                        true
                      )
                    : "0"
                  // insertComma(trimZeroFromTheEnd((1223232.2323223).toFixed(5)), true)
                }
              />
              <Cards
                Title="CLAIMED"
                Subtitle={
                  userConnected && claimed
                    ? insertComma(trimZeroFromTheEnd(claimed.toFixed(5)), true)
                    : "0"
                }
              ></Cards>
              <Cards
                Title="REMAINING"
                Subtitle={
                  userConnected && remaining
                    ? insertComma(
                        trimZeroFromTheEnd(remaining.toFixed(5)),
                        true
                      )
                    : "0"
                }
              />
            </Row>
            <Row className="staking-row mx-0">
              <Col md={7} className="staking-input-col">
                <Form>
                  <div className="input-wrapper">
                    <div className="input-inner-text height-fix">
                      <span className="ticket-per-day small-text">
                        CLAIMABLE
                      </span>
                      <div className="input-field">
                        <Form.Control
                          type="text"
                          maxLength={20}
                          placeholder="000"
                          value={
                            userConnected &&
                            claimableAmount &&
                            claimableAmount > 0
                              ? insertComma(
                                  trimZeroFromTheEnd(
                                    claimableAmount.toFixed(5)
                                  ),
                                  true
                                )
                              : "0"
                          }
                          readOnly
                          autoComplete="off"
                          // onChange={(e) => validationHandler(e)}
                        />
                        <span className="input-xeta heading-4">xeta</span>
                      </div>
                    </div>
                    <div className="input-field-bottom-text-wrapper">
                      {/* <p className="small-text right">
                   XETA
                  </p> */}
                    </div>
                  </div>
                </Form>
              </Col>
              <Col md={5} className="stack-btn-col width-fix">
                <div className="stake-now-btn-wrapper">
                  <div className="stake-now-btn-inner">
                    <Button
                      className="claim-btn"
                      onClick={claimTicket}
                      disabled={
                        isClaimable > 0 && claimableAmount > 0 ? false : true
                      }
                    >
                      {claimload ? (
                        <Spinner
                          as="span"
                          animation="border"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        "Claim Now"
                      )}
                    </Button>
                  </div>
                  {/* <Wallet1 connectToWallet={undefined} /> */}
                </div>
              </Col>
            </Row>
            {/* <Row className="staking-row mx-0">
              <Col md={5} className="stack-btn-col width-fix">
                <div className="stake-now-btn-wrapper">
                  <div className="stake-now-btn-inner">
                    <Button
                      className="claim-btn"
                      onClick={claimTicket}
                      disabled={remaining !== 0 ? false : true}
                    >
                      {claimload ? (
                        <Spinner
                          as="span"
                          animation="border"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        "Claim Ticket"
                      )}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row> */}
          </Container>
        </Container>
      )}
    </div>
  );
}
