import React from 'react';
import Image from "next/image";
import { CiLogin } from 'react-icons/ci';
import { IoIosArrowRoundForward } from "react-icons/io";
import { authenticate } from '../services/auth';
import styles from "../app/page.module.css";
import { Button } from '@nextui-org/react';


function Landing({ clientConfig }) {
    return (
        <div className='w-full'>
            <div className='w-full flex flex-col-2 justify-between'>
                <div>
                    <Image title='Click to see network menue' src="/vercel.svg" alt="Vercel Logo" className={styles.vercelLogo} width={100} height={24} priority />
                </div>
                <div className='flex items-center justify-center gap-2' onClick={authenticate}>
                    Log in <CiLogin className="tesxt-success" />
                </div>
            </div>

            <div style={{ margin: '.5rem' }} />

            <div className='flex flex-col-3 justify-center items-center gap-4' >
                <a href="#">White Paper</a>
                <a href="#">Features</a>
                <a href="#">About</a>
            </div>

            <div style={{ margin: '5rem' }} />

            <div className='w-full flex flex-col justify-center items-center text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10'>
                <h1 className="myCustomBannerHeadertext">
                    <b>Deploy Smart Wallets with <br /> Ease and Confidence</b>
                </h1>
                <p class="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
                    Seamless. Secure. Scalable. <br /> Start your blockchain journey with tools designed to empower every user.
                </p>
            </div>

            <div style={{ margin: '5rem' }} />

            <div className='w-full flex flex-col-2 gap-3 justify-center items-center'>
                <Button color='primary'>
                    Get started
                </Button>
                <p className='flex justify-center items-center gap-1'>Learn more <IoIosArrowRoundForward /></p>
            </div>
        </div>

    );
}

export default Landing;