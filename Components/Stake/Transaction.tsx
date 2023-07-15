import React, { useEffect, useState } from 'react'
import { Button } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
// import { connectors } from "../WalletConnect/Connectors/Connectors";
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
// import Abi, { address } from "../Common/Abi/Abi";
import { useDispatch, useSelector } from "react-redux";

const Transaction = () => {
    const { activate, library, account, deactivate, connector, active } = useWeb3React();
    const [webreact, setWebReact] = useState("");
    const addresses = useSelector((state: any) => state.persistedReducer.providerReducer.address)

    const metatransfer = () => {
        // const abi = Abi;
        // if (library?.provider) {
        // const web3 = new Web3(library?.provider);
        // const contract = new web3.eth.Contract(abi as AbiItem[], address);
        // const amount = Web3.utils.toWei('10000000000000', 'ether');
        //     contract.methods.approve(address, amount).send({
        //         from: addresses,
        //     }).then((result: any) => alert("result")).catch((err:string) => alert(err));
        // }
    }

    return (
        <>
            <Button onClick={metatransfer}>stake now</Button>
        </>
    )
}

export default Transaction;