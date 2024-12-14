import React from 'react';
import { Button, Input } from '@nextui-org/react';
import { IoSend } from 'react-icons/io5';

function SendWallet(props) {
    return (
        <div className='w-full flex flex-col gap-3'>

            <Input
                isRequired
                errorMessage="Please enter a valid email"
                label=""
                labelPlacement="outside"
                placeholder="New owner"
                type="text"
            />

            <Button className='p-0' color='primary'><IoSend /></Button>
        </div>
    );
}

export default SendWallet;