import React, { useEffect, useRef } from 'react';
import { SellPlant } from '../SellItem';
import soldOut from 'assets/images/sold.png'
import { FaRegClock } from 'react-icons/fa';
import { MdClose } from "react-icons/md";

interface SellItemMobileProps {
  plants: SellPlant[];
}

const SellItemMobile: React.FC<SellItemMobileProps> = (props) => {
  const { plants } = props;

  const formatNumber = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };
  
  return (
    <div className="pb-6">
      <ul className="grid grid-cols-1 gap-6 list-none" >
        {plants.map((plant, index) => (
          <div className="plant-card-mobile mx-8 p-5 pb-2" key={index}>
            <div className="flex w-full items-center pb-6 border-b border-black/10">
              <div className='plant-image-mobile w-1/3'>
                <img className='rounded-full mx-auto' src={plant.image} alt={plant.name} />
              </div>
              <div className='w-2/3 pl-2'>
                <h3 className='text-xl font-bold truncate'>{plant.name}</h3>
                {
                    plant.status == 0 ? (
                        <button className="flex bg-green/10 text-green text-xs font-bold items-center mt-2 py-2 px-2 rounded-5" >
                            <FaRegClock className='text-base mr-2' />
                            Pending to sell...
                        </button>
                    ) : plant.status == 1 ? (
                        <button className="flex bg-red-500/30 text-rose-500 text-xs font-bold items-center mt-2 py-1 px-2 rounded-5" >
                            <img src={soldOut} className='mr-1' />
                            Sold out
                        </button>
                    ) : (
                      <button className="flex bg-amber-500/80 text-white text-xs font-bold items-center mt-2 py-2 px-2 rounded-5" >
                          {/* <FaRegHandPaper className='text-base mr-2' /> */}
                          <MdClose className='text-base font-bold text-white mr-1' />
                          Sell request rejected
                      </button>
                    )
                }
              </div>
            </div>
            <div className='plant-details mt-5 mb-5 w-full'>
              <ul className=''>
                <li className='flex w-full mb-4'>
                  <div className='w-1/2 text-left'>
                    <label className='block text-sm font-bold'>Weight</label>
                    <label className='block text-sm text-black/50'>{plant.seed_weight}gr</label>
                  </div>
                  <div className='w-1/2 text-right'>
                    <label className='block text-sm font-bold'>Harvest</label>
                    <label className='block text-sm text-black/50'>{formatNumber(plant.harvest_amount, 2)}gr</label>
                  </div>
                </li>
                <li className='flex w-full mb-3'>
                  <div className='w-1/2 text-left'>
                    <label className='block text-sm font-bold'>Invest</label>
                    <label className='block text-sm text-black/50'>{plant.payment_method === 0 ? 'PGA': 'USD'}&nbsp;{ formatNumber(plant.total_price, 2) }</label>
                  </div>
                  <div className='w-1/2 text-right'>
                    <label className='block text-sm font-bold'>Get Funds</label>
                    <label className='block text-sm text-black/50'>{plant.payment_method === 0 ? 'PGA': 'USD'}&nbsp;{ formatNumber(plant.total_profit, 2) }</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};


export default SellItemMobile;