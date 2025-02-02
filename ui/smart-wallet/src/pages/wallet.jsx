import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import SmartWalletContractAdvisory from '../components/alert/smartWalletContractAdvisory'
import { GrDeploy } from 'react-icons/gr';
import SmartWalletBalance from '../components/smartwalletbalance';
import Tabs from '../components/tabs';

function Wallet({ clientConfig, setClientConfig }) {
    const [showAdvisory, setShowAdvisory] = useState(true);
    const [advisoryMessage, setAdvisoryMessage] = useState({ title: '', msg: '', reason: '', severity: '' });

    const [showLaunchPad, setShowLaunchPad] = useState(false);

    async function openLaunchPad() {

    }

    useEffect(() => {
        setAdvisoryMessage({ msg: 'Seems you dont have smart wallet contract deployed yet.', reason: 'Deploy Required', severity: 'secondary' });
    }, [])

    return (
        <>
            <div className="w-full flex flex-col justify-center gap-6 items-center mt-10 p-2 sm:p-[5%] md:p-[10%] lg:p-[10%]">

                <Header clientConfig={clientConfig} setClientConfig={setClientConfig} />

                {/* Advisory Box */}
                <SmartWalletContractAdvisory
                    show={showAdvisory}
                    props={advisoryMessage} icon={<GrDeploy />}
                    action={openLaunchPad}
                />

                <SmartWalletBalance />

                <Tabs />

            </div>

            {/* Modals */}
        </>
    )
}

export default Wallet
