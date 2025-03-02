import { Avatar, Button, Chip, Code } from '@heroui/react'
import React from 'react'
import { IoMdSend } from 'react-icons/io'
import { RiLuggageDepositFill } from 'react-icons/ri'

function SmartWalletBalance({ balance, stx, setShowDepositModal, setShowStxSendModal }) {


    return (
        <div className='w-full gap-3 flex flex-col-3 items-center mt-3'>
            <Avatar
                isBordered
                radius="full"
                size="md"
                src='/stx-logo-wallet.svg'
            />
            <div className='flex flex-col gap-1'>
                <label><Code className='text-warning'>{balance.toFixed(2)} <Chip size='sm' variant='dot' color='success'>${(balance * stx?.rate?.Price).toFixed(2)}</Chip></Code></label>
                <h3 className='text-small tracking-tight text-default-500'>Rate: <small className='text-primary'>${stx?.rate?.Price.toFixed(2) || 0}</small></h3>
            </div>
            <div className='flex gap-1'>
                <Button color="warning" radius="full" size="sm" onPress={() => setShowDepositModal(true)}>
                    <RiLuggageDepositFill color='white' />
                </Button>
                <Button color="warning" radius="full" size="sm" onPress={() => setShowStxSendModal(true)}>
                    <IoMdSend color='white' />
                </Button>
            </div>
        </div >
    )
}

export default SmartWalletBalance
