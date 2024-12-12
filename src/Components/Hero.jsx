import React, { useState } from 'react'
import Identicon from 'react-identicons'
import { connectWallet } from '../Blockchain.services'
import { setGlobalState, truncate, useGlobalState } from '../store'

const Hero = () => {
  const [connectedAccount]=useGlobalState('connectedAccount')
  return (
    <div className="mx-4 flex flex-col md:flex-row justify-between items-center py-14 font-globalFont">
      <div className="md:w-3/5 w-full">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-400">
            Buy and Sell
            <br />
            <span>Degital Arts</span>
            <br />
            <span className="text-gradient">NFTs</span>collections
          </h1>
          <div className="mt-4 ">
            <p className="text-gray-400 font-normal ">
              Mint and collect the hottest NFTS around
            </p>
            <p className="text-gray-400 font-normal">
              Grow your sales faster with our community
            </p>
          </div>
          <div className=" flex gap-4 mt-6">
            <button
              disabled
              className=" mr-4 px-6 py-3 text-gray-50 rounded-xl getstarted font-medium"
            >
              Get Started
            </button>
            <button
              className=" px-6 py-3  rounded-xl bg-inherit border-gray-300 border  border-[rgba(34,193,195,1)]
                text-[rgba(34,193,195,1)]"
              onClick={
                connectedAccount
                  ? () => setGlobalState("modal", "scale-100")
                  : connectWallet
              }
            >
              Create NFT's
            </button>
          </div>
          <div className="flex items-center justify-between w-3/4 mt-6">
            <div className="text-gray-400">
              <p className="font-bold">200</p>
              <small className="text-gray-400 font-medium">users</small>
            </div>
            <div className="text-gray-400">
              <p className="font-bold">257k</p>
              <small className="text-gray-400 font-medium">Artworks</small>
            </div>
            <div className="text-gray-400">
              <p className="font-bold">152k</p>
              <small className="text-gray-400 font-medium">artists</small>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-2/5 w-full shadow-xl mt-10 md:mt-0 bg-white p-4 overflow-hidden rounded-xl">
        <img
          className="h-[300px] w-full  mb-3 object-cover rounded-xl"
          src="https://i.ibb.co/7gvtr8J/Screenshot-2024-12-12-at-03-46-32.png"
          alt="Hero-nft-profile"
        />
        <hr />
        <div className="mt-2 flex justify-between items-center text-gray-400 gap-4">
          {!connectedAccount ? (
            <div className="flex">
              <Identicon
                className="h-10 w-10 object-contain rounded-full"
                string={"0x21...786a"}
                size={50}
              />
              <div className="ml-4 ">
                <p className="text-gray-400 font-semibold">
                  Connect Your wallet
                </p>
                <small className="text-gradient text-sm">You</small>
              </div>
            </div>
          ) : (
            <div className="flex">
              <Identicon
                className="h-10 w-10 object-contain rounded-full"
                string={connectedAccount}
                size={50}
              />
              <div className="ml-4 ">
                <p className="text-gray-400 font-semibold">
                  {truncate(connectedAccount, 7, 8, 19)}
                </p>
                <small className="text-gradient text-sm">You</small>
              </div>
            </div>
          )}

          {/* <div className=' font-semibold rounded-xl'>
            <h4 >Balance</h4>
            <p className='text-gradient'>0.007 ETH</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Hero