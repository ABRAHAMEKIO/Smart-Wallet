import React from 'react'
import { Button, Image } from '@heroui/react'
import { CiLogin } from 'react-icons/ci'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { FaDiscord, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { authenticate } from '../services/auth'

function Landing() {

    return (
        <div className="w-full flex flex-col justify-center items-center mt-10 p-2 sm:p-[5%] md:p-[10%] lg:p-[10%]">
            <div className='w-full flex justify-between mb-10'>
                <Image
                    className='flex justify-start relative -left-3'
                    title="Click to see network menue"
                    src="/smart-wallet.svg"
                    alt="Vercel Logo"
                    width="80px"
                />
                <div className="flex items-center justify-center font-semibold gap-2" >
                    <Button onPress={authenticate}>Log in <CiLogin className="text-success" /></Button>
                </div>
            </div>

            <div className="w-full flex flex-col-3 font-bold justify-center items-center gap-4 mb-4">
                <a href="#">White Paper</a>
                <a href="#">Features</a>
                <a href="#">About</a>
            </div>

            <div className="w-full flex flex-col justify-center items-center text-center bg-gradient-to-b from-indigo-500 via-purple-500 to-[#e2ebf0] py-10">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
                    Deploy Smart Wallets with <br /> Ease and Confidence
                </h1>
                <p className="pl-20 pr-20 mt-1 text-xs text-white font-semidbold">
                    Seamless. Secure. Scalable.
                    <br />
                    Start your blockchain journey with tools designed to empower every user.
                </p>
            </div>

            <div className="w-full flex justify-center mt-8 items-center gap-4">
                <Button color="primary" onPress={authenticate}>
                    Get started
                </Button>
                <a href="#" className="flex justify-center items-center gap-1">
                    Learn more <IoIosArrowRoundForward />
                </a>
            </div>

            <div className="w-full flex justify-center mt-10 items-center gap-4">
                <FaDiscord size="20" /> <FaXTwitter size="20" /> <FaYoutube size="20" />
            </div>

        </div>

    )
}

export default Landing
