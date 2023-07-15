import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Card,
} from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Web3 from "web3";
import { XanaVestingContractServiceV1 } from "../../services/XanaVestingContractV1.service";
import { toast } from "react-toastify";
import TabComponent from "../Tab/tab";
import VestingV2 from "../../V2-Vesting/vestingV2";
import { isValidAddress } from "../../Utils/isValidAddress";
import { stakeTransactionCredential } from "../../store/metamask/stakeTransaction";

export default function HomePage() {
  // const [token, setToken] = useState("");
  const [userToDelete, setUserToDelete] = useState("");
  const [userData, setUserData]: any = useState({
    userName: "",
    maxSupply: '',
    address: "",
  });
  const dispatch = useDispatch();

  const addresses = useSelector(
    (state: any) => state.persistedReducer.providerReducer.address
  );
  const provider = useSelector(
    (state: any) => state.persistedReducer.providerReducer?.provider
  );
  const userConnected = useSelector(
    (state: any) => state.persistedReducer.reducer.userConnected
  );
  const transactionInProgress = useSelector(
    (state: any) => state.stakeTransactionReducer.transactionInProgress
  );
  const [_bug, _setBug] = useState("");
  const [inputwithdraw, setInputWithdraw] = useState("");
  const [inputReleaseFund, setInputReleaseFund] = useState("");
  const [inputLimit, setInputLimit] = useState("");
  const [inputLimitArray, setInputLimitArray] = useState<string[]>([]);
  const [stop, setStop] = useState(false);
  const [initialstop, setInitialStop] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [rewdPercentage, setRewdPercentage] = useState("");
  const [rewdPercentageArr, setRewdPercentageArr] = useState<string[]>([]);
  const [sumOfRewdPercnt, setSumOfRewdPercnt] = useState(0);
  const [disableAddRewdBtn, setDisableAddRewdBtn] = useState(false);
  const [disableAddLimitBtn, setDisableAddLimitBtn] = useState(false);
  const [activeTab, setActiveTab] = useState("V1");
  const [inputime, setInputTime] = useState("");
  const [isloading, setIsLoading] = useState({
    btn1: false,
    btn2: false,
    btn3: false,
    btn4: false,
    btn5: false,
    btn6: false,
    btn7: false,
    btn8: false,
  });
  let sum: any;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    _setBug("");
  }, [userData]);

  useEffect(() => {
    let Vestingobj = new XanaVestingContractServiceV1(process.env.NEXT_PUBLIC_RPC);
    Vestingobj.pause().then((initialPause) => {
      if (initialPause !== undefined) {
        setInitialStop(initialPause);
        setStop(initialPause);
      }
    });
  }, []);

  const handlePause = async () => {
    if (userConnected) {
      if (stop === false) return toast.error("Please mark the checkbox");
      // if (transactionInProgress === false) {
      //   const payload = {
      //     transactionInProgress: true,
      //   };
      //   dispatch(stakeTransactionCredential(payload));
        setIsLoading({
          ...isloading,
          btn4: true,
        });
        try {
          if (initialstop !== stop) {
            let Vestingobj = new XanaVestingContractServiceV1(provider);
            let pauseResponse = await Vestingobj.setPause(stop, addresses);
            if (pauseResponse) {
              if (stop) toast.success("Contract has been paused");
              else toast.success("Contract has been resumed");
              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));
              setIsLoading({
                ...isloading,
                btn4: false,
              });
            }
          }
        } catch {
          toast.error("Something went wrong .");
          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));
          setIsLoading({
            ...isloading,
            btn4: false,
          });
        }
      // } else {
      //   toast.info("Transaction in progess");
      // }
    } else {
      toast.info("Connect to wallet");
    }
  };

  const checkboxHandle = () => {
    if (stop === false) {
      setStop(true);
    } else {
      setStop(false);
    }
  };

  const handleValidTime = (e: any) => {
    let number = /^[0-9]+$/;
    if (number.test(e.target.value) || e.target.value === "") {
      setInputTime(e.target.value);
    } else {
      toast.error("Enter Number only");
    }
  };

  const changeLimitHandler = (e: any) => {
    // let numberRegex = /^(|[1-9]\d*)$/;
    let value = e.target.value;
    // if (numberRegex.test(value) && value <= 52) {
    setInputLimit(value);
    // } else {
    //   toast.error("Enter Number only", {
    //     position: "bottom-right",
    //     autoClose: 3000,
    //     progress: undefined,
    //     toastId: "FSgrtrthnten",
    //   });
    // }
    if (inputLimitArray.length !== 0) {
      let sum = 0;
      for (let i = 0; i < inputLimitArray.length; i++) {
        sum = sum + parseInt(inputLimitArray[i]);
      }
      let validValue = sum + parseInt(value);
      if ((sum && sum >= 52) || validValue > 52) {
        setDisableAddLimitBtn(true);
        toast.error("Sum is greater than 52", {
          position: "bottom-right",
          autoClose: 3000,
          progress: undefined,
          toastId: "FSgrtrthnten",
        });
      } else {
        setDisableAddLimitBtn(false);
      }
    }
  };

  const handleAddLimit = (e: any) => {
    if (inputLimit) {
      setInputLimitArray([...inputLimitArray, inputLimit]);
    }
  };

  const handleValidToken = (e: any) => {
    let letterNumber = /^[0-9a-zA-Z]+$/;
    if (letterNumber.test(e.target.value) || e.target.value === "") {
      if (e.target.name === "tokenAddress") setUserToken(e.target.value);
      if (e.target.name === "withdrawAddress") setInputWithdraw(e.target.value);
    } else {
      toast.error("enter valid address");
    }
  };

  const fixToken = async () => {
    if (userConnected) {
      if (transactionInProgress === false) {
        if (userToken === "") return;
        setIsLoading({
          ...isloading,
          btn1: true,
        });
        const payload = {
          transactionInProgress: true,
        };
        dispatch(stakeTransactionCredential(payload));
        if (isValidAddress(userToken)) {
          try {
            let Vestingobj = new XanaVestingContractServiceV1(provider);
            let tokenResponse = await Vestingobj.setToken(userToken, addresses);
            if (tokenResponse) {
              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));
              setUserToken("");
              toast.success("Set Token successfully");
              setIsLoading({
                ...isloading,
                btn1: false,
              });
            }
          } catch (err: any) {
            toast.error("something happpen while setToken");
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setUserToken("");
            setIsLoading({
              ...isloading,
              btn1: false,
            });
          }
        } else {
          toast.error("Enter Valid Address");
        }
      } else {
        toast.info("Transaction is in progess");
      }
    }
  };
  const emergecyWithdraw = async () => {
    if (userConnected) {
      if (!inputwithdraw) return toast.error("Please Enter Address To Withdraw!");
      // if (transactionInProgress === false) {
      //   const payload = {
      //     transactionInProgress: true,
      //   };
        // dispatch(stakeTransactionCredential(payload));
        if (isValidAddress(inputwithdraw)) {
          setIsLoading({
            ...isloading,
            btn7: true,
          });
          try {
            let Vestingobj = new XanaVestingContractServiceV1(provider);
            let emergencyWith = await Vestingobj.emergencyWithdraw(
              inputwithdraw,
              addresses
            );
            if (emergencyWith !== false) {
              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));
              setInputWithdraw("");
              toast.success("Withdraw Sucessfull");
              setIsLoading({
                ...isloading,
                btn7: false,
              });
            }
          } catch {
            setInputWithdraw("");
            toast.error("Something went wrong while withdraw.");
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setIsLoading({
              ...isloading,
              btn7: false,
            });
          }
        }
      // } else {
      //   toast.info("Transaction is in progess");
      // }
    } else {
      toast.info("Connect to Wallet");
    }
  };

  const relaseFund = async () => {
    if (userConnected) {
      // if (transactionInProgress === false) {
      //   const payload = {
      //     transactionInProgress: true,
      //   };
        setIsLoading({
          ...isloading,
          btn6: true,
        });
        let Vestingobj = new XanaVestingContractServiceV1(provider);
        Vestingobj.releaseFunds(addresses)
          .then((release) => {
            if (release !== false) toast.success("Realsed Fund Successfully");
            setIsLoading({
              ...isloading,
              btn6: false,
            });
          })
          .catch(() => {
            toast.error("Something went wrong while Release Funds.");
            setIsLoading({
              ...isloading,
              btn6: false,
            });
          });
     
      //   } else {
      //   toast.info("Transaction in progess");
      // }
    } else {
      toast.info("Connect to Wallet");
    }
  };

  const handleDelete = async () => {
    if (userConnected) {
      if (!deleteName) return toast.error("Please Enter Address To Delete !")
      // if (transactionInProgress === false) {
      //   const payload = {
      //     transactionInProgress: true,
      //   };
        if (deleteName === "") return;
        setIsLoading({
          ...isloading,
          btn3: true,
        });
        let Vestingobj = new XanaVestingContractServiceV1(provider);
        Vestingobj.deleteUser(deleteName, addresses)
          .then((deleteResponse: any) => {
            if (deleteResponse !== false) {
              toast.success("User deleted successfully");
              setDeleteName("");
              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));
              setDeleteName("");
              setIsLoading({
                ...isloading,
                btn3: false,
              });
            }
          })
          .catch(() => {
            toast.error("Something went wrong while deleting user");
            setDeleteName("");
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setIsLoading({
              ...isloading,
              btn3: false,
            });
          });
      
      //  else {
      //   toast.info("Connect to Wallet");
      // }
    } else {
      toast.info("MetaMask not connected");
    }
  };
  const RewardPercentageValidation = (e: any) => {
    const value = e.target.value;
    const regex = /^(|[1-9]\d*)$/;

    if (regex.test(value) && value <= 100) {
      setRewdPercentage(value);
    }
    if (rewdPercentageArr.length !== 0) {
      let sum = 0;
      for (let i = 0; i < rewdPercentageArr.length; i++) {
        sum = sum + parseInt(rewdPercentageArr[i]);
      }
      let validValue = sum + parseInt(value);
      if ((sum && sum >= 100) || validValue > 100) {
        setDisableAddRewdBtn(true);
        toast.error("Sum is greater than 100", {
          position: "bottom-right",
          autoClose: 3000,
          progress: undefined,
          toastId: "FSgrtrthnten",
        });
      } else {
        setDisableAddRewdBtn(false);
      }
      setSumOfRewdPercnt(sum);
    }
  };

  const handleAddRewardPercetage = (e: any) => {
    e.preventDefault();
    setRewdPercentageArr([...rewdPercentageArr, rewdPercentage]);
    setRewdPercentage("");
    if (sum && sum >= 100) {
      toast.error("Sum is greater than 100");
    }
    setSumOfRewdPercnt(sum);
  };

  const handleRemoveRewdPercentage = (e: any, item: number, index: number) => {
    e.preventDefault();
    const deletedRwdPercentage = rewdPercentageArr.filter(
      (arr, prcIndex) => prcIndex !== index
    );
    if (deletedRwdPercentage.length == 0) {
      setRewdPercentageArr([])
    } else {
      setRewdPercentageArr(deletedRwdPercentage);
    }
  };

  const handleRemoveLimit = (e: any, item: number, index: number) => {
    e.preventDefault();
    const deletedLimitValue = inputLimitArray.filter(
      (arr, limitVal) => limitVal !== index
    );
    if (deletedLimitValue.length == 0) {
      setInputLimitArray([])
    } else {
      setInputLimitArray(deletedLimitValue);
    }
  };

  const handleAddUserMethode = async (e: any) => {
    if (userConnected) {
      if (!userData.userName || !userData.maxSupply || !userData.address || rewdPercentageArr.length === 0) return toast.error(" Please Fill All the fields first !")

        let formattedArr =
          rewdPercentageArr &&
          rewdPercentageArr.map((item) => Web3.utils.toWei(item, "ether"));
        let formattedMaxSupply: any =
          userData.maxSupply && Web3.utils.toWei(userData.maxSupply, "ether");
        try {
          let Vestingobj = new XanaVestingContractServiceV1(provider);
          let tokenResponse = await Vestingobj.addUser(
            userData.userName,
            userData.maxSupply,
            userData.address,
            addresses
          );
          if (tokenResponse !== false) {

            setUserData({
              userName: "",
              maxSupply: '',
              address: "",
            })
            setRewdPercentage('')
            setRewdPercentageArr([])

            // setFixedToken(tokenResponse);
            toast.success("User Added successfully");
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setIsLoading({
              ...isloading,
              btn2: false,
            });
          }
        } catch (err: any) {
          setRewdPercentage('')
          setRewdPercentageArr([])
          setUserData({
            userName: "",
            maxSupply: '',
            address: "",
          })

          toast.error("something Went Wrong While adding User!");
          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));
          setIsLoading({
            ...isloading,
            btn2: false,
          });
        }
      // }
      // else{
      //   toast.info("Transaction is in progress")
      // }
      
    }
     else {
      toast.info("MetaMask not connected");
    }
  };
  const handleAddLimitMethod = async (e: any) => {
    if (userConnected) {
      if (inputLimitArray.length === 0) return toast.error("Please Enter Limit First !");
      // if (transactionInProgress === false) {
      //   const payload = {
      //     transactionInProgress: true,
      //   };
        e.preventDefault();
        setIsLoading({
          ...isloading,
          btn5: true,
        });
        try {
          let Vestingobj = new XanaVestingContractServiceV1(provider);
          let tokenResponse = await Vestingobj.setLimit(
            inputLimitArray,
            addresses
          );
          if (tokenResponse !== false) {
            // setFixedToken(tokenResponse);
            toast.success("Limit Added successfully");
            setInputLimit("");
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setIsLoading({
              ...isloading,
              btn5: false,
            });
          }
        } catch (err: any) {
          toast.error("something Went Wrong While adding Limit!");
          setInputLimit("");
          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));
          setIsLoading({
            ...isloading,
            btn5: false,
          });
        }
      // } else {
      //   toast.info("transaction is in progress !")
      // }


    }
  };
  const handleTabChange = (selectedTab: string) => {
    setActiveTab(selectedTab);
  };
  const handleSetTime = async () => {
    if (userConnected) {
      if (!inputime) return toast.error("please Enter Time First !");
      // if (transactionInProgress === false) {
      //   const payload = {
      //     transactionInProgress: true,
      //   };
        try {
          setIsLoading({
            ...isloading,
            btn8: true,
          });
          let Vestingobj = new XanaVestingContractServiceV1(provider);
          let initialTime = await Vestingobj.setTime(inputime, addresses);
          if (initialTime !== false) {
            toast.success("Set Time successfully");
            setInputTime("");
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setIsLoading({
              ...isloading,
              btn8: false,
            });
            setInputTime("");
          }
        } catch (err: any) {
          toast.error("something Went Wrong While setting time!");
          setInputTime("");
          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));
          setIsLoading({
            ...isloading,
            btn8: false,
          });
          setInputTime("");
        }
      // }
      // else {
      //   toast.error("Transaction in Progess")
      // }
    }
    else {
      toast.error("Connect to Wallet")
    }
  };

  return (
    <Container fluid className="landingUI">
      <Container className="px-0">
        <Row className="homepage-title mx-0">
          <Col className="text-center px-0">
            <h1 className="heading-1">VESTING</h1>
          </Col>
        </Row>

        <Row className="homepage-title mx-0">
          <Col className="col-12 col-sm-6 px-0">
            {/* <h2 className="heading-4 history-title">STAKING HISTORY</h2> */}
            <TabComponent
              activeKey={activeTab}
              tabOptions={[
                { key: "V1", title: "V1" },
                { key: "V2", title: "V2" },
              ]}
              onChangeTab={handleTabChange}
            />
          </Col>
        </Row>

        {activeTab === "V1" ? (
          <Row className="vestingAdmin">
            {/* <Card className="formCardUI">
              <Card.Header>Set Token</Card.Header>
              <Card.Body>
                <Form.Control
                  type="text"
                  name={"tokenAddress"}
                  placeholder="Enter Address to set Tokens"
                  value={userToken}
                  onChange={(e) => {
                    handleValidToken(e);
                  }}
                />
                {isloading.btn1 ? (
                  <Button className="submitBtn" onClick={fixToken}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button className="submitBtn" onClick={fixToken}>
                    Set Token
                  </Button>
                )}
              </Card.Body>
            </Card> */}

            <Card className="formCardUI addUserCls">
              <Card.Header>Add User</Card.Header>
              <Row className="m-0">
                <Card.Body className="col-md-6 col-xs-12">
                  <Form.Control
                    type="text"
                    placeholder="Enter User Name"
                    name="userName"
                    value={userData.userName}
                    onChange={(e) => handleChange(e)}
                  />
                </Card.Body>

                <Card.Body className="col-md-6 col-xs-12">
                  <Form.Control
                    type="text"
                    placeholder="Enter Max Supply"
                    name="maxSupply"
                    value={userData.maxSupply}

                    onChange={(e) => handleChange(e)}
                  />
                </Card.Body>

                <Card.Body className="col-md-6 col-xs-12">
                  <Form.Control
                    type="text"
                    placeholder="Enter Address"
                    name="address"
                    value={userData.address}
                    onChange={(e) => handleChange(e)}
                  />
                </Card.Body>

                <Card.Body className="col-md-6 col-xs-12">
                  <Form.Control
                    type="text"
                    placeholder="Enter Rewards Percentage"
                    value={sumOfRewdPercnt >= 100 ? "" : rewdPercentage}
                    onChange={(e) => RewardPercentageValidation(e)}
                  />
                  <Form.Group>
                    <Button
                      disabled={
                        sumOfRewdPercnt >= 100 ||
                          disableAddRewdBtn ||
                          rewdPercentage.length === 0
                          ? true
                          : false
                      }
                      onClick={(e) => handleAddRewardPercetage(e)}
                      className="addLimitBtn"
                    >
                      {" "}
                      Add{" "}
                    </Button>
                  </Form.Group>
                </Card.Body>
                {rewdPercentageArr.map((item: any, index) => {
                  return (
                    <Col md="1">
                      <Badge
                        key={index}
                        pill
                        style={{
                          backgroundColor: "#dc36ad",
                          fontSize: 30,
                          borderRadius: 20,
                          margin: 5,
                        }}
                        variant="dot"
                      >
                        {item}
                        <div
                          onClick={(e) =>
                            handleRemoveRewdPercentage(e, item, index)
                          }
                          style={{ position: "absolute", cursor: "pointer" }}
                        >
                          x
                        </div>
                      </Badge>
                    </Col>
                  );
                })}
              </Row>
              {isloading.btn2 ? (
                <Button
                  onClick={(e) => handleAddUserMethode(e)}
                  className="submitBtn ml-0"
                >
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Button>
              ) : (
                <Button
                  onClick={(e) => handleAddUserMethode(e)}
                  className="submitBtn ml-0"
                >
                  {" "}
                  Add{" "}
                </Button>
              )}
            </Card>
            <Card className="formCardUI">
              <Card.Header> Set Time</Card.Header>
              <Card.Body>
                <Form.Control
                  type="text"
                  placeholder="Enter Time"
                  value={inputime}
                  onChange={(e) => handleValidTime(e)}
                />
                {isloading.btn8 ? (
                  <Button className="submitBtn" onClick={handleSetTime}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button className="submitBtn" onClick={handleSetTime}>
                    Time
                  </Button>
                )}
              </Card.Body>
            </Card>
            <Card className="formCardUI">
              <Card.Header>Delete User</Card.Header>
              <Card.Body>
                <Form.Control
                  type="text"
                  placeholder="Enter User Name you Want to be Deleted"
                  value={deleteName}
                  onChange={(e) => setDeleteName(e.target.value)}
                />{" "}
                {isloading.btn3 ? (
                  <Button className="submitBtn" onClick={handleDelete}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button className="submitBtn" onClick={handleDelete}>
                    Delete
                  </Button>
                )}
              </Card.Body>
            </Card>

            <Card className="formCardUI">
              <Card.Header>Set Pause</Card.Header>
              <Card.Body>
                <Form.Group controlId="formBasicCheckbox" className="w-100">
                  <Form.Check
                    type="checkbox"
                    onChange={checkboxHandle}
                    checked={stop}
                  />
                </Form.Group>{" "}
                {isloading.btn4 ? (
                  <Button className="submitBtn" onClick={handlePause}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button className="submitBtn" onClick={handlePause}>
                    Confirm
                  </Button>
                )}
              </Card.Body>
            </Card>

            <Card className="formCardUI">
              <Card.Header> Set Limit </Card.Header>
              <Card.Body>
                <Form.Control
                  type="text"
                  placeholder="Enter Limit for User"
                  value={inputLimit}
                  onChange={(e) => changeLimitHandler(e)}
                />
                <Form.Group>
                  <Button
                    disabled={disableAddLimitBtn || !inputLimit ? true : false}
                    onClick={(e) => handleAddLimit(e)}
                    className="addLimitBtn"
                  >
                    Add
                  </Button>
                </Form.Group>
                {isloading.btn5 ? (
                  <Button
                    onClick={(e) => handleAddLimitMethod(e)}
                    className="submitBtn"
                  >
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => handleAddLimitMethod(e)}
                    className="submitBtn"
                  >
                    Confirm Add Limit
                  </Button>
                )}
              </Card.Body>
            </Card>
            {inputLimitArray.map((item: any, index) => {
              return (
                <Col style={{ marginTop: -40 }} md="1" className="mb-5">
                  <Badge
                    key={index}
                    pill
                    style={{
                      backgroundColor: "#dc36ad",
                      fontSize: 30,
                      borderRadius: 20,
                      width: 50,
                      // margin: 5,
                    }}
                    variant="dot"
                  >
                    {item}
                    <div
                      onClick={(e) => handleRemoveLimit(e, item, index)}
                      style={{ position: "absolute", cursor: "pointer" }}
                    >
                      x
                    </div>
                  </Badge>
                </Col>
              );
            })}

            <Card className="formCardUI">
              <Card.Header> Release Funds</Card.Header>
              <Card.Body>
                {isloading.btn6 ? (
                  <Button className="submitBtn" onClick={relaseFund}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button className="submitBtn" onClick={relaseFund}>
                    Release Funds
                  </Button>
                )}
              </Card.Body>
            </Card>

            <Card className="formCardUI">
              <Card.Header> Emergency Withdraw</Card.Header>
              <Card.Body>
                <Form.Control
                  type="text"
                  placeholder="Enter address for withdraw"
                  value={inputwithdraw}
                  name={"withdrawAddress"}
                  onChange={(e) => handleValidToken(e)}
                />
                {isloading.btn7 ? (
                  <Button className="submitBtn" onClick={emergecyWithdraw}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button className="submitBtn" onClick={emergecyWithdraw}>
                    WithDraw
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Row>
        ) : (
          <VestingV2 />
        )}
      </Container>
    </Container>
  );
}
