import { Card, CardBody, Tab, Tabs } from '@heroui/react'
import React from 'react'
import { FaWallet } from 'react-icons/fa'
import { GiWallet } from 'react-icons/gi'
import { IoExtensionPuzzle } from 'react-icons/io5'
import Walletassets from './walletassets'
import Wallettransfer from './wallettransfer'
import Extensions from './extensions'

function TabsComponent({ clientConfig, fungibleToken, nonFungibleToken, contractState, setConfirmationModal, setTx, smartWalletStx }) {
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
                                <Walletassets clientConfig={clientConfig} fungibleToken={fungibleToken} nonFungibleToken={nonFungibleToken} contractState={contractState} setConfirmationModal={setConfirmationModal} setTx={setTx} />
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab className='w-full p-0' key="extension" title={
                        <div className="flex items-center gap-1  space-x-2 p-2">
                            <IoExtensionPuzzle color='#FFA500' />
                            <span>Extensions</span>
                        </div>
                    }>
                        <Card className='mt-1'>
                            <CardBody>
                                <Extensions clientConfig={clientConfig} contractState={contractState} setConfirmationModal={setConfirmationModal} setTx={setTx} smartWalletStx={smartWalletStx} />
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
                                <Wallettransfer clientConfig={clientConfig} contractState={contractState} setConfirmationModal={setConfirmationModal} setTx={setTx} />
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default TabsComponent
