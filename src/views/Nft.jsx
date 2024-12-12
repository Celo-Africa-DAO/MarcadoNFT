import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadNFT } from '../Blockchain.services'
import NFTDetails from '../Components/NFTDetails'
import UpdateNFT from '../Components/UpdateNFT'
import { useGlobalState } from '../store'

const Nft = () => {
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [singleNft] = useGlobalState('singleNft')

  useEffect(async () => {
    await  loadNFT({id:id});
    setLoaded(true)

  },[])
  return
    <>
    <NFTDetails singleNft={singleNft}/>
    <UpdateNFT ingleNft={singleNft}/>
    </>
}

export default Nft