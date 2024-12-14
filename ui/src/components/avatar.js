"use client";

import React, { useEffect, useState } from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import { userSession, authenticate, disconnect } from '../services/auth';
import { User } from "@nextui-org/react";

const appOrigin = window.location.origin;
const Avatar = ({ clientConfig }) => {
  const [avatar, setAvatar] = useState('');
  const [bns, setBns] = useState('');

  console.log(window.cookie, { clientConfig });

  const authed = userSession.isUserSignedIn();
  const testnet = authed ? userSession.loadUserData().profile.stxAddress.testnet : 'No Session';
  const mainnet = authed ? userSession.loadUserData().profile.stxAddress.mainnet : 'No Session';
  const shorttestnet = authed ? `${testnet.slice(0, 4)}...${testnet.slice(-4)}` : 'NA';
  const shortmainnet = authed ? `${mainnet.slice(0, 4)}...${mainnet.slice(-4)}` : 'NA';


  return (
    <User
      className="flex p-0 gap-1"
      avatarProps={{ src: avatar || "/avatar.png" }}
      description={<div><small>{{ mainnet: shortmainnet, testnet: shorttestnet }[clientConfig[appOrigin]['network']]}</small> {authed ? <CiLogout onClick={disconnect} className="text-danger" /> : <CiLogin onClick={authenticate} className="tesxt-success" />}</div>}
      name={bns || "No Bns"}
    />
  );
};

export default Avatar;
