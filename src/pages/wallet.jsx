import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import SmartWalletContractAdvisory from '../components/alert/smartWalletContractAdvisory'
import { GrDeploy } from 'react-icons/gr';
import SmartWalletBalance from '../components/smartwalletbalance';
import Tabs from '../components/tabs';
import { getSmartWalletBalance, getUserBalance, getWalletContractInfo } from '../services/wallet';
import DepositModal from '../components/modal/depositModal';
import SmartWalletDeployModal from '../components/modal/smartwalletdeploymodal';
import StxSendModal from '../components/modal/stxsendmodal';
import ConfirmedModal from '../components/modal/confirmedmodal';

function Wallet({ clientConfig, setClientConfig }) {
    const [showAdvisory, setShowAdvisory] = useState(false);
    const [advisoryMessage, setAdvisoryMessage] = useState({ title: '', msg: '', reason: '', severity: '' });
    const [contractState, setContractState] = useState(false);

    const [userStx, setUserStx] = useState({});
    const [userFungibleToken, setUserFungible] = useState([]);
    const [userNonFungibleToken, setUserNoneFungible] = useState([]);

    const [smartWalletStx, setSmartWalletStx] = useState({});
    const [smartWalletFungibleToken, setSmartWalletFungible] = useState([]);
    const [smartWalletNonFungibleToken, setSmartWalletNoneFungible] = useState([]);

    // Modals State
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showSmartWalletModal, setShowSmartWallettModal] = useState(false);
    const [showStxSendModal, setShowStxSendModal] = useState(false);
    const [showConfirmationModal, setConfirmationModal] = useState(false);

    const [tx, setTx] = useState('');

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
        setShowSmartWallettModal(true);
    }

    async function initWalletbalance() {
        const { stx: smartwallet_stx, fungibleTokens: smartwallet_fungibleTokens, nonFungibleTokens: smartwallet_nonFungibleTokens } = await getSmartWalletBalance(clientConfig);
        const { stx: user_stx, fungibleTokens: user_fungibleTokens, nonFungibleTokens: user_nonFungibleTokens } = await getUserBalance(clientConfig);

        console.log({ smartwallet_stx, smartwallet_fungibleTokens, smartwallet_nonFungibleTokens, user_stx, user_fungibleTokens, user_nonFungibleTokens });

        setSmartWalletStx(smartwallet_stx);
        setSmartWalletFungible(smartwallet_fungibleTokens);
        setSmartWalletNoneFungible(smartwallet_nonFungibleTokens);

        setUserStx(user_stx);
        setUserFungible(user_fungibleTokens);
        setUserNoneFungible(user_nonFungibleTokens);
    }
    async function initWalletInstance() {
        const contract_info = await getWalletContractInfo(clientConfig);
        setShowAdvisory(!contract_info?.found);
        setContractState(contract_info?.found);
        if (!contract_info?.found) {
            setAdvisoryMessage({ msg: 'Seems you dont have smart wallet contract deployed yet.', reason: 'Deploy Required', severity: 'secondary' });
            setShowSmartWallettModal(true);
        };
        if (contract_info?.error) { setAdvisoryMessage({ msg: contract_info?.error, reason: contract_info?.code, severity: 'danger' }); };
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
                <SmartWalletContractAdvisory show={showAdvisory} props={advisoryMessage} icon={<GrDeploy />} action={openLaunchPad} />

                <SmartWalletBalance balance={formatNumber(parseFloat(smartWalletStx?.balance) / 1000000)} stx={smartWalletStx} setShowDepositModal={setShowDepositModal} setShowStxSendModal={setShowStxSendModal} />

                <Tabs clientConfig={clientConfig} fungibleToken={smartWalletFungibleToken} nonFungibleToken={smartWalletNonFungibleToken} contractState={contractState} setConfirmationModal={setConfirmationModal} setTx={setTx} smartWalletStx={smartWalletStx} />

            </div>

            {/* Modals */}
            {showDepositModal && <DepositModal show={showDepositModal} close={() => setShowDepositModal(false)} stx={userStx} fungibleToken={userFungibleToken} nonFungibleToken={userNonFungibleToken} clientConfig={clientConfig} setTx={setTx} setConfirmationModal={setConfirmationModal} contractState={contractState} />}
            {showSmartWalletModal && <SmartWalletDeployModal show={showSmartWalletModal} close={() => setShowSmartWallettModal(false)} clientConfig={clientConfig} setTx={setTx} setConfirmationModal={setConfirmationModal} contractState={contractState} />}
            {showStxSendModal && <StxSendModal show={showStxSendModal} close={() => setShowStxSendModal(false)} stx={smartWalletStx} clientConfig={clientConfig} setTx={setTx} setConfirmationModal={setConfirmationModal} contractState={contractState} />}
            {showConfirmationModal && <ConfirmedModal show={showConfirmationModal} close={() => setConfirmationModal(false)} tx={tx} clientConfig={clientConfig} />}
        </>
    )
}

export default Wallet