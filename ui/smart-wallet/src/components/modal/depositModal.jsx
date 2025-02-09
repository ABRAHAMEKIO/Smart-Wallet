import React, { useEffect, useState } from 'react';
import BaseModal from './basemodal';
import { Avatar, Chip, ModalBody, ModalHeader, Select, SelectItem, Spinner } from '@heroui/react';
import { umicrostoActualValue } from '../../lib/operator';

const DepositModal = ({ show, close, stx, fungibleToken }) => {
    const [selectedFt, setSelectedFt] = useState({});
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectFt, setSelectFt] = useState();
    const [timer, setTimer] = useState(0);


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
        console.log({ value });
        if (value === 'stx') {
            selectFt({ image_uri: '/stx-logo.svg', ...stx });
            return
        }
        setSelectFt(fungibleToken[value])
    }

    console.log({ selectFt });

    useEffect(() => {
        const tick = setTimeout(() => {
            const update = new Date().getTime();
            setTimer(update);
        }, 1000);
        return () => clearTimeout(tick);
    }, [timer]);

    return (
        <BaseModal baseModalsOpen={show} baseModalOnClose={close}>
            <ModalHeader className="flex flex-col gap-1">Fund Smart Wallet</ModalHeader>
            <ModalBody>

                <Select label="" placeholder='Available ft tokens'
                    startContent={<Avatar src={selectFt ? `${selectFt?.image_uri || selectFt?.placeholder_icon}?timestamp=${timer}` : ''} />}
                    onChange={handleSelectToken}
                >
                    <SelectItem
                        startContent={<Avatar src='/stx-logo.svg' />}
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

                    {fungibleToken.map(({ name, suggested_name, placeholder_icon, image_uri, balance, contract_principal, contract_identity, decimals }, i) => (
                        <SelectItem key={i}
                            value={i}
                            startContent={<Avatar src={image_uri || placeholder_icon} />}
                            endContent={
                                (isDisabled && name === targetName)
                                    ? <Spinner color="warning" />
                                    : <Chip color="success" variant="dot">
                                        {formatNumber(umicrostoActualValue(balance, parseInt(decimals) || 1))}
                                    </Chip>
                            }
                            isReadOnly={isDisabled}>
                            {name || suggested_name}
                        </SelectItem>
                    ))}

                </Select>
            </ModalBody>
        </BaseModal>
    );
}

export default DepositModal;
