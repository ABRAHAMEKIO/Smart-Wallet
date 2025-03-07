import { Accordion, AccordionItem, Button, Code, Input, Listbox, ListboxItem, Switch, Textarea } from '@heroui/react';
import { openContractCall } from '@stacks/connect';
import React, { useState } from 'react';
import { userSession } from '../user-session';
import { PostConditionMode, principalCV } from '@stacks/transactions';
import { network } from '../lib/constants';

const Wallettransfer = ({ clientConfig, contractState, setConfirmationModal, setTx }) => {
    const [agree, setAgree] = useState(false);
    const [address, setAdress] = useState('');

    const userAddress = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];
    const contractName = 'smart-wallet';

    console.log({ agree, address, contractState });

    function transferWalletOwnerShip() {
        openContractCall({
            contractAddress: userAddress,
            contractName,
            functionName: 'transfer-wallet',
            functionArgs: [principalCV(address)],
            network: network(clientConfig?.chain),
            stxAddress: userAddress,
            postConditionMode: PostConditionMode.Deny,
            onFinish: ({ txId }) => {
                setTx(txId);
                setConfirmationModal(true);
            }
        })
    }

    return (
        <div className='w-full flex flex-col gap-5 items-center p-5'>
            <h1 className='w-full flex font-bold gap-2'>Privacy Policy for Wallet Ownership Transfer Effective Date: <Code>{new Date().toDateString()}</Code></h1>

            <Accordion selectionMode="multiple" variant="shadow">

                <AccordionItem key="1" aria-label="Introduction" title="Introduction">
                    This Privacy Policy explains how we handle data during wallet ownership transfers within our Stacks smart wallet contract, a Web3 project built on decentralized technology.
                </AccordionItem>

                <AccordionItem key="2" aria-label="Information We Collect" title="Information We Collect">

                    <Listbox aria-label="Actions" className='pl-2'>
                        {[
                            'Current and new wallet addresses',
                            'Transaction metadata',
                            'Smart contract execution details'
                        ].map((label, i) => (
                            <ListboxItem key={i}>{label}</ListboxItem>
                        ))}
                    </Listbox>
                </AccordionItem>

                <AccordionItem key="3" aria-label="How We Use Your Information" title="How We Use Your Information">

                    <Listbox aria-label="Actions" className='pl-2'>
                        {[
                            'Facilitate secure ownership transfers',
                            'Ensure compliance with smart contract logic',
                            'Prevent unauthorized transactions',
                            'Provide support'
                        ].map((label, i) => (
                            <ListboxItem key={i}>{label}</ListboxItem>
                        ))}
                    </Listbox>

                </AccordionItem>

                <AccordionItem key="4" aria-label="Data Security" title="Data Security">

                    <Listbox aria-label="Actions" className='pl-2'>
                        {[
                            'All transactions are recorded on the Stacks blockchain and cannot be altered',
                            'We do not store private keys or personal data',
                            'Security measures prevent unauthorized access'
                        ].map((label, i) => (
                            <ListboxItem key={i}>{label}</ListboxItem>
                        ))}
                    </Listbox>

                </AccordionItem>

                <AccordionItem key="5" aria-label="Public Blockchain Disclosure" title="Public Blockchain Disclosure">

                    <Listbox aria-label="Actions" className='pl-2'>
                        {[
                            'Transactions and wallet addresses are public',
                            'We do not share additional data with third parties'
                        ].map((label, i) => (
                            <ListboxItem key={i}>{label}</ListboxItem>
                        ))}
                    </Listbox>

                </AccordionItem>

                <AccordionItem key="6" aria-label="User Responsibilities" title="User Responsibilities">

                    <Listbox aria-label="Actions" className='pl-2'>
                        {[
                            'Secure private keys and credentials',
                            'Transfers are irreversible',
                            'We cannot modify or reverse transactions',
                            'The contract still belongs to you, but all withdrawals and actions can only be performed by the new owner',
                            'Secure private keys and credentials'
                        ].map((label, i) => (
                            <ListboxItem key={i}>{label}</ListboxItem>
                        ))}
                    </Listbox>

                </AccordionItem>

                <AccordionItem key="7" aria-label="Policy Updates" title="Policy Updates">
                    We may update this policy at any time. Changes take effect upon posting.
                </AccordionItem>

                <AccordionItem key="8" aria-label="Contact" title="Contact">
                    For questions, contact us at [Insert Contact Information].
                </AccordionItem>

            </Accordion>

            <div className='w-full flex gap-5 flex-col'>
                <Switch value={agree} size="sm" onChange={() => setAgree(!agree)}>
                    I agree to the privacy policy.
                </Switch>
                <Input label='Address' placeholder='Enter address' value={address} onChange={(e) => setAdress(e.target.value)} />
                <Button isDisabled={!((agree && address) && contractState)} color='warning' onPress={transferWalletOwnerShip}>Transfer Wallet</Button>
            </div>

        </div>
    );
}

export default Wallettransfer;