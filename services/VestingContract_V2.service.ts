import { VestingContract_V2 } from "../Components/Common/VestingContract_V2";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

class VestingContractService {
  contract: any = {};
  constructor(web3Provider: any, address: string = VestingContract_V2.address) {
    let web3 = new Web3(web3Provider);
    if (web3) {
      this.contract = new web3.eth.Contract(
        VestingContract_V2.abi as AbiItem[],
        address
      );
    }
  }

  getName = async () => {
    let nameRespone = await this.contract.methods.name().call();
    if (nameRespone) return nameRespone;
    return undefined;
  };

  users = async (userAddress: string) => {
    let userResult = await this.contract.methods.users(userAddress).call();
    if (userResult) return userResult;
    else return false;
  };

  setToken = async (tokenAddress: string , address: string ) => {
    let fixToken = await this.contract.methods
      .setToken(tokenAddress)
      .send({ from: address });
    if (fixToken) return fixToken;
  };

  claim = async (address: any) => {
    let claimResult = await this.contract.methods
      .claim(address)
      .send({ from: address });
    if (claimResult) return claimResult;
    else return false;
  };

  deleteUser = async (inputAddress: any, userAddress: any) => {
    let deleteResult = await this.contract.methods
      .deleteUser(inputAddress)
      .send({ from: userAddress });
    if (deleteResult) return deleteResult;
    else return false;
  };
  pause = async () => {
    let initialPause = await this.contract.methods.pause().call();
    if (initialPause === true || initialPause === false) return initialPause;
    return undefined;
  };

  setPause = async (pause: boolean, address: string) => {
    let pauseResponse = await this.contract.methods
      .setPause(pause)
      .send({ from: address });
    if (pauseResponse) return pauseResponse;
    else false;
  };

  setUser = async (
    address: string[],
    Percentage: string[],
    userAddress: any
  ) => {
    let setUser = await this.contract.methods
      .setUsers(address, Percentage)
      .send({ from: userAddress });
    if (setUser) return setUser;
  };

  decimals = async () => {
    let initialPause = await this.contract.methods.decimals().call();
    if (initialPause !== undefined) return initialPause;
    return false;
  };
  setVesting=async(userAddress:string, address:string)=>{
    let setVestingResponse= await this.contract.methods.setVesting(userAddress).send({from:address});
    if(setVestingResponse) return setVestingResponse;
  }
}

export { VestingContractService };
