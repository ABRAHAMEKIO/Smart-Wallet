import React, { useState } from 'react';
import { Chip, Select, SelectItem, Spinner } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody, Button, Avatar, } from "@nextui-org/react";
import { RiNftFill } from "react-icons/ri";
import { MdGeneratingTokens } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { umicrostoActualValue } from "../services/operator";
import { api, explorer } from '../lib/constants';
import axios from 'axios';
import { fetchCallReadOnlyFunction, Cl, cvToValue } from '@stacks/transactions';


export default function WalletAssets({ network, fungible_Tokens, non_Fungible_Tokens, setSelectedContract, sendFtModalOnOpen, setSendNftModalOnOpen }) {
    const [nftMeta, setNftMeta] = useState([]);
    const [targetName, setTargetName] = useState('');
    const [isDisabled, setIsDisAbled] = useState(false);

    function openSendModal(asset) {
        setSelectedContract(asset);
        sendFtModalOnOpen(true);
    }

    function formatNumber(num) {
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

    function openSendNft(assetInfo) {
        setSelectedContract(assetInfo);
        setSendNftModalOnOpen(true);
    }

    async function selectNft(asset) {
        const { name, contract_address, count } = asset;
        setIsDisAbled(true);
        setTargetName(name);
        const nftOwner = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';
        let nftHoldings = (await axios.get(`${api[network]}/extended/v1/tokens/nft/holdings?principal=${nftOwner}&asset_identifiers=${contract_address}::${name}&limit=${count}&offset=0`)).data.results
        nftHoldings = await Promise.all(nftHoldings.map(async (res) => {
            const { asset_identifier, tx_id, value: { repr } } = res;


            let nftmeta;
            try {
                const nftmetaUrl = cvToValue(await fetchCallReadOnlyFunction({
                    contractAddress: asset_identifier.split('.')[0],
                    contractName: asset_identifier.split('::')[0].split('.')[1],
                    functionName: 'get-token-uri',
                    functionArgs: [Cl.uint(parseInt(repr.replace(/\D/g, ''), 10))],
                    senderAddress: nftOwner,
                    network: network
                }))?.value?.value;
                nftmeta = (await axios.get(nftmetaUrl)).data;
            } catch (err) { console.log(err) }

            return {
                name: asset_identifier.split('::')[1],
                asset_identifier,
                tx_id,
                meta: nftmeta,
                asset_id: parseInt(repr.replace(/\D/g, ''), 10),
                contract_principal: asset_identifier.split('::')[0],
                placeholder_icon: '/icon-placeholder.svg'
            };

        }))
        setNftMeta(nftHoldings);
        setIsDisAbled(false);
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
                            {fungible_Tokens.map(({ suggested_name, placeholder_icon, image_uri, balance, contract_principal, contract_identity, tx_id, decimals, symbol }, i) => (
                                <div className="flex justify-between justify-center items-center" key={i}>
                                    <div className='flex gap-3 justify-center items-center'>
                                        <Avatar
                                            isBordered
                                            radius="full"
                                            size="md"
                                            src={image_uri || placeholder_icon}
                                        />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">{symbol || suggested_name}</h4>
                                            <h5 className="text-small tracking-tight text-default-400 text-warning"> {formatNumber(umicrostoActualValue(balance, decimals || 1))}</h5>
                                        </div>
                                    </div>
                                    <p className='truncate p-3'>
                                        <a href={`${explorer(contract_principal || '', tx_id || '', network)}`} target='blank' className='text-primary underline'>{tx_id || contract_principal}</a>
                                    </p>
                                    <div className='flex flex-col gap-2'>
                                        <Button color="primary" radius="full" size="sm" onPress={() => openSendModal({ address: contract_identity, decimals: parseInt(decimals) || 1, balance })}>
                                            <IoMdSend />
                                        </Button>
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
                                {non_Fungible_Tokens.map(({ name, count, contract_address, contract_id }, i) => (
                                    <SelectItem key={i} startContent={<Avatar src='/icon-placeholder.svg' />} endContent={(isDisabled && name === targetName) ? <Spinner color="warning" /> : <Chip color="success" variant="dot">{count}</Chip>} onPress={() => selectNft({ name, contract_address, count, contract_id })} isReadOnly={isDisabled}>{name}</SelectItem>
                                ))}
                            </Select>

                            {nftMeta.map(({ name, asset_id, meta, tx_id, placeholder_icon, asset_identifier, image_url, contract_principal }, i) => (
                                <div className="flex justify-between justify-center items-center" key={i}>
                                    <div className='flex gap-3 justify-center items-center'>
                                        <a href={`${explorer(contract_principal, '', network)}`} target='blank' className='text-primary underline'>
                                            <Avatar
                                                isBordered
                                                radius="full"
                                                size="md"
                                                src={image_url || placeholder_icon}
                                            />
                                        </a>
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">{name}</h4>
                                            <h5 className="text-small tracking-tight text-default-400">{asset_id}</h5>
                                        </div>
                                    </div>
                                    <p className='truncate p-3'>
                                        <a href={`${explorer('', tx_id, network)}`} target='blank' className='text-primary underline'>{tx_id || contract_principal}</a>
                                    </p>
                                    <div className='flex flex-col gap-2'>
                                        <Button color="primary" radius="full" size="sm" onPress={() => openSendNft({ name, asset_id, address: contract_principal, asset_identifier, meta, tx_id })}>
                                            <IoMdSend />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {non_Fungible_Tokens.length === 0 && <p>Nothing to display.</p>}
                        </div>
                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    );
}