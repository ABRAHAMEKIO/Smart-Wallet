import React from 'react';
import BaseModal from './basemodal';
import { Alert, Button, ModalBody, ModalHeader } from '@heroui/react';

const ConfirmedModal = ({ show, close, tx, clientConfig }) => {
    return (
        <BaseModal baseModalsOpen={show} baseModalOnClose={close}>
            <ModalHeader className="flex flex-col gap-1">Transaction Confirmation</ModalHeader>
            <ModalBody className='p-5 gap-4'>
                <Alert
                    color="success"
                    className='flex items-center text-justify'
                    description={`The transaction has been successfully confirmed with the following TX: ${`${tx.slice(0, 5)}...${tx.length - 5, tx.length}`}. For details regarding the transaction, please follow the TX URL: ${<a href={`${clientConfig?.explorer}/txid/${tx}?chain=${clientConfig?.chain}`} target='_blank'>Click here</a>}. 🚀🔗`}
                    title="Note:"
                    variant="faded"
                />

                <Button color="warning" variant="shadow" onPress={close}>
                    OK
                </Button>

            </ModalBody>
        </BaseModal>
    );
}

export default ConfirmedModal;
