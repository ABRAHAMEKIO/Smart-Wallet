import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { STACKS_TESTNET, STACKS_MAINNET, STACKS_MOCKNET, STACKS_DEVNET } from "@stacks/network";
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
    return isUserAuthed() ? userSession.loadUserData().profile.stxAddress[network] : '';
}

export function network(network) {
    return { testnet: STACKS_TESTNET, mainnet: STACKS_MAINNET }[network];
}