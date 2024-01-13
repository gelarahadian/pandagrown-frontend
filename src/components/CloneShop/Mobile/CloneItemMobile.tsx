import React from "react";
import plantImage from "assets/images/plant1.png";
import { Item } from "context/PlantContext";

interface CloneItemMobileProps {
  cards: Item[];
  onSelect: (id: number) => void;
}

const CloneItemMobile: React.FC<CloneItemMobileProps> = (props) => {
  const { cards, onSelect } = props;

  const handleSelectItem = (id: number) => {
    return onSelect(id);
  };

  const formatPrice = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  return (
    <ul className="grid grid-cols-1 gap-4 my-1 list-none ">
      {cards.map((item, index) => (
        <li
          className="relative w-full clone-item bg-white rounded-5 w-full border border-white"
          key={index}
        >
          <section>
            <div className="pt-6 px-8 flex w-full items-center">
              <div className="w-3/5 text-left">
                <label className="text-xl font-bold block truncate">
                  {item.name}
                </label>
                <label className="block text-black-half text-xs truncate">
                  Available stock: {formatPrice(item.stock, 1)}
                </label>
              </div>
              <div className="w-2/5 text-right">
                <label className="block text-xl font-bold text-green">
                  USD&nbsp;{item.buy_price}
                </label>
                <label className="block text-black-half text-xs truncate">
                  Seed Price (gr)
                </label>
              </div>
            </div>
            <div className="flex mt-5 w-full items-end">
              <div className="w-2/3 left-0 bottom-0 img-plant">
                <img
                  className="object-cover w-11/12 rounded-bl"
                  src={item.image}
                />
              </div>
              <div className="w-1/3 text-right pr-10 mb-8">
                <button
                  className="bg-green text-white text-base font-bold py-1 px-3 rounded-5"
                  onClick={() => handleSelectItem(item.id)}
                >
                  Buy
                </button>
              </div>
            </div>
          </section>
        </li>
      ))}
    </ul>
  );
};

export default CloneItemMobile;
