"use client";


import { useEffect, useState } from "react";
import { Connect } from "@stacks/connect-react";

import Avatar, { userSession } from "../components/avatar";
import TabsComponents from "../components/tabs";
import styles from "./page.module.css";
import Logo from "../components/logo";
import './globals.css';
import SendModal from "../components/modals/sendmodal";

const appOrigin = window.location.origin;

export default function Home() {
  const [clientConfig, setClientConfig] = useState({ "http://localhost:3000": { network: 'testnet' } });

  const [selectedContract, setSelectedContract] = useState('');

  // Modal State
  const [sendModalOpen, sendModalOnOpen] = useState(false);

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
        <div className="w-full flex justify-between items-center">
          <Logo clientConfig={clientConfig} setClientConfig={setClientConfig} />
          <Avatar clientConfig={clientConfig} />
        </div>

        <div style={{ marginTop: '4rem' }} />

        <div className="w-full">
          <TabsComponents clientConfig={clientConfig} setSelectedContract={setSelectedContract} sendModalOnOpen={sendModalOnOpen} />
        </div>

        <div>

        </div>

        {/* Modals */}
        <SendModal sendModalOpen={sendModalOpen} sendModalOnClose={() => sendModalOnOpen(false)} props={{ network: clientConfig[appOrigin]['network'], address: selectedContract }} />
      </main>

    </Connect>
  );
}
