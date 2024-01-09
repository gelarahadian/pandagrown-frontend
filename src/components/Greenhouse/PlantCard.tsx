import React, { useEffect, useRef, useState } from 'react';
import { Plant } from 'types/common';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { config } from "config";
import { styled } from "styled-components"
import { off } from 'process';
import 'styles/greenhouse.scss'
import {Scrollbars} from "rc-scrollbars";

interface PlantCardProps {
  plants: Plant[];
}

const PlantCard: React.FC<PlantCardProps> = (props) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const { plants } = props;

  const calculateTotalPrice = (price: number, weight: number): string => {
    const totalPrice = price * weight;
    return formatNumber(totalPrice, 2);
  };
  const calculateEstimateProfit = (price_seed: string, weight_seed: string, price_harvest: string, weight_harvest: string): string => {
    const estimateProfit = (Number(price_harvest) * Number(weight_harvest)) - (Number(price_seed) * Number(weight_seed));
    return formatNumber(estimateProfit,2);
  };

  const calculateHarvestWeight = (seed_weight: number, harvest_rate: number) => {
    const estimateProfit = seed_weight + seed_weight * harvest_rate / 100;
    return formatNumber(estimateProfit, 2);
  }

  const formatNumber = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  const calculateHarvestTotalPrice = (item: Plant) => {
    const seed_price = item.seed_price * item.seed_weight + item.profit;
    return formatNumber(seed_price, 2);
  }

  const getTotalPeriod = (item: Plant) => {
    const total_period = item.clone_rooting_period + item.vegetation_mass_period + item.flowering_preharvest_period + item.harvest_period;
    return total_period;
  }

  const onSetSliderIndex = (idx: number) => {
    setSliderIndex(idx);
  }
  
  return (
    <div className="mt-6">
      <Scrollbars className="" style={{ width: '100%', height: 'calc(100vh - 180px)' }}>
        <ul className="grid grid-cols-1 gap-6 list-none">
          {plants.map((plant, index) => (
              <li className="plant-card h-60 bg-white rounded" key={index}>
                <div className="flex">
                  <div className=''>
                    <img className='h-60 rounded-l object-fill' src={plant.image} alt={plant.name} />
                  </div>
                  <div className='greenhouse-plant-details mx-7 my-4' >
                    <div className='flex w-full'>
                      <div className='w-1/4 border-r border-black/10'>
                        <h3 className='text-xl font-bold'>{plant.name}</h3>
                        <label className='text-sm text-black/50'>{formatDate(plant.date)}</label>
                        <h6 className='text-sm mt-3 font-bold'>Est.Harvest Date</h6>
                        <label className='text-sm text-black/50'>{formatDate(plant.est_harvest_at)}</label>
                      </div>
                      <div className='w-1/2 border-r border-black/10'>
                        <ul className='flex w-full mb-3'>
                          <li className='w-1/3'>
                            <label className='block pl-10 text-base font-bold truncate'>Seed Price</label>
                            <label className='block pl-10 text-base text-black/50'>USD&nbsp;{plant.seed_price}/gr</label>
                          </li>
                          <li className='w-1/3'>
                            <label className='block pl-8 text-base font-bold'>Weight</label>
                            <label className='block pl-8 text-base text-black/50'>{plant.seed_weight}gr</label>
                          </li>
                          <li className='w-1/3'>
                            <label className='block pl-6 text-base font-bold'>Invest</label>
                            <label className='block pl-6 text-base text-black/50'>
                              {plant.payment_method === 0 ? 'PGA ' +  plant.price_sum: '$ ' + plant.price_sum}</label>
                          </li>
                        </ul>
                        <ul className='flex w-full'>
                          <li className='w-1/3'>
                            <label className='block pl-10 text-base font-bold'>Harvest</label>
                            <label className='block pl-10 text-base text-black/50'>{calculateHarvestWeight(plant.seed_weight, plant.harvest_rate)}&nbsp;gr</label>
                          </li>
                          <li className='w-1/3'>
                            <label className='block pl-8 text-base font-bold'>Period</label>
                            <label className='block pl-8 text-base text-black/50 truncate'>{ getTotalPeriod(plant) } days</label>
                          </li>
                          <li className='w-1/3'>
                            <label className='block pl-6 text-base font-bold truncate'>Get Funds</label>
                            <label className='block pl-6 text-base text-black/50'>
                              {plant.payment_method === 0 ? 'PGA ' + Math.round( plant.profit * 100) / 100
                                  : '$ ' + Math.round( plant.profit * 100 ) / 100}&nbsp;
                              {plant.payment_method === 1 && (plant.method_botanicare * config.pga.silicaPrice + plant.method_rhizo * config.pga.rhizoPrice + plant.method_silica * config.pga.silicaPrice) > 0?
                                  ', PGA ' + (plant.method_botanicare * config.pga.silicaPrice + plant.method_rhizo * config.pga.rhizoPrice + plant.method_silica * config.pga.silicaPrice)
                              : ''
                              }</label>
                          </li>
                        </ul>
                      </div>
                      <div className='w-1/4'>
                        <h3 className='block text-right text-2xl font-bold'>
                          {plant.payment_method === 0 ? 'PGA' : '$'}&nbsp;{ formatNumber(plant.profit - plant.price_sum,2) }
                        </h3>
                        <label className='block text-right text-sm text-green'>Estimated Profit</label>
                      </div>
                    </div>
                    <div>
                      <PlantState plant={plant} sliderIndex={sliderIndex} handleSetIndex={onSetSliderIndex} />
                    </div>
                  </div>
                </div>
              </li>
          ))}
        </ul>
      </Scrollbars>

    </div>
  );
};

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

