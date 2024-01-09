import React, { useEffect, useState, useRef } from 'react';
import { Plant } from 'types/common';
import { config } from 'config';

interface PlantCardProps {
  plants: Plant[];
}

const PlantCardMobile: React.FC<PlantCardProps> = (props) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const { plants } = props;

  const calculateTotalPrice = (price: number, weight: number): string => {
    const totalPrice = price * weight;
    return formatNumber(totalPrice,2);
  };
  const calculateEstimateProfit = (price_seed: string, weight_seed: string, price_harvest: string, weight_harvest: string): string => {
    const estimateProfit = (Number(price_harvest) * Number(weight_harvest)) - (Number(price_seed) * Number(weight_seed));
    return estimateProfit.toString();
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

  const getTotalPeriod = (item: Plant) => {
    const total_period = item.clone_rooting_period + item.vegetation_mass_period + item.flowering_preharvest_period + item.harvest_period;
    return total_period;
  }
  
  const calculateHarvestTotalPrice = (item: Plant) => {
    const seed_price = item.seed_price * item.seed_weight + item.profit;
    return formatNumber(seed_price, 2);
  }

  const onSetSliderIndex = (idx: number) => {
    setSliderIndex(idx);
  }

  return (
    <div className="pb-6">
      <ul className="grid grid-cols-1 gap-6 list-none" >
        {plants.map((plant, index) => (
          <div className="plant-card-mobile mx-8 p-5 pb-10" key={index}>
            <div className="flex w-full items-center pb-2">
              <div className='plant-image-mobile w-1/3 text-left'>
                <img className='rounded-full' src={plant.image} alt={plant.name} />
              </div>
              <div className='w-2/3 pl-2'>
                <h3 className='text-xl font-bold truncate'>{plant.name}</h3>
                <label className='text text-sm text-black/50 truncate'>{formatDate(plant.date)}</label>
              </div>
            </div>
            <div className='plant-details mt-8 mb-5 w-full'>
              <ul className='border-b border-black/10 pb-3'>
                <li className='flex w-full mb-3'>
                  <div className='w-full text-left'>
                    <label className='block text-sm font-bold'>Est.Harvest Date</label>
                    <label className='block text-sm text-black/50'>{formatDate(plant.est_harvest_at)}</label>
                  </div>
                </li>
                <li className='flex w-full mb-3'>
                  <div className='w-1/2 text-left'>
                    <label className='block text-sm font-bold'>Seed Price</label>
                    <label className='block text-sm text-black/50'>USD&nbsp;{plant.seed_price}/gr</label>
                  </div>
                  <div className='w-1/2 text-right'>
                    <label className='block text-sm font-bold'>Harvest</label>
                    <label className='block text-sm text-black/50'>{calculateHarvestWeight(plant.seed_weight, plant.harvest_rate)}gr</label>
                  </div>
                </li>
                <li className='flex w-full mb-3'>
                  <div className='w-1/2 text-left'>
                    <label className='block text-sm font-bold'>Weight</label>
                    <label className='block text-sm text-black/50'>{plant.seed_weight}gr</label>
                  </div>
                  <div className='w-1/2 text-right'>
                    <label className='block text-sm font-bold'>Period</label>
                    <label className='block text-sm text-black/50'>{getTotalPeriod(plant)} days</label>
                  </div>
                </li>
                <li className='flex w-full mb-3'>
                  <div className='w-1/2 text-left'>
                    <label className='block text-sm font-bold'>Invest</label>
                    <label className='block text-sm text-black/50'>&nbsp;
                      {plant.payment_method === 0 ? 'PGA ' +  plant.price_sum: '$ ' + plant.price_sum}</label>
                  </div>
                  <div className='w-1/2 text-right'>
                    <label className='block text-sm font-bold'>Get Funds</label>
                    <label className='block text-sm text-black/50'>{plant.payment_method === 0 ? 'PGA ' + Math.round( plant.profit * 100) / 100
                        : '$ ' + Math.round( plant.profit * 100 ) / 100}&nbsp;
                      {plant.payment_method === 1 && (plant.method_botanicare * config.pga.silicaPrice + plant.method_rhizo * config.pga.rhizoPrice + plant.method_silica * config.pga.silicaPrice) > 0?
                          ', PGA ' + (plant.method_botanicare * config.pga.silicaPrice + plant.method_rhizo * config.pga.rhizoPrice + plant.method_silica * config.pga.silicaPrice)
                          : ''
                      }</label>
                  </div>
                </li>
              </ul>
            </div>
            <div className='flex w-full pb-2'>
                <label className='w-1/2 block text-left text-sm text-green'>Estimated<br/>Profit</label>
                <h3 className='w-1/2 block text-right text-xl font-bold'>{plant.payment_method === 0 ? 'PGA' : '$'}&nbsp;{ formatNumber(plant.profit - plant.price_sum,2) }</h3>
            </div>
            <div className='w-full py-2 plant-grow-state'>
              <PlantState plant={plant} sliderIndex={sliderIndex} handleSetIndex={onSetSliderIndex} />
            </div>
          </div>
        ))}
      </ul>
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


interface GreenhouseCanvasProps {
  plant: Plant;
  sliderIndex: number;
  handleSetIndex: (idx: number) => void;
}

const PlantState: React.FC<GreenhouseCanvasProps> = ({ plant, sliderIndex, handleSetIndex }) => {

  const graphRef = useRef<HTMLDivElement>(null);
  const [distanceFromBottom, setDistanceFromBottom] = React.useState(0);
  const [distanceFromRight, setDistanceFromRight] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageData, setImageData] = useState<SliderImage>();
  const [percentage, setPercentage] = useState(0);

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
  
  const clone_day = 0;
  const cur_day = plant.clone_rooting_period + plant.current_period;
  let growing_state = "Cloning & Rooting";
  if ( plant.current_period <= clone_day ){
    growing_state = "Cloning & Rooting";
  }else if (plant.current_period <= clone_day + plant.vegetation_mass_period) {
    growing_state = "Vegetation & Mass Gain";
  }else if (plant.current_period <= clone_day + plant.vegetation_mass_period + plant.flowering_preharvest_period){
    growing_state = "Flowering & Preharvest";
  }else if (plant.current_period <= clone_day + plant.vegetation_mass_period + plant.flowering_preharvest_period + plant.harvest_period){
    growing_state = "Harvest";
  }else if (plant.current_period > clone_day + plant.vegetation_mass_period + plant.flowering_preharvest_period + plant.harvest_period){
    growing_state = "Harvest Complete";
  }

  const total_growing_days = Number(clone_day) + Number(plant.vegetation_mass_period) + Number(plant.flowering_preharvest_period) + Number(plant.harvest_period);
  let per = 0;
  per = 100 * (plant.current_period / total_growing_days );
  if (plant.current_period > total_growing_days){
    per = 100;
  }
  
  let remaining_harvest_days = total_growing_days - Number(plant.current_period);
  let remain_state = `${remaining_harvest_days} days remaining until harvest time`;
  if(remaining_harvest_days <= 0) {
    remain_state = 'harvest complete';
  }
  // const width = `calc(${per}% + 8px)`;

  const handleClick = (event : any) => {
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
    if((width - mouseX) < 0) {
      setDistanceFromRight(0);
    } else if((width - mouseX) > 240) {
      setDistanceFromRight(mouseX);
    } else {
      if((mouseX - 240) < 0) {
        setDistanceFromRight(0);
      } else {
        setDistanceFromRight(mouseX-240);
      }
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

    if (cur_day <= day) {
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
      <div className='absolute w-full h-2.5 rounded-full bg-black/10' ></div>
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
          <div className="z-20 tooltip" style={{ right: '-5px'}} >{cur_day + "days"}</div>
          : 
          per == 100 ? 
          <div className="z-20 tooltip" style={{ right: '5px'}} >{cur_day + "days"}</div>
          :
          <div className="z-20 tooltip" style={{ right: '0%'}} >{cur_day + "days"}</div>
        }
        {/* {per>=0?<div className="absolute w-2.5 h-2.5 rounded-full border border-white bg-green right-0" />:<></>} */}
        
      </div>
      <span className='absolute block w-full text-green text-base -mt-14 left-0 truncate' >{growing_state}</span>
      <span className='absolute block w-full text-black text-xs -mt-7 left-0 truncate' >{remain_state}</span>
      {isModalOpen && imageData ? (
          <div>
            <div className="absolute z-20" style={{left: `${distanceFromRight}px`, marginTop: distanceFromBottom>200 ? "15px": "-181px"}}>
              <ImageSlider sliderImages={imageData} />
            </div>
            <div className="fixed inset-0 z-0" onClick={closeSlider}></div>
          </div>
        ) : <></>}
        <div className='absolute w-full h-2.5 rounded-full bg-transparent' onMouseMove={handleClick} onMouseLeave={handleMouseLeave} ></div>
    </div>
  );
}


interface PlantCanvasProps {
  plant: Plant;
}

const PlantCanvas1: React.FC<PlantCanvasProps> = ({ plant }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Ensure ctx is not null before performing canvas operations
      if (ctx) {
        // Calculate the canvas width based on the parent div width
        const parentDiv = canvas.parentElement;
        if (parentDiv) {
          canvas.width = parentDiv.clientWidth;
          canvas.height = parentDiv.clientHeight;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Set text properties
        ctx.textBaseline = 'middle';

        // Draw text in the middle of the canvas width
        const offset_x = 0;
        const draw_width = canvas.width - offset_x * 2;
        
        ctx.fillStyle = 'green';
        ctx.font = '0.8rem Arial';
        ctx.textAlign = 'left';
        if(Number(plant.current_period)<=Number(plant.clone_rooting_period)) {
          ctx.fillText(`Cloning & Rooting`, offset_x, (canvas.height / 4) - (canvas.height / 8));
        }else if(Number(plant.current_period) <= (Number(plant.clone_rooting_period) + Number(plant.vegetation_mass_period))) {
          ctx.fillText(`Vegetation & Mass Gain`, offset_x, (canvas.height / 4) - (canvas.height / 8));
        }else if(Number(plant.current_period) <= (Number(plant.clone_rooting_period) + Number(plant.vegetation_mass_period) + Number(plant.flowering_preharvest_period))) {
          ctx.fillText(`Flowering & Preharvest`, offset_x, (canvas.height / 4) - (canvas.height / 8));
        }else if(Number(plant.current_period) < (Number(plant.clone_rooting_period) + Number(plant.vegetation_mass_period) + Number(plant.flowering_preharvest_period) + Number(plant.harvest_period))) {
          ctx.fillText(`Harvest`, offset_x, (canvas.height / 4) - (canvas.height / 8));
        }else{
          ctx.fillText(`Harvest Complete`, offset_x, (canvas.height / 4) - (canvas.height / 8));
        }
        
        let total_growing_days = Number(plant.clone_rooting_period) + Number(plant.vegetation_mass_period) + Number(plant.flowering_preharvest_period) + Number(plant.harvest_period);
        let remaining_harvest_days = total_growing_days - Number(plant.current_period);
        
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.font = '0.6rem Arial';
        if(remaining_harvest_days <= 0) {
          ctx.fillText(`harvest complete`, offset_x, canvas.height / 2 - (canvas.height / 8));
        }else{
          ctx.fillText(`${remaining_harvest_days} days remaining until harvest time`, offset_x, canvas.height / 2 - (canvas.height / 8));
        }
        
        // Draw a rectangle
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        
        const rd_org_rect_posX = offset_x;
        const rd_org_rect_poxY = (canvas.height / 5 * 3) - (canvas.height / 16) - 1;
        const rd_org_rect_width = draw_width;
        const rd_org_rect_height = (canvas.height / 8) + 2;
        const org_radius = canvas.height / 16 + 1;

        ctx.beginPath();
        ctx.moveTo(rd_org_rect_posX + org_radius, rd_org_rect_poxY);
        ctx.lineTo(rd_org_rect_posX + rd_org_rect_width - org_radius, rd_org_rect_poxY);
        ctx.arcTo(rd_org_rect_posX + rd_org_rect_width, rd_org_rect_poxY, rd_org_rect_posX + rd_org_rect_width, rd_org_rect_poxY + org_radius, org_radius);
        ctx.lineTo(rd_org_rect_posX + rd_org_rect_width, rd_org_rect_poxY + rd_org_rect_height - org_radius);
        ctx.arcTo(rd_org_rect_posX + rd_org_rect_width, rd_org_rect_poxY + rd_org_rect_height, rd_org_rect_posX + rd_org_rect_width - org_radius, rd_org_rect_poxY + rd_org_rect_height, org_radius);
        ctx.lineTo(rd_org_rect_posX + org_radius, rd_org_rect_poxY + rd_org_rect_height);
        ctx.arcTo(rd_org_rect_posX, rd_org_rect_poxY + rd_org_rect_height, rd_org_rect_posX, rd_org_rect_poxY + rd_org_rect_height - org_radius, org_radius);
        ctx.lineTo(rd_org_rect_posX, rd_org_rect_poxY + org_radius);
        ctx.arcTo(rd_org_rect_posX, rd_org_rect_poxY, rd_org_rect_posX + org_radius, rd_org_rect_poxY, org_radius);
        ctx.closePath();
        ctx.fill();
                
        
        let rd_rect_posX = 0; //growing days X position
        //growing state
        let width = (draw_width - (canvas.height / 8) - 2) * Number(plant.current_period) / total_growing_days;
        if(width > (draw_width - (canvas.height / 8) - 1)) {
          width = draw_width - (canvas.height / 8) - 1;
        }

        var grd = ctx.createLinearGradient(1 + (canvas.height / 16) + offset_x, canvas.height / 5 * 3, width + 1 + (canvas.height / 16), canvas.height / 5 * 3);
        grd.addColorStop(0, 'rgba(5, 90, 33, 0.35)');
        grd.addColorStop(1, 'rgba(5, 90, 33, 1)');

        ctx.fillStyle = grd;
        
        const rd_progress_rect_posX = offset_x;
        const rd_progress_rect_poxY = (canvas.height / 5 * 3) - (canvas.height / 16) - 1;
        const rd_progress_rect_width = width + (canvas.height / 8) + 1;
        const rd_progress_rect_height = (canvas.height / 8) + 2;
        const progress_radius = canvas.height / 16 + 1;

        ctx.beginPath();
        ctx.moveTo(rd_progress_rect_posX + progress_radius, rd_progress_rect_poxY);
        ctx.lineTo(rd_progress_rect_posX + rd_progress_rect_width - progress_radius, rd_progress_rect_poxY);
        ctx.arcTo(rd_progress_rect_posX + rd_progress_rect_width, rd_progress_rect_poxY, rd_progress_rect_posX + rd_progress_rect_width, rd_progress_rect_poxY + progress_radius, progress_radius);
        ctx.lineTo(rd_progress_rect_posX + rd_progress_rect_width, rd_progress_rect_poxY + rd_progress_rect_height - progress_radius);
        ctx.arcTo(rd_progress_rect_posX + rd_progress_rect_width, rd_progress_rect_poxY + rd_progress_rect_height, rd_progress_rect_posX + rd_progress_rect_width - progress_radius, rd_progress_rect_poxY + rd_progress_rect_height, progress_radius);
        ctx.lineTo(rd_progress_rect_posX + progress_radius, rd_progress_rect_poxY + rd_progress_rect_height);
        ctx.arcTo(rd_progress_rect_posX, rd_progress_rect_poxY + rd_progress_rect_height, rd_progress_rect_posX, rd_progress_rect_poxY + rd_progress_rect_height - progress_radius, progress_radius);
        ctx.lineTo(rd_progress_rect_posX, rd_progress_rect_poxY + progress_radius);
        ctx.arcTo(rd_progress_rect_posX, rd_progress_rect_poxY, rd_progress_rect_posX + progress_radius, rd_progress_rect_poxY, progress_radius);
        ctx.closePath();
        ctx.fill();
        

        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'green';

        ctx.beginPath();
        ctx.arc(1 + (canvas.height / 16) + width + offset_x, canvas.height / 5 * 3, canvas.height / 16, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        rd_rect_posX = width + 1 + (canvas.height / 16) + offset_x;

        rd_rect_posX -= 30;
        if(rd_rect_posX <= 0){
          rd_rect_posX = 0;
        }
        else if(rd_rect_posX > (canvas.width - 60)){
          rd_rect_posX = (canvas.width - 60);
        }

        ctx.fillStyle = 'green';

        const rd_rect_poxY = canvas.height / 4 * 3;
        const rd_rect_width = 60;
        const rd_rect_height = canvas.height / 4;
        const radius = canvas.height / 10;
    
        ctx.strokeStyle = 'transparent';
        //draw round rect
        ctx.beginPath();
        ctx.moveTo(rd_rect_posX + radius, rd_rect_poxY);
        ctx.lineTo(rd_rect_posX + rd_rect_width - radius, rd_rect_poxY);
        ctx.arcTo(rd_rect_posX + rd_rect_width, rd_rect_poxY, rd_rect_posX + rd_rect_width, rd_rect_poxY + radius, radius);
        ctx.lineTo(rd_rect_posX + rd_rect_width, rd_rect_poxY + rd_rect_height - radius);
        ctx.arcTo(rd_rect_posX + rd_rect_width, rd_rect_poxY + rd_rect_height, rd_rect_posX + rd_rect_width - radius, rd_rect_poxY + rd_rect_height, radius);
        ctx.lineTo(rd_rect_posX + radius, rd_rect_poxY + rd_rect_height);
        ctx.arcTo(rd_rect_posX, rd_rect_poxY + rd_rect_height, rd_rect_posX, rd_rect_poxY + rd_rect_height - radius, radius);
        ctx.lineTo(rd_rect_posX, rd_rect_poxY + radius);
        ctx.arcTo(rd_rect_posX, rd_rect_poxY, rd_rect_posX + radius, rd_rect_poxY, radius);
        ctx.closePath();
    
        ctx.fill();

        //draw trianglectx.beginPath();

        ctx.moveTo(rd_rect_posX + 30, canvas.height / 16 * 11);
        ctx.lineTo(rd_rect_posX + 30 - canvas.height / 15, canvas.height / 16 * 11 + canvas.height / 10);
        ctx.lineTo(rd_rect_posX + 30 + canvas.height / 15, canvas.height / 16 * 11 + canvas.height / 10);
        ctx.lineTo(rd_rect_posX + 30, canvas.height / 16 * 11);
        ctx.closePath();
    
        ctx.fill();

        //draw day count text
        ctx.fillStyle = 'white';
        ctx.font = '0.6rem Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${plant.current_period} days`, rd_rect_posX + 30, rd_rect_poxY + canvas.height / 8);

      }
    }
  }, [plant]);

  return <canvas ref={canvasRef} className="canvas-plant-grow"></canvas>;
};

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
              <img src={image} alt='travel image' className='w-60 object-cover rounded' />
            )}
          </div>
        );
      })}
    </section>
  );
}

export default PlantCardMobile;