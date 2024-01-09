import React from 'react';
import soldOut from 'assets/images/sold.png'
import { FaRegClock } from 'react-icons/fa';
import { MdClose } from "react-icons/md";

export interface SellPlant {
    id: number;
    seed_id: number;
    user_id: number;
    name: string;
    image: string;
    date: string;
    seed_price: number;
    seed_weight: number;
    harvest_rate: number;
    profit: number;
    clone_rooting_period: number;
    vegetation_mass_period: number;
    flowering_preharvest_period: number;
    harvest_period: number;
    harvest_amount: number;
    total_price: number;
    total_profit: number;
    total_period: number;
    status: number;
    payment_method: number;
}
  

interface SellItemProps {
  plants: SellPlant[];
}

const SellItem: React.FC<SellItemProps> = (props) => {
  const { plants } = props;
  
  const formatNumber = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };
  
  return (
    <div>
    <ul className="grid grid-cols-1 gap-6 list-none mt-6">
        {plants.map((plant, index) => (
          <li className="sellorder-plant-card h-48 rounded" key={index}>
            <div className="flex">
                <div className='plant-image'>
                  <img className='main rounded-l h-48' src={plant.image} alt={plant.name} />
                </div>
                <div className='plant-details px-6 py-4'>
                  <div className='flex w-full'>
                    <div className='w-1/4 border-r border-black/10'>
                      <h3 className='text-2xl font-bold mt-1'>{plant.name}</h3>
                      <label className='block font-bold text-black mt-2'>Growing Period</label>
                      <label className='block text-sm text-black'>{plant.total_period} days</label>
                      <label className='block font-bold text-black mt-4'>Seed Price</label>
                      <label className='block text-sm text-black'>$&nbsp;{plant.seed_price}/gr</label>
                    </div>
                    <div className='w-1/2 border-r border-black/10 pt-1 pb-3'>
                      {/* <ul className='flex w-full mb-3 mt-1'>
                        <li className='w-1/2'>
                          <label className='block pl-16 text-base font-bold'>Seed Price</label>
                          <label className='block pl-16 text-base text-black/50'>$&nbsp;{plant.seed_price}/gr</label>
                        </li>
                      </ul> */}
                      <ul className='flex w-full mb-3'>
                        <li className='w-1/2'>
                          <label className='block pl-16 text-base font-bold'>Weight</label>
                          <label className='block pl-16 text-base text-black/50'>{plant.seed_weight}gr</label>
                        </li>
                        <li className='w-1/2'>
                          <label className='block pl-16 text-base font-bold'>Harvest</label>
                          <label className='block pl-16 text-base text-black/50'>{ formatNumber(plant.harvest_amount, 2) }&nbsp;gr</label>
                        </li>
                      </ul>
                      <ul className='flex w-full'>
                        <li className='w-1/2'>
                          <label className='block pl-16 text-base font-bold'>Invest</label>
                          <label className='block pl-16 text-base text-black/50'>{plant.payment_method === 0 ? 'PGA': 'USD'}&nbsp;{ formatNumber(plant.total_price, 2) }</label>
                        </li>
                        <li className='w-1/2'>
                          <label className='block pl-16 text-base font-bold'>Get Funds</label>
                          <label className='block pl-16 text-base text-black/50'>{plant.payment_method === 0 ? 'PGA': 'USD'}&nbsp;{ formatNumber(plant.total_profit, 2) }</label>
                        </li>
                      </ul>
                    </div>
                    <div className='w-1/4 relative'>
                      <div className='absolute top-0 right-0'>
                        {
                            plant.status == 0 ? (
                                <button className="flex bg-green/10 text-green text-xs font-bold items-center mt-2 mx-auto py-3 px-4 rounded-5" >
                                    <FaRegClock className='text-base mr-3' />
                                    Pending to sell...
                                </button>
                            ) : plant.status == 1 ? (
                                <button className="flex bg-red-500/30 text-rose-500 text-xs font-bold items-center mt-2 py-2 px-3 rounded-5" >
                                  <img src={soldOut} className='mr-3' />
                                  Sold out
                                </button>
                            ) : (
                              <button className="flex bg-amber-500/80 text-white text-xs font-bold items-center mt-2 mx-auto py-2 px-4 rounded-5" >
                                  {/* <FaRegHandPaper className='text-base mr-2' /> */}
                                  <MdClose className='text-xl font-bold text-white mr-2' />
                                  Sell request rejected
                              </button>
                            )
                        }
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </li>
        ))}
    </ul>
    </div>
  );
};

export default SellItem;