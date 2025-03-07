import { STACKS_DEVNET, STACKS_MAINNET, STACKS_MOCKNET, STACKS_TESTNET } from "@stacks/network";

export const api = {
    testnet: 'https://api.testnet.hiro.so',
    mainnet: 'https://api.hiro.so',
    devnet: 'https://localhost:3999',
    nakamototestnet: 'https://api.nakamoto.testnet.hiro.so',
};

export const explorer = (address, tx, network) => {
    const explorerUrl = {
        mainnet: `https://explorer.hiro.so/${address ? 'address' : 'txid'}/${address || tx}?chain=mainnet`,
        testnet: `https://explorer.hiro.so/${address ? 'address' : 'txid'}/${address || tx}?chain=testnet`,
        devnet: `http://localhost:3999/${address ? 'address' : 'txid'}/${address || tx}?chain=devnet`,
    }
    return explorerUrl[network];
}

export const network = (chain) => {
    const networks = {
        mainnet: STACKS_MAINNET,
        testnet: STACKS_TESTNET,
        devnet: STACKS_DEVNET,
        mocknet: STACKS_MOCKNET
    };
    return networks[chain];
}

export const storageProvider = {
    ipfs: { replace: "https://ipfs.tech/", at: "ipfs:/" },
    gaia: ""
};