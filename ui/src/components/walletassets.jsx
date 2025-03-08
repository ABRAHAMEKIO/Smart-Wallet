import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card, CardBody, Button, Select, SelectItem, Chip, Input, Image, CardHeader, Divider, CardFooter, Code, Accordion, AccordionItem } from "@heroui/react";
import { RiNftFill } from "react-icons/ri";
import { MdGeneratingTokens } from "react-icons/md";
import { umicrostoActualValue, actualtoUmicroValue } from '../lib/operator';
import { getNftWallet } from '../services/wallet';
import { IoSend } from 'react-icons/io5';
import { userSession } from '../user-session';
import { bufferCVFromString, cvToValue, fetchCallReadOnlyFunction, noneCV, Pc, PostConditionMode, principalCV, someCV, uintCV } from '@stacks/transactions';
import { network } from '../lib/constants';
import { openContractCall } from '@stacks/connect';

const Walletassets = ({ clientConfig, fungibleToken, nonFungibleToken, contractState, setConfirmationModal, setTx, smartWalletAddress }) => {
    const userAddress = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];

    const [selectedToken, setSelectedToken] = useState();
    const [assetMeta, setAssetMeta] = useState();
    const [selectedNft, setSelectedNft] = useState();
    const [isFtDisabled, setIsFtDisabled] = useState(false);
    const [isNftDisabled, setIsNftDisabled] = useState(false);

    const [amount, setAmount] = useState(0);
    const [address, setAddress] = useState(userAddress);
    const [memo, setMemo] = useState('');


    async function handleSelectFt(e) {
        const { value } = e.target;
        if (value === '$.0') {
            setSelectedToken({ image_uri: '/stx-logo.svg', ...stx });
            return
        }

        const { contract_id } = fungibleToken[value];
        const getDecimal = await fetchCallReadOnlyFunction({
            contractAddress: contract_id.split('.')[0],
            contractName: contract_id.split('::')[0].split('.')[1],
            functionName: 'get-decimals',
            functionArgs: [],
            network: network(clientConfig?.chain),
            senderAddress: userAddress
        });
        setSelectedToken({ decimal: parseInt(cvToValue(getDecimal)?.value), ...fungibleToken[value] })
    }

    async function handleSelectNft(e) {
        const { value } = e.target;
        let metaData = await getNftWallet(nonFungibleToken[value]?.asset_identifier, nonFungibleToken[value]?.value, clientConfig);
        setAssetMeta({ ...metaData, ...nonFungibleToken[value] });
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

    function sendFt() {

        const { contract_id } = selectedToken;
        const ftTxAmount = actualtoUmicroValue(amount, selectedToken?.decimal);
        const mem = memo ? someCV(bufferCVFromString(memo)) : noneCV();
        const condition1 = Pc.principal(smartWalletAddress).willSendLte(ftTxAmount).ft(contract_id.split('::')[0], contract_id.split('::')[1]);

        const [assetAddress, assetContractName] = contract_id.split('.');
        openContractCall({
            contractAddress: assetAddress,
            contractName: assetContractName,
            functionName: 'transfer',
            functionArgs: [uintCV(ftTxAmount), principalCV(smartContractAddress), principalCV(address), mem],
            network: network(clientConfig?.chain),
            stxAddress: userAddress,
            postConditions: [condition1],
            postConditionMode: PostConditionMode.Deny,
            onFinish: (res) => {
                setTx(res?.txId);
                setConfirmationModal(true);
            },
            onCancel: (res) => {
                console.log('transaction cancelled', { res });
            }
        })
    }

    function sendNFt() {
        const { asset_identifier, value } = selectedNft;
        const condition = Pc.principal(smartWalletAddress).willSendAsset().nft(asset_identifier, uintCV(value));
        openContractCall({
            contractAddress: asset_identifier.split('.')[0],
            contractName: asset_identifier.split('::')[0].split(".")[1],
            functionName: 'transfer',
            functionArgs: [uintCV(value), principalCV(smartWalletAddress), principalCV(address)],
            network: network(clientConfig?.chain),
            postConditions: [condition],
            postConditionMode: PostConditionMode.Deny,
            stxAddress: userAddress,
            onFinish: (res) => {
                setTx(res?.txId);
                setConfirmationModal(true);
            },
            onCancel: (res) => {
                console.log('transaction cancelled', { res });
            }
        });
    }

    useEffect(() => {
        if (amount > umicrostoActualValue(selectedToken?.balance, selectedToken?.decimal)) {
            setIsFtDisabled(true);
        } else {
            setIsFtDisabled(false);
        }
    }, [selectedToken, amount])

    useEffect(() => {
        if (!selectedNft || !address) {
            setIsNftDisabled(true);
        } else {
            setIsNftDisabled(false);
        }
    }, [selectedNft, address])

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
                                    endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(selectedToken?.balance, selectedToken?.decimal))}</Chip>}
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

                                <Input label="Amount" placeholder='Enter amount...' type='number' max={umicrostoActualValue(selectedToken?.balance, selectedToken?.decimal) || 0} onChange={(e) => setAmount(e.target.value)} />
                                <Input label="Address" placeholder='Enter address...' type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
                                <Input label="Memo" placeholder='Enter memo...' type='text' maxLength={34} value={memo} onChange={(e) => setMemo(e.target.value)} />

                                <Button color='warning' onPress={sendFt} isDisabled={isFtDisabled || !contractState}>
                                    <IoSend size="20px" className='text-white' />
                                </Button>
                                <Divider />

                                <div className='w-full flex flex-col gap-2'>

                                    <Code className='w-full flex items-center gap-5'><Chip>Receipient:</Chip> <small>{`${address.slice(0, 4)}...${address.slice(address.length - 5, address.length)}`}</small></Code>
                                    <Code className='w-full flex items-center gap-5'><Chip>Amount:</Chip> {`${formatNumber(amount)} ${selectedToken?.name || 'NA'}`}</Code>

                                </div>



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
                                        <Image key={assetMeta?.name} alt={assetMeta?.name} width={'100%'} height={'100%'} radius="sm" src={assetMeta?.image} />
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
                                                                <Code className='flex gap-1 items-center pl-5 overflow-x-auto' key={key}><Chip color='primary' variant='dot'>{key}: </Chip>{attr[key]}</Code>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </AccordionItem>
                                            </Accordion>

                                            <Accordion>
                                                <AccordionItem key="3" className='bg-secondary-100 rounded' variant='splitted' aria-label="Accordion 3" title={<Chip color="secondary" className='uppercase' variant="dot">Properties</Chip>}>
                                                    <div className='flex flex-col gap-1 bg-default-200 rounded-lg'>
                                                        {assetMeta && Object.keys(assetMeta?.properties).map((k) => (
                                                            <Code className='flex gap-1 items-center pl-5 overflow-x-auto ' key={k}><Chip color='primary' variant='dot'>{k}: </Chip>{assetMeta?.properties[k]}</Code>
                                                        ))}
                                                    </div>
                                                </AccordionItem>
                                            </Accordion>

                                        </div>
                                    </CardBody>

                                    <Divider />
                                    <CardFooter className='flex flex-col gap-2'>
                                        <Input label="Address" placeholder='Enter address' type='text' value={address} onChange={(e) => setAddress(e.target.value)} />

                                        <Button color='warning' className='w-full' isDisabled={isNftDisabled || !contractState} onPress={sendNFt}>
                                            <IoSend size="20px" className='text-white' />
                                        </Button>

                                        <Divider />
                                        <div className='w-full flex flex-col gap-2'>
                                            <Code className='w-full flex items-center gap-5'><Chip>Receipient:</Chip> <small>{`${address.slice(0, 4)}...${address.slice(address.length - 5, address.length)}`}</small></Code>
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
