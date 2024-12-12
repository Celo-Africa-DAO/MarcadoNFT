import React, { useState } from 'react'
import {
  setAlert,
  setGlobalState,
  setLoadingMsg,
  useGlobalState,
} from '../store/index'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import { updateNFTPrice } from '../Blockchain.services'

const UpdateNFT = () => {
  const [updateModal] = useGlobalState('updateModal')
  const [nft]= useGlobalState('nft')
  const [price, setPrice] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!price || price <= 0) return

    setGlobalState('modal', 'scale-0')
    setGlobalState('loading', { show: true, msg: 'Initiating price update...' })

    try {
      setLoadingMsg('Price updating...')
      setGlobalState('updateModal', 'scale-0')

      await updateNFTPrice({ ...nft, cost: price })
      setAlert('Price updated...', 'green')
      window.location.reload()
    } catch (error) {
      console.log('Error updating file: ', error)
      setAlert('Update failed...', 'red')
    }
  }
  const closeModal = () =>{
    setGlobalState('updateModal', 'scale-0')
  }
  return (
    <div 
    className={`fixed top-0 left-0 w-screen h-screen
    flex items-center justify-center bg-black bg-opacity-30 
    transform duration-300 font-globalFont ${updateModal}`}
    >
      <div className='w-11/12 md:w-3/12 h-7/12 p-4 bg-gray-50 shadow-lg rounded-xl text-gray-400'>
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <div className='flex items-center justify-between'>
              <h2 className='text-gray-400 font-semibold text-lg'>Edit NFT Price</h2>
            <button type='button' onClick={closeModal}>
              <AiOutlineCloseCircle className='font-bold text-2xl text-gray-900'/>
            </button>
          </div>
          <div className='flex justify-center items-center rounded-lg mt-4'>
            <div className='w-20 h-20 overflow-hidden  shrink-0'>
              <img className='rounded-full h-full w-full object-cover cursor-pointer' 
          src='https://lawire.com/wp-content/uploads/elementor/thumbs/16-1-puzy5fol3t8ul4ioyf61thcaccskxusk57i5dftl68.png'
              alt="NFT" />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-50 border rounded-lg mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
                type="number"
                step={0.01}
                min={0.01}
                name="price"
                placeholder="Price (CELO)"
                required
                onChange={(e)=>setPrice(e.target.value)}
                value={price}
            />
          </div>

          <button
            type="submit"
            className="flex flex-row justify-center items-center
              w-full text-white 
              font-semibold
              px-6 py-2 bg-white getstarted rounded-lg
              drop-shadow-xl border border-transparent
              focus:outline-none focus:ring mt-5"
          >
            Update Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateNFT