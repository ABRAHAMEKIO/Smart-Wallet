import React, { useState } from 'react';
import BaseModal from './basemodal';
import { Button, Form, ModalBody, ModalFooter, ModalHeader, Input } from '@nextui-org/react';
import { IoMdSend } from 'react-icons/io';
import { Cl, Pc } from '@stacks/transactions';
import { getAddress, network } from '../../services/auth';
import { actualtoUmicroValue } from '../../services/operator';
import { openContractCall } from '@stacks/connect';

const appOrigin = window.location.origin;
function SendStxModal({ clientConfig, sendStxModalOpen, sendStxModalOnClose }) {
    const [amount, setAmount] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [memo, setMemo] = useState('');

    const activeNetwork = clientConfig[appOrigin]['network'];

    async function send() {
        const address = getAddress(activeNetwork);
        const contractName = "smart-wallet";
        const sendAmount = amount * 1000000;
        console.log(sendAmount);

        const condition01 = Pc.principal(`${address}.${contractName}`).willSendLte(sendAmount).ustx();

        openContractCall({
            contractAddress: address,
            contractName: contractName,
            functionName: 'stx-transfer',
            functionArgs: [
                Cl.uint(sendAmount),
                Cl.standardPrincipal(recipient),
                memo ? Cl.some(Cl.bufferFromAscii(memo)) : Cl.none(),
            ],
            validateWithAbi: true,
            sponsored: false,
            stxAddress: address,
            postConditions: [condition01],
            network: network(activeNetwork),
            onFinish: (res) => {
                console.log({ res });
            },
            onCancel: (err) => {
                console.log(err);
            }
        });

    }

    return (
        <BaseModal baseModalsOpen={sendStxModalOpen} baseModalOnClose={sendStxModalOnClose}>
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

export default SendStxModal;