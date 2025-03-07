import React, { useEffect } from "react";
import { openContractDeploy } from "@stacks/connect";
import { Alert, Button, Chip, ModalBody, ModalHeader } from "@heroui/react";
import { GrDeploy } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import BaseModal from "./basemodal";
import { userSession } from "../../user-session";
import { network } from "../../lib/constants";

function SmartWalletDeployModal({ clientConfig, show, close, setTx, setConfirmationModal, contractState }) {
    const authedUser = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];
    const contractName = "smart-wallet";

    async function checkMemPool() {
        console.log("Mempool check");
    }

    async function deployContract() {
        let clarityCode = await fetch("/smart-wallet.clar");
        if (clarityCode.status !== 200) {
            alert("Failed to fetch contract code");
            return;
        }
        clarityCode = (await clarityCode.text()).toString();

        openContractDeploy({
            contractName: contractName,
            codeBody: clarityCode,
            clarityVersion: 2,
            stxAddress: authedUser,
            network: network(clientConfig?.chain),
            onFinish: (res) => {
                setTx(res?.txId);
                setConfirmationModal(true);
                close();
            },
            onCancel: (res) => {
                console.log('transaction cancelled', { res });
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
                <div className="w-full justify-center items-center w-full space-y-4">
                    <Alert
                        hideIcon
                        className="text-justify"
                        color="secondary"
                        description="🚀 Smart Wallet is a secure 🔒 and intuitive solution for managing your digital assets. Effortlessly deploy your contract 📜 and take full control of your finances 💰 with a seamless and streamlined experience.                            "
                        title={<Chip color="danger" variant="faded">Note:</Chip>}
                        variant="flat"
                    />

                    <div className="w-full flex justify-between gap-4">
                        <Button className="p-0" color="default" radius="full" onPress={close}>
                            <IoClose className="text-danger" />
                        </Button>
                        <Button isDisabled={contractState} className="p-0" color="warning" radius="full" onPress={deployContract}>
                            <GrDeploy />
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </BaseModal>
    );
}

export default SmartWalletDeployModal;