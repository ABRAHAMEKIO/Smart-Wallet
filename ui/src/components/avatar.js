"use client";

import React, { useEffect, useState } from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import { userSession, authenticate, disconnect } from '../services/auth';
import { User } from "@nextui-org/react";

const Avatar = ({ clientConfig }) => {
  const [avatar, setAvatar] = useState('');
  const [bns, setBns] = useState('');

  const authed = userSession.isUserSignedIn();
  const testnet = authed ? userSession.loadUserData().profile.stxAddress.testnet : '';
  const mainnet = authed ? userSession.loadUserData().profile.stxAddress.mainnet : '';
  const shorttestnet = authed ? `${testnet.slice(0, 4)}...${testnet.slice(-4)}` : '';
  const shortmainnet = authed ? `${mainnet.slice(0, 4)}...${mainnet.slice(-4)}` : '';


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
          {authed
            ? <CiLogout onClick={disconnect} className="text-danger" />
            : <CiLogin onClick={authenticate} className="tesxt-success" />
          }
        </div>
      }
      name={authed ? bns || "No Bns" : ''}
    />
  );
};

export default Avatar;
