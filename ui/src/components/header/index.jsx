import React from 'react'
import Logo from './logo'
import Avatar from './avatar'

function Header({ clientConfig, setClientConfig }) {
    return (
        <div className="w-full flex justify-between items-center">
            <Logo clientConfig={clientConfig} setClientConfig={setClientConfig} />
            <Avatar clientConfig={clientConfig}/>
        </div>
    )
}

export default Header
