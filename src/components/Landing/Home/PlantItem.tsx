import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { formatNumber } from "utils/common";
import { useMobileContext } from "context/MobileContext";
import { config } from "config";

export type Plant = {
  id: number;
  name: string;
  buy_price: number;
  stock: number;
  cover_img: string;
};

interface Props {
  plant: Plant;
  onHoverImage: (url: string) => void;
  onOutImage: () => void;
}

const PlantItem = ({ plant, onHoverImage, onOutImage }: Props) => {
  const isMobile = useMobileContext();

  if (isMobile) {
    return (
      <Container className="!mx-auto space-y-2">
        <div className="flex justify-between items-center">
          <div className="relative w-[75px] h-[75px] overflow-hidden rounded-full">
            <img src={plant.cover_img} className="object-cover w-full h-full" />
          </div>
          <div>
            <label className="green">USD {formatNumber(plant.buy_price)}</label>
            <span className="pt-1">Seed Price (gr)</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <label className="truncate">{plant.name}</label>
            <span>Available stocks: {formatNumber(plant.stock)}</span>
          </div>
          <div style={{ marginTop: "auto", textAlign: "right" }}>
            <Link to="/signup">Buy</Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="!mx-auto space-y-2">
      <div className="flex justify-between items-center">
        <div className="relative w-[75px] h-[75px] overflow-hidden rounded-full">
          <img src={plant.cover_img} className="object-cover w-full h-full" />
        </div>
        <div>
          <label className="green">USD {formatNumber(plant.buy_price)}</label>
          <span className="pt-1">Seed Price (gr)</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <label className="truncate">{plant.name}</label>
          <span>Available stocks: {formatNumber(plant.stock)}</span>
        </div>
        <div style={{ marginTop: "auto", textAlign: "right" }}>
          <Link to="/signup">Buy</Link>
        </div>
      </div>
    </Container>
  );
};

export default PlantItem;

const Container = styled.div`
  background: white;
  color: black;
  border-radius: 5px;
  margin: 5px;
  box-shadow: 1px 0px 8px 2px rgba(0, 0, 0, 0.1);

  @media (min-width: 593px) {
    padding: 27px 34px;
    width: 376px;
    margin-right: 20px;
    position: relative;

    &:last-child {
      margin-right: 0;
    }

    label {
      // line-height: 15px;
    }
  }

  @media (min-width: 900px) and (max-width: 1100px) {
    width: 300px;
  }

  @media (max-width: 592px) {
    padding: 25px 30px 30px 29px;
    height: 225px;
    width: 315px;
    margin-bottom: 26px;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }
  }

  img.img-desk {
    height: 79px;
    width: 79px;
    border-radius: 50%;
    margin-bottom: 10px;

    @media (max-width: 592px) {
      display: none;
    }
  }

  img.img-mobile {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 235px;
    height: 135px;
    object-fit: cover;

    @media (min-width: 900px) {
      /*display: none;*/
    }
  }

  label {
    font-size: 20px;
    font-weight: 700;
    display: block;

    &.green {
      color: #059033;
      line-height: 1.5;
    }
  }

  span {
    font-size: 12px;
  }

  .div-buy {
    @media (min-width: 593px) {
      margin-top: 6px;
      margin-bottom: 4px;
    }
  }

  a {
    padding: 5px 15px;
    background: #059033;
    border-radius: 5px;
    margin-top: auto;
    color: white;
    font-weight: 700;
    position: relative;
    z-index: 1;
  }

  a:hover {
    background: #036a25;
  }
`;
