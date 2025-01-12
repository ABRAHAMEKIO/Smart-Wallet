import React, { useEffect } from 'react';
import { Button, Form, ModalBody, ModalHeader } from '@nextui-org/react';
import { GrDeploy } from "react-icons/gr";
import BaseModal from './basemodal';
import { getAddress, network } from '../../services/auth';
import { openContractDeploy } from '@stacks/connect';

function SmartWalletDeployModal({ clientConfig, openSmartWalletDeploy, closeSmartWalletDeploy }) {

    const authedUser = getAddress(clientConfig.network);
    const contract = `${authedUser}.smart-wallet`;
    const contractName = "smart-wallet";


    async function checkMemPool() {
        console.log("fired");
    }

    async function deployContract() {
        let clarityCode = await fetch('/smartwallet.clar');
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
            }
        })
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            checkMemPool();
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <BaseModal baseModalsOpen={openSmartWalletDeploy} baseModalOnClose={closeSmartWalletDeploy}>
            <ModalHeader className="flex flex-col gap-1">Welcome to Smart Wallet!</ModalHeader>
            <ModalBody>
                <Form className="w-full justify-center items-center w-full space-y-4" validationBehavior="native">
                    <div className="w-full flex flex-col gap-4 justify-center items-center bg-pink-200">
                        <p>Smart Wallet is designed to make managing your money simple, secure, and seamless. Deploy your contract and start managing your assets with ease</p>
                        <div className="flex justify-between gap-4">
                            <Button className="p-0" color="primary" radius="full" onPress={deployContract}>
                                <GrDeploy />
                            </Button>
                        </div>
                    </div>
                </Form>
            </ModalBody>
        </BaseModal>
    );
}

export default SmartWalletDeployModal;