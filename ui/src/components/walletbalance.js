import { Avatar, Button } from '@nextui-org/react';
import React from 'react';
import { IoMdSend } from 'react-icons/io';
import { TbBrandCashapp } from "react-icons/tb";

function WalletBalance({ stx, sendStxModalOnClose, setOpenDepositModal }) {

    function send() {
        sendStxModalOnClose(true);
    }

    function deposit() {
        setOpenDepositModal(true);
    }

    return (
        <div className="myflex">
            <div className="flex gap-3 justify-center items-center">
                <div className='flex gap-3 justify-center items-center'>
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
                <div className='flex gap-2'>
                    <Button color="primary" radius="full" size="sm" onPress={deposit}>
                        <TbBrandCashapp />
                    </Button>
                    <Button color="primary" radius="full" size="sm" onPress={send}>
                        <IoMdSend />
                    </Button>
                </div>
            </div>
            {/* <div className="flex gap-1 justify-center items-center">
                <div className='flex gap-1 justify-center items-center'>
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src="/btc-logo.svg"
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">Balance: <code className='text-warning'>{ }</code></h4>
                        <h5 className="text-small tracking-tight text-default-400">Rate: $ { }</h5>
                    </div>
                </div>
                {/* <Button color="primary" radius="full" size="sm" onPress={() => sendFtModalOnOpen(true)}>
                    <IoMdSend />
                </Button> 
            </div> */}
        </div>
    );
}

export default WalletBalance;