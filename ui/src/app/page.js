"use client";

import { useEffect, useState } from "react";
import { Connect } from "@stacks/connect-react";
import axios from "axios";

import Avatar from "../components/avatar";
import {
  getAddress,
  isUserAuthed,
  network,
  userSession,
} from "../services/auth";
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
import { useSearchParams } from "next/navigation";
import { api } from "../lib/constants";
import "./globals.css";

export default function Home() {
  const [clientLoading, setClientLoading] = useState(true);
  const [contractStatus, setContractStatus] = useState(false);
  const [selectedContract, setSelectedContract] = useState("");

  // Client Configurations
  const searchParams = useSearchParams();
  const [clientConfig, setClientConfig] = useState({
    chain: "",
    network: "",
    api: "",
  });

  // Modal State
  const [openSmartWalletDeploy, setOpenSmartWalletDeploy] = useState();
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [sendStxModalOpen, sendStxModalOnClose] = useState(false);
  const [sendFtModalOpen, setSendFtModalOnOpen] = useState(false);
  const [sendNftModalOpen, setSendNftModalOnOpen] = useState(false);

  // Alert State
  const [showAlerter, setShowAlerter] = useState(false);
  const [props, setProps] = useState({ msg: "", reason: "", severity: "" });

  const authed = isUserAuthed();

  async function initSmartWalletContract(clientNetwork, clientApi) {
    console.log({ clientApi });
    try {
      const authedUser = getAddress(clientNetwork);
      const contract = `${authedUser}.smart-wallet`;
      console.log({ authedUser, contract });
      const getContractStatus = await axios.get(
        `${clientApi}/extended/v2/smart-contracts/status?contract_id=${contract}`
      );
      if (getContractStatus.status === 200) {
        const { found } = getContractStatus.data[contract];
        if (!found) setOpenSmartWalletDeploy(true);
        setContractStatus(found);
      }
    } catch (error) {
      console.log({ error });
      setProps({ msg: error.message, severity: "danger", reason: error.code });
      setShowAlerter(true);
    }
  }

  console.log({ clientConfig });

  useEffect(() => {
    // Client Configurations
    const clientChain = searchParams.get("chain") || "testnet";
    const clientNetwork = searchParams.get("network") || "testnet";
    const clientApi = searchParams.get("api") || api[clientChain];
    setClientConfig({
      chain: clientChain,
      network: clientNetwork,
      api: clientApi,
    });
    setClientLoading(false);
    initSmartWalletContract(clientNetwork, clientApi);
  }, []);

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "Smart Wallet",
          icon: window.location.origin + "/smart-wallet.svg",
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      <main className="w-full mymaindiv">
        {!authed && <Landing />}

        {authed && !clientLoading && (
          <>
            <div className="w-full flex justify-between items-center">
              <Logo
                clientConfig={clientConfig}
                setClientConfig={setClientConfig}
              />
              <Avatar clientConfig={clientConfig} />
            </div>
          </>
        )}

        {/* AlertBox */}
        {authed && !clientLoading && (
          <>
            <Alerter
              showAlerter={showAlerter}
              closeAlerter={() => setShowAlerter(false)}
              props={props}
            />
            {!clientLoading &&
              !showAlerter &&
              !openSmartWalletDeploy &&
              !contractStatus && (
                <Advisor
                  msg={"Seems you dont have smart wallet deployed yet."}
                  title={"Deploy required"}
                  action={() => setOpenSmartWalletDeploy(true)}
                />
              )}
          </>
        )}

        {authed && !clientLoading && (
          <>
            <div style={{ marginTop: "4rem" }} />

            <div className="w-full">
              <TabsComponents
                clientConfig={clientConfig}
                setSelectedContract={setSelectedContract}
                sendStxModalOnClose={sendStxModalOnClose}
                sendFtModalOnOpen={setSendFtModalOnOpen}
                setSendNftModalOnOpen={setSendNftModalOnOpen}
                setOpenDepositModal={setOpenDepositModal}
              />
            </div>
          </>
        )}

        {/* Modals */}
        {authed && !clientLoading && (
          <>
            <SmartWalletDeployModal
              clientConfig={clientConfig}
              openSmartWalletDeploy={openSmartWalletDeploy}
              closeSmartWalletDeploy={() => setOpenSmartWalletDeploy(false)}
            />
            <DepositModal
              openDepositModal={openDepositModal}
              closeDepositModal={setOpenDepositModal}
              clientConfig={clientConfig}
            />
            <SendStxModal
              sendStxModalOpen={sendStxModalOpen}
              sendStxModalOnClose={sendStxModalOnClose}
              clientConfig={clientConfig}
            />
            <SendFtModal
              sendFtModalOpen={sendFtModalOpen}
              sendFtModalOnClose={() => setSendFtModalOnOpen(false)}
              props={{ network: clientConfig.network, ...selectedContract }}
            />
            <SendNftModal
              sendNftModalOpen={sendNftModalOpen}
              setSendNftModalOnOpen={() => setSendNftModalOnOpen(false)}
              props={{ network: clientConfig.network, ...selectedContract }}
            />
          </>
        )}
      </main>
    </Connect>
  );
}
