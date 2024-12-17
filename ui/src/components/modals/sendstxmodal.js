import React, { useEffect, useState } from 'react';
import BaseModal from './basemodal';
import { Button, Form, ModalBody, ModalFooter, ModalHeader, Input, Avatar } from '@nextui-org/react';
import { IoMdSend } from 'react-icons/io';
import { Cl, Pc } from '@stacks/transactions';
import { getAddress, network } from '../../services/auth';
import { actualtoUmicroValue } from '../../services/operator';
import { openContractCall } from '@stacks/connect';
import { getAllAssets } from '../../services/wallet';

const appOrigin = window.location.origin;
function SendStxModal({ clientConfig, sendStxModalOpen, sendStxModalOnClose }) {
    const [stx, setStx] = useState({ balance: 0, rate: 0 });
    const [amount, setAmount] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [memo, setMemo] = useState('');

    const activeNetwork = clientConfig[appOrigin]['network'];

    async function send() {
        const address = getAddress(activeNetwork);
        const contractName = "smart-wallet";
        const sendAmount = amount * 1000000;

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

    const network = clientConfig[appOrigin]['network'];
    const authedUser = getAddress(network);

    useEffect(() => {
        async function init() {
            const balance = await getAllAssets(`${authedUser}.smart-wallet`, network);
            const { stx } = balance;
            setStx(stx);
        }
        init();
    }, [])

    return (
        <BaseModal baseModalsOpen={sendStxModalOpen} baseModalOnClose={sendStxModalOnClose}>
            <ModalHeader className="flex flex-col gap-1">Send Asset's</ModalHeader>
            <ModalBody>
                <Form
                    className="w-full w-full space-y-4"
                    validationBehavior="native"
                >
                    <div className='flex gap-3 justify'>
                        <Avatar
                            isBordered
                            radius="full"
                            size="md"
                            src="/stx-logo.svg"
                        />
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">Balance: <code className='text-warning'>{stx.balance}</code></h4>
                            <h5 className="text-small tracking-tight text-default-400">Rate: $ {stx.rate}</h5>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4 bg-pink-200">
                        <Input
                            isRequired
                            errorMessage={"This field is required"}
                            label=""
                            labelPlacement="outside"
                            placeholder="Amount"
                            value={amount}
                            max={stx.balance}
                            maxLength={stx.balance}
                            type='number'
                            onChange={(e) => {
                                if (Number(e.target.value) > stx.balance) {
                                    setAmount(0);
                                    return;
                                }
                                let value = e.target.value.replace(/^0+(?=\d)/, '');
                                setAmount(Number(value));
                            }}
                        />

                        <Input
                            isRequired
                            errorMessage={"This field is required"}
                            label=""
                            value={recipient}
                            labelPlacement="outside"
                            placeholder="Recipient address"
                            onChange={(e) => setRecipient(e.target.value)}
                        />

                        <Input
                            errorMessage={"Memo is optional"}
                            label=""
                            value={memo}
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