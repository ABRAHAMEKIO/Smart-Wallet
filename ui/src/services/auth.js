import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { STACKS_TESTNET, STACKS_MAINNET, STACKS_MOCKNET, STACKS_DEVNET, StacksNetworks } from "@stacks/network";
const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export function authenticate() {
    showConnect({
        appDetails: {
            name: "Smart Wallet",
            icon: window.location.origin + "/logo512.png",
        },
        redirectTo: "/",
        onFinish: () => {
            window.location.reload();
        },
        userSession,
    });
}

export function disconnect() {
    userSession.signUserOut("/");
}

export function isUserAuthed() {
    return userSession.isUserSignedIn();
}

export function getAddress(network) {
    const networkVal = { testnet: 'testnet', devnet: 'testnet', mainnet: 'mainnet', mocknet: 'mainnet' }[network];
    console.log({ networkVal, network, ll: { testnet: 'testnet', devnet: 'testnet', mainnet: 'mainnet', mocknet: 'mainnet' }[network] });
    return isUserAuthed() ? userSession.loadUserData().profile.stxAddress[networkVal] : '';
}

export function getNetworks() {
    return StacksNetworks;
}

export function network(network) {
    return { mainnet: STACKS_MAINNET, testnet: STACKS_TESTNET, mocknet: STACKS_MOCKNET, devnet: STACKS_DEVNET }[network];
}