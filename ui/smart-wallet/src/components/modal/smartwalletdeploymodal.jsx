import React, { useEffect } from "react";
import { Button, Form, ModalBody, ModalHeader } from "@heroui/react";
import { openContractDeploy } from "@stacks/connect";
import { GrDeploy } from "react-icons/gr";
import BaseModal from "./basemodal";
import { userSession } from "../../user-session";
import { GiCancel } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

function SmartWalletDeployModal({ clientConfig, show, close }) {
    const authedUser = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];
    const contractName = "smart-wallet-standard";

    async function checkMemPool() {
        console.log("fired");
    }

    async function deployContract() {
        let clarityCode = await fetch("/api/smart-wallet-standard");
        if (clarityCode.status !== 200) {
            alert("Failed to fetch contract code");
            return;
        }
        clarityCode = (await clarityCode.text()).toString();

        openContractDeploy({
            contractName: contractName,
            codeBody: clarityCode,
            clarityVersion: 3,
            stxAddress: authedUser,
            network: network(clientConfig.network),
            onFinish: (res) => {
                console.log({ res });
            },
            onCancel: (res) => {
                console.log({ res });
            },
        });
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            checkMemPool();
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <BaseModal baseModalsOpen={show} baseModalOnClose={close}>
            <ModalHeader className="flex flex-col gap-1">
                Welcome to Smart Wallet!
            </ModalHeader>
            <ModalBody>
                <Form className="w-full justify-center items-center w-full space-y-4" validationBehavior="native">
                    <div className="w-full flex flex-col gap-4 justify-center items-center">
                        <p>
                            🚀 Smart Wallet is a secure 🔒 and intuitive solution for managing your digital assets.
                            Effortlessly deploy your contract 📜 and take full control of your finances 💰 with a seamless and streamlined experience.
                        </p>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                        <Button className="p-0" color="default" radius="full" onPress={close}>
                            <IoClose className="text-danger" />
                        </Button>
                        <Button className="p-0" color="warning" radius="full" onPress={deployContract}>
                            <GrDeploy />
                        </Button>
                    </div>
                </Form>
            </ModalBody>
        </BaseModal>
    );
}

export default SmartWalletDeployModal;