// interface PlantGraphProps {
//   width?: string;
// }
// const PlantGraph = styled.div<PlantGraphProps>`
//     height: 9px;
//     border-radius: 100px;
//     background-image: linear-gradient(to right, rgba(5, 90, 33, 0.35), rgba(5, 90, 33, 1));
//     width: ${(props) => props.width || '100%'};
//     position: relative;
//   `;

interface PlantCanvasProps {
  plant: Plant;
  sliderIndex: number;
  handleSetIndex: (idx: number) => void;
}

const PlantState: React.FC<PlantCanvasProps> = ({ plant, sliderIndex, handleSetIndex }) => {

  const graphRef = useRef<HTMLDivElement>(null);
  const [distanceFromBottom, setDistanceFromBottom] = React.useState(0);
  const [distanceFromRight, setDistanceFromRight] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const graphPosition = graphRef.current?.getBoundingClientRect()?.bottom;
      if (graphPosition) {
        const distance = windowHeight - graphPosition;
        setDistanceFromBottom(distance);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageData, setImageData] = useState<SliderImage>();
  const [percentage, setPercentage] = useState(0);

  var per = 0;
  const cur_period = plant.clone_rooting_period + plant.current_period;
  if ( cur_period <= plant.clone_rooting_period ){
    per = 0;
  }else if (cur_period <= plant.clone_rooting_period + plant.vegetation_mass_period) {
    per = (100/3) * ((cur_period - plant.clone_rooting_period)/plant.vegetation_mass_period);
  }else if (cur_period <= plant.clone_rooting_period + plant.vegetation_mass_period + plant.flowering_preharvest_period){
    per = (100/3) * ((cur_period - plant.clone_rooting_period - plant.vegetation_mass_period)/plant.flowering_preharvest_period ) + (100/3);
  }else if (cur_period <= plant.clone_rooting_period + plant.vegetation_mass_period + plant.flowering_preharvest_period + plant.harvest_period){
    per = (100/3) * ((cur_period - plant.clone_rooting_period - plant.vegetation_mass_period - plant.flowering_preharvest_period)/plant.harvest_period ) + (100/3*2);
  }else if (cur_period > plant.clone_rooting_period + plant.vegetation_mass_period + plant.flowering_preharvest_period + plant.harvest_period){
    per = 100;
  }
  // const width = `calc(${per}% + 8px)`;


  const handleHover = (event : any) => {
    const element = event.target;
    const mouseX = event.clientX - element.getBoundingClientRect().left;
    const width = element.clientWidth;
    const percent = (mouseX / width) * 100;
    var days = 0;
    if(percent <= (100/3)) {
      days = plant.vegetation_mass_period*percent/(100/3) + plant.clone_rooting_period;
    }else if (percent <= (100/3*2)){
      days = plant.flowering_preharvest_period*(percent-(100/3))/(100/3) + plant.clone_rooting_period + plant.vegetation_mass_period;
    }else if (percent > (100/3*2)){
      days = plant.harvest_period*(percent - (100/3*2))/(100/3) + plant.clone_rooting_period + plant.vegetation_mass_period + plant.flowering_preharvest_period;
    }    
    setPercentage(percent);
    if((width - mouseX) > 300) {
      setDistanceFromRight(mouseX);
    } else {
      setDistanceFromRight(mouseX-300);
    }
    getHoverImages(days);
  };

  const handleMouseLeave = () => {
    setIsModalOpen(false);
    if (sliderIndex == plant.id) {
      handleSetIndex(0);
    }
    return;
  }

  const getHoverImages = (day: number) => {
    
    let seed_media = [];
    if (plant.seed_media) {
      seed_media = plant.seed_media;
    } else {
      setIsModalOpen(false);
      return;
    }
    
    if (cur_period <= day) {
      setIsModalOpen(false);
      if (sliderIndex == plant.id) {
        handleSetIndex(0);
      }
      return;
    }

    if (sliderIndex != plant.id && sliderIndex != 0) {
      setIsModalOpen(false);
      return;
    }

    const hoverMedia = seed_media.find(
      (image) => day >= image.start_day && day < image.end_day + 1
    );
    
    if(hoverMedia && hoverMedia.growing_img.length > 0) {
      setIsModalOpen(false);
      setImageData(hoverMedia);
      setIsModalOpen(true);
      handleSetIndex(plant.id);
    }else {
      setIsModalOpen(false);
    }
  }

  const closeSlider = () => {
    setIsModalOpen(false);
    handleSetIndex(0);
  }

  // height: 9px;
  // border-radius: 100px;
  // background-image: linear-gradient(to right, rgba(5, 90, 33, 0.35), rgba(5, 90, 33, 1));
  // width: ${(props) => props.width || '100%'};
  // position: relative;

  return (
    <div className='w-full relative flex mt-16 plant-grow-state '>
      <div className='absolute w-full h-2.5 rounded-full bg-black/10'></div>
      <div className='relative h-2.5 rounded-full bg-gradient-to-r from-green/10 to-green' style={{ width:  per+"%", }} ref={graphRef}  >
        {per == 0 ?
          <div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green z-10 left-0 " ></div>
          : 
          per == 100 ? 
          <div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green z-10 right-0 " ></div>
          :
          <div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green z-10 right-0 translate-x-2/4" ></div>
        }
        {per == 0 ?
          <div className="z-20 tooltip" style={{ right: '-5px'}} >{cur_period + "days"}</div>
          : 
          per == 100 ? 
          <div className="z-20 tooltip" style={{ right: '5px'}} >{cur_period + "days"}</div>
          :
          <div className="z-20 tooltip" style={{ right: '0%'}} >{cur_period + "days"}</div>
        }
        {/* {per>=0?<div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green right-0" />:<></>} */}
        
      </div>
      { per>0? <div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green left-0" /> : <div className="absolute w-2.5 h-2.5 rounded-full border border-green bg-white left-0" /> }
      { per>=33? <div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green left-1/3 -translate-x-2/4" /> : <div className="absolute w-2.5 h-2.5 rounded-full border border-green bg-white left-1/3 -translate-x-2/4" /> }
      { per>=66? <div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green left-2/3 -translate-x-2/4" /> : <div className="absolute w-2.5 h-2.5 rounded-full border border-green bg-white left-2/3 -translate-x-2/4" /> }
      { per>=100? <div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green right-0" /> : <div className="absolute w-2.5 h-2.5 rounded-full border border-green bg-white right-0" /> }
      <span className='absolute text-green text-sm font-bold -mt-6 left-0' >Cloning & Rooting</span>
      <span className='absolute text-green text-sm font-bold -mt-6 left-1/3 -translate-x-2/4' >Vegetation & Mass Gain</span>
      <span className='absolute text-green text-sm font-bold -mt-6 left-2/3 -translate-x-2/4' >Flowering & Preharvest</span>
      <span className='absolute text-green text-sm font-bold -mt-6 right-0' >Harvest</span>
      <span className='absolute text-black text-xs mt-4 left-0' >{plant.clone_rooting_period + " days"}</span>
      <span className='absolute text-black text-xs mt-4 left-1/3 -translate-x-2/4' >{plant.vegetation_mass_period + " days"}</span>
      <span className='absolute text-black text-xs mt-4 left-2/3 -translate-x-2/4' >{plant.flowering_preharvest_period + " days"}</span>
      <span className='absolute text-black text-xs mt-4 right-0' >{plant.harvest_period + " days"}</span>
      {isModalOpen && imageData ? (
          <div>
            <div className="absolute z-20" style={{left: `${distanceFromRight}px`, marginTop: distanceFromBottom>240 ? "30px": "-221px"}}>
              <ImageSlider sliderImages={imageData} />
            </div>
            <div className="fixed inset-0 z-0" onClick={closeSlider}></div>
          </div>
        ) : <></>}
      <div className='absolute w-full h-2.5 rounded-full bg-transparent' onMouseMove={handleHover} onMouseLeave={handleMouseLeave} ></div>
    </div>
  );
}

interface SliderImage {
  id: number;
  start_day: number;
  end_day: number;
  growing_img: [];
}

interface ImageSliderProps {
  sliderImages: SliderImage;
}
const ImageSlider: React.FC<ImageSliderProps> = (props) => {
  const { sliderImages } = props;
  const [current, setCurrent] = useState(0);
  const length = sliderImages.growing_img.length;
  console.log(sliderImages);

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (sliderImages.growing_img.length <= 0) {
    return null;
  }

  return (
    <section className='relative flex justify-center items-center'>
      {/* { (sliderImages.growing_img.length < 2) ? (
        <></>
      ) : (
        <>
        <FaArrowAltCircleLeft className='absolute top-2/4 left-8 text-4xl text-black/30 z-20 cursor-pointer select-none hover:text-black/50' onClick={prevSlide} />
        <FaArrowAltCircleRight className='absolute top-2/4 right-8 text-4xl text-black/30 z-20 cursor-pointer select-none hover:text-black/50' onClick={nextSlide} />
        </>
      ) } */}
      {sliderImages.growing_img.map((image, index) => {
        return (
          <div
            className={index === current ? 'slide active z-10' : 'slide z-10' }
            key={index}
          >
            {index === current && (
              <img src={image} alt='travel image' className='h-52 w-80 object-cover rounded' />
            )}
          </div>
        );
      })}
    </section>
  );
}

// interface PlantCanvasProps {
//   plant: Plant;
// }

// const PlantCanvas: React.FC<PlantCanvasProps> = ({ plant }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [hoverDays, setHoverDays] = useState(-1);
//   const [modalPosition, setModalPosition] = useState<{ posX: number; posY: number }>({ posX: 0, posY: 0 });
//   const [imageData, setImageData] = useState<SliderImage>();

//   // const [modalImageSrc, setModalImageSrc] = useState('');

//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');

//       // Ensure ctx is not null before performing canvas operations
//       if (ctx) {
//         // Calculate the canvas width based on the parent div width
//         const parentDiv = canvas.parentElement;
//         if (parentDiv) {
//           canvas.width = parentDiv.clientWidth;
//           canvas.height = parentDiv.clientHeight;
//         }

//         // Clear the canvas
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         // Set text properties
//         ctx.fillStyle = 'green';
//         ctx.font = 'bold 1rem Poppins';
//         ctx.textBaseline = 'middle';

//         const offset_x = 30;
//         const draw_width = canvas.width - (offset_x * 2);

//         // Draw text in the middle of the canvas width
        
//         ctx.textAlign = 'left';
//         ctx.fillText(`Rooting & Cloning`, 0 + offset_x, (canvas.height / 4));
        
//         ctx.textAlign = 'center';
//         ctx.fillText(`Vegetation & Mass Gain`, draw_width / 3 + offset_x, (canvas.height / 4));
//         ctx.fillText(`Flowering & Preharvest`, draw_width / 3 * 2 + offset_x, (canvas.height / 4));
        
//         ctx.textAlign = 'right';
//         ctx.fillText(`Harvest`, canvas.width - offset_x, (canvas.height / 4));
        
//         ctx.font = '0.8rem Poppins';
//         ctx.fillStyle = 'black';
//         ctx.textAlign = 'left';
//         ctx.fillText(`${plant.clone_rooting_period} days`, 0 + offset_x, canvas.height / 4 * 3 + canvas.height / 8);
        
//         ctx.textAlign = 'center';
//         ctx.fillText(`${plant.vegetation_mass_period} days`, draw_width / 3 + offset_x, canvas.height / 4 * 3 + canvas.height / 8);
//         ctx.fillText(`${plant.flowering_preharvest_period} days`, draw_width / 3 * 2 + offset_x, canvas.height / 4 * 3 + canvas.height / 8);
        
//         ctx.textAlign = 'right';
//         ctx.fillText(`${plant.harvest_period} days`, canvas.width - offset_x, canvas.height / 4 * 3 + canvas.height / 8);

//         // Draw a rectangle
//         ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
//         ctx.fillRect(1 + (canvas.height / 16) + offset_x, (canvas.height / 2) - (canvas.height / 16) - 1, canvas.width - 2 - (canvas.height / 8) - (offset_x * 2), (canvas.height / 8) + 2);
//         // Draw a circle
//         ctx.strokeStyle = 'green';
//         ctx.fillStyle = 'white';
//         ctx.beginPath();
//         ctx.arc(1 + (canvas.height / 16) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
        
//         ctx.beginPath();
//         ctx.arc((draw_width / 3 + offset_x), canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
        
//         ctx.beginPath();
//         ctx.arc((draw_width / 3 * 2 + offset_x), canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
        
//         ctx.beginPath();
//         ctx.arc(canvas.width - (canvas.height / 16) - 1 - offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();

        
//         let rd_rect_posX = 0; //growing days X position
//         //growing state
//         if(Number(plant.current_period)<=Number(plant.clone_rooting_period)) {
//           ctx.strokeStyle = 'white';
//           ctx.fillStyle = 'green';

//           ctx.beginPath();
//           ctx.arc(1 + (canvas.height / 16) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
//         }else if(Number(plant.current_period) <= (Number(plant.clone_rooting_period) + Number(plant.vegetation_mass_period))) {
//           let ongoing_vegetation_massgain_days = Number(plant.current_period) - Number(plant.clone_rooting_period);

//           //draw gradient rect
//           var grd = ctx.createLinearGradient(1 + (canvas.height / 16) + offset_x, canvas.height / 2, 1 + (canvas.height / 16) + offset_x + (draw_width / 3 * (ongoing_vegetation_massgain_days / Number(plant.vegetation_mass_period))), canvas.height / 2);
//           grd.addColorStop(0, 'rgba(5, 90, 33, 0.35)');
//           grd.addColorStop(1, 'rgba(5, 90, 33, 1)');

//           // Fill with gradient
//           ctx.fillStyle = grd;
//           ctx.fillRect(1 + (canvas.height / 16) + offset_x, canvas.height / 2 - (canvas.height / 16) - 1, ((draw_width / 3 - (canvas.height / 16) - 1) * (ongoing_vegetation_massgain_days / Number(plant.vegetation_mass_period))), (canvas.height / 8) + 2);

//           ctx.strokeStyle = 'white';
//           ctx.fillStyle = 'green';
          
//           ctx.beginPath();
//           ctx.arc(1 + (canvas.height / 16) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           ctx.beginPath();
//           ctx.arc(1 + (canvas.height / 16) + offset_x + ((draw_width / 3 - (canvas.height / 16) - 1) * (ongoing_vegetation_massgain_days / Number(plant.vegetation_mass_period))), canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           //calc growing days X pos
//           rd_rect_posX = offset_x + ((draw_width / 3 - (canvas.height / 16) - 1) * (ongoing_vegetation_massgain_days / Number(plant.vegetation_mass_period)));

//         }else if(Number(plant.current_period) <= (Number(plant.clone_rooting_period) + Number(plant.vegetation_mass_period) + Number(plant.flowering_preharvest_period))) {
//           let ongoing_flowering_preharvest_days = Number(plant.current_period) - Number(plant.clone_rooting_period) - Number(plant.vegetation_mass_period);
          
//           //draw gradient rect
//           var grd = ctx.createLinearGradient(1 + (canvas.height / 16) + offset_x, canvas.height / 2, (draw_width / 3) + (draw_width / 3 * (ongoing_flowering_preharvest_days / Number(plant.flowering_preharvest_period))), canvas.height / 2);
//           grd.addColorStop(0, 'rgba(5, 90, 33, 0.35)');
//           grd.addColorStop(1, 'rgba(5, 90, 33, 1)');

//           // Fill with gradient
//           ctx.fillStyle = grd;
//           ctx.fillRect(1 + (canvas.height / 16) + offset_x, canvas.height / 2 - (canvas.height / 16) - 1, (draw_width / 3) - (1 + (canvas.height / 16)) + (draw_width / 3 * (ongoing_flowering_preharvest_days / Number(plant.flowering_preharvest_period))), (canvas.height / 8) + 2);

//           ctx.strokeStyle = 'white';
//           ctx.fillStyle = 'green';
          
//           ctx.beginPath();
//           ctx.arc(1 + (canvas.height / 16) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           ctx.beginPath();
//           ctx.arc((draw_width / 3) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();

//           ctx.beginPath();
//           ctx.arc((draw_width / 3) + offset_x + (draw_width / 3 * (ongoing_flowering_preharvest_days / Number(plant.flowering_preharvest_period))), canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           //calc growing days X pos
//           rd_rect_posX = (draw_width / 3) + offset_x + (draw_width / 3 * (ongoing_flowering_preharvest_days / Number(plant.flowering_preharvest_period))) - (1 + (canvas.height / 16));

//         }else if(Number(plant.current_period) <= (Number(plant.clone_rooting_period) + Number(plant.vegetation_mass_period) + Number(plant.flowering_preharvest_period) + Number(plant.harvest_period))) {
//           let ongoing_harvest_days = Number(plant.current_period) - Number(plant.clone_rooting_period) - Number(plant.vegetation_mass_period) - Number(plant.flowering_preharvest_period);
          
//           //draw gradient rect
//           var grd = ctx.createLinearGradient(1 + (canvas.height / 16) + offset_x, canvas.height / 2, (draw_width / 3 * 2) - (1 + (canvas.height / 16)) + ((draw_width / 3) * (ongoing_harvest_days / Number(plant.harvest_period))), canvas.height / 2);
//           grd.addColorStop(0, 'rgba(5, 90, 33, 0.35)');
//           grd.addColorStop(1, 'rgba(5, 90, 33, 1)');

//           // Fill with gradient
//           ctx.fillStyle = grd;
//           ctx.fillRect(1 + (canvas.height / 16) + offset_x, canvas.height / 2 - (canvas.height / 16) - 1, (draw_width / 3 * 2) - (1 + (canvas.height / 16)) + ((draw_width / 3) * (ongoing_harvest_days / Number(plant.harvest_period))), (canvas.height / 8) + 2);

//           ctx.strokeStyle = 'white';
//           ctx.fillStyle = 'green';
          
//           ctx.beginPath();
//           ctx.arc(1 + (canvas.height / 16) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           ctx.beginPath();
//           ctx.arc((draw_width / 3) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           ctx.beginPath();
//           ctx.arc((draw_width / 3 * 2) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();

//           ctx.beginPath();
//           ctx.arc((draw_width / 3 * 2) + offset_x + ((draw_width / 3) * (ongoing_harvest_days / Number(plant.harvest_period))), canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           //calc growing days X pos
//           rd_rect_posX = (draw_width / 3 * 2) + offset_x + ((draw_width / 3) * (ongoing_harvest_days / Number(plant.harvest_period))) - (1 + (canvas.height / 16));

//         }else{
//           //draw gradient rect
//           var grd = ctx.createLinearGradient(1 + (canvas.height / 16) + offset_x, canvas.height / 2, canvas.width - (1 + (canvas.height / 16)) * 2 - (offset_x * 2), canvas.height / 4 * 3);
//           grd.addColorStop(0, 'rgba(5, 90, 33, 0.35)');
//           grd.addColorStop(1, 'rgba(5, 90, 33, 1)');

//           // Fill with gradient
//           ctx.fillStyle = grd;
//           ctx.fillRect(1 + (canvas.height / 16) + offset_x, canvas.height / 2 - (canvas.height / 16) - 1, canvas.width - (1 + (canvas.height / 16)) * 2 - (offset_x * 2), (canvas.height / 8) + 2);

//           ctx.strokeStyle = 'white';
//           ctx.fillStyle = 'green';
          
//           ctx.beginPath();
//           ctx.arc(1 + (canvas.height / 16) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           ctx.beginPath();
//           ctx.arc((draw_width / 3) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           ctx.beginPath();
//           ctx.arc((draw_width / 3 * 2) + offset_x, canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();

//           ctx.beginPath();
//           ctx.arc((canvas.width - (1 + (canvas.height / 16)) - offset_x) , canvas.height / 2, canvas.height / 16, 0, 2 * Math.PI);
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
          
//           //calc growing days X pos
//           rd_rect_posX = (canvas.width - (1 + (canvas.height / 16)) * 2 - offset_x);

//         }

//         // Add more information as needed
//         //draw growing days
//         rd_rect_posX -= 30;
//         if(rd_rect_posX <= 0){
//           rd_rect_posX = 0;
//         }else if(rd_rect_posX > (canvas.width - 60)){
//           rd_rect_posX = (canvas.width - 60);
//         }
//         rd_rect_posX += (1 + (canvas.height / 16));

//         const rd_rect_poxY = canvas.height / 4 * 3;
//         const rd_rect_width = 60;
//         const rd_rect_height = canvas.height / 4;
//         const radius = canvas.height / 10;
    
//         ctx.strokeStyle = 'transparent';
//         //draw round rect
//         ctx.beginPath();
//         ctx.moveTo(rd_rect_posX + radius, rd_rect_poxY);
//         ctx.lineTo(rd_rect_posX + rd_rect_width - radius, rd_rect_poxY);
//         ctx.arcTo(rd_rect_posX + rd_rect_width, rd_rect_poxY, rd_rect_posX + rd_rect_width, rd_rect_poxY + radius, radius);
//         ctx.lineTo(rd_rect_posX + rd_rect_width, rd_rect_poxY + rd_rect_height - radius);
//         ctx.arcTo(rd_rect_posX + rd_rect_width, rd_rect_poxY + rd_rect_height, rd_rect_posX + rd_rect_width - radius, rd_rect_poxY + rd_rect_height, radius);
//         ctx.lineTo(rd_rect_posX + radius, rd_rect_poxY + rd_rect_height);
//         ctx.arcTo(rd_rect_posX, rd_rect_poxY + rd_rect_height, rd_rect_posX, rd_rect_poxY + rd_rect_height - radius, radius);
//         ctx.lineTo(rd_rect_posX, rd_rect_poxY + radius);
//         ctx.arcTo(rd_rect_posX, rd_rect_poxY, rd_rect_posX + radius, rd_rect_poxY, radius);
//         ctx.closePath();
    
//         ctx.fill();

//         //draw trianglectx.beginPath();

//         ctx.moveTo(rd_rect_posX + 30, canvas.height / 16 * 11);
//         ctx.lineTo(rd_rect_posX + 30 - canvas.height / 15, canvas.height / 16 * 11 + canvas.height / 10);
//         ctx.lineTo(rd_rect_posX + 30 + canvas.height / 15, canvas.height / 16 * 11 + canvas.height / 10);
//         ctx.lineTo(rd_rect_posX + 30, canvas.height / 16 * 11);
//         ctx.closePath();
    
//         ctx.fill();

//         //draw day count text
//         ctx.fillStyle = 'white';
//         ctx.font = '0.6rem Poppins';
//         ctx.textAlign = 'center';
//         ctx.fillText(`${plant.current_period} days`, rd_rect_posX + 30, rd_rect_poxY + canvas.height / 8);

//       }

//       const handleMouseMove = (event: MouseEvent) => {
//         const rect = canvas.getBoundingClientRect();
//         const posX : number = event.clientX - rect.left;
//         const posY : number = event.clientY - rect.top;
        
//         const ctx = canvas.getContext('2d');
        
//         const clone_rooting_period = plant.clone_rooting_period;
//         const vegetation_mass_period = plant.vegetation_mass_period;
//         const flowering_preharvest_period = plant.flowering_preharvest_period;
//         const harvest_period = plant.harvest_period;

//         // let select_days = -1;
//         const offset_x = 30;

//         const sector1_x = offset_x;
//         const sector1_x_width = canvas.height / 16 + 1;
//         const sector2_x = offset_x + canvas.height / 16 + 1;
//         const sector2_x_width = (canvas.width - (offset_x * 2)) / 3 - (canvas.height / 16 + 1);
//         const sector3_x = offset_x + (canvas.width - (offset_x * 2)) / 3;
//         const sector3_x_width = (canvas.width - (offset_x * 2)) / 3;
//         const sector4_x = offset_x + (canvas.width - (offset_x * 2)) / 3 * 2;
//         const sector4_x_width = (canvas.width - (offset_x * 2)) / 3 + (canvas.height / 16 + 1);

//         const sector_y = canvas.height / 5 * 3 - (canvas.height / 16) - 1;
//         const sector_y_height = canvas.height / 8 + 2;
//         const mPosX : number = maxPosX(canvas.width - (offset_x), posX);

//         if (
//           posX >= sector1_x &&
//           posX <= sector1_x + sector1_x_width &&
//           posY >= sector_y &&
//           posY <= sector_y + sector_y_height
//         ) {
//           const hoverDay = parseInt(((posX - sector1_x) / sector1_x_width * clone_rooting_period).toString());
//           setHoverDays(hoverDay);
//           setModalPosition({ posX: mPosX, posY });
//           getHoverImages(hoverDay);
//         } else if (
//           posX >= sector2_x &&
//           posX <= sector2_x + sector2_x_width &&
//           posY >= sector_y &&
//           posY <= sector_y + sector_y_height
//         ) {
//           const hoverDay = parseInt(((posX - sector2_x) / sector2_x_width * vegetation_mass_period + 1).toString()) + clone_rooting_period;
//           setHoverDays(hoverDay);
//           setModalPosition({ posX: mPosX, posY });
//           getHoverImages(hoverDay);
//         } else if (
//           posX >= sector3_x &&
//           posX <= sector3_x + sector3_x_width &&
//           posY >= sector_y &&
//           posY <= sector_y + sector_y_height
//         ) {
//           const hoverDay = parseInt(((posX - sector3_x) / sector3_x_width * flowering_preharvest_period + 1).toString()) + clone_rooting_period + vegetation_mass_period;
//           setHoverDays(hoverDay);
//           setModalPosition({ posX: mPosX, posY });
//           getHoverImages(hoverDay);
//         } else if (
//           posX >= sector4_x &&
//           posX <= sector4_x + sector4_x_width &&
//           posY >= sector_y &&
//           posY <= sector_y + sector_y_height
//         ) {
//           const hoverDay = parseInt(((posX - sector4_x) / sector4_x_width * harvest_period + 1).toString()) + clone_rooting_period + vegetation_mass_period + flowering_preharvest_period;
//           setHoverDays(hoverDay);
//           setModalPosition({ posX: mPosX, posY });
//           getHoverImages(hoverDay);
//         }else {
//           // setIsModalOpen(false);
//         }

//       };

//       canvas.addEventListener('mousemove', handleMouseMove);
//     }
//   }, [plant]);

//   const maxPosX = (width: number, posX: number) => {
//     if(posX + 300 > width){
//       return width-300;
//     }
//     return posX;
//   }

//   const getHoverImages = (day: number) => {
//     let seed_media = [];
//     if (plant.seed_media) {
//       seed_media = plant.seed_media;
//     } else {
//       setIsModalOpen(false);
//       return;
//     }

//     const hoverMedia = seed_media.find(
//       (image) => day > image.start_day && day < image.end_day
//     );
    
//     if(hoverMedia && hoverMedia.growing_img.length > 0) {
//       // console.log("hover_day", day);
//       // console.log("hoverMedia", hoverMedia);
//       setIsModalOpen(false);
//       setImageData(hoverMedia);
//       setIsModalOpen(true);
//     }else {
//       setIsModalOpen(false);
//     }
//   }

//   const closeSlider = () => {
//     setIsModalOpen(false);
//   }

//   return (
//       <div className='w-full pt-3 plant-grow-state relative'>
//         <canvas ref={canvasRef} className="canvas-plant-grow relative z-10 bg-white"></canvas>
//         {isModalOpen && imageData ? (
//           <div>
//             <div className="absolute mt-8 z-20"
//             style={{ top: modalPosition.posY, left: modalPosition.posX }}
//             >
//               <ImageSlider sliderImages={imageData} />
//             </div>
//             <div className="fixed inset-0 z-0" onClick={closeSlider}></div>
//           </div>
//         ) : <></>}
//       </div>
//     );
// };




export default PlantCard;