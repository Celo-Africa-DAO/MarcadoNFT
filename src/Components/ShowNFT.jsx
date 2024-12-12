import Identicon from 'react-identicons'
import { FaTimes } from 'react-icons/fa'
import { useGlobalState, setGlobalState, truncate, setAlert } from '../store'
import { buyNFT } from '../Blockchain.services'
import { AiOutlineCloseCircle } from 'react-icons/ai'


const ShowNFT = () => {
  const [showModal] = useGlobalState('showModal')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [nft] = useGlobalState('nft')

  const onChangePrice = () => {
    setGlobalState('showModal', 'scale-0')
    setGlobalState('updateModal', 'scale-100')
  }

  const handleNFTPurchase = async () => {
    setGlobalState('showModal', 'scale-0')
    setGlobalState('loading', {
      show: true,
      msg: 'Initializing NFT transfer...',
    })

    try {
      await buyNFT(nft)
      setAlert('Transfer completed...', 'green')
      window.location.reload()
    } catch (error) {
      console.log('Error transfering NFT: ', error)
      setAlert('Purchase failed...', 'red')
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
      flex items-center justify-center bg-black bg-opacity-30 
      transform duration-300 font-globalFont ${showModal}`}
    >
      <div className="bg-gray-50 shadow-lg rounded-xl text-gray-400 w-11/12 md:w-3/6 h-7/12 px-4 pt-3 pb-4">
          <div className='flex items-center justify-between'>
              <h2 className='text-xl mb-2 font-globalFont font-semibold text-gray-400 capitalize'>Buy NFT</h2>
            <button type='button'  onClick={() => setGlobalState('showModal', 'scale-0')} >
              <AiOutlineCloseCircle className='font-bold text-2xl text-gray-900'/>
            </button>
          </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
          <div className='md:w-2/5 w-full px-4  sm:px-0'>
            <img className='rounded-lg h-60 w-full object-cover' src={nft?.metadataURI} alt={nft?.title} />
          </div>
          {/* rign */}
          <div className='md:w-3/5 w-full px-4 sm:px-0'>
              <h2 className='text-xl mb-2 font-globalFont font-semibold text-gray-400 capitalize'>{nft?.title}</h2>
              <p className='text-[13px] my-2 font-medium'>{nft?.description}</p>
              <div className='my-1 flex flex-col'>
              <h3 className='text-[14px] text-gray-600 font-base rounded-xl transition duration-200'>Owned by</h3>
                <div className='flex justify-start items-center'>
                        <Identicon
                          className='h-10 w-10 object-contain rounded-full'
                          string={nft?.owner}
                          size={25}
                          />
                          <p className='ml-2 text-[13px] text-gray-400 mt-2 font-medium'>
                          {nft?.owner ? truncate(nft.owner, 6, 8, 17) : '...'}  
                          </p>
                  </div>
              </div>
              <div className='flex justify-between items-center'>
                <div className='my-1'>
                  <h3 className='text-base mb-.5 font-medium'>current price</h3>
                  <h1 className='text-xl mb-2 font-globalFont font-semibold text-gray-400'>{nft?.cost} CELO</h1>
                </div>

                  <div className=' flex gap-4 mt-6'>
                  {
                    connectedAccount == nft?.owner ? (
                      <button  
                      className=' 
                      px-4 py-2 text-white font-semibold cursor-pointer
                      rounded-lg border border-[rgba(34,193,195,1)]
                        text-[rgba(34,193,195,1)]' onClick={onChangePrice}>Edit Price</button>
                      
                    ):
                    (
                      <button  className=' px-6 py-3 mr-2 text-white
                      font-semibold cursor-pointer rounded-lg getstarted' onClick={handleNFTPurchase}>Buy Now</button>
                    )
                  }
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowNFT


   