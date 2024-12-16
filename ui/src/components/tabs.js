import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card, CardBody, CardHeader, Avatar, Button } from "@nextui-org/react";
import { IoExtensionPuzzle } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";

import WalletAssets from './walletassets';
import Extension from './extension';
import SendWallet from './sendwallet';
import WalletBalance from './walletbalance';
import { getAllAssets } from '../services/wallet';
import { getAddress } from '../services/auth';

const appOrigin = window.location.origin;

export default function TabsComponents({ clientConfig, setSelectedContract, sendFtModalOnOpen, setSendNftModalOnOpen }) {
    const [stx, setStx] = useState({});
    const [fungible_Tokens, setFungible_Tokens] = useState([]);
    const [non_Fungible_Tokens, setNon_Fungible_Tokens] = useState([]);

    const network = clientConfig[appOrigin]['network'];
    const authedUser = getAddress(network);

    useEffect(() => {
        async function init() {
            const balance = await getAllAssets("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5", network);
            const { stx, fungible_tokens, non_fungible_tokens } = balance;
            console.log({ stx, fungible_tokens, non_fungible_tokens });
            setStx(stx);
            setFungible_Tokens(fungible_tokens);
            setNon_Fungible_Tokens(non_fungible_tokens);
        }
        init();
    }, [])

    return (
        <>
            <WalletBalance stx={stx} setSelectedContract={setSelectedContract} sendFtModalOnOpen={sendFtModalOnOpen} />

            <div style={{ marginTop: '2rem' }} />

            <Tabs className='w-full mt-1' aria-label="Options" placement={'top'}>
                <Tab className='w-full p-0' key="wallet" title={
                    <div className="flex items-center gap-1 space-x-2 p-1">
                        <FaWallet />
                        <span>Wallet</span>
                    </div>
                }>
                    <Card className='mt-1'>
                        <CardBody >
                            <WalletAssets network={network} fungible_Tokens={fungible_Tokens} non_Fungible_Tokens={non_Fungible_Tokens} setSelectedContract={setSelectedContract} sendFtModalOnOpen={sendFtModalOnOpen} setSendNftModalOnOpen={setSendNftModalOnOpen} />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab className='w-full p-0' key="extension" title={
                    <div className="flex items-center gap-1  space-x-2 p-1">
                        <IoExtensionPuzzle />
                        <span>Extension</span>
                    </div>
                }>
                    <Card className='mt-1'>
                        <CardBody>
                            <Extension />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab className='w-full p-0' key="sendwallet" title={
                    <div className="flex items-center  gap-1 space-x-2 p-1">
                        <GiWallet />
                        <span>Send Wallet</span>
                    </div>
                }>
                    <Card className='mt-1'>
                        <CardBody>
                            <SendWallet network={network} />
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </>

    );
};