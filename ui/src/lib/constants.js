export const api = {
    testnet: 'https://api.testnet.hiro.so',
    mainnet: 'https://api.hiro.so',
    nakamototestnet: 'https://api.nakamoto.testnet.hiro.so',
};

export const explorer = (address, tx, network) => {
    const explorerUrl = {
        mainnet: `https://explorer.hiro.so/${address ? 'address' : 'txid'}/${address || tx}?chain=mainnet`,
        testnet: `https://explorer.hiro.so/${address ? 'address' : 'txid'}/${address || tx}?chain=testnet`,
        devnet: `http://localhost:3999/${address ? 'address' : 'txid'}/${address || tx}?chain=devnet`,
    }
    console.log({ url: explorerUrl[network], address, tx, network });
    return explorerUrl[network];
}

export const spportedExtensions = [
    { key: "cat", label: "Cat" },
    { key: "dog", label: "Dog" },
    { key: "elephant", label: "Elephant" },
    { key: "lion", label: "Lion" },
    { key: "tiger", label: "Tiger" },
    { key: "giraffe", label: "Giraffe" },
    { key: "dolphin", label: "Dolphin" },
    { key: "penguin", label: "Penguin" },
    { key: "zebra", label: "Zebra" },
    { key: "shark", label: "Shark" },
    { key: "whale", label: "Whale" },
    { key: "otter", label: "Otter" },
    { key: "crocodile", label: "Crocodile" },
]

