import React, { useEffect, useState } from 'react';
import BaseModal from './basemodal';
import { Alert, Avatar, Button, Chip, Input, ModalBody, ModalHeader, Select, SelectItem, Spinner, Switch } from '@heroui/react';
import { RiLuggageDepositFill, RiNftFill } from 'react-icons/ri';
import { openContractCall, openSTXTransfer } from '@stacks/connect';
import { Pc, PostConditionMode } from '@stacks/transactions';
import { userSession } from '../../user-session';
import { network } from '../../lib/constants';

const StxSendModal = ({ show, close, stx, clientConfig }) => {
    const [amount, setAmount] = useState();
    const [memo, setMemo] = useState();

    async function sendStx() {
        const userAddres = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];
        const contractName = "smart-wallet-standared";
        const postConditions = [Pc.principal(`${userAddres}.${contractName}`).willSendLte(amount / 10000000)];
        openSTXTransfer({
            recipient: userAddres,
            amount,
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

                <Button color="warning" variant="shadow" onClickCapture={sendStx}>
                    <RiLuggageDepositFill color='white' />
                </Button>

            </ModalBody>
        </BaseModal>
    );
}

export default StxSendModal;