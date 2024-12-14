import axios from "axios";
import { api, decimals } from "../lib/constants";
import { bufferCV, callReadOnlyFunction, createAssetInfo, cvToValue, FungibleConditionCode, makeContractFungiblePostCondition, makeContractSTXPostCondition, optionalCVOf, principalCV, uintCV } from "@stacks/transactions";
import { Button } from "@nextui-org/react";
import { IoMdSend } from "react-icons/io";
import { useConnect } from "@stacks/connect-react";
import { getAddress, network } from "./auth";

export async function getAllAssets(address, network) {
    let balance = { stx: { balance: 0, rate: 0 }, fungible_tokens: [], non_fungible_tokens: [] };
    const apiUrl = `${api[network]}/extended/v1/address/${address}/balances`;

    try {
        const res = await axios.get(apiUrl);
        if (res.status === 200 && res.data) {
            const { data: { stx, fungible_tokens, non_fungible_tokens } } = res
            const stxRate = (await axios.get('https://api.diadata.org/v1/assetQuotation/Stacks/0x0000000000000000000000000000000000000000')).data;
            console.log({ stxRate });
            balance = {
                stx: { balance: (stx?.balance/1000000).toFixed(2), rate: (stxRate?.Price).toFixed(2) },
                fungible_tokens: Object.keys(fungible_tokens).map((key) => {
                    return {
                        name: key.split('::')[1],
                        balance: fungible_tokens[key].balance / decimals[key],
                        icon: './icon-placeholder.svg',
                        contract_id: key
                    }
                }),
                non_fungible_tokens: Object.keys(non_fungible_tokens).map((key) => {
                    return {
                        name: key.split('::')[1],
                        count: non_fungible_tokens[key].count,
                        image: '',
                        contract_id: key
                    }
                })
            };
            console.log({ balance });
        } else {
            throw res.status;
        }
    } catch (error) {
        console.log(error);
    }

    return balance;
}

export default function SendAsset({ props }) {
    const { doContractCall } = useConnect();
    console.log({ props });
    async function send() {
        console.log("çlicked", { props });
        let condition;
        const address = getAddress(props.network);
        const contractName = "smart-wallet-standard";
        const conditionCode = FungibleConditionCode.LessEqual;
        const amount = props.amount;

        if (props.isStx) {
            condition = makeContractSTXPostCondition(address, contractName, conditionCode, amount);
        } else {
            const assetInfo = createAssetInfo(props.address.split('.')[0], props.address.split('.')[1].split('::')[0], props.address.split('.')[1].split('::')[1]);
            condition = makeContractFungiblePostCondition(address, contractName, conditionCode, amount, assetInfo);
        }
        doContractCall({
            contractAddress: address,
            contractName: contractName,
            functionName: props.isStx ? 'stx-transfer' : 'sip010-transfer',
            functionArgs: props.isStx
                ? [uintCV(amount), principalCV(props.receiver), optionalCVOf(bufferCV(props.memo))]
                : [uintCV(amount), principalCV(props.recipient), optionalCVOf(bufferCV(props.memo)), principalCV(props.address.split('::')[0])],
            stxAddress: contractName,
            postConditions: [condition],
            network: network(props.network)
        })
    }

    return (
        <Button className="p-0" color="primary" radius="full" onPress={send}>
            <IoMdSend />
        </Button>
    )
}