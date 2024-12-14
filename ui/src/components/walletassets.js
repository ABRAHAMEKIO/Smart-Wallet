import React from 'react';
import { Tabs, Tab, Card, CardHeader, CardFooter, Image, CardBody, Button, Avatar, useDisclosure } from "@nextui-org/react";
import { RiNftFill } from "react-icons/ri";
import { MdGeneratingTokens } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
export default function WalletAssets({ fungible_Tokens, non_Fungible_Tokens, setSelectedContract, sendModalOnOpen }) {

    function openSendModal(asset) {
        setSelectedContract(asset);
        sendModalOnOpen(true);
    }

    return (
        <Tabs className='w-full' aria-label="Options" placement={'top'}>
            <Tab key="token" title={
                <div className="flex items-center gap-1">
                    <MdGeneratingTokens />
                    <span>Token</span>
                </div>
            }>
                <Card className='mt-1'>
                    <CardBody>
                        <div className="myresponsivegrid">
                            {fungible_Tokens.map(({ name, balance, icon, contract_id }) => (
                                <Card style={{ width: '200px', height: '150px' }} isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
                                    <Image
                                        removeWrapper
                                        alt="Card example background"
                                        className="z-0 w-full h-full scale-125 -translate-y-6"
                                        src={icon}
                                    />
                                    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                                        <div>
                                            <p className="text-black text-tiny">{name}</p>
                                            <p className="text-black text-tiny">{balance}</p>
                                        </div>
                                        <Button color="primary" radius="full" size="sm" onPress={() => openSendModal(contract_id)}>
                                            <IoMdSend />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            {fungible_Tokens.length === 0 && <p>No Ft Asset's</p>}
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
                        <div className="myresponsivegrid">
                            {non_Fungible_Tokens.map(({ name, count, image }) => (
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
                            ))}
                            {non_Fungible_Tokens.length === 0 && <p>No Nft Asset's</p>}
                        </div>
                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    );
}