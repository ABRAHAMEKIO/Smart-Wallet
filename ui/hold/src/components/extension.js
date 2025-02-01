import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { getAddress, network, userSession } from '../services/auth';
import { openContractCall } from '@stacks/connect';
import { Cl } from '@stacks/transactions';

function Extension({ clientConfig }) {
    const [exContract, setExContract] = useState('');
    const [amount, setAmount] = useState(0);
    const [toPrincipal, setToPrincipal] = useState('');
    const [burnHeight, setBurnHeight] = useState(0);
    const [version, setVersion] = useState('');
    const [hash, setHash] = useState('');

    const activeNetwork = clientConfig.network;
    const authedUser = getAddress(activeNetwork);

    function execute() {
        const clarityTuple = Cl.tuple({
            "smart-wallet": Cl.contractPrincipal(exContract.split('.')[0], exContract.split('.')[1]),
            "amount-ustx": Cl.uint(amount),
            "delegate-to": Cl.standardPrincipal(toPrincipal),
            "until-burn-ht": burnHeight ? Cl.some(Cl.uint(burnHeight)) : Cl.none(),
            "pox-addr": version && hash ?
                Cl.some(Cl.tuple({
                    "version": Cl.bufferFromAscii(version),
                    "hashbytes": Cl.bufferFromAscii(hash)
                })) : Cl.none()
        })
        const serializedTuple = Buffer.from(
            JSON.stringify(clarityTuple, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            ),
            "utf8"
        );

        openContractCall({
            contractAddress: authedUser,
            contractName: 'smart-wallet',
            functionName: 'extension-call',
            functionArgs: [
                Cl.contractPrincipal(exContract.split('.')[0], exContract.split('.')[1]),
                Cl.buffer(serializedTuple)
            ],
            userSession: userSession,
            stxAddress: authedUser,
            nettwork: network(activeNetwork)
        })
    }

    return (
        <div className='w-full flex flex-col gap-3'>

            <Input isRequired errorMessage="Extension contract is required" label="" labelPlacement="outside" placeholder="Extension contract" type="text" onChange={(e) => setExContract(e.target.value)} />

            <Input isRequired errorMessage="Amount is required" label="" labelPlacement="outside" placeholder="Amount" type="text" onChange={(e) => setAmount(e.target.value)} />

            <Input isRequired errorMessage="Delegate to is required" label="" labelPlacement="outside" placeholder="Delegate to" type="text" onChange={(e) => setToPrincipal(e.target.value)} />

            <Input errorMessage="" label="" labelPlacement="outside" placeholder="Until burn height" type="text" onChange={(e) => setBurnHeight(e.target.value)} />

            <Input errorMessage="" label="" labelPlacement="outside" placeholder="Version" type="text" onChange={(e) => setVersion(e.target.value)} />

            <Input errorMessage="" label="" labelPlacement="outside" placeholder="Hash" type="text" onChange={(e) => setHash(e.target.value)} />

            <Button className='p-0' color='primary' onPress={execute}>Execute</Button>
        </div>
    );
}

export default Extension;