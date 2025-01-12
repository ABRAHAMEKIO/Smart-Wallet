'use client'

import React from 'react';
import Image from "next/image";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { SiVitest } from "react-icons/si";
import { IoIosArrowDown } from "react-icons/io";
import styles from "../app/page.module.css";
import { getNetworks } from '../services/auth';
import { api } from '../lib/constants';
import Link from 'next/link';

function Logo({ clientConfig, setClientConfig }) {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const stacksNetworks = getNetworks();

    function networkConfig(label) {
        setClientConfig({ chain: label, network: label, api: api[label] });
    }

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
}

export default Logo;