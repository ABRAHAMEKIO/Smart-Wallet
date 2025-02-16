import React, { useEffect, useState } from 'react';
import BaseModal from './basemodal';
import { Alert, Avatar, Button, Chip, Code, Input, ModalBody, ModalHeader, Select, SelectItem, Spinner, Switch } from '@heroui/react';
import { RiLuggageDepositFill, RiNftFill } from 'react-icons/ri';
import { openContractCall, openSTXTransfer } from '@stacks/connect';
import { Pc, PostConditionMode } from '@stacks/transactions';
import { userSession } from '../../user-session';
import { network } from '../../lib/constants';

const StxSendModal = ({ show, close, stx, clientConfig }) => {
    const [amount, setAmount] = useState(0);
    const [memo, setMemo] = useState('');
    const userAddress = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];
    const contractName = "smart-wallet-standared";
    const smartWalletAddress = `${userAddress}.${contractName}`;

    function sendStx() {
        const txAmount = amount * 1000000;
        const postConditions = [Pc.principal(`${userAddress}.${contractName}`).willSendLte(txAmount).ustx()];

        openSTXTransfer({
            recipient: userAddress,
            amount: txAmount,
            memo,
            network: network(clientConfig?.chain),
            postConditions,
            postConditionMode: PostConditionMode.Deny
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
                    description="STX 💰 will be transferred from your Smart Wallet 🤖  to your wallet 💼. Verify the transaction on Leathal Window 🔒."
                    title=""
                    variant="faded"
                />

                <Input label="Amount" placeholder="Enter amount" type="number" onChange={(e) => setAmount(e.target.value)} />

                <Input label="Memo" placeholder="Enter amount" type="text" onChange={(e) => setMemo(e.target.value)} />

                <div className='w-full flex flex-col gap-2'>

                    <Code className='w-full flex items-center gap-5'><Chip>Sender:</Chip> <small>{`${smartWalletAddress.slice(0, 4)}...${smartWalletAddress.slice(smartWalletAddress.length - 20, smartWalletAddress.length)}`}</small></Code>
                    <Code className='w-full flex items-center gap-5'><Chip>Receipient:</Chip> <small>{`${userAddress.slice(0, 4)}...${userAddress.slice(userAddress.length - 20, userAddress.length)}`}</small></Code>
                    <Code className='w-full flex items-center gap-5'><Chip>Amount:</Chip> {amount}</Code>

                </div>

                <Button color="warning" variant="shadow" onPress={sendStx}>
                    <RiLuggageDepositFill color='white' />
                </Button>


            </ModalBody>
        </BaseModal>
    );
}

export default StxSendModal;