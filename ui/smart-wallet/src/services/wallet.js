import axios from "axios";
import { userSession } from "../user-session";
import { testnet_ft_tokens_meta } from "../lib/supported_ft_token";
import { bufferCV, cvToValue, fetchCallReadOnlyFunction, hexToCV, Pc, uintCV } from "@stacks/transactions";
import { Buffer } from "buffer";
import { network } from "../lib/constants";
import { clientFromNetwork } from "@stacks/network";

export async function getSmartWalletBalance(clientConfig) {
    const userAddress = 'SP2EX5XP57Q02WV8VT0SAE849Z0GCA9D2X12ERFX6'; //userSession?.loadUserData()?.profile?.stxAddress[clientConfig?.network];
    const { data, status } = await axios.get(`${clientConfig?.api}/extended/v1/address/${userAddress}/balances`);
    const { fungible_tokens, non_fungible_tokens, stx } = data;

    const rate = (await axios.get(`https://api.diadata.org/v1/assetQuotation/Stacks/0x0000000000000000000000000000000000000000`)).data;
    const fungibleTokens = Object.keys(fungible_tokens).map((key) => {
        return { contract_id: key, ...fungible_tokens[key], name: key.split('::')[1], contract_principal: key.split('::')[0] };
    });
    const nonFungibleTokens = await Promise.all(Object.keys(non_fungible_tokens).map(async (key) => {
        let asset = (await axios.get(`${clientConfig?.api}/extended/v1/tokens/nft/holdings?principal=${userAddress}&asset_identifiers=${key}&offset=0&limit=50`)).data?.results;
        asset = asset?.map((values) => {
            const hexvals = hexToCV(values?.value?.hex);
            const buffValue = hexvals?.value?.name ? Buffer.from(hexvals?.value?.name?.value, "hex").toString() : values?.value?.repr.slice(1);
            console.log({ buffValue });
            return {
                ...values,
                name: values?.asset_identifier.split('::')[1],
                value: buffValue
            }
        })
        return asset;
    }));
    return { stx: { ...stx, rate }, fungibleTokens, nonFungibleTokens: nonFungibleTokens.flat() };
}

export async function getUserBalance(clientConfig) {
    const userAddress = 'SP2EX5XP57Q02WV8VT0SAE849Z0GCA9D2X12ERFX6'; //userSession?.loadUserData()?.profile?.stxAddress[clientConfig?.network];
    const { data, status } = await axios.get(`${clientConfig?.api}/extended/v1/address/${userAddress}/balances`);
    const { fungible_tokens, non_fungible_tokens, stx } = data;

    const rate = (await axios.get(`https://api.diadata.org/v1/assetQuotation/Stacks/0x0000000000000000000000000000000000000000`)).data;
    const fungibleTokens = Object.keys(fungible_tokens).map((key) => {
        return { contract_id: key, ...fungible_tokens[key], name: key.split('::')[1] };
    });
    const nonFungibleTokens = await Promise.all(Object.keys(non_fungible_tokens).map(async (key) => {
        let asset = (await axios.get(`${clientConfig?.api}/extended/v1/tokens/nft/holdings?principal=${userAddress}&asset_identifiers=${key}&offset=0&limit=50`)).data?.results;
        asset = asset?.map((values) => {
            const hexvals = hexToCV(values?.value?.hex);
            const buffValue = hexvals?.value?.name ? Buffer.from(hexvals?.value?.name?.value, "hex").toString() : values?.value?.repr.slice(1);
            console.log({ buffValue });
            return {
                ...values,
                name: values?.asset_identifier.split('::')[1],
                value: buffValue
            }
        })
        return asset;
    }));
    return { stx: { ...stx, rate }, fungibleTokens, nonFungibleTokens: nonFungibleTokens.flat() };
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

export async function getNftWallet(targetAssetAddress, assetId, clientConfig) {
    let result;
    try {
        const userAddress = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];
        let metaUri = await fetchCallReadOnlyFunction({
            contractAddress: targetAssetAddress.split('.')[0],
            contractName: targetAssetAddress.split('::')[0].split('.')[1],
            functionName: 'get-token-uri',
            functionArgs: [uintCV(parseInt(assetId))],
            network: network(clientFromNetwork?.chain),
            senderAddress: userAddress
        });
        metaUri = cvToValue(metaUri)?.value?.value;
        const getmeta = (await axios.get(metaUri)).data;
        result = getmeta;
    } catch (error) {
        result = {
            attributes: [],
            description: error?.message,
            image: "https://nft-ad-2.aibtc.dev/aibtcdev-2.png",
            name: error?.code,
            properties: {}
        }
    }


    return result;
}