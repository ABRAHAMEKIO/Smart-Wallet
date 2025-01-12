import { getAddress, network } from '../../services/auth';
import React, { useEffect, useState } from 'react';
import BaseModal from './basemodal';
import { Button, Form, ModalBody, ModalHeader, Input, Tabs, Tab, Card, CardBody, Avatar, ModalFooter, Select, SelectItem, Spinner, Chip } from '@nextui-org/react';
import { MdGeneratingTokens } from "react-icons/md";
import { RiNftFill } from 'react-icons/ri';
import { CiCoinInsert } from "react-icons/ci";
import { openContractCall, openSTXTransfer } from '@stacks/connect';
import { getAllAssets } from '../../services/wallet';
import { umicrostoActualValue } from '../../services/operator';
import { bufferCVFromString, callReadOnlyFunction, Cl, createAssetInfo, cvToValue, makeStandardNonFungiblePostCondition, NonFungibleConditionCode, Pc } from '@stacks/transactions';
import axios from 'axios';
import { api, explorer } from '../../lib/constants';
import { IoMdSend } from 'react-icons/io';

function DepositModal({ clientConfig, openDepositModal, closeDepositModal }) {
    const [stx, setStx] = useState({ balance: 0, rate: 0 });
    const [fungible_Tokens, setFungible_Tokens] = useState([]);
    const [non_Fungible_Tokens, setNon_Fungible_Tokens] = useState([]);
    const [nftMeta, setNftMeta] = useState([]);

    const [targetName, setTargetName] = useState('');
    const [isDisabled, setIsDisAbled] = useState(false);
    const [selectedFt, setSelectedFt] = useState({ image_uri: '', placeholder_icon: '', balance: 0, decimals: 0, contract_principal: '', contract_identity: '' });

    const [amount, setAmount] = useState(0);
    const [memo, setMemo] = useState('');

    const activeNetwork = clientConfig.network;
    const authedUser = getAddress(activeNetwork);

    async function depoStx() {
        const contractName = "smart-wallet";
        openSTXTransfer({
            recipient: `${authedUser}.${contractName}`,
            amount: amount * 1000000,
            memo: memo,
            stxAddress: authedUser,
            network: network(activeNetwork)
        })
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
    function selectFt(props) {
        setSelectedFt(props);
    }
    async function depoFt() {
        const address = selectedFt.contract_principal.split('.')[0]
        const contractName = selectedFt.contract_principal.split('.')[1];
        const sendAmount = amount / selectedFt.decimals;
        const condition01 = Pc.principal(authedUser).willSendLte(sendAmount).ft(selectedFt.contract_principal, selectedFt.contract_identity.split('::')[1]);

        openContractCall({
            contractAddress: address,
            contractName: contractName,
            functionName: 'transfer',
            functionArgs: [
                Cl.uint(sendAmount),
                Cl.standardPrincipal(authedUser),
                Cl.contractPrincipal(authedUser, 'smart-wallet'),
                memo ? Cl.some(Cl.bufferFromAscii(memo)) : Cl.none()
            ],
            validateWithAbi: true,
            sponsored: false,
            stxAddress: address,
            postConditions: [condition01],
            network: network(activeNetwork),
            onFinish: (res) => {
                console.log({ res });
            },
            onCancel: (err) => {
                console.log(err);
            }
        });
    }

    async function selectNft(asset) {
        const { name, contract_address, count } = asset;
        setIsDisAbled(true);
        setTargetName(name);
        const nftOwner = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';
        let nftHoldings = (await axios.get(`${api[activeNetwork]}/extended/v1/tokens/nft/holdings?principal=${nftOwner}&asset_identifiers=${contract_address}::${name}&limit=${count}&offset=0`)).data.results
        nftHoldings = await Promise.all(nftHoldings.map(async (res) => {
            const { asset_identifier, tx_id, value: { repr } } = res;


            let nftmeta;
            try {
                const nftmetaUrl = cvToValue(await callReadOnlyFunction({
                    contractAddress: asset_identifier.split('.')[0],
                    contractName: asset_identifier.split('::')[0].split('.')[1],
                    functionName: 'get-token-uri',
                    functionArgs: [Cl.uint(parseInt(repr.replace(/\D/g, ''), 10))],
                    senderAddress: nftOwner,
                    network: network
                }))?.value?.value;
                nftmeta = (await axios.get(nftmetaUrl)).data;
            } catch (error) { }

            return {
                name: asset_identifier.split('::')[1],
                asset_identifier,
                tx_id,
                meta: nftmeta,
                asset_id: parseInt(repr.replace(/\D/g, ''), 10),
                contract_principal: asset_identifier.split('::')[0],
                placeholder_icon: '/nft-placeholder.svg'
            };

        }))
        setNftMeta(nftHoldings);
        setIsDisAbled(false);
    }
    async function depoNft(asset) {
        const { asset_id, asset_identifier } = asset;
        const address = asset_identifier.split('::')[0].split('.')[0];
        const contractname = asset_identifier.split('::')[0].split('.')[1];
        const assetname = asset_identifier.split('::')[1];
        const assetId = bufferCVFromString(asset_id);

        const postConditionCode = NonFungibleConditionCode.Sends;
        const nonFungibleAssetInfo = createAssetInfo(address, contractname, assetname);
        const condition01 = makeStandardNonFungiblePostCondition(authedUser, postConditionCode, nonFungibleAssetInfo, assetId);

        openContractCall({
            contractAddress: address,
            contractName: contractname,
            functionName: 'transfer',
            functionArgs: [
                Cl.uint(asset_id),
                Cl.standardPrincipal(authedUser),
                Cl.contractPrincipal(authedUser, 'smart-wallet')
            ],
            validateWithAbi: true,
            sponsored: false,
            stxAddress: address,
            postConditions: [condition01],
            network: network(activeNetwork),
            onFinish: (res) => {
                console.log({ res });
            },
            onCancel: (err) => {
                console.log(err);
            }
        });
    }

    useEffect(() => {
        async function initBalance() {
            const balance = await getAllAssets(authedUser, activeNetwork);
            const { stx, fungible_tokens, non_fungible_tokens } = balance;
            setStx(stx);
            setFungible_Tokens(fungible_tokens);
            setNon_Fungible_Tokens(non_fungible_tokens);
        }
        initBalance();
    }, [])

    return (
        <BaseModal baseModalsOpen={openDepositModal} baseModalOnClose={closeDepositModal}>
            <ModalHeader className="flex flex-col gap-1">Fund Smart Wallet</ModalHeader>
            <ModalBody>
                <Tabs className='w-full mt-1' aria-label="Options" placement={'top'}>
                    <Tab className='w-full p-0' key="stx" title={
                        <div className="flex items-center gap-1 space-x-2 p-1">
                            <Avatar src='/stx-logo.svg' size='sm' />
                            <span>Stx</span>
                        </div>
                    }>
                        <Card className='mt-1'>
                            <CardBody >
                                <Form className="w-full space-y-4" validationBehavior="native"
                                >
                                    <div className='flex gap-3 justify'>
                                        <Avatar
                                            isBordered
                                            radius="full"
                                            size="md"
                                            src="/stx-logo.svg"
                                        />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">Balance: <code className='text-warning'>{stx.balance}</code></h4>
                                            <h5 className="text-small tracking-tight text-default-400">Rate: $ {stx.rate}</h5>
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col gap-4 bg-pink-200">
                                        <Input
                                            isRequired
                                            errorMessage={"This field is required"}
                                            label=""
                                            labelPlacement="outside"
                                            placeholder="Amount"
                                            type='number'
                                            value={amount}
                                            maxLength={stx.balance}
                                            max={stx.balance}
                                            onChange={(e) => {
                                                if (Number(e.target.value) > stx.balance) {
                                                    setAmount(0);
                                                    return;
                                                }
                                                let value = e.target.value.replace(/^0+(?=\d)/, '');
                                                setAmount(value);
                                            }}
                                        />

                                        <Input
                                            errorMessage={"This field is required"}
                                            label=""
                                            labelPlacement="outside"
                                            placeholder="Memo"
                                            type='text'
                                            value={memo}
                                            onChange={(e) => setMemo(e.target.value)}
                                        />

                                        <div className="flex justify-between gap-4">
                                            <Button type="reset" variant="bordered" onPress={() => { setAmount(0); setMemo('') }}>
                                                Reset
                                            </Button>
                                            <Button className="p-0" color="primary" radius="full" onPress={depoStx}>
                                                <CiCoinInsert size='sm' />
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab className='w-full p-0' key="token" title={
                        <div className="flex items-center gap-1 space-x-2 p-1">
                            <MdGeneratingTokens />
                            <span>Token</span>
                        </div>
                    }>
                        <Card className='mt-1'>
                            <CardBody >
                                <Form
                                    className="w-full justify-center items-center w-full space-y-4"
                                    validationBehavior="native"
                                >
                                    <div className="w-full flex flex-col gap-4 bg-pink-200">

                                        <Select label="" placeholder='Available ft tokens' startContent={<Avatar size='sm' src={selectedFt.image_uri || selectedFt.placeholder_icon} />}>
                                            {fungible_Tokens.map(({ name, suggested_name, placeholder_icon, image_uri, balance, contract_principal, contract_identity, tx_id, decimals, symbol }) => (
                                                <SelectItem
                                                    startContent={<Avatar src={image_uri || placeholder_icon} />}
                                                    endContent={
                                                        (isDisabled && name === targetName)
                                                            ? <Spinner color="warning" />
                                                            : <Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(balance, parseInt(decimals) || 1))}</Chip>
                                                    }
                                                    onPress={() => selectFt({ name, suggested_name, placeholder_icon, image_uri, balance, contract_principal, contract_identity, decimals: parseInt(decimals) || 1 })}
                                                    isReadOnly={isDisabled}>
                                                    {name || suggested_name}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Input
                                            isRequired
                                            errorMessage={"This field is required"}
                                            label=""
                                            labelPlacement="outside"
                                            value={amount}
                                            placeholder="Amount"
                                            type='number'
                                            maxLength={selectedFt.balance}
                                            max={selectedFt.balance}
                                            onChange={(e) => {
                                                if (Number(e.target.value) > stx.balance) {
                                                    setAmount(0);
                                                    return;
                                                }
                                                let value = e.target.value.replace(/^0+(?=\d)/, '');
                                                setAmount(value);
                                            }}
                                        />

                                        <Input
                                            errorMessage={"This field is required"}
                                            label=""
                                            labelPlacement="outside"
                                            placeholder="Memo"
                                            type='text'
                                            value={memo}
                                            onChange={(e) => setMemo(e.target.value)}
                                        />

                                        <div className="flex justify-between gap-4">
                                            <Button type="reset" variant="bordered" onPress={() => { setAmount(0); setMemo('') }}>
                                                Reset
                                            </Button>
                                            <Button className="p-0" color="primary" radius="full" onPress={depoFt}>
                                                <CiCoinInsert size='sm' />
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab className='w-full p-0' key="wallet" title={
                        <div className="flex items-center gap-1 space-x-2 p-1">
                            <RiNftFill />
                            <span>Wallet</span>
                        </div>
                    }>
                        <Card className='mt-1'>
                            <CardBody >
                                <Form
                                    className="w-full justify-center items-center w-full space-y-4"
                                    validationBehavior="native"
                                >
                                    <div className="w-full flex flex-col gap-4 bg-pink-200">

                                        <Select label="Assets List">
                                            {non_Fungible_Tokens.map(({ name, count, contract_address, contract_id, image_url }) => (
                                                <SelectItem startContent={<Avatar src={image_url} />} endContent={(isDisabled && name === targetName) ? <Spinner color="warning" /> : <Chip color="success" variant="dot">{count}</Chip>} onPress={() => selectNft({ name, contract_address, count, contract_id, image_url })} isReadOnly={isDisabled}>{name}</SelectItem>
                                            ))}
                                        </Select>

                                        <div style={{ maxHeight: '400px', padding: '1rem', overflowY: 'auto' }} className='w-full flex flex-col gap-3'>
                                            {nftMeta.map(({ name, asset_id, meta, tx_id, placeholder_icon, asset_identifier, image_url, contract_principal, }) => (
                                                <div className="w-full flex justify-between justify-center items-center">
                                                    <div className='flex gap-3 justify-center items-center'>
                                                        <a href={`${explorer(contract_principal || '', tx_id || '', network)}`} target='blank' className='text-primary underline'>
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

                                                    </p>
                                                    <div className='flex flex-col gap-2'>
                                                        <Button color="primary" radius="full" size="sm" onPress={() => depoNft({ asset_id, asset_identifier })}>
                                                            <IoMdSend />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            {non_Fungible_Tokens.length === 0 && <p>Nothing to display.</p>}
                                        </div>


                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>

            </ModalBody>
            <ModalFooter />
        </BaseModal >
    );
}

export default DepositModal;