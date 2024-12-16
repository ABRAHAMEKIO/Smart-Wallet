import React, { useState } from 'react';
import { ModalHeader, ModalBody, ModalFooter, Button, } from "@nextui-org/react";
import { Form, Input } from "@nextui-org/react";
import { IoMdSend } from 'react-icons/io';

import { Cl, makeContractNonFungiblePostCondition, NonFungibleConditionCode } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect-react';

import { getAddress, network } from '../../services/auth';
import BaseModal from './basemodal';

function SendNftModal({ sendNftModalOpen, sendFtModalOnClose, props }) {

    const [recipient, setRecipient] = useState('');

    async function send() {
        const address = getAddress(props.network);
        const contractName = "smart-wallet";
        const assetId = bufferCVFromString(props.assetid);

        const postConditionCode = NonFungibleConditionCode.Sends;
        const nonFungibleAssetInfo = createAssetInfo(props.address.split('::')[0].split('.')[0], props.address.split('::')[0].split('.')[1], props.address.split('::')[1]);
        const condition01 = makeContractNonFungiblePostCondition(`${address}.${contractName}`, postConditionCode, nonFungibleAssetInfo, assetId);

        openContractCall({
            contractAddress: address,
            contractName: contractName,
            functionName: 'sip009-transfer',
            functionArgs: [
                Cl.uint(props.assetid),
                Cl.standardPrincipal(recipient),
                Cl.contractPrincipal(props.address.split('::')[0].split('.')[0], props.address.split('::')[0].split('.')[1])
            ],
            validateWithAbi: true,
            sponsored: false,
            stxAddress: address,
            postConditions: [condition01],
            network: network(props.network),
            onFinish: (res) => {
                console.log({ res });
            },
            onCancel: (err) => {
                console.log(err);
            }
        });

    }

    return (
        <BaseModal baseModalsOpen={sendNftModalOpen} baseModalOnClose={sendFtModalOnClose}>
            <ModalHeader className="flex flex-col gap-1">Send Asset's</ModalHeader>
            <ModalBody>
                <Form
                    className="w-full justify-center items-center w-full space-y-4"
                    validationBehavior="native"
                >
                    <div className="w-full flex flex-col gap-4 bg-pink-200">

                        <Input
                            isRequired
                            errorMessage={"This field is required"}
                            label=""
                            labelPlacement="outside"
                            placeholder="Recipient address"
                            onChange={(e) => setRecipient(e.target.value)}
                        />

                        <div className="flex justify-between gap-4">
                            <Button type="reset" variant="bordered">
                                Reset
                            </Button>
                            <Button className="p-0" color="primary" radius="full" onPress={send}>
                                <IoMdSend />
                            </Button>
                        </div>
                    </div>
                </Form>
            </ModalBody>
            <ModalFooter />
        </BaseModal>
    );
}

export default SendNftModal;