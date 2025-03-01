import { Button, Input } from '@heroui/react';
import { openContractCall } from '@stacks/connect';
import React, { useState } from 'react';
import { PiLockKey } from "react-icons/pi";
import { network } from '../../lib/constants';
import { noneCV, Pc, PostConditionMode, principalCV, tupleCV, uintCV } from '@stacks/transactions';
import { serialize } from '@stacks/transactions/dist/cl';
import { delegate_address } from '../../lib/contracts';

const DelegateStxPox4 = ({ clientConfig, contractState, setConfirmationModal, setTx }) => {
    const [amount, setAmount] = useState(0.1);
    const [address, setAddress] = useState('');
    const [lockPeriod, setLockPeriod] = useState(1);

    const userAddress = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];
    const contractName = "smart-wallet-standared";
    const smartWalletAddress = `${userAddress}.${contractName}`;

    function handleOnchange(e) {
        const { name, value } = e.target;
        if (name === 'lock-amount') {
            if (value < 1) setAmount(1);
        }

        if (name === 'lock-period') {
            if (value < 1) setLockPeriod(1);
            if (value > 12) setLockPeriod(1);
        }
    }

    function delegate() {
        const delegateAmount = amount * 1000000;
        openContractCall({
            contractAddress: userAddress,
            contractName: contractName,
            functionName: 'extension-call',
            functionArgs: [
                principalCV(delegate_address),
                serialize(
                    tupleCV({
                        "action": 'delegate',
                        "amount-ustx": uintCV(delegateAmount),
                        "delegate-to": principalCV(address),
                        "pox-addr": noneCV()
                    })
                )
            ],
            network: network(clientConfig?.chain),
            stxAddress: userAddress,
            postConditionMode: PostConditionMode.Deny,
            postConditions: [
                Pc.principal(smartWalletAddress).willSendLte(delegateAmount).ustx()
            ],
            onFinish: ({ txId }) => {
                setTx(txId);
                setConfirmationModal(true);
            },
            onCancel: () => {
                console.log('Action canceled!!!');
            }
        })
    }

    return (
        <div className='w-full flex flex-col space-y-4'>
            <Input label='Lock Amount' min={0.1} name="lock-amount" type='number' value={amount} onChange={handleOnchange} />
            <Input label='Delegate to Address' id='delegate-to-address' type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
            <Input label='Lock Period' name='lock-period' type='text' value={lockPeriod} onChange={handleOnchange} />
            <Button isDisabled={!contractState} color='warning' onPress={delegate}>
                <PiLockKey size="20px" className='text-white' />
            </Button>
        </div>
    );
}

export default DelegateStxPox4;
