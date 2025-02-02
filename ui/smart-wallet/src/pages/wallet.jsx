import React from 'react'
import Header from '../components/header'

function Wallet({ clientConfig, setClientConfig }) {
    return (
        <div className="w-full flex flex-col justify-center items-center mt-10 p-2 sm:p-[5%] md:p-[10%] lg:p-[10%]">

            <Header clientConfig={clientConfig} setClientConfig={setClientConfig} />



        </div>
    )
}

export default Wallet
