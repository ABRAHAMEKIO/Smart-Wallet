import { User } from '@heroui/react'
import React, { useState } from 'react'
import { authenticate, disconnect } from '../../services/auth';
import { isAuthed, userSession } from '../../user-session';
import { CiLogin, CiLogout } from 'react-icons/ci';

function Avatar({ clientConfig }) {
    const [avatar] = useState('');
    const [bns] = useState('');

    const testnet = isAuthed ? userSession.loadUserData().profile.stxAddress.testnet : '';
    const mainnet = isAuthed ? userSession.loadUserData().profile.stxAddress.mainnet : '';
    const shorttestnet = isAuthed ? `${testnet.slice(0, 4)}...${testnet.slice(-4)}` : '';
    const shortmainnet = isAuthed ? `${mainnet.slice(0, 4)}...${mainnet.slice(-4)}` : '';

    return (
        <User
            className="flex p-0 gap-3"
            avatarProps={{ src: avatar || "/avatar.png" }}
            description={
                <div>
                    <small>
                        {
                            {
                                mainnet: shortmainnet,
                                mocknet: shortmainnet,
                                testnet: shorttestnet,
                                devnet: shorttestnet
                            }[clientConfig.network] || ''
                        }
                    </small>
                    {isAuthed
                        ? <CiLogout onClick={disconnect} className="text-danger" />
                        : <CiLogin onClick={authenticate} className="tesxt-success" />
                    }
                </div>
            }
            name={isAuthed ? bns || "No Bns" : ''}
        >

        </User>
    )
}

export default Avatar
