// import contracts here
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { XanaVestingContractV1 } from "../Components/Common/XanaVestingContract_V1 ";

class XanaVestingContractServiceV1 {
  contract: any = {};
  constructor(web3Provider: any, address: string = XanaVestingContractV1.address) {
    let web3 = new Web3(web3Provider);
    if (web3) {
      this.contract = new web3.eth.Contract(
        XanaVestingContractV1.abi as AbiItem[],
        address
      );
    }
  }

  distributionList = async (userName: any, step: any) => {
    let distributionResponse = this.contract.methods
      .distributionList(userName, step)
      .call();
    if (distributionResponse) return distributionResponse;
    return false;
  };

  getPercentage = async (userName: any, step: any) => {
    let distributionResponse = this.contract.methods
      .getPercentage(userName, step)
      .call();
    if (distributionResponse) return distributionResponse;
    return false;
  };

  users = async (username: any) => {
    let userResult = await this.contract.methods.users(username).call();
    if (userResult) return userResult;
    else return false;
  };

  setToken = async ( tokenAddress: string , address: string ) => {
    let fixToken = await this.contract.methods
      .setToken(tokenAddress)
      .send({ from: address });
    if (fixToken) return fixToken;
  };

  emission = async () => {
    let emissionResponse = await this.contract.methods.emission().call();
    if (emissionResponse !== undefined) return emissionResponse;
    else return false;
  };

  addUser = async (
    userName: string,
    maxSupply: number,
    address: any,
    userAddress: any
  ) => {
    let addUser = await this.contract.methods
      .setUser(userName, maxSupply, address)
      .send({ from: userAddress });
    if (addUser) return addUser;
  };

  deleteUser = async (userName: string, address: string) => {
    let deleteResponse = await this.contract.methods
      .deleteUser(userName)
      .send({ from: address });
    if (deleteResponse) return deleteResponse;
    else false;
  };

  setPause = async (pause: boolean, address: string) => {
    let pauseResponse = await this.contract.methods
      .setPause(pause)
      .send({ from: address });

    if (pauseResponse) return pauseResponse;
    else false;
  };

  setLimit = async (formattedInputLimitArray: string[], userAddress: any) => {
    let setLimit = await this.contract.methods
      .setLimit(formattedInputLimitArray)
      .send({ from: userAddress });
    if (setLimit) return setLimit;
  };

  releaseFunds = async (address: string) => {
    let release = await this.contract.methods
      .releaseFunds()
      .send({ from: address });
    if (release) return release;
  };

  emergencyWithdraw = async (address: string, userInputAddress: string) => {
    let emergencyWith = await this.contract.methods
      .emergencyWithdraw(userInputAddress)
      .send({ from: address });
    if (emergencyWith) return emergencyWith;
    else false;
  };

  pause = async () => {
    let initialPause = await this.contract.methods.pause().call();
    if (initialPause === true || initialPause === false) return initialPause;
    return undefined;
  };

  decimals = async () => {
    let initialPause = await this.contract.methods.decimals().call();
    if (initialPause !== undefined) return initialPause;
    return false;
  };
setTime=async(time:string,address:string)=>{
  let initialTime = await this.contract.methods.setTime(time).send({from:address});
  if (initialTime) return initialTime;
  return false;
}
}
export { XanaVestingContractServiceV1 };
