import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { XanaVestingContractServiceV2 } from "../services/XanaVestingContract_V2.service";
import { toast } from "react-toastify";
import { stakeTransactionCredential } from "../store/metamask/stakeTransaction";

export default function vestingV2() {
  const [userInputAddress, setUserInputAddress]: any = useState("");
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
  const [userInputToken, setUserInputToken] = useState("");
  const [deleteUserInput, setDeleteUserInput] = useState("");
  const [rewdPercentage, setRewdPercentage] = useState("");
  const [rewdPercentageArr, setRewdPercentageArr] = useState<string[]>([]);
  const [sumOfRewdPercnt, setSumOfRewdPercnt] = useState(0);
  const [disableAddRewdBtn, setDisableAddRewdBtn] = useState(false);
  const [pauseCheck, setPauseCheck] = useState(false);
  const [addressArray, setAddressArray] = useState<string[]>([]);
  const [initialstop, setInitialStop] = useState(false);
  const [inputVesting, setInputVesting] = useState("");
  const [isloading, setIsLoading] = useState({
    tokenBtnLoading: false,
    addUserBtnLoading: false,
    DeleteBtnLoading: false,
    PauseBtnLoading: false,
    VestingLoading: false,
  });
  const dispatch = useDispatch();

  let sum: any = 0;
  useEffect(() => {
    let VestingV2Obj = new XanaVestingContractServiceV2(process.env.NEXT_PUBLIC_RPC);
    VestingV2Obj.pause().then((initialPause: boolean) => {
      if (initialPause !== undefined) {
        setInitialStop(initialPause);
        setPauseCheck(initialPause);
      }
    });
  }, []);

  const handeleSetPause = async (e: any) => {
    if (userConnected) {
      if (pauseCheck === false) return toast.error("Please mark the checkbox");
      // if (transactionInProgress === false) {
      //   const payload = {
      //     transactionInProgress: true,
      //   };
      //   dispatch(stakeTransactionCredential(payload));
        try {
          if (initialstop !== pauseCheck) {
            let VestingV2Obj = new XanaVestingContractServiceV2(provider);
            let pauseResponse = await VestingV2Obj.setPause(
              pauseCheck,
              addresses
            );
            if (pauseResponse) {
              if (pauseCheck) toast.success("Contract has been paused");
              else toast.success("Contract has been resumed");
              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));
              setIsLoading({
                ...isloading,
                PauseBtnLoading: false,
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
            PauseBtnLoading: false,
          });
        }
      // } else {
      //   toast.info("Transaction in progess");
      // }
    } else {
      toast.info("Connect to wallet");
    }
  };

  const handlePauseCheck = async () => {
    if (pauseCheck === false) {
      setPauseCheck(true);
    } else {
      setPauseCheck(false);
    }
  };
  const handleUserTokenInput = async (e: any) => {
    e.preventDefault();
    if (e) {
      setUserInputToken(e.target.value);
    }
  };

  const setToken = async () => {
    if (userConnected) {
      if (transactionInProgress === false) {
        setIsLoading({ ...isloading, tokenBtnLoading: true });
        const payload = {
          transactionInProgress: true,
        };
        dispatch(stakeTransactionCredential(payload));

        let validUserInputAddress = Web3.utils.isAddress(userInputToken);

        if (validUserInputAddress === true) {
          try {
            let Vesting2obj = new XanaVestingContractServiceV2(provider);
            let tokenResponse = await Vesting2obj.setToken(
              userInputToken,
              addresses
            );

            if (tokenResponse !== false) {
              setIsLoading({ ...isloading, tokenBtnLoading: false });
              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));

              setUserInputToken("");
              toast.success("Set Token successfully");
            }
          } catch (errr: any) {
            setIsLoading({ ...isloading, tokenBtnLoading: false });
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setUserInputToken("");
            toast.error("something happpen while setToken");
          }
        } else {
          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));
          setIsLoading({ ...isloading, tokenBtnLoading: false });
          setUserInputToken("");
          toast.error("Enter Valid Address");
        }
      } else {
        toast.info("Transaction is in Progress !");
      }
    } else {
      toast.error("Connect To Wallet !");
    }
  };

  const validDelete = (e: any) => {
    if (e) {
      setDeleteUserInput(e.target.value);
    }
  };

  const handleDelete = async () => {
    if (userConnected) {
      if (!deleteUserInput) return toast.error("Enter Address To be deleted !")
      // if (transactionInProgress === false) {
      //   setIsLoading({ ...isloading, DeleteBtnLoading: true });

      //   const payload = {
      //     transactionInProgress: true,
      //   };
      //   dispatch(stakeTransactionCredential(payload));

        let validDeleteUserAddress = Web3.utils.isAddress(deleteUserInput);
        if (validDeleteUserAddress === true) {
          try {
            let Vesting2obj = new XanaVestingContractServiceV2(provider);
            let deleteResponse = await Vesting2obj.deleteUser(
              deleteUserInput,
              addresses
            );
            if (deleteResponse !== false) {
              setDeleteUserInput("");
              setIsLoading({ ...isloading, DeleteBtnLoading: false });

              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));

              toast.success("user Deleted successfully");
            }
          } catch (error) {
            setDeleteUserInput("");
            setIsLoading({ ...isloading, DeleteBtnLoading: false });

            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));

            toast.error("Something went wrong while deleting user");
          }
        } else {
          setIsLoading({ ...isloading, DeleteBtnLoading: false });
          setDeleteUserInput("");
          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));

          toast.error("Enter Valid Address");
        }
      // } else {
      //   toast.info("Transaction is in Progress !");
      // }
    } else {
      toast.error("Connect To Wallet !");
    }
  };

  const RewardPercentageValidation = (e: any) => {
    const value = e.target.value;
    const regex = /^(|[1-9]\d*)$/;

    if (regex.test(value) && value <= 100) {
      setRewdPercentage(value);
    }
    if (rewdPercentageArr.length !== 0) {
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

  const handleRemoveAddress = (event: any, item: number, i: number) => {
    event.preventDefault();

    const deletedAddress = addressArray.filter(
      (arr, addressIndex) => addressIndex !== i
    );
    if (deletedAddress.length == 0) {
      setAddressArray([])
      setUserInputAddress("");
    } else {
      setAddressArray(deletedAddress);
    }
  };

  const handleAddUserMethod = async (e: any) => {
    e.preventDefault();
    if (userConnected) {
      if (rewdPercentageArr.length === 0 || !userInputAddress) return toast.error("please fill all the field first !");
      // if (transactionInProgress === false) {
      //   setIsLoading({ ...isloading, addUserBtnLoading: true });

      //   const payload = {
      //     transactionInProgress: true,
      //   };
      //   dispatch(stakeTransactionCredential(payload));

        let percentage = rewdPercentageArr.map((item) =>
          // Web3.utils.toWei(item, "ether")
          item
        );
        let validAddress = Web3.utils.isAddress(userInputAddress);
        if (validAddress === true) {
          let InputAddress = addressArray;
          try {
            let Vesting2obj = new XanaVestingContractServiceV2(provider);
            let tokenResponse = await Vesting2obj.setUser(
              InputAddress,
              percentage,
              addresses
            );
            if (tokenResponse !== false) {
              setIsLoading({ ...isloading, addUserBtnLoading: false });
              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));
              toast.success("User Added successfully");
              setUserInputAddress("");
              setRewdPercentageArr([])
              setAddressArray([])
              setRewdPercentage('')
            }
          } catch (err: any) {
            setIsLoading({ ...isloading, addUserBtnLoading: false });
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setRewdPercentageArr([])
            setRewdPercentage('')
            setUserInputAddress("");
            setAddressArray([])
            toast.error("something Went Wrong While adding User !");
            setUserInputAddress("");
          }
        } else {
          setIsLoading({ ...isloading, addUserBtnLoading: false });

          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));

          toast.error("Enter Valid Address");
        }
      // } 
      // else {
      //   toast.info("Transaction is in Progress !");
      // }
    } else {
      toast.error("Connect To Wallet !");
    }
  };

  const handleAddRewardPercetage = (e: any) => {
    e.preventDefault();
    if (userConnected) {
      let validAddressInput;

      if (userInputAddress) {
        validAddressInput = Web3.utils.isAddress(userInputAddress);
      }

      if (validAddressInput && !addressArray.includes(userInputAddress)) {
        setAddressArray([...addressArray, userInputAddress]);
      }
      setRewdPercentageArr([...rewdPercentageArr, rewdPercentage]);
      setRewdPercentage("");
      if (sum && sum >= 100) {
        toast.error("Sum is greater than 100", {
          position: "bottom-right",
          autoClose: 3000,
          progress: undefined,
          toastId: "FSgrtrthnten",
        });
      }
      setSumOfRewdPercnt(sum);
    } else {
      toast.error("Connect To Wallet !");
    }
  };

  const handleRemoveRewdPercentage = (e: any, item: number, index: number) => {
    e.preventDefault();
    const deletedRwdPercentage = rewdPercentageArr.filter(
      (arr, prcIndex) => prcIndex !== index
    );
    if (deletedRwdPercentage.length == 0) {
      setRewdPercentageArr([])
      setUserInputAddress("");
    } else {
      setRewdPercentageArr(deletedRwdPercentage);
    }
  };
  const handleValidToken = (e: any) => {
    let letterNumber = /^[0-9a-zA-Z]+$/;
    if (letterNumber.test(e.target.value) || e.target.value === "") {
      setInputVesting(e.target.value);
    } else {
      toast.error("enter valid address");
    }
  };
  const handleSetVesting = async (e: any) => {
    e.preventDefault();
    if (userConnected) {
      if (!inputVesting) return toast.error("Enter Address First !");
      // if (transactionInProgress === false) {
      //   const payload = {
      //     transactionInProgress: true,
      //   };
      //   dispatch(stakeTransactionCredential(payload));
        let validAddress = Web3.utils.isAddress(inputVesting);
        if (validAddress === true) {
          try {
            setIsLoading({
              ...isloading,
              VestingLoading: true,
            });
            let Vesting2obj = new XanaVestingContractServiceV2(provider);
            let setVestingResponse = await Vesting2obj.setVesting(
              inputVesting,
              addresses
            );
            if (setVestingResponse !== false) {
              const payload = {
                transactionInProgress: false,
              };
              dispatch(stakeTransactionCredential(payload));
              setInputVesting("");
              toast.success("Set Vesting successfull");
              setIsLoading({
                ...isloading,
                VestingLoading: false,
              });
            }
          } catch (err: any) {
            const payload = {
              transactionInProgress: false,
            };
            dispatch(stakeTransactionCredential(payload));
            setInputVesting("");
            setIsLoading({
              ...isloading,
              VestingLoading: false,
            });
            toast.error("something Went Wrong While vesting !");
            setInputVesting("");
          }
        } else {
          const payload = {
            transactionInProgress: false,
          };
          dispatch(stakeTransactionCredential(payload));
          setIsLoading({
            ...isloading,
            VestingLoading: false,
          });
          toast.error("Enter Valid Address");
        }
      // } else {
      //   toast.info("Transaction is in Progress !");

        setIsLoading({
          ...isloading,
          VestingLoading: false,
        });
    } else {
      toast.error("Connect To Wallet !");
    }
  };
  return (
    <Container fluid className="landingUI">
      <Container className="px-0">
        <Row className="vestingAdmin">
          {/* <Card className="formCardUI">
            <Card.Header>Set Token</Card.Header>
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="Enter Address to set Tokens"
                value={userInputToken}
                onChange={(e) => handleUserTokenInput(e)}
              />
              {isloading.tokenBtnLoading ?
                <Button className="submitBtn" onClick={setToken}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Button>
                :
                <Button className="submitBtn" onClick={setToken}>
                  Set Token
                </Button>
              }
            </Card.Body>
          </Card> */}

          <Card className="formCardUI addUserCls">
            <Card.Header>Add User</Card.Header>
            <Row className="m-0">
              <Card.Body className="col-md-6 col-xs-12">
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={userInputAddress}
                  onChange={(e) => setUserInputAddress(e.target.value)}
                />
              </Card.Body>

              <Card.Body className="col-md-6 col-xs-12">
                <Form.Control
                  type="text"
                  placeholder="Enter Percentage"
                  value={sumOfRewdPercnt >= 100 ? "" : rewdPercentage}
                  onChange={(e) => RewardPercentageValidation(e)}
                />
                <Form.Group className="m-3">
                  <Button
                    disabled={
                      sumOfRewdPercnt >= 100 ||
                        disableAddRewdBtn ||
                        rewdPercentage.length === 0
                        ? true
                        : false
                    }
                    onClick={(e) => handleAddRewardPercetage(e)}
                    className="submitBtn ml-0"
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

              {addressArray &&
                addressArray.map((item: any, index) => {
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
                        {item.slice(0, 4)}...
                        <div
                          onClick={(event) =>
                            handleRemoveAddress(event, item, index)
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

            {isloading.addUserBtnLoading ? (
              <Button
                onClick={(e) => handleAddUserMethod(e)}
                className="submitBtn ml-0"
              >
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Button>
            ) : (
              <Button
                onClick={(e) => handleAddUserMethod(e)}
                className="submitBtn ml-0"
              >
                Add User
              </Button>
            )}
          </Card>
          <Card className="formCardUI">
            <Card.Header> Set Vesting</Card.Header>
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="Enter Vesting"
                value={inputVesting}
                onChange={(e) => handleValidToken(e)}
              />
              {isloading.VestingLoading ? (
                <Button className="submitBtn" onClick={handleSetVesting}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Button>
              ) : (
                <Button className="submitBtn" onClick={handleSetVesting}>
                  Set Vesting
                </Button>
              )}
            </Card.Body>
          </Card>

          <Card className="formCardUI">
            <Card.Header>Delete User</Card.Header>
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="Enter User Address you Want to be Deleted"
                value={deleteUserInput}
                onChange={(e) => validDelete(e)}
              />
              {isloading.DeleteBtnLoading ? (
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
                  label={pauseCheck ? " Checked " : "Check me out"}
                  onChange={handlePauseCheck}
                  checked={pauseCheck}
                />
              </Form.Group>
              {isloading.PauseBtnLoading ? (
                <Button className="submitBtn" onClick={handeleSetPause}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Button>
              ) : (
                <Button className="submitBtn" onClick={handeleSetPause}>
                  Confirm
                </Button>
              )}
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </Container>
  );
}
