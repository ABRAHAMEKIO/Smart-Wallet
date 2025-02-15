import React, { useEffect, useState } from 'react';
import BaseModal from './basemodal';
import { Alert, Avatar, Button, Chip, Image, Input, ModalBody, ModalHeader, Select, SelectItem, Spinner, Switch } from '@heroui/react';
import { umicrostoActualValue } from '../../lib/operator';
import { RiLuggageDepositFill, RiNftFill } from 'react-icons/ri';
import { MdGeneratingTokens } from 'react-icons/md';
import { default_token_icon } from '../../pages/wallet';
import { getNftWallet } from '../../services/wallet';
import { storageProvider } from '../../lib/constants';

const DepositModal = ({ show, close, stx, fungibleToken, nonFungibleToken, clientConfig }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedToken, setSelectedToken] = useState();

    const [selectedNftToken, setSelectedNftToken] = useState();
    const [assetMeta, setAssetmet] = useState();

    const [assetSwitch, setAssetSwitch] = useState(false);

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

    function handleSelectToken(e) {
        const { value } = e.target;
        if (value === '$.0') {
            setSelectedToken({ image_uri: '/stx-logo.svg', ...stx });
            return
        }
        setSelectedToken(fungibleToken[value])
    }

    async function handleSelectNftToken(e) {
        const { value } = e.target;
        let metaData = await getNftWallet(nonFungibleToken[value]?.asset_identifier, nonFungibleToken[value]?.value, clientConfig);
        console.log({ metaData });
        setAssetmet(metaData);
        setSelectedNftToken(nonFungibleToken[value]);
    }

    return (
        <BaseModal baseModalsOpen={show} baseModalOnClose={close}>
            <ModalHeader className="flex flex-col gap-1">Credit Smart Wallet</ModalHeader>
            <ModalBody className='p-5 gap-4'>
                <Alert
                    color="success"
                    description="Transactions move from your wallet 💼 to your smart wallet 🤖. Verify on Leathal Wallet 🔒."
                    title=""
                    variant="faded"
                />

                <div className='w-full flex justify-end'>
                    <Switch value={assetSwitch} onChange={() => setAssetSwitch(!assetSwitch)} color="warning" size="sm" endContent={<MdGeneratingTokens color='#FFA500' />} startContent={<RiNftFill color='#eff6ff' />} />
                </div>

                {assetSwitch
                    ? <>
                        <Select label=""
                            placeholder='Available nft asset'
                            startContent={<RiNftFill color='#FFA500' />}
                            endContent={<Chip color="success" variant="dot">{selectedNftToken?.value}</Chip>}
                            onChange={handleSelectNftToken}
                        >
                            {nonFungibleToken.map(({ name, value }, i) => (
                                <SelectItem key={i}
                                    className='capitalize'
                                    value={i}
                                    startContent={<RiNftFill color='#FFA500' />}
                                    endContent={<Chip color="success" variant="dot">{value}</Chip>}
                                    isReadOnly={isNaN(parseInt(value))}>
                                    {name}
                                </SelectItem>
                            ))}

                        </Select>

                        <div className='w-full flex flex-row-2 gap-5 items-center p-4'>
                            <Image alt={assetMeta?.name} key={assetMeta?.name} style={{ maxWidth: '160px', height: '90px' }} src={assetMeta?.image || '/nft-holder.png'} isBordered />
                            <div className='flex flex-col'>
                                <div className='flex gap-1 items-center'>
                                    <h4>Name:</h4>
                                    <small className='uppercase'>{assetMeta?.name}</small>
                                </div>
                                <div>
                                    <h4>Description:</h4>
                                    <small>{assetMeta?.description}</small>
                                </div>
                            </div>
                        </div>

                    </>
                    : <>
                        <Select label=""
                            placeholder='Available ft tokens'
                            startContent={<MdGeneratingTokens color='#FFA500' />}
                            endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(selectedToken?.balance, 6))}</Chip>}
                            onChange={handleSelectToken}
                        >
                            <SelectItem
                                className='uppercase'
                                startContent={<MdGeneratingTokens color='#FFA500' />}
                                value={'stx'}
                                endContent={
                                    (isDisabled && 'stx' === targetName)
                                        ? <Spinner color="warning" />
                                        : <Chip color="success" variant="dot">
                                            {formatNumber(umicrostoActualValue(stx?.balance, 6))}
                                        </Chip>
                                }
                                isReadOnly={isDisabled}
                            >
                                Stx
                            </SelectItem>

                            {fungibleToken.map(({ name, balance, decimals }, i) => (
                                <SelectItem key={i}
                                    className='uppercase'
                                    value={i}
                                    startContent={<MdGeneratingTokens color='#FFA500' />}
                                    endContent={
                                        (isDisabled && name === targetName)
                                            ? <Spinner color="warning" />
                                            : <Chip color="success" variant="dot">
                                                {formatNumber(umicrostoActualValue(balance, parseInt(decimals) || 1))}
                                            </Chip>
                                    }
                                    isReadOnly={isDisabled}>
                                    {name}
                                </SelectItem>
                            ))}

                        </Select>

                        <Input label="Amount" placeholder="Enter amount" type="number" />

                    </>
                }

                <Button color="warning" variant="shadow">
                    <RiLuggageDepositFill color='white' />
                </Button>

            </ModalBody>
        </BaseModal>
    );
}

export default DepositModal;
