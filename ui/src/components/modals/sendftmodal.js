import React, { useState } from 'react';
import { ModalHeader, ModalBody, ModalFooter, Button, } from "@nextui-org/react";
import { Form, Input } from "@nextui-org/react";
import { IoMdSend } from 'react-icons/io';

import { Pc, Cl } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect-react';

import { getAddress, network } from '../../services/auth';
import BaseModal from './basemodal';
import { actualtoUmicroValue } from '../../services/operator';


function SendFtModal({ sendFtModalOpen, sendFtModalOnClose, props }) {

    const [amount, setAmount] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [memo, setMemo] = useState('');

    async function send() {
        console.log("çlicked", { props });
        const address = getAddress(props.network);
        const contractName = "smart-wallet";
        const sendAmount = actualtoUmicroValue(amount, props.decimals);

        const condition01 = Pc.principal(`${address}.${contractName}`)
            .willSendLte(sendAmount)
            .ft(props.address.split('::')[0]);


        console.log({ network: network(props.network) });

        openContractCall({
            contractAddress: address,
            contractName: contractName,
            functionName: 'sip010-transfer',
            functionArgs: [
                Cl.uint(sendAmount),
                Cl.standardPrincipal(recipient),
                memo ? Cl.some(Cl.bufferFromAscii(memo)) : Cl.none(),
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
        <BaseModal baseModalsOpen={sendFtModalOpen} baseModalOnClose={sendFtModalOnClose}>
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
                            placeholder="Amount"
                            type='number'
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />

                        <Input
                            isRequired
                            errorMessage={"This field is required"}
                            label=""
                            labelPlacement="outside"
                            placeholder="Recipient address"
                            onChange={(e) => setRecipient(e.target.value)}
                        />

                        <Input
                            errorMessage={"Memo is optional"}
                            label=""
                            labelPlacement="outside"
                            placeholder="Memo"
                            onChange={(e) => setMemo(e.target.value)}
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

export default SendFtModal;