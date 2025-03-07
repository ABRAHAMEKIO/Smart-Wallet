import React from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from '@heroui/react'
import { GrMenu } from 'react-icons/gr'
import { IoIosArrowDown } from 'react-icons/io'
import { getNetworks } from '../../services/auth'
import { SiVitest } from 'react-icons/si'
import { api } from '../../lib/constants'
import { useNavigate } from 'react-router-dom'

function Logo({ clientConfig, setClientConfig }) {
    const nav = useNavigate();

    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    function navigate(label) {
        nav(`/?network=${label}&chain=${label}&api=${api[label]}`);
        window.location.reload();
    }

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="faded"><GrMenu color='primary' /></Button>
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
                        onPress={() => navigate(val)}
                    >
                        {val.charAt(0).toUpperCase() + val.slice(1)}
                    </DropdownItem>
                ))}

            </DropdownMenu>
        </Dropdown>
    )
}

export default Logo
