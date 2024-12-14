import React, { useState } from 'react';
import { ModalHeader, ModalBody, ModalFooter, Button, } from "@nextui-org/react";
import { Form, Input, Select, SelectItem, Checkbox, } from "@nextui-org/react";

import BaseModal from './basemodal';
import SendAsset from '../../services/wallet';


function SendModal({ sendModalOpen, sendModalOnClose, props }) {
    const [amount, setAmount] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [memo, setMemo] = useState('');

    console.log({ props });

    return (
        <BaseModal baseModalsOpen={sendModalOpen} baseModalOnClose={sendModalOnClose}>
            <ModalHeader className="flex flex-col gap-1">Send Asset's</ModalHeader>
            <ModalBody>
                <Form
                    className="w-full justify-center items-center w-full space-y-4"
                    validationBehavior="native"
                >
                    <div  className="w-full flex flex-col gap-4 bg-pink-200">
                        <Input
                            isRequired
                            errorMessage={"This field is required"}
                            label=""
                            labelPlacement="outside"
                            placeholder="Amount"
                            type='number'
                            onChange={(e) => setAmount(e.target.value)}
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
                            <SendAsset props={{ ...props, recipient, amount, memo }} />
                        </div>
                    </div>
                </Form>
            </ModalBody>
            <ModalFooter>

            </ModalFooter>
        </BaseModal>
    );
}

export default SendModal;