import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import SmartWalletContractAdvisory from '../components/alert/smartWalletContractAdvisory'
import { GrDeploy } from 'react-icons/gr';
import SmartWalletBalance from '../components/smartwalletbalance';
import Tabs from '../components/tabs';
import { getBalance, getWalletContractInfo } from '../services/wallet';
import DepositModal from '../components/modal/depositModal';

function Wallet({ clientConfig, setClientConfig }) {
    const [showAdvisory, setShowAdvisory] = useState(false);
    const [advisoryMessage, setAdvisoryMessage] = useState({ title: '', msg: '', reason: '', severity: '' });
    const [showLaunchPad, setShowLaunchPad] = useState(false);

    const [fungibleToken, setFungible] = useState([]);
    const [stx, setStx] = useState({});
    const [nonFungibleToken, setNoneFungible] = useState([]);

    // Modals State
    const [showDepositModal, setShowDepositModal] = useState(true);

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

    async function openLaunchPad() {

    }

    async function initWalletbalance() {
        const { stx, fungibleTokens, nonFungibleTokens } = await getBalance(clientConfig);
        console.log({ stx, fungibleTokens, nonFungibleTokens });
        setStx(stx);
        setFungible(fungibleTokens);
        setNoneFungible(nonFungibleTokens);
    }
    async function initWalletInstance() {
        const contract_info = await getWalletContractInfo(clientConfig);
        setShowAdvisory(!contract_info?.found);
        if (!contract_info?.found) { setAdvisoryMessage({ msg: 'Seems you dont have smart wallet contract deployed yet.', reason: 'Deploy Required', severity: 'secondary' }); };
        if (contract_info?.error) { setAdvisoryMessage({ msg: contract_info?.error, reason: contract_info?.code, severity: 'danger' }); };

        console.log({ contract_info });
    }

    useEffect(() => {
        initWalletbalance();
        initWalletInstance();
    }, [])

    return (
        <>
            <div className="w-full flex flex-col justify-center gap-6 items-center mt-10 p-2 sm:p-[5%] md:p-[10%] lg:p-[10%]">

                <Header clientConfig={clientConfig} setClientConfig={setClientConfig} />

                {/* Advisory Box */}
                <SmartWalletContractAdvisory
                    show={showAdvisory}
                    props={advisoryMessage}
                    icon={<GrDeploy />}
                    action={openLaunchPad}
                />

                <SmartWalletBalance balance={formatNumber(parseFloat(stx?.balance) / 1000000)} stx={stx} />

                <Tabs clientConfig={clientConfig} fungibleToken={fungibleToken} nonFungibleToken={nonFungibleToken} />

            </div>

            {/* Modals */}
            <DepositModal show={showDepositModal} close={() => setShowDepositModal(false)} stx={stx} fungibleToken={fungibleToken} />
        </>
    )
}

export default Wallet
