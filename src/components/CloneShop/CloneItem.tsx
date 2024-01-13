import React from "react";
import plantImage from "assets/images/plant1.png";
import { Item, CartItemInfo } from "pages/Dashboard/manage/CloneShop";

interface CloneItemProps {
  cards: Item[];
  cartItems: CartItemInfo[];
  column?: boolean;
  onSelect: (id: number) => void;
}

const CloneItem: React.FC<CloneItemProps> = (props) => {
  const { cards, cartItems, column, onSelect } = props;

  const handleSelectItem = (id: number) => {
    return onSelect(id);
  };

  const formatPrice = (price: string, fixed_count: number): string => {
    let formattedPrice = parseFloat(price).toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  const checkInCart = (id: number) => {
    const cart = cartItems.find((cart) => cart.seed_id === id);

    if (cart) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <ul
      className={`grid ${
        column ? "grid-cols-1" : "grid-cols-2"
      }  gap-5 mb-6 list-none `}
    >
      {cards.map((item, index) => (
        <li
          className={`${
            checkInCart(item.id) ? "border-4 border-green" : "border-none"
          } relative w-full clone-item bg-white rounded-5 `}
          key={index}
        >
          <section>
            <div className="pt-6 pl-8 pr-10 flex w-full items-center">
              <div className="w-3/5 text-left">
                <label className="text-xl font-bold block">{item.name}</label>
                <label className="text-black-half text-xs">
                  Available stock: {formatPrice(item.stock.toString(), 1)}
                </label>
              </div>
              <div className="w-2/5 text-right">
                <label className="block text-xl font-bold text-green">
                  USD&nbsp;{item.buy_price}
                </label>
                <label className="text-black-half text-xs">
                  Seed Price (gr)
                </label>
              </div>
            </div>
            <div className="flex mt-5 w-full items-end">
              <div className="w-2/3 left-0 bottom-0 img-plant ">
                <img
                  className="rounded-bl object-cover w-11/12 "
                  src={item.image}
                />
              </div>
              <div className="w-1/3 text-right pr-10 mb-8">
                <button
                  className="bg-green text-white text-lg font-bold py-2 px-8 rounded-5"
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

export default CloneItem;
