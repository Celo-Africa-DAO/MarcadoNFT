import React from 'react';
import {BiTransfer} from 'react-icons/bi'
import {AiOutlineReload} from 'react-icons/ai'
import {MdOpenInNew} from 'react-icons/md'
import { truncate, useGlobalState } from '../store';

const Transactions = () => {
  const [transactions] = useGlobalState('transactions')
  return (
    <div className='my-4  pb-10 mx-auto font-globalFont'>
      <h2 className='mb-4 text-gray-400 text-3xl font-globalFont font-semibold text-center '>Transaction History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-2 py-2.5 mx-4">
        {transactions
        .map((tx,i)=>{
          return(
            <Transaction key={i} tx = {tx}/>
          )
        })}
      </div>
      <div className="flex flex-row justify-center mt-5">
        <button className=' px-6 py-3 bg-white rounded-3xl getstarted text-gray-50 flex flex-row justify-center items-center gap-1'>Load More <AiOutlineReload/></button>
      </div>
    </div>
  )
}

export default Transactions

const Transaction = ({tx})=>{
  return(
    <div 
    className='flex justify-between items-center border  text-gray-500 w-full shadow-sm rounded-lg px-3 py-1'>
      <div className='rounded-md p-1 shadow-sm text-green-700 text-2xl'>
        <BiTransfer/>
      </div>
      <div className=''> 
        <h4 className='text-sm text-center'>Fund Transfered</h4>
        <small className="flex flex-row justify-start items-center">
          <span className='mr-1'>Received by</span>
          <a href="#" target='_blank' className='text-green-700'>
          {truncate(tx.owner, 4, 4, 11)}
          </a>
          <a href="#">
            <MdOpenInNew className='text-gray-600 text-lg'/>  
          </a>
        </small>
      </div>
      <p className='text-sm font-medium'>{tx.cost}</p>
      </div>
  )
}