import { showConnect } from "@stacks/connect";
import { StacksNetworks } from "@stacks/network";
import { userSession } from "../user-session";

export function getNetworks() {
    return StacksNetworks;
}

export function authenticate() {
    showConnect({
        appDetails: {
            name: "Stacks React Starter",
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