import React, { useState } from 'react';
import { Tabs, Tab, Card, CardBody, Button, Avatar, Select, SelectItem, Chip } from "@heroui/react";
import { RiLuggageDepositFill, RiNftFill } from "react-icons/ri";
import { MdGeneratingTokens } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { umicrostoActualValue, actualtoUmicroValue } from '../lib/operator';
import { default_token_icon } from '../pages/wallet';
import { getNftWallet } from '../services/wallet';

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
        setAssetMeta(metaData);
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
                            ? <div className="w-full flex flex-col gap-2">
                                <Select label="Available Fungible token"
                                    placeholder='Select token...'
                                    endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(selectedToken?.balance, 6))}</Chip>}
                                    onChange={handleSelectFt}
                                >
                                    {fungibleToken.map(({ name, balance, decimals }, i) => (
                                        <SelectItem key={i}
                                            className='uppercase'
                                            value={i}
                                            startContent={<Avatar src={default_token_icon} />}
                                            endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(balance, parseInt(decimals) || 1))}</Chip>}>
                                            {name}
                                        </SelectItem>
                                    ))}

                                </Select>
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
                            ? <div className="w-full">
                                <Select
                                    label="Available NoneFungible token"
                                    placeholder='Select asset...'
                                    endContent={<Chip color="success" variant="dot">{selectedNft?.value}</Chip>}
                                    onChange={handleSelectNft}
                                >
                                    {nonFungibleToken.map(({ name, value }, i) => (
                                        <SelectItem key={i}
                                            value={i}
                                            startContent={<Avatar src='/icon-placeholder.svg' />}
                                            endContent={<Chip color="success" variant="dot">{value}</Chip>}
                                        >
                                            {name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            : <p>Nothing to display.</p>
                        }
                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    );
}

export default Walletassets;
