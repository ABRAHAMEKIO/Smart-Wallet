import {
  isConnected,
  connect,
  disconnect as stacksDisconnect,
  getLocalStorage,
} from "@stacks/connect";
import {
  STACKS_TESTNET,
  STACKS_MAINNET,
  STACKS_MOCKNET,
  STACKS_DEVNET,
  StacksNetworks,
} from "@stacks/network";
const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export function authenticate() {
  return connect();
  return;
  return showConnect({
    appDetails: {
      name: "Smart Wallet",
      icon: "https://smart-wallet-blond.vercel.app/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

export function disconnect() {
  stacksDisconnect();
}

export function isUserAuthed() {
  return isConnected();
}

export function getAddress(network) {
  const data = getLocalStorage();
  return data.addresses.stx;
}

export function getNetworks() {
  return StacksNetworks;
}

export function network(network) {
  return {
    mainnet: STACKS_MAINNET,
    testnet: STACKS_TESTNET,
    mocknet: STACKS_MOCKNET,
    devnet: STACKS_DEVNET,
  }[network];
}
