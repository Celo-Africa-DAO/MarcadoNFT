import React from 'react'
import Identicon from 'react-identicons'
import { truncate } from '../store'

export const NFTCard = ({nft}) => {
  return (
    <div className='p-4 border rounded-xl shadow-sm font-globalFont'>
            <div className='flex justify-between items-center pb-2'>
                <div className='flex justify-center items-center'>
                  <Identicon
                    className='h-10 w-10 object-contain rounded-full'
                    string={nft?.owner}
                    size={30}
                    />
                    <p className='ml-4 text-gray-400 font-medium'>{truncate(nft?.owner,4,4,11)}</p>
                </div>
                <p className='font-semibold text-gradient'>{nft.cost} CELO</p>
            </div>
            <img className='rounded-lg h-60 w-full' src={nft?.metadataURI} alt="NFT" />
            <h2 className='my-2  text-gray-500 font-medium'> {nft?.title}</h2>
            <button className='px-6 py-3 bg-gray-200 text-gray-600 rounded-xl w-full '>View Details</button>
    </div>
  )
}
