import React, { useState } from 'react';
import { Select, SelectItem } from "@nextui-org/react";
import { Tabs, Tab, Card, CardHeader, CardFooter, Image, CardBody, Button, Avatar, useDisclosure } from "@nextui-org/react";
import { RiNftFill } from "react-icons/ri";
import { MdGeneratingTokens } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { TbBrandCashapp } from 'react-icons/tb';
import { umicrostoActualValue } from "../services/operator";
import { explorer } from '../lib/constants';


export default function WalletAssets({ network, fungible_Tokens, non_Fungible_Tokens, setSelectedContract, sendFtModalOnOpen }) {
    function openSendModal(asset) {
        setSelectedContract(asset);
        sendFtModalOnOpen(true);
    }

    function formatNumber(num, op) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "b"; // Billions
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "m"; // Millions
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k"; // Thousands
        }
        return op ? num.toString() : `micro${num.toString()}`; // Less than 1,000
    }

    return (
        <Tabs className='w-full' aria-label="Options" placement={'top'} >
            <Tab key="token" title={
                <div className="flex items-center gap-1">
                    <MdGeneratingTokens />
                    <span>Token</span>
                </div>
            }>
                <Card className='mt-1'>
                    <CardBody>
                        <div className="w-full flex flex-col gap-4">
                            {fungible_Tokens.map(({ name, suggested_name, placeholder_icon, image_uri, balance, contract_principal, contract_identity, tx_id, decimals }) => (
                                <div className="flex justify-between justify-center items-center">
                                    <div className='flex gap-3 justify-center items-center'>
                                        <Avatar
                                            isBordered
                                            radius="full"
                                            size="md"
                                            src={image_uri || placeholder_icon}
                                        />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">{name || suggested_name}</h4>
                                            <h5 className="text-small tracking-tight text-default-400"> {formatNumber(umicrostoActualValue(balance, decimals || 1), decimals)}</h5>
                                        </div>
                                    </div>
                                    <p className='truncate p-3'>
                                        <a href={`${explorer(contract_principal || '', tx_id || '', network)}`} target='blank' className='text-primary underline'>{tx_id || contract_principal}</a>
                                    </p>
                                    <div className='flex flex-col gap-2'>
                                        <Button color="primary" radius="full" size="sm" onPress={() => openSendModal({ address: contract_identity, decimals })}>
                                            <IoMdSend />
                                        </Button>
                                        {/* <Button color="primary" radius="full" size="sm" onPress={() => openSendModal()}>
                                        <IoMdSend />
                                    </Button> */}
                                    </div>
                                </div>
                            ))}
                            {fungible_Tokens.length === 0 && <p>Nothing to display.</p>}
                        </div>
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="nft" title={
                <div className="flex items-center gap-1">
                    <RiNftFill />
                    <span>Nft</span>
                </div>
            }>
                <Card fullWidth>
                    <CardBody>
                        <div className="w-full">
                            <Select label="Assets List">
                                {non_Fungible_Tokens.map(({ name }) => (
                                    <SelectItem startContent={<Avatar src='/icon-placeholder.svg' />}>{name}</SelectItem>
                                ))}
                            </Select>
                            {/* {non_Fungible_Tokens.map(({ name, count, image }) => (
                                // /* eslint-disable no-console 
                                <Card style={{ width: '200px', height: '150px' }} isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
                                    <Image
                                        removeWrapper
                                        alt="Card example background"
                                        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                                        src="https://nextui.org/images/card-example-6.jpeg"
                                    />
                                    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                                        <div>
                                            <p className="text-black text-tiny">{name}</p>
                                            <p className="text-black text-tiny">{count}</p>
                                        </div>
                                        <Button className="text-tiny" color="primary" radius="full" size="sm">
                                            <IoMdSend />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))} // */}
                            {non_Fungible_Tokens.length === 0 && <p>Nothing to display.</p>}
                        </div>
                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    );
}