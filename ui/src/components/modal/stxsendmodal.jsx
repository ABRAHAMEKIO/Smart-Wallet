import React, { useState } from 'react';
import BaseModal from './basemodal';
import { Alert, Button, Chip, Code, Input, ModalBody, ModalHeader } from '@heroui/react';
import { RiLuggageDepositFill } from 'react-icons/ri';
import { openSTXTransfer } from '@stacks/connect';
import { Pc, PostConditionMode } from '@stacks/transactions';
import { userSession } from '../../user-session';
import { network } from '../../lib/constants';

const StxSendModal = ({ show, close, stx, clientConfig, contractState, smartWalletAddress }) => {
    const userAddress = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];

    const [amount, setAmount] = useState(0);
    const [address, setAddress] = useState(userAddress);
    const [memo, setMemo] = useState('');


    function sendStx() {
        const txAmount = amount * 1000000;
        const postConditions = [Pc.principal(smartWalletAddress).willSendLte(txAmount).ustx()];

        openSTXTransfer({
            recipient: address,
            amount: txAmount,
            memo,
            network: network(clientConfig?.chain),
            postConditions,
            postConditionMode: PostConditionMode.Deny,
            stxAddress: userAddress
        })
    }

    function formatNumber(num) {
        if (isNaN(num)) return 0.0;

        if (num >= 1e9) {
            return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "b"; // Billions
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "m"; // Millions
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k"; // Thousands
        }
        return num;
    }

    return (
        <BaseModal baseModalsOpen={show} baseModalOnClose={close}>
            <ModalHeader className="flex flex-col gap-1">Debit Smart Wallet</ModalHeader>
            <ModalBody className='p-5 gap-4'>
                <Alert
                    color="danger"
                    className='flex items-center text-justify'
                    description="STX 💰 will be transferred from your Smart Wallet 🤖  to any designated address 💼. Verify the transaction on Leathal Window 🔒."
                    title=""
                    variant="faded"
                />

                <Input label="Amount" placeholder="Enter amount" type="number" max={stx?.balance} value={amount} onChange={(e) => setAmount(e.target.value)} />

                <Input label="Address" placeholder="Enter address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

                <Input label="Memo" placeholder="Enter memo" type="text" maxLength={32} value={memo} onChange={(e) => setMemo(e.target.value)} />

                <div className='w-full flex flex-col gap-2'>

                    <Code className='w-full flex items-center gap-5'><Chip>Sender:</Chip> <small>{`${smartWalletAddress.slice(0, 4)}...${smartWalletAddress.slice(smartWalletAddress.length - 20, smartWalletAddress.length)}`}</small></Code>
                    <Code className='w-full flex items-center gap-5'><Chip>Receipient:</Chip> <small>{`${userAddress.slice(0, 4)}...${userAddress.slice(userAddress.length - 20, userAddress.length)}`}</small></Code>
                    <Code className='w-full flex items-center gap-5'><Chip>Amount:</Chip> {formatNumber(amount)}</Code>

                </div>

                <Button color="warning" variant="shadow" isDisabled={!contractState} onPress={sendStx}>
                    <RiLuggageDepositFill color='white' />
                </Button>


            </ModalBody>
        </BaseModal>
    );
}

export default StxSendModal;