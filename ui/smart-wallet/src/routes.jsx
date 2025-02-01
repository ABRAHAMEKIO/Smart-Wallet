import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import { isAuthed } from './user-session'
import Wallet from './pages/wallet'

function AppRoutes() {
    const [clientConfig, setClientConfig] = useState({ chain: '', network: '', api: '', explorer: '' });


    return (
        <Routes>
            {!isAuthed && <Route path='/' element={<Landing />} />}

            {isAuthed &&
                <Route path='/' element={
                    <Wallet
                        clientConfig={clientConfig}
                        setClientConfig={setClientConfig}
                    />
                } />}
        </Routes>
    )
}

export default AppRoutes
