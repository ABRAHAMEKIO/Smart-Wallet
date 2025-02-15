import React, { useState } from 'react';
import { Tabs, Tab, Card, CardBody, Button, Avatar, Select, SelectItem, Chip, Input, Image, CardHeader, Divider, CardFooter, Link, Code, Textarea, Accordion, AccordionItem } from "@heroui/react";
import { RiLuggageDepositFill, RiNftFill } from "react-icons/ri";
import { MdGeneratingTokens } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { umicrostoActualValue, actualtoUmicroValue } from '../lib/operator';
import { default_token_icon } from '../pages/wallet';
import { getNftWallet } from '../services/wallet';
import { IoSend } from 'react-icons/io5';

const Walletassets = ({ clientConfig, fungibleToken, nonFungibleToken }) => {

    const [selectedToken, setSelectedToken] = useState();
    function handleSelectFt(e) {
        const { value } = e.target;
        if (value === '$.0') {
            setSelectedToken({ image_uri: '/stx-logo.svg', ...stx });
            return
        }
        setSelectedToken(fungibleToken[value])
    }

    const [assetMeta, setAssetMeta] = useState();
    const [selectedNft, setSelectedNft] = useState();
    async function handleSelectNft(e) {
        const { value } = e.target;
        let metaData = await getNftWallet(nonFungibleToken[value]?.asset_identifier, nonFungibleToken[value]?.value, clientConfig);
        console.log({ metaData });
        setAssetMeta({ ...metaData, ...nonFungibleToken[value] });
        console.log({ hkhkh: nonFungibleToken[value] });
        setSelectedNft(nonFungibleToken[value]);
    }

    function formatNumber(num) {
        if (isNaN(num)) return 0.0;

        if (num >= 1e9) {
            return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "b"; // Billions
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "m"; // Millions
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k"; // Thousands
        }
        return num;
    }

    return (
        <Tabs className='w-full' aria-label="Options" placement={'top'} >
            <Tab key="token" title={
                <div className="flex items-center gap-1 p-1">
                    <MdGeneratingTokens color='#FFA500' />
                    <span>Token</span>
                </div>
            }>
                <Card className='mt-1'>
                    <CardBody>
                        {(fungibleToken.length > 0)
                            ? <div className="w-full flex flex-col gap-2 p-5">

                                <Select label="Available Fungible token"
                                    placeholder='Select token...'
                                    startContent={<MdGeneratingTokens color='#FFA500' />}
                                    endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(selectedToken?.balance, 1))}</Chip>}
                                    onChange={handleSelectFt}
                                >
                                    {fungibleToken.map(({ name, balance, decimals }, i) => (
                                        <SelectItem key={i}
                                            className='uppercase'
                                            value={i}
                                            startContent={<MdGeneratingTokens color='#FFA500' />}
                                            endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(balance, parseInt(decimals) || 1))}</Chip>}>
                                            {name}
                                        </SelectItem>
                                    ))}

                                </Select>

                                <Input label="Amount" placeholder='Enter amount...' type='number' />

                                <Button color='warning'>
                                    <IoSend size="20px" className='text-white' />
                                </Button>

                            </div>
                            : <p>Nothing to display.</p>}
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="nft" title={
                <div className="flex items-center gap-1 p-1">
                    <RiNftFill color='#FFA500' />
                    <span>Nft</span>
                </div>
            }>
                <Card fullWidth>
                    <CardBody>
                        {(nonFungibleToken.length > 0)
                            ? <div className="w-full flex flex-col gap-2 p-5">
                                <Select
                                    label="Available NoneFungible token"
                                    placeholder='Select asset...'
                                    startContent={<RiNftFill color='#FFA500' />}
                                    endContent={<Chip color="success" variant="dot">{selectedNft?.value}</Chip>}
                                    onChange={handleSelectNft}
                                >
                                    {nonFungibleToken.map(({ name, value }, i) => (
                                        <SelectItem key={i}
                                            value={i}
                                            startContent={<RiNftFill color='#FFA500' />}
                                            endContent={<Chip color="success" variant="dot">{value}</Chip>}
                                        >
                                            {name}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Card className="w-full">
                                    <CardHeader className="flex gap-3">
                                        <Image
                                            key={assetMeta?.name}
                                            alt={assetMeta?.name}
                                            height={80}
                                            radius="sm"
                                            src={assetMeta?.image}
                                            width={80}
                                        />
                                        <div className="flex flex-col">
                                            <p className="text-md">Name: {assetMeta?.name}</p>
                                            <p className="text-small text-default-500">Id: {assetMeta?.value}</p>
                                        </div>
                                    </CardHeader>
                                    <Divider />

                                    <CardBody className='flex flex-col gap-2'>
                                        <div className='flex flex-col gap-1'>

                                            <Accordion>
                                                <AccordionItem key="1" className='bg-secondary-100 rounded' variant='splitted' aria-label="Accordion 1" title={<Chip color="secondary" className='uppercase' variant="dot">Description</Chip>}>
                                                    <div className='bg-default-200 rounded break-words pl-5'>
                                                        {assetMeta?.description}
                                                    </div>
                                                </AccordionItem>
                                            </Accordion>

                                            <Accordion>
                                                <AccordionItem key="2" className='bg-secondary-100 rounded' variant='splitted' aria-label="Accordion 2" title={<Chip color="secondary" className='uppercase' variant="dot">Attributes</Chip>}>
                                                    {(Array.isArray(assetMeta?.attributes)) && assetMeta?.attributes.map((attr, i) => (
                                                        <div className='flex flex-col gap-1 bg-default-200 rounded-lg' key={i}>
                                                            {Object.keys(attr).map((key) => (
                                                                <Code className='flex gap-1 items-center pl-5' key={key}><Chip color='primary' variant='dot'>{key}: </Chip>{attr[key]}</Code>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </AccordionItem>
                                            </Accordion>

                                            <Accordion>
                                                <AccordionItem key="3" className='bg-secondary-100 rounded' variant='splitted' aria-label="Accordion 3" title={<Chip color="secondary" className='uppercase' variant="dot">Properties</Chip>}>
                                                    <div className='flex flex-col gap-1 bg-default-200 rounded-lg'>
                                                        {assetMeta && Object.keys(assetMeta?.properties).map((k) => (
                                                            <Code className='flex gap-1 items-center pl-5' key={k}><Chip color='primary' variant='dot'>{k}: </Chip>{assetMeta?.properties[k]}</Code>
                                                        ))}
                                                    </div>
                                                </AccordionItem>
                                            </Accordion>

                                        </div>
                                    </CardBody>

                                    <Divider />
                                    <CardFooter>
                                        <div className='w-full flex justify-end'>
                                            <Button color='warning'>
                                                <IoMdSend color='white' style={{ transform: "rotate(-45deg)" }} />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>

                            </div>
                            : <p>Nothing to display.</p>
                        }
                    </CardBody>
                </Card>
            </Tab>
        </Tabs >
    );
}

export default Walletassets;
