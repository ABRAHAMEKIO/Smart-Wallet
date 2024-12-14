import React from 'react';
import { Button, Input } from '@nextui-org/react';

function Extension(props) {
    return (
        <div className='w-full flex flex-col gap-3'>

            <Input
                isRequired
                errorMessage="Please enter a valid email"
                label=""
                labelPlacement="outside"
                placeholder="Extension contract"
                type="text"
            />

            <Input
                isRequired
                errorMessage="Amount is required"
                label=""
                labelPlacement="outside"
                placeholder="Amount"
                type="text"
            />

            <Input
                isRequired
                errorMessage="This is required"
                label=""
                labelPlacement="outside"
                placeholder="Delegate to"
                type="text"
            />

            <Input
                errorMessage=""
                label=""
                labelPlacement="outside"
                placeholder="Until Burn Height"
                type="text"
            />

            <Input
                errorMessage=""
                label=""
                labelPlacement="outside"
                placeholder="Pox Address"
                type="text"
            />

            <Input
                errorMessage=""
                label=""
                labelPlacement="outside"
                placeholder="Hash"
                type="text"
            />

            <Button className='p-0' color='primary'>Execute</Button>
        </div>
    );
}

export default Extension;