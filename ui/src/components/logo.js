<<<<<<< HEAD
'use client'

import React from 'react';
=======
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
>>>>>>> c9577ef8496bd6188c709e14e399105c791d130a
import Image from "next/image";
import { useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { SiVitest } from "react-icons/si";
import styles from "../app/page.module.css";
<<<<<<< HEAD
import { getNetworks } from '../services/auth';
import { api } from '../lib/constants';
import Link from 'next/link';
=======
import { getNetworks } from "../services/auth";
>>>>>>> c9577ef8496bd6188c709e14e399105c791d130a

function Logo({ clientConfig, setClientConfig }) {
<<<<<<< HEAD
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const stacksNetworks = getNetworks();

    function networkConfig(label) {
        setClientConfig({ chain: label, network: label, api: api[label] });
=======
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const activeNetwork = clientConfig[appOrigin]["network"];
  const stacksNetworks = getNetworks();

  function networkConfig(network) {
    const saveValue = { [appOrigin]: { network } };
    const serializedValue = encodeURIComponent(JSON.stringify(saveValue));
    document.cookie = `${encodeURIComponent(
      appOrigin
    )}=${serializedValue}; path=/`;
    setClientConfig(saveValue);
  }

  function getNetworkConfig() {
    const encodedName = encodeURIComponent(appOrigin) + "=";
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      if (cookie.startsWith(encodedName)) {
        return JSON.parse(
          decodeURIComponent(cookie.substring(encodedName.length))
        );
      }
>>>>>>> c9577ef8496bd6188c709e14e399105c791d130a
    }
    return { "http://localhost:3000": { network: stacksNetworks[0] } };
  }

<<<<<<< HEAD
    return (
        <Dropdown>
            <DropdownTrigger>
                <Image title='Click to see network menue' src="/vercel.svg" alt="Vercel Logo" className={styles.vercelLogo} width={100} height={24} priority />
            </DropdownTrigger>
            <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
                <DropdownItem key="networks" isReadOnly endContent={<IoIosArrowDown />}>
                    Stacks Networks
                </DropdownItem>
                {stacksNetworks.map((label) => (
                    <DropdownItem key={label} startContent={<SiVitest className={`${iconClasses} ${clientConfig.network === label ? 'text-success' : 'text-warning'}`} />} onPress={() => networkConfig(label)}>
                        <Link href={`?network=${label}&chain=${label}&api=${api[label]}`}>
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                        </Link>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown >
    );
=======
  useEffect(() => {
    const config = getNetworkConfig();
    setClientConfig(config);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Image
          title="Click to see network menue"
          src="/smart-wallet.svg"
          alt="Smart Wallet Logo"
          className={styles.smartWalletLogo}
          width={40}
          height={40}
          priority
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
        <DropdownItem key="networks" isReadOnly endContent={<IoIosArrowDown />}>
          Stacks Networks
        </DropdownItem>
        {stacksNetworks.map((label) => (
          <DropdownItem
            key={label}
            startContent={
              <SiVitest
                className={`${iconClasses} ${
                  activeNetwork === label ? "text-success" : "text-warning"
                }`}
              />
            }
            onPress={() => networkConfig(label)}
          >
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
>>>>>>> c9577ef8496bd6188c709e14e399105c791d130a
}

export default Logo;
