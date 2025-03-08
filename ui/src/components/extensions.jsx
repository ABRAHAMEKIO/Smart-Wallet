import React from 'react';
import DelegateStxPox4 from './extensions/delegate-stx-pox4';
import { Accordion, AccordionItem } from '@heroui/react';
import { PiLockKey } from 'react-icons/pi';

const Extensions = ({ clientConfig, contractState, setConfirmationModal, setTx, smartWalletStx, smartWalletAddress }) => {
    return (
        <div>
            <Accordion variant="splitted">
                <AccordionItem key="1" aria-label="Accordion 1" title={<label className='flex gap-4 items-center'><PiLockKey size="20px" className='text-warning' /> Delegate Stx</label>}>
                    <DelegateStxPox4 clientConfig={clientConfig} contractState={contractState} setConfirmationModal={setConfirmationModal} setTx={setTx} smartWalletStx={smartWalletStx} smartWalletAddress={smartWalletAddress} />
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default Extensions;
