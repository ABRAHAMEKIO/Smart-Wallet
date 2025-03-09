import React, { useState } from 'react'
import { Routes, Route, useParams, useSearchParams } from 'react-router-dom'
import Landing from './pages/landing'
import { isAuthed } from './user-session'
import Wallet from './pages/wallet'

function AppRoutes() {
    // Client config values
    const [searchParams] = useSearchParams();
    const chain = searchParams.get("chain") || 'mainnet';
    const network = searchParams.get("network") || 'mainnet';
    const api = searchParams.get("api") || 'https://api.hiro.so/';
    const explorer = searchParams.get("explorer") || 'https://explorer.stacks.co/';

    const [clientConfig, setClientConfig] = useState({ chain: chain, network: network, api: api, explorer: explorer });


    return (
        <Routes>

            {!isAuthed && <Route path='/' element={<Landing />} />}

            {isAuthed &&
                <>
                    <Route path='/' element={<Wallet clientConfig={clientConfig} setClientConfig={setClientConfig} />} />
                    <Route path='/:address*' element={<Wallet clientConfig={clientConfig} setClientConfig={setClientConfig} />} />
                </>
            }
        </Routes>
    )
}

export default AppRoutes
