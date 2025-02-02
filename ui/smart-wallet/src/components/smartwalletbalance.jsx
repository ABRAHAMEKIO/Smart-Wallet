import { Avatar, Button } from '@heroui/react'
import React from 'react'
import { IoMdSend } from 'react-icons/io'
import { TbBrandCashapp } from 'react-icons/tb'

function SmartWalletBalance({ }) {
    return (
        <div className='w-full gap-3 flex flex-col-3 items-center mt-3'>
            <Avatar
                isBordered
                radius="full"
                size="md"
                src='/stx-logo.svg'
            />
            <div className='flex flex-col gap-1'>
                <h1 className='text-small font-semibold leading-none text-default-600'>Balance: <code className='text-warning'>50.50</code></h1>
                <h3 className='text-small tracking-tight text-default-400'>Rate: $ 1.23</h3>
            </div>
            <div className='flex gap-1'>
                <Button color="primary" radius="full" size="sm">
                    <TbBrandCashapp />
                </Button>
                <Button color="primary" radius="full" size="sm">
                    <IoMdSend />
                </Button>
            </div>
        </div >
    )
}

export default SmartWalletBalance
