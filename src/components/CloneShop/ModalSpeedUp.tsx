import React, { useState, useEffect, useContext } from "react";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import { NavLink } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import botanicare from "assets/cloneshop/botanicare.png";
import rhizo from "assets/cloneshop/rhizo.png";
import silica from "assets/cloneshop/silica.png";
import { Scrollbars } from "rc-scrollbars";
import { FaChevronLeft } from "react-icons/fa";
import { useMobileContext } from "../../context/MobileContext";
import { Item } from "context/PlantContext";

interface ModalSpeedUpProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: (itemPrice: number) => void;
  onBack: () => void;
  cartItem: Item;
  priceSum: number;
  isLoading: boolean;
}

interface ButtonWithSpinnerProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isLoading,
  onClick,
  children,
}) => {
  return (
    <button
      disabled={isLoading}
      className={`purchase absolute w-full bottom-0 right-0 left-0 text-center bg-green !bg-green py-4 cursor-pointer hover:bg-green/80 text-white align-center`}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <FaSpinner className="spinner m-auto text-2xl" />
        </>
      ) : (
        children
      )}
    </button>
  );
};

// function ModalSpeedUp({ isOpen, onClose, cartList }: ModalProps) {
const ModalSpeedUp: React.FC<ModalSpeedUpProps> = (props) => {
  const { isOpen, onClose, onBuy, onBack, cartItem, priceSum, isLoading } =
    props;
  if (!isOpen) return null;

  const isTablet = useTabletContext();
  const isMobile = useMobileContext();
  const { user, setUser } = useContext(MyAuthContext);
  const [selBotanicare, setSelBotanicare] = useState(user.methodBotani);
  const [selRhizo, setSelRhizo] = useState(user.methodRhizo);
  const [selSilica, setSelSilica] = useState(user.methodSilica);
  var initialReduceDays = 0;
  if (user.methodBotani) {
    initialReduceDays += user.botaniProfit;
  }
  if (user.methodSilica) {
    initialReduceDays += user.silicaProfit;
  }
  var _totalPrice =
    0 +
    (user.methodBotani ? user.botaniPrice : 0) +
    (user.methodRhizo ? user.rhizoPrice : 0) +
    (user.methodSilica ? user.silicaPrice : 0);
  const [totalPrice, setTotalPrice] = useState(_totalPrice);
  const [reduceDays, setReduceDays] = useState(initialReduceDays);

  const [insufficientBalance, setInsufficientBalance] = useState(false);

  // console.log(cartItem);

  const onMethodBotani = () => {
    setUser((prevUser: typeof MyAuthContext) => ({
      ...prevUser,
      methodBotani: !user.methodBotani,
    }));
  };

  const onMethodRhizo = () => {
    setUser((prevUser: typeof MyAuthContext) => ({
      ...prevUser,
      methodRhizo: !user.methodRhizo,
    }));
  };
  const onMethodSilica = () => {
    setUser((prevUser: typeof MyAuthContext) => ({
      ...prevUser,
      methodSilica: !user.methodSilica,
    }));
  };

  const onBotanicare = () => {
    if (!selBotanicare) {
      setTotalPrice(totalPrice + user.botaniPrice);
      setReduceDays(reduceDays + user.botaniProfit);
    } else {
      setTotalPrice(totalPrice - user.botaniPrice);
      setReduceDays(reduceDays - user.botaniProfit);

      if (totalPrice - user.botaniPrice <= user.pga_balance) {
        setInsufficientBalance(false);
      }
    }
    setSelBotanicare(!selBotanicare);
    onMethodBotani();
  };

  const onRhizo = () => {
    if (!selRhizo) {
      setTotalPrice(totalPrice + user.rhizoPrice);
    } else {
      setTotalPrice(totalPrice - user.rhizoPrice);

      if (totalPrice - user.rhizoPrice <= user.pga_balance) {
        setInsufficientBalance(false);
      }
    }
    setSelRhizo(!selRhizo);
    onMethodRhizo();
  };

  const onSilica = () => {
    if (!selSilica) {
      setTotalPrice(totalPrice + user.silicaPrice);
      setReduceDays(reduceDays + user.silicaProfit);
    } else {
      setTotalPrice(totalPrice - user.silicaPrice);
      setReduceDays(reduceDays - user.silicaProfit);

      if (totalPrice - user.silicaPrice <= user.pga_balance) {
        setInsufficientBalance(false);
      }
    }
    setSelSilica(!selSilica);
    onMethodSilica();
  };

  const calculateHarvestPeriod = (item: Item): string => {
    const harvestPeriod =
      item.clone_rooting_period +
      item.vegetation_mass_period +
      item.flowering_preharvest_period +
      item.harvest_period +
      item.curing_period +
      item.drying_period +
      item.packing_period;
    return harvestPeriod.toString();
  };

  const handleAddCart = () => {
    if (totalPrice > user.pga_balance) {
      setInsufficientBalance(true);
      return;
    }
    setInsufficientBalance(false);
    setSelBotanicare(false);
    setSelRhizo(false);
    setSelSilica(false);
    setReduceDays(0);
    setTotalPrice(0);
    onBuy(totalPrice);
  };

  const handleClose = () => {
    setInsufficientBalance(false);
    setSelBotanicare(false);
    setSelRhizo(false);
    setSelSilica(false);
    setReduceDays(0);
    setTotalPrice(0);
    onClose();
    // setBuyQuantity(0);
  };

  const getMaxQuantity = (org_amount: number, use_amount: number) => {
    const remain_amount = org_amount - use_amount;
    return remain_amount < 0 ? 0 : remain_amount;
  };

  // const handleSliderRelease = () => {
  //   // Handle the release event
  //   // alert('Slider released');
  // };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none">
        <Scrollbars className="" style={{ width: "100%", height: "100vh" }}>
          <div className="relative flex items-center h-fit min-h-screen w-auto py-6 mx-auto max-w-3xl">
            <div
              className={`${
                isMobile ? "modal-buy" : "modal-buy-tablet"
              } animation-fade-in mx-auto border-0 rounded-lg shadow-lg relative flex flex-col bg-[#041D04] text-white outline-none focus:outline-none px-8 py-7 z-40`}
            >
              <button
                className="bg-transparent border-0 leading-none font-semibold outline-none focus:outline-none absolute top-7 right-7 z-50"
                onClick={handleClose}
              >
                <MdClose className="bg-transparent text-white h-6 w-6 text-2xl font-bold block outline-none focus:outline-none" />
              </button>
              <button
                className="bg-transparent border-0 leading-none font-semibold outline-none focus:outline-none absolute top-7 left-7 z-50"
                onClick={onBack}
              >
                <FaChevronLeft className="bg-transparent text-white h-6 w-6 block outline-none focus:outline-none" />
              </button>

              {/*body*/}
              <div>
                <div>
                  <div className="pt-8">
                    <label className="block pb-1 text-xl font-bold">
                      Select Grow Method
                    </label>
                    <p className="">
                      The more method you choose, your plan will be harvested
                      quicker.
                    </p>
                  </div>
                  <div className="pt-4">
                    <div
                      className={`${
                        selSilica
                          ? "border-green bg-green/10"
                          : "border-black/10"
                      } flex items-center cursor-pointer border border-gray p-3`}
                      onClick={onSilica}
                    >
                      <img src={silica} className="w-10" />
                      <div className="pl-3">
                        <label className="font-bold">Silica Blast</label>
                        <p>Regulating photosynthesis and transpiration.</p>
                      </div>
                    </div>
                    <div
                      className={`${
                        selBotanicare
                          ? "border-green bg-green/10"
                          : "border-black/10"
                      } flex items-center cursor-pointer mt-3 border border-gray p-3 `}
                      onClick={onBotanicare}
                    >
                      <img src={botanicare} className="w-10" />
                      <div className="pl-3">
                        <label className="font-bold">
                          Botanicare Hydroguard
                        </label>
                        <p>Convert organic matter into nutrients.</p>
                      </div>
                    </div>
                    <div
                      className={`${
                        selRhizo
                          ? "border-green bg-green/10"
                          : "border-black/10"
                      } flex items-center cursor-pointer mt-3 border border-gray p-3`}
                      onClick={onRhizo}
                    >
                      <img src={rhizo} className="w-10" />
                      <div className="pl-3">
                        <label className="font-bold">Rhizo Blast</label>
                        <p>Encourages root, foliage, and flower development.</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 mb-14">
                    <label className="font-bold">Harvested Period</label>
                    <div className="flex mt-2 px-5 py-2 bg-green/10">
                      <div className="w-1/2 text-left">
                        {calculateHarvestPeriod(cartItem)} days
                      </div>
                      <div className="w-1/2 text-right text-green">
                        {reduceDays} days
                      </div>
                    </div>
                    <div className="mt-3 py-3 px-5 bg-black/10">
                      <label className="block font-bold pb-1">
                        Payment Summary
                      </label>
                      {selBotanicare ? (
                        <div className="flex">
                          <div className="w-5/6">Botanicare Hydroguard</div>
                          <div className="w-1/6 text-right">
                            {user.botaniPrice} PGA
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {selRhizo ? (
                        <div className="flex">
                          <div className="w-5/6">Rhizo Blast</div>
                          <div className="w-1/6 text-right">
                            {user.rhizoPrice} PGA
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {selSilica ? (
                        <div className="flex">
                          <div className="w-5/6">Silica Blast</div>
                          <div className="w-1/6 text-right">
                            {user.silicaPrice} PGA
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="flex pt-1 font-bold">
                        <div className="w-5/6">Total payment</div>
                        <div className="w-1/6 text-right">{totalPrice}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*<div className="absolute bottom-0 left-0 w-full px-8 py-4 mb-12" style={{ boxShadow: "0px -2px 6px 0px rgba(0, 0, 0, 0.3)" }}>
                <div className="flex font-bold">
                  <div className="w-2/3">PGA Token</div>
                  <div className="w-1/3 text-right pr-4">{totalPrice}</div>
                </div>
                {
                  insufficientBalance ? (
                    <label className="text-sm" style={{ color: '#f00' }}>insufficient balance</label>
                  ) : (
                    <label>Balance: PGA {user.pga_balance}</label>
                  )
                }
              </div>*/}
                {insufficientBalance ? (
                  <NavLink
                    to="/deposit"
                    className="purchase absolute bottom-0 right-0 left-0 text-center bg-green !bg-green py-4 cursor-pointer hover:bg-green/80 text-white align-center"
                  >
                    Top up token
                  </NavLink>
                ) : (
                  <ButtonWithSpinner
                    isLoading={isLoading}
                    onClick={handleAddCart}
                  >
                    Add to cart
                  </ButtonWithSpinner>
                )}
              </div>
            </div>
            <div
              className="opacity-50 fixed inset-0 z-30 bg-black"
              onClick={handleClose}
            ></div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default ModalSpeedUp;
