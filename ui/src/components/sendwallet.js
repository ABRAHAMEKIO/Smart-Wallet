import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { IoSend } from 'react-icons/io5';
import { getAddress, userSession, network } from '../services/auth';
import { openContractCall } from '@stacks/connect';
import { Cl } from '@stacks/transactions';

function SendWallet({ network: activeNetwork }) {
    const [newOwner, setNewOwner] = useState('');

    const authedUser = getAddress(network);

    async function transferOwnership() {
        openContractCall({
            contractAddress: authedUser,
            contractName: 'smart-wallet',
            functionName: 'transfer-wallet',
            functionArgs: [Cl.standardPrincipal(newOwner)],
            stxAddress: authedUser,
            userSession: userSession,
            network: network(activeNetwork)
        });
    }

    return (
        <div className='w-full flex flex-col gap-3'>

            <Input
                isRequired
                errorMessage="Please enter a valid email"
                label=""
                labelPlacement="outside"
                placeholder="New owner"
                type="text"
                onChange={(e) => setNewOwner(e.target.value)}
            />

            <Button className='p-0' color='primary' onPress={transferOwnership}><IoSend /></Button>
        </div>
    );
}

export default SendWallet;