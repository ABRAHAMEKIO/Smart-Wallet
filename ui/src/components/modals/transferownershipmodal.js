import React from 'react';
import BaseModal from './basemodal';
import { Form, ModalBody, ModalHeader } from '@nextui-org/react';
import { Input } from 'postcss';

function TransferOwnershipModal({}) {
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

export default TransferOwnershipModal;