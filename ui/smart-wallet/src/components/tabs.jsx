import { Card, CardBody, Tab, Tabs } from '@heroui/react'
import React from 'react'
import { FaWallet } from 'react-icons/fa'
import { GiWallet } from 'react-icons/gi'
import { IoExtensionPuzzle } from 'react-icons/io5'
import Walletassets from './walletassets'

function TabsComponent({ clientConfig, fungibleToken, nonFungibleToken }) {
    return (
        <div className="flex w-full flex-col">
            <div className="flex w-full flex-col">
                <Tabs className='w-full mt-1' aria-label="Options" placement={'top'}>
                    <Tab className='w-full p-0' key="wallet" title={
                        <div className="flex items-center gap-1 space-x-2 p-2">
                            <FaWallet color='#FFA500' />
                            <span>Wallet</span>
                        </div>
                    }>
                        <Card className='mt-1'>
                            <CardBody >
                                <Walletassets clientConfig={clientConfig} fungibleToken={fungibleToken} nonFungibleToken={nonFungibleToken} />
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab className='w-full p-0' key="extension" title={
                        <div className="flex items-center gap-1  space-x-2 p-2">
                            <IoExtensionPuzzle color='#FFA500' />
                            <span>Extension</span>
                        </div>
                    }>
                        <Card className='mt-1'>
                            <CardBody>
                                {/* <Extension clientConfig={clientConfig} /> */}
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab className='w-full p-0' key="sendwallet" title={
                        <div className="flex items-center  gap-1 space-x-2 p-2">
                            <GiWallet color='#FFA500' />
                            <span>Send Wallet</span>
                        </div>
                    }>
                        <Card className='mt-1'>
                            <CardBody>
                                {/* <SendWallet network={network} /> */}
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default TabsComponent
