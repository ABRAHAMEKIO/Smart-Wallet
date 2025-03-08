import React, { useEffect, useState } from 'react';
import BaseModal from './basemodal';
import { bufferCVFromString, cvToValue, fetchCallReadOnlyFunction, noneCV, Pc, PostConditionMode, principalCV, someCV, uintCV } from '@stacks/transactions';
import { Alert, Button, Chip, Image, Input, ModalBody, ModalHeader, Select, SelectItem, Switch } from '@heroui/react';
import { actualtoUmicroValue, umicrostoActualValue } from '../../lib/operator';
import { RiLuggageDepositFill, RiNftFill } from 'react-icons/ri';
import { MdGeneratingTokens } from 'react-icons/md';
import { getNftWallet } from '../../services/wallet';
import { network } from '../../lib/constants';
import { userSession } from '../../user-session';
import { openContractCall, openSTXTransfer } from '@stacks/connect';

const DepositModal = ({ clientConfig, show, close, stx, fungibleToken, nonFungibleToken, setTx, setConfirmationModal, contractState, smartWalletAddress }) => {
    const userAddress = userSession.loadUserData().profile.stxAddress[clientConfig?.chain];

    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedToken, setSelectedToken] = useState();

    const [selectedNftToken, setSelectedNftToken] = useState();
    const [assetMeta, setAssetmet] = useState();

    const [assetSwitch, setAssetSwitch] = useState(false);

    const [amount, setAmount] = useState(0);
    const [memo, setMemo] = useState('');


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

    async function handleSelectToken(e) {
        const { value } = e.target;
        if (value === '$.0') {
            setSelectedToken({ name: 'stx', decimal: 6, image_uri: '/stx-logo.svg', ...stx });
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

    async function handleSelectNftToken(e) {
        const { value } = e.target;
        let metaData = await getNftWallet(nonFungibleToken[value]?.asset_identifier, nonFungibleToken[value]?.value, clientConfig);
        console.log({ metaData });
        setAssetmet(metaData);
        setSelectedNftToken(nonFungibleToken[value]);
    }

    async function depositFt() {
        const { name, contract_id } = selectedToken;
        if (name === 'stx') {
            const stxTxAmount = actualtoUmicroValue(amount, selectedToken?.decimal);
            const condition0 = Pc.principal(userAddress).willSendLte(stxTxAmount).ustx();
            openSTXTransfer({
                amount: stxTxAmount,
                recipient: smartWalletAddress,
                memo: memo,
                stxAddress: userAddress,
                network: network(clientConfig?.chain),
                postConditions: [condition0],
                postConditionMode: PostConditionMode.Deny,
                onFinish: (res) => {
                    setTx(res?.txId);
                    setConfirmationModal(true);
                    close();
                },
                onCancel: (res) => {
                    console.log('transaction cancelled', { res });
                }
            })
            return;
        }

        const ftTxAmount = actualtoUmicroValue(amount, selectedToken?.decimal);
        const mem = memo ? someCV(bufferCVFromString(memo)) : noneCV();
        const condition1 = Pc.principal(userAddress).willSendLte(ftTxAmount).ft(contract_id.split('::')[0], contract_id.split('::')[1]);
        openContractCall({
            contractAddress: contract_id.split('.')[0],
            contractName: contract_id.split('::')[0].split('.')[1],
            functionName: 'transfer',
            functionArgs: [uintCV(ftTxAmount), principalCV(userAddress), principalCV(smartWalletAddress), mem],
            network: network(clientConfig?.chain),
            stxAddress: userAddress,
            postConditions: [condition1],
            postConditionMode: PostConditionMode.Deny,
            onFinish: (res) => {
                setTx(res?.txId);
                setConfirmationModal(true);
                close();
            },
            onCancel: (res) => {
                console.log('transaction cancelled', { res });
            }
        })

    }

    async function depositNft() {
        const { asset_identifier, value } = selectedNftToken;
        const condition = Pc.principal(userAddress).willSendAsset().nft(asset_identifier, uintCV(value));
        openContractCall({
            contractAddress: asset_identifier.split('.')[0],
            contractName: asset_identifier.split('::')[0].split(".")[1],
            functionName: 'transfer',
            functionArgs: [uintCV(value), principalCV(userAddress), principalCV(smartWalletAddress)],
            network: network(clientConfig?.chain),
            postConditions: [condition],
            postConditionMode: PostConditionMode.Deny,
            stxAddress: userAddress,
            onFinish: (res) => {
                setTx(res?.txId);
                setConfirmationModal(true);
                close();
            },
            onCancel: (res) => {
                console.log('transaction cancelled', { res });
            }
        });
    }

    useEffect(() => {
        if (amount > umicrostoActualValue(selectedToken?.balance, selectedToken?.decimal)) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [selectedToken, amount])

    return (
        <BaseModal baseModalsOpen={show} baseModalOnClose={close}>
            <ModalHeader className="flex flex-col gap-1">Credit Smart Wallet</ModalHeader>
            <ModalBody className='p-5 gap-4'>
                <Alert
                    className='flex items-center'
                    color="secondary"
                    description="Transactions are transfered from your wallet 💼 to your smart wallet 🤖. Verify on Leathal Wallet 🔒."
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
                            <Image key={assetMeta?.name} alt={assetMeta?.name} width={'100%'} height={'100%'} src={assetMeta?.image || '/nft-holder.png'} />
                            <div className='flex flex-col gap-2'>
                                <div>
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
                            endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(selectedToken?.balance, selectedToken?.decimal))}</Chip>}
                            onChange={handleSelectToken}
                        >
                            <SelectItem
                                className='uppercase'
                                startContent={<MdGeneratingTokens color='#FFA500' />}
                                value={'stx'}
                                endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(stx?.balance, 6))}</Chip>}
                                isReadOnly={isDisabled}
                            >
                                Stx
                            </SelectItem>

                            {fungibleToken.map(({ name, balance, decimals }, i) => (
                                <SelectItem key={i}
                                    className='uppercase'
                                    value={i}
                                    startContent={<MdGeneratingTokens color='#FFA500' />}
                                    endContent={<Chip color="success" variant="dot">{formatNumber(umicrostoActualValue(balance, parseInt(decimals) || 1))}</Chip>}
                                    isReadOnly={isDisabled}>
                                    {name}
                                </SelectItem>
                            ))}

                        </Select>
                        <Input errorMessage={`Value must be less than or equal to ${formatNumber(umicrostoActualValue(selectedToken?.balance, selectedToken?.decimal))}`} label="Amount" placeholder="Enter amount" type="number" max={umicrostoActualValue(selectedToken?.balance, selectedToken?.decimal) || 0} value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <Input label="Memo" placeholder="Enter memo" type="text" maxLength={34} value={memo} onChange={(e) => setMemo(e.target.value)} />

                    </>
                }

                <Button color="warning" variant="shadow" onPress={assetSwitch ? depositNft : depositFt} isDisabled={isDisabled || !contractState}>
                    <RiLuggageDepositFill color='white' />
                </Button>

            </ModalBody>
        </BaseModal>
    );
}

export default DepositModal;
