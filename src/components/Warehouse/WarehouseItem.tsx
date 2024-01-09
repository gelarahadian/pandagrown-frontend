import React, { useState, useEffect, useRef } from 'react';
import ModalWarehouseConfirm from './ModalWarehouseConfirm';
import 'styles/warehouse.scss'

export interface WarehousePlant {
    id: number;
    seed_id: number;
    user_id: number;
    name: string;
    image: string;
    date: string;
    current_period: number;
    seed_price: number;
    seed_weight: number;
    profit: number;
    harvest_rate: number;
    drying_period: number;
    curing_period: number;
    packing_period: number;
    warehouse_period: number;
  }
  

interface WarehouseItemProps {
  plants: WarehousePlant[];
  isLoading: boolean;
  isShowModal: boolean;
  onClickSell: (idx: number) => void;
  onSellHarvest: () => void;
  onCloseModal: () => void;
}

const WarehouseItem: React.FC<WarehouseItemProps> = (props) => {
  const { plants, isLoading, isShowModal, onClickSell, onCloseModal, onSellHarvest } = props;
  
  const formatNumber = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  const calculateRemainingDays = (item: WarehousePlant) => {
    let remainingDays = item.drying_period + item.curing_period + item.packing_period - item.warehouse_period;
    if(remainingDays < 0) {
      remainingDays = 0;
    }
    return formatNumber(remainingDays, 0);
  }

  const plantState = (item: WarehousePlant) => {
    const remain_days = calculateRemainingDays(item);
    if((item.drying_period + item.curing_period + item.packing_period) <= item.warehouse_period) {
      return "Ready to Sell.";
    }else if((item.drying_period + item.curing_period) < item.warehouse_period) {
      return "Packing Process (" + remain_days + " days remaining...)";
    }else if(item.drying_period < item.warehouse_period) {
      return "Curing Process (" + remain_days + " days remaining...)";
    }else {
      return "Drying Process (" + remain_days + " days remaining...)";
    }
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
    <div>
    <ul className="grid grid-cols-1 gap-6 list-none mt-6">
        {plants.map((plant, index) => (
          <li className="plant-card-warehouse h-40 bg-white rounded" key={index}>
            <div className="flex">
                <div className=''>
                  <img className='main object-cover h-40 rounded-l' src={plant.image} alt={plant.name} />
                </div>
                <div className='warehouse-plant-details'>
                  <div className='flex w-full'>
                    <div className='w-1/2 '>
                      <h3 className='text-2xl font-bold'>{plant.name}</h3>
                      <label className='text-xs text-black'>{plantState(plant)}</label>
                    </div>
                    <div className='w-1/2 text-right'>
                      <button disabled={!getSellState(plant)} className={`${getSellState(plant) ? 'bg-green' : ''} text-white text-xs font-bold py-2 px-4 rounded-5`} onClick={() => onClickSell(plant.id)} >
                        Sell harvest
                      </button>
                    </div>
                  </div>
                  <div className='w-full pt-3 h-16'>
                    <WarehousePlantState plant={plant} />
                  </div>
                </div>
            </div>
          </li>
        ))}
    </ul>
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className='font-bold'>
          {"Selling your harvested plant?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          You will not be able to cancel this once you confirm. Your plant will be added to the selling order page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className='!text-red-600' onClick={handleClose}>No, thanks</Button>
          <Button className='!text-green' onClick={sellHarvest} autoFocus>
            Yes, I'm sure
          </Button>
        </DialogActions>
      </Dialog> */}
      <ModalWarehouseConfirm isOpen={isShowModal} isLoading={isLoading} sellHarvest={onSellHarvest} onClose={onCloseModal} />
    </div>
    
  );
};

interface WarehousePlantStateProps {
  plant: WarehousePlant;
}

const WarehousePlantState: React.FC<WarehousePlantStateProps> = ({ plant }) => {

  let per = 0;
  if ( plant.warehouse_period <= plant.drying_period ){
    per = 0;
  }else if (plant.warehouse_period <= plant.drying_period + plant.curing_period) {
    per = 50 * ((plant.warehouse_period - plant.drying_period)/plant.curing_period);
  }else if (plant.warehouse_period <= plant.drying_period+ plant.curing_period + plant.packing_period){
    per = 50 * ((plant.warehouse_period - plant.drying_period - plant.curing_period)/plant.packing_period ) + 50;
  }else{
    per = 100;
  }

  let remain_days = plant.drying_period + plant.curing_period + plant.packing_period - plant.warehouse_period;
  if(remain_days < 0) {
    remain_days = 0;
  }

  // height: 9px;
  // border-radius: 100px;
  // background-image: linear-gradient(to right, rgba(5, 90, 33, 0.35), rgba(5, 90, 33, 1));
  // width: ${(props) => props.width || '100%'};
  // position: relative;

  return (
    <div className='w-full relative flex h-16 mt-6 '>
      <div className='absolute w-full h-3 rounded-full bg-black/10'></div>
      <div className='relative h-3 rounded-full bg-gradient-to-r from-green/10 to-green' style={{ width:  per+"%", }} >
        {per == 0 ?
          <div className="absolute w-5 h-5 rounded-full border border-white bg-green z-10 left-0 -translate-y-1 text-center" ><label className='text-white text-xs align-[3px]'>{remain_days}</label></div>
          : 
          per == 100 ? 
          <div className="absolute w-5 h-5 rounded-full border border-white bg-green z-10 right-0 -translate-y-1 text-center" ><label className='text-white text-xs align-[3px]'>{remain_days}</label></div>
          :
          <div className="absolute w-5 h-5 rounded-full border border-white bg-green z-10 translate-x-2/4 right-0 -translate-y-1 text-center" ><label className='text-white text-xs align-[3px]'>{remain_days}</label></div>
        }
      </div>
      { per>=0? <div className="absolute w-3 h-3 rounded-full border border-white bg-green left-0 " /> : <div className="absolute w-3 h-3 rounded-full border border-green bg-white" /> }
      { per>=50? <div className="absolute w-3 h-3 rounded-full border border-white bg-green -translate-x-2/4 left-2/4" /> : <div className="absolute w-3 h-3 rounded-full border border-green bg-white -translate-x-2/4 left-2/4" /> }
      { per>=100? <div className="absolute w-3 h-3 rounded-full border border-white bg-green right-0" /> : <div className="absolute w-3 h-3 rounded-full border border-green bg-white right-0" /> }
      <span className='absolute text-green text-xs font-bold -mt-6 left-0'>Drying</span>
      <span className='absolute text-green text-xs font-bold -mt-6 -translate-x-2/4 left-2/4' >Curing</span>
      <span className='absolute text-green text-xs font-bold -mt-6 right-0'>Packing</span>
      <span className='absolute text-black text-xs mt-4 left-0'>{plant.drying_period + " days"}</span>
      <span className='absolute text-black text-xs mt-4 -translate-x-2/4 left-2/4' >{plant.curing_period + " days"}</span>
      <span className='absolute text-black text-xs mt-4 right-0'>{plant.packing_period + " days"}</span>

    </div>
  );
}


export default WarehouseItem;