import React from 'react';
import { WarehousePlant } from '../WarehouseItem';
import ModalWarehouseConfirmMobile from './ModalWarehouseConfirmMobile';


interface WarehouseItemProps {
  plants: WarehousePlant[];
  isLoading: boolean;
  isShowModal: boolean;
  onClickSell: (idx: number) => void;
  onSellHarvest: () => void;
  onCloseModal: () => void;
}

const WarehouseItemMobile: React.FC<WarehouseItemProps> = (props) => {
  const { plants, isLoading, isShowModal, onClickSell, onCloseModal, onSellHarvest } = props;
  
  const calculateRemainingDays = (item: WarehousePlant) => {
    let remainingDays = item.drying_period + item.curing_period + item.packing_period - item.warehouse_period;
    if(remainingDays < 0) {
      remainingDays = 0;
    }
    return remainingDays;
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };
    
    const new_date = date.toLocaleDateString('en-US', options);
  
    return `${new_date}`;
  }
  
  const getSellState = (item: WarehousePlant) => {
    const remain_days = calculateRemainingDays(item);
    if(Number(remain_days) > 0) {
      return false;
    }else {
      return true;
    }
  }

  return (
    <div className="pb-6">
      <ul className="grid grid-cols-1 gap-6 list-none" >
        {plants.map((plant, index) => (
          <div className="relative plant-card-mobile mx-8 p-5 pb-24 rounded" key={index}>
            <div className="flex w-full items-center pb-6 border-b border-black/10">
              <div className='plant-image-mobile w-1/3'>
                <img className='rounded-full mx-auto' src={plant.image} alt={plant.name} />
              </div>
              <div className='w-2/3 pl-2'>
                <h3 className='text-xl font-bold truncate'>{plant.name}</h3>
                <label className='text-sm text-black/50'>{formatDate(plant.date)}</label>
              </div>
            </div>
            <div className='w-full pt-3 plant-grow-state'>
              <WarehousePlantState plant={plant} />
            </div>
            <button disabled={!getSellState(plant)} className={`${getSellState(plant) ? 'bg-green' : ''} rounded-b absolute w-full left-0 bottom-0 text-white font-bold py-4 `} onClick={() => onClickSell(plant.id)} >Sell harvest</button>
          </div>
        ))}
      </ul>
      <ModalWarehouseConfirmMobile isOpen={isShowModal} isLoading={isLoading} sellHarvest={onSellHarvest} onClose={onCloseModal} />
    </div>
  );
};


interface WarehousePlantStateProps {
    plant: WarehousePlant;
}
  
const WarehousePlantState: React.FC<WarehousePlantStateProps> = ({ plant }) => {
    let plant_state = "";
    let remain_day_text = "";

    if ( plant.warehouse_period <= plant.drying_period ){
      plant_state = "Drying Process";
    }else if (plant.warehouse_period <= plant.drying_period + plant.curing_period) {
      plant_state = "Curing Process";
    }else if (plant.warehouse_period <= plant.drying_period+ plant.curing_period + plant.packing_period){
      plant_state = "Packing Process";
    }else{
      plant_state = "Ready to Sell";
    }
  
    let remain_days = plant.drying_period + plant.curing_period + plant.packing_period - plant.warehouse_period;
    remain_day_text = remain_days + "days remaining...";
    if(remain_days <= 0) {
      remain_days = 0;
      remain_day_text = "Complete packing."
    }
    
    let per = 0;
    per = plant.warehouse_period / (plant.drying_period + plant.curing_period + plant.packing_period) * 100;
    if(per > 100) {
        per = 100;
    }
  
    // height: 9px;
    // border-radius: 100px;
    // background-image: linear-gradient(to right, rgba(5, 90, 33, 0.35), rgba(5, 90, 33, 1));
    // width: ${(props) => props.width || '100%'};
    // position: relative;
  
    return (
      <div className='w-full pt-1'>
        <div>
            <label className='block text-green text-sm'>{plant_state}</label>
            <label className='block text-black/50 text-xs'>{remain_day_text}</label>
        </div>
        <div className='relative flex h-16 mt-3'>
            <div className='absolute w-full h-3 rounded-full bg-black/10'></div>
            <div className='relative h-3 rounded-full bg-gradient-to-r from-green/10 to-green' style={{ width:  per+"%", }}  >
                {per == 0 ?
                <div className="absolute w-3 h-3 rounded-full border border-white bg-green z-10 left-0 " ></div>
                : 
                per == 100 ? 
                <div className="absolute w-3 h-3 rounded-full border border-white bg-green z-10 right-0 " ></div>
                :
                <div className="absolute w-3 h-3 rounded-full border border-white bg-green z-10 right-0 translate-x-2/4" ></div>
                }
                {per == 0 ?
                <div className="z-20 tooltip" style={{ right: '-5px'}} >{remain_days + "days"}</div>
                : 
                per == 100 ? 
                <div className="z-20 tooltip" style={{ right: '5px'}} >{remain_days + "days"}</div>
                :
                <div className="z-20 tooltip" style={{ right: '0%'}} >{remain_days + "days"}</div>
                }
                {/* {per>=0?<div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green right-0" />:<></>} */}
            </div>
        </div>
      </div>
    );
}


export default WarehouseItemMobile;