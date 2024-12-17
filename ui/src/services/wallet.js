import axios from "axios";
import { api } from "../lib/constants";
import { testnet_ft_tokens_meta } from "../lib/ft_testnet_meta";

export async function getAllAssets(address, network) {
    let balance = { stx: { balance: 0, rate: 0 }, fungible_tokens: [], non_fungible_tokens: [] };
    const apiUrl = `${api[network]}/extended/v1/address/${address}/balances`;

    try {
        const res = await axios.get(apiUrl);
        if (res.status === 200 && res.data) {
            const { data: { stx, fungible_tokens, non_fungible_tokens } } = res
            const stxRate = (await axios.get('https://api.diadata.org/v1/assetQuotation/Stacks/0x0000000000000000000000000000000000000000')).data;
            balance = {
                stx: { balance: (stx?.balance / 1000000).toFixed(2), rate: (stxRate?.Price).toFixed(2) },
                fungible_tokens: Object.keys(fungible_tokens).map((key) => {
                    return {
                        ...testnet_ft_tokens_meta[key.split('::')[0]], ...{
                            balance: parseInt(fungible_tokens[key].balance),
                            suggested_name: key.split('::')[1],
                            placeholder_icon: './icon-placeholder.svg',
                            contract_principal: key.split('::')[0],
                            contract_identity: key
                        }
                    };
                }),
                non_fungible_tokens: Object.keys(non_fungible_tokens).map((key) => {
                    return {
                        name: key.split('::')[1],
                        count: non_fungible_tokens[key].count,
                        contract_id: key,
                        contract_address: key.split('::')[0],
                        image_url: '/nft-placeholder.svg'
                    }
                })
            };
        } else {
            throw res.status;
        }
    } catch (error) {
        console.log(error);
    }

    return balance;
}