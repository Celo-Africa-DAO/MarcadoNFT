import React from 'react'
import Identicon from 'react-identicons'
import { NFTCard } from './NFTCard'
import { setGlobalState, truncate, useGlobalState } from '../store';

const MyList = () => {
  const [nfts] = useGlobalState('nfts')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const myNFTs=[];
  nfts.map((nft)=>{
    if(nft.owner.toLowerCase() == connectedAccount){
      myNFTs.push(nft)
    }}
  )

  return (
    <div className='max-w-6xl mx-auto py-10 '>
       <div className='my-6 pb-10'>
        {myNFTs.length <=0?(
          <h2 className='text-3xl mb-2 font-globalFont font-semibold text-left mx-4 md:text-center text-gray-400'>You don't have an NFT yet!</h2>
        ):(
          <h2 className='text-3xl mb-2 font-globalFont font-semibold text-left mx-4 md:text-center text-gray-400'>All My NFT's</h2>
        )}
           <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5 mx-4'>
              {myNFTs.map((nft,i)=>{
                return(
                  <NFTCard key={i} nft ={nft}/>
                )
              })}
            </div>
       </div>
    </div>
  )
}

export default MyList