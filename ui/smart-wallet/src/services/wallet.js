import axios from "axios";
import { userSession } from "../user-session";
import { testnet_ft_tokens_meta } from "../lib/supported_ft_token";

export async function getBalance(clientConfig) {
    const userAddress = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'; //userSession?.loadUserData()?.profile?.stxAddress[clientConfig?.network];
    const { data, status } = await axios.get(`${clientConfig?.api}/extended/v1/address/${userAddress}/balances`);
    const { fungible_tokens, non_fungible_tokens, stx } = data;

    const rate = (await axios.get(`https://api.diadata.org/v1/assetQuotation/Stacks/0x0000000000000000000000000000000000000000`)).data;
    const fungibleTokens = Object.keys(fungible_tokens).map((key) => {
        return { contract_id: key, ...fungible_tokens[key], ...testnet_ft_tokens_meta('ST1J2JTYXGRMZYNKE40GM87ZCACSPSSEEQVSNB7DC.brc20-db20') };
    });
    const nonFungibleTokens = Object.keys(non_fungible_tokens).map((key) => {
        return { contract_id: key, ...non_fungible_tokens[key] };
    })
    return { stx: { ...stx, rate }, fungibleTokens, nonFungibleTokens };
}

export async function getWalletContractInfo(clientConfig) {
    let result;
    const userAddress = 'SPQZF23W7SEYBFG5JQ496NMY0G7379SRYEDREMSV';//userSession?.loadUserData()?.profile?.stxAddress[clientConfig?.network];
    // const contract_id = `${userAddress}.smartwallet`;
    const contract_id = `${userAddress}.smart-wallet`;

    try {
        const contractInfoData = await (await axios.get(`${clientConfig?.api}/extended/v2/smart-contracts/status?contract_id=${contract_id}`)).data
        const contractInfo = contractInfoData[contract_id];
        result = { found: contractInfo?.found, ...contractInfo?.result };
    } catch (error) {
        result = { found: false, error: error.message, code: error?.code };
    }

    return result;
}