"use client";

import { useEffect, useState } from "react";
import { Connect } from "@stacks/connect-react";

import Avatar from "../components/avatar";
import { getAddress, isUserAuthed, userSession } from "../services/auth";
import TabsComponents from "../components/tabs";
import Logo from "../components/logo";
import Landing from "../pages/landing";
// Modals
import SmartWalletDeployModal from "../components/modals/smartwalletdeploymodal";
import DepositModal from "../components/modals/depositmodal";
import SendStxModal from "../components/modals/sendstxmodal";
import SendFtModal from "../components/modals/sendftmodal";
import SendNftModal from "../components/modals/sendnftmodal";
import Alerter from "../components/alerter";
import Advisor from "../components/advisor";


import './globals.css';
import axios from "axios";
import { api } from "../lib/constants";

const appOrigin = window.location.origin;

export default function Home() {
  const [clientLoading, setClientLoading] = useState(true);
  const [contractStatus, setContractStatus] = useState(false);
  const [clientConfig, setClientConfig] = useState({ "http://localhost:3000": { network: 'testnet' } });
  const [selectedContract, setSelectedContract] = useState('');

  // Modal State
  const [openSmartWalletDeploy, setOpenSmartWalletDeploy] = useState();
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [sendStxModalOpen, sendStxModalOnClose] = useState(false);
  const [sendFtModalOpen, setSendFtModalOnOpen] = useState(false);
  const [sendNftModalOpen, setSendNftModalOnOpen] = useState(false);

  // Alert State
  const [showAlerter, setShowAlerter] = useState(false)
  const [props, setProps] = useState({ msg: '', reason: '', severity: '' })

  const activeNetwork = clientConfig[appOrigin]['network'];
  const authed = isUserAuthed();
  const authedUser = getAddress(activeNetwork);

  async function initSmartWalletContract() {
    try {
      const contract = `${authedUser}.smart-wallet`;
      const getContractStatus = await axios.get(`${api[activeNetwork]}/extended/v2/smart-contracts/status?contract_id=${contract}`);
      if (getContractStatus.status === 200) {
        const { found } = getContractStatus.data[contract];
        if (!found) setOpenSmartWalletDeploy(true);
        setContractStatus(found);
      }
    } catch (error) {
      console.log({ error });
      setProps({ msg: error.message, severity: 'danger', reason: error.code });
      setShowAlerter(true);
    }
  }

  useEffect(() => {
    setClientLoading(false);
  }, [])

  useEffect(() => {
    initSmartWalletContract();
  }, [clientConfig])

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "Stacks Next.js Template",
          icon: window.location.origin + "/logo.png",
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >

      <main className="w-full mymaindiv">
        {!authed && <Landing clientConfig={clientConfig} />}

        {authed &&
          <>
            <div className="w-full flex justify-between items-center">
              <Logo clientConfig={clientConfig} setClientConfig={setClientConfig} />
              <Avatar clientConfig={clientConfig} />
            </div>
          </>
        }

        {/* AlertBox */}
        <Alerter showAlerter={showAlerter} closeAlerter={() => setShowAlerter(false)} props={props} />
        {((!clientLoading && !showAlerter) && (!openSmartWalletDeploy && !contractStatus)) && <Advisor msg={"Seems you dont have smart wallet deployed yet."} title={"Deploy required"} action={() => setOpenSmartWalletDeploy(true)} />}

        {authed &&
          <>
            <div style={{ marginTop: '4rem' }} />

            <div className="w-full">
              <TabsComponents clientConfig={clientConfig} setSelectedContract={setSelectedContract} sendStxModalOnClose={sendStxModalOnClose} sendFtModalOnOpen={setSendFtModalOnOpen} setSendNftModalOnOpen={setSendNftModalOnOpen} setOpenDepositModal={setOpenDepositModal} />
            </div>
          </>
        }

        {/* Modals */}
        <SmartWalletDeployModal clientConfig={clientConfig} openSmartWalletDeploy={openSmartWalletDeploy} closeSmartWalletDeploy={() => setOpenSmartWalletDeploy(false)} />
        <DepositModal openDepositModal={openDepositModal} closeDepositModal={setOpenDepositModal} clientConfig={clientConfig} />
        <SendStxModal sendStxModalOpen={sendStxModalOpen} sendStxModalOnClose={sendStxModalOnClose} clientConfig={clientConfig} />
        <SendFtModal sendFtModalOpen={sendFtModalOpen} sendFtModalOnClose={() => setSendFtModalOnOpen(false)} props={{ network: clientConfig[appOrigin]['network'], ...selectedContract }} />
        <SendNftModal sendNftModalOpen={sendNftModalOpen} setSendNftModalOnOpen={() => setSendNftModalOnOpen(false)} props={{ network: clientConfig[appOrigin]['network'], ...selectedContract }} />
      </main>

    </Connect>
  );
}
