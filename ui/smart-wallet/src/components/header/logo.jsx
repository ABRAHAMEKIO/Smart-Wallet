import React from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from '@heroui/react'
import { GrMenu } from 'react-icons/gr'
import { IoIosArrowDown } from 'react-icons/io'
import { getNetworks } from '../../services/auth'
import { SiVitest } from 'react-icons/si'
import { api } from '../../lib/constants'

function Logo({ clientConfig, setClientConfig }) {

    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    function networkConfig(label) {
        setClientConfig({ chain: label, network: label, api: api[label] });
    }

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="bordered"><GrMenu /></Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
                <DropdownItem key="networks" isReadOnly endContent={<IoIosArrowDown />}>
                    Stacks Networks
                </DropdownItem>

                {getNetworks().map((val) => (
                    <DropdownItem
                        key={val}
                        startContent={
                            <SiVitest className={`${iconClasses} ${clientConfig.network === val ? "text-success" : "text-warning"}`} />
                        }
                        onPress={() => networkConfig(val)}
                    >
                        <Link href={`/?network=${val}&chain=${val}&api=${api[val]}`}>
                            {val.charAt(0).toUpperCase() + val.slice(1)}
                        </Link>
                    </DropdownItem>
                ))}

            </DropdownMenu>
        </Dropdown>
    )
}

export default Logo
