import React, { useEffect } from 'react';
import Image from "next/image";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { SiVitest } from "react-icons/si";
import { IoIosArrowDown } from "react-icons/io";
import styles from "../app/page.module.css";

const appOrigin = window.location.origin;
function Logo({ clientConfig, setClientConfig }) {

    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const activeNetwork = clientConfig[appOrigin]['network'];

    function networkConfig(network) {
        console.log({ network });
        const saveValue = { [appOrigin]: { network } }
        const serializedValue = encodeURIComponent(JSON.stringify(saveValue));
        document.cookie = `${encodeURIComponent(appOrigin)}=${serializedValue}; path=/`;
        setClientConfig(saveValue);
    }

    function getNetworkConfig() {
        const encodedName = encodeURIComponent(appOrigin) + "=";
        const cookies = document.cookie.split("; ");

        for (const cookie of cookies) {
            if (cookie.startsWith(encodedName)) {
                return JSON.parse(decodeURIComponent(cookie.substring(encodedName.length)));
            }
        }

        return { "http://localhost:3000": { network: 'testnet' } };
    }

    useEffect(() => {
        const config = getNetworkConfig();
        console.log({ config });
        setClientConfig(config);
    }, [])

    return (
        <Dropdown>
            <DropdownTrigger>
                <Image title='Click to see network menue' src="/vercel.svg" alt="Vercel Logo" className={styles.vercelLogo} width={100} height={24} priority />
            </DropdownTrigger>
            <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
                <DropdownItem key="networks" isReadOnly endContent={<IoIosArrowDown />}>
                    Stacks Networks
                </DropdownItem>
                <DropdownItem key="mainnet" startContent={<SiVitest className={`${iconClasses} ${activeNetwork === 'mainnet' ? 'text-success' : 'text-warning'}`} />} onPress={() => networkConfig('mainnet')}>
                    Mainnet
                </DropdownItem>
                <DropdownItem key="testnet" startContent={<SiVitest className={`${iconClasses} ${activeNetwork === 'testnet' ? 'text-success' : 'text-warning'}`} />} onPress={() => networkConfig('testnet')}>
                    Testnet
                </DropdownItem>
                <DropdownItem key="mocknet" startContent={<SiVitest className={`${iconClasses} ${activeNetwork === 'mocknet' ? 'text-success' : 'text-warning'}`} />} onPress={() => networkConfig('mocknet')}>
                    Mocknet
                </DropdownItem>
                <DropdownItem key="devnet" startContent={<SiVitest className={`${iconClasses} ${activeNetwork === 'devnet' ? 'text-success' : 'text-warning'}`} />} onPress={() => networkConfig('devnet')}>
                    Devnet
                </DropdownItem>
            </DropdownMenu>
        </Dropdown >
    );
}

export default Logo;