import Web3 from "web3"
export const isValidAddress = (adr:string) => {
    try {
      const web3 = new Web3()
       return web3.utils.isAddress(adr)
    } catch (e) {
      return false
    }
  };