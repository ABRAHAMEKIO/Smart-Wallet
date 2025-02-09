import React, { } from 'react';
import { Tabs, Tab, Card, CardBody, Button, Avatar } from "@heroui/react";
import { RiLuggageDepositFill, RiNftFill } from "react-icons/ri";
import { MdGeneratingTokens } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { umicrostoActualValue, actualtoUmicroValue } from '../lib/operator';

const Walletassets = ({ clientConfig, fungibleToken, nonFungibleToken }) => {

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
                        <div className="w-full flex flex-col gap-2">
                            {fungibleToken.map((
                                { suggested_name, placeholder_icon,
                                    image_uri, balance,
                                    contract_principal, contract_identity,
                                    tx_id, decimals,
                                    symbol
                                }, i) => (
                                <div className="flex justify-between justify-center items-center bg-gray-100 rounded-xl p-2" key={i}>
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
                                        <a href={`${clientConfig?.explorer}/${contract_principal ? 'address' : 'txid'}/${contract_principal || tx_id}/?chain=${clientConfig?.chain}`} target='blank' className='text-primary underline'>
                                            {
                                                `${String(tx_id).slice(0, 4)}...${String(tx_id).slice(String(tx_id).length - 5, String(tx_id).length)}` ||
                                                `${String(contract_principal).slice(0, 4)}...${String(contract_principal).slice(String(contract_principal).length - 5, String(contract_principal).length)}`
                                            }
                                        </a>
                                    </p>
                                    <div className='flex flex-col gap-2'>
                                        <Button color="primary" radius="full" size="sm" onPress={() => openSendModal({ address: contract_identity, decimals: parseInt(decimals) || 1, balance })}>
                                            <IoMdSend />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {!(fungibleToken.length > 0) && <p>Nothing to display.</p>}
                        </div>
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
                        <div className="w-full">
                            {/* <Select label="Assets List">
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

                        {non_Fungible_Tokens.length === 0 && <p>Nothing to display.</p>} */}
                        </div>
                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    );
}

export default Walletassets;
