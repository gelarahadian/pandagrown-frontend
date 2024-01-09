import { useState, useEffect, useContext, useRef } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import ModalDepositConfirm from "components/Deposit/ModalDepositConfirm";
import ModalDepositCancel from "components/Deposit/ModalDepositCancel";
import SidebarWallet from "components/Layout/SidebarWallet";
import DepositCancelMobile from "components/Deposit/mobile/DepositCancelMobile";
import DepositConfirmMobile from "components/Deposit/mobile/DepositConfirmMobile";
import { MdErrorOutline } from "react-icons/md";
import panda from 'assets/icons/pandami.svg';
import { toast } from 'react-toastify';
import coinbase from 'assets/icons/Coinbase.svg';
import api from "utils/api";
import { FaSpinner } from "react-icons/fa";
import Select from 'react-select'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import 'styles/deposit.scss'
import "react-toastify/dist/ReactToastify.css";
import '@rainbow-me/rainbowkit/styles.css'
import { useContractRead, useContractWrite, useAccount } from "wagmi";
import { PGA_ABI } from "utils/abi";
import Bignumber, { BigNumber } from "bignumber.js"
import { useNetwork } from 'wagmi'
import {Scrollbars} from "rc-scrollbars";

function Deposit() {
    const { platform, status, amount } = useParams();
    const isMobile = useMobileContext();
    const isTablet = useTabletContext();
    const { user, setUser } = useContext(MyAuthContext);
    const [fundAmount, setFundAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PANDAGROWN');
    const [fundUnit, setFundUnit] = useState('PGA');
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showDepositCancelModal, setShowDepositCancelModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const [letterWidth, setLetterWidth] = useState(0);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();
    const {address} = useAccount();
    const { chain, chains } = useNetwork();

  const { data: decimals } = useContractRead(
    {
      address: '0xf0068a3657526Bc7f824B55575714ebFFe9ca67e',
      abi: PGA_ABI,
      functionName: "decimals",
    }
  );

  const getWei = () => {
    const decimal = decimals as number;
    const bigAmount = new BigNumber(fundAmount);
    const big_decimal = new Bignumber(10).pow(decimal);
    const wei = bigAmount.times(big_decimal);
    return wei;
  }

  const { data: approveResult, write: approveAction } = useContractWrite(
    {
      address: '0xf0068a3657526Bc7f824B55575714ebFFe9ca67e',
      abi: PGA_ABI,
      functionName: "approve",
      args:['0xAA4b0B7C750174E2563FB30cD1Ff5c53B803cca9', getWei()],
        onError(error) {
            console.log('Error', error);
            setIsLoading(false);
        },
        onSettled(data, error) {
            console.log('Settled', { data, error })
            setIsLoading(false);
        },
    }
  )

  const { data: transferResult, write: transferAction } = useContractWrite(
    {
      address: '0xf0068a3657526Bc7f824B55575714ebFFe9ca67e',
      abi: PGA_ABI,
      functionName: "transfer",
      args:['0xAA4b0B7C750174E2563FB30cD1Ff5c53B803cca9', getWei()],
        onError(error) {
            console.log('Error', error);
            setIsLoading(false);
        },
        onSettled(data, error) {
            console.log('Settled', { data, error })
            setIsLoading(false);
        },
    }
  )

  useEffect(() => {
    console.log("approve result:");
    console.log(approveResult);
    console.log(chain);
    if(approveResult){
      transferAction();
    }
    
  }, [approveResult]);

  useEffect(() => {
    console.log("transfer result:");
    console.log(transferResult);
    console.log(chain);
    if (transferResult) {
        const tx_url = chain?.id == 56 ? 'https://bscscan.com/tx/' : (chain?.id == 1 ? 'https://etherscan.io/tx/' : '');
        api.post(`payment/${user.user_id}/deposit/pandami/`, {
            address: address,
            coin_amount: fundAmount,
            tx_hash: tx_url + transferResult.hash
        })
            .then((res: any) => {
                const data = res.data;
                console.log("request");
                console.log(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }
  }, [transferResult]);

  const options = [
    { value: 'PANDAGROWN', label: <div className="flex w-full items-center justify-center"><img src={panda} className="h-8 pr-3" alt="Coinbase" /><div className="truncate"><label className="block text-sm truncate">PANDAGROWN TOKEN</label></div></div> },
    { value: 'Coinbase', label: <div className="flex w-full items-center justify-center"><img src={coinbase} className="h-8 pr-2" alt="Coinbase" /><div className="truncate"><label className="block text-sm truncate">Coinbase Commerce Pay</label></div></div> }
  ];

    useEffect(() => {
        if (!platform || !status || !amount) {
            if (platform && status && status === 'cancel') {
                setShowDepositCancelModal(true);
            }
        } else {
            if (status === "success") {
                setShowDepositModal(true);

                api.get(`user/${user.user_id}/profile/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(res => {
                    const data = res.data[0];
                    if (res.data) {
                        localStorage.setItem('balance', data.balance); // set token -> this means logged in
                        setUser((prevUser: typeof MyAuthContext) => ({
                            ...prevUser,
                            balance: data.balance,
                        }));
                    }
                    // notice
                    console.log('get profile data', data);
                }).catch(err => {
                    console.log('get profile data error', err);
                });
            }
        }

        if (inputRef.current) {
            const span = document.createElement('span');
            span.textContent = 'a';
            span.style.position = 'absolute';
            span.style.visibility = 'hidden';
            document.body.appendChild(span);
            const letterWidth = span.offsetWidth;
            document.body.removeChild(span);
            setLetterWidth(letterWidth);
        }
    }, []);

    useEffect(() => {
        updatePrefixPosition();
    }, [fundAmount]);

    const updatePrefixPosition = () => {
        if (inputRef.current) {
            const inputWidth = fundAmount.length * (letterWidth - 1);
            inputRef.current.style.paddingRight = inputWidth + "px";
        }
    };

    const formatNumber = (price: string, fixed_count: number): number => {
        let formattedPrice = Number(price).toFixed(fixed_count);
        const parsedPrice = Number.parseFloat(formattedPrice);
        return parsedPrice;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get the input value from the event
        const inputValue = event.target.value;

        setFundAmount(event.target.value);
        // Convert the input value to a number
        const parsedValue = parseFloat(inputValue);

        // Get the maximum allowed value (replace 1000 with your desired maximum value)
        const minValue = 0;
        const maxValue = 99999999999999;

        // Check if the parsedValue is a valid number
        if (!isNaN(parsedValue)) {
            // If the parsedValue exceeds the maximum value, set it to the maximum value
            const valueToSet = parsedValue > maxValue ? maxValue : parsedValue;

            // Update the state with the value
            setFundAmount(valueToSet.toString());
            if(parsedValue > 0) {
                setIsDisabled(false);
            }
        } else {
            // If the parsedValue is not a valid number (e.g., empty input or invalid characters), update the state with the original input value
            setFundAmount(inputValue);
            setIsDisabled(true);
        }
    };

    const handleConfirm = () => {
        if( paymentMethod == "PANDAGROWN" ) {
            setIsLoading(true);
            transferAction();
        }else {
            setIsLoading(true);
            api.get(`payment/${user.user_id}/deposit/coinbase/?amount=` + fundAmount, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res: any) => {
                    const data = res.data;
                    if (data.type === "success") {
                        window.open(data.url, '_blank');
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setIsLoading(false);
                });
        }
    }

    const onCloseDeposit = () => {
        setShowDepositModal(false);
        navigate('/deposit');
    }

    const onCloseDepositCancel = () => {
        setShowDepositCancelModal(false);
    }

    const selAmount = (amount: string) => {
        setFundAmount(amount);
        setIsDisabled(false);
    }

    const handleSelectPayMethod = (selectOption: any) => {
        // alert(selectOption.value);
        setPaymentMethod(selectOption.value);
        if(selectOption.value == 'PANDAGROWN') {
            setFundUnit("PGA");
        }
    }

    const handleChangePayMathod = (method: string) => {
        setPaymentMethod(method);
        if(method == 'PANDAGROWN') {
            setFundUnit("PGA");
        } else {

        }
    }

    if (isMobile) {
        return (
            <>
                { showDepositModal ? (
                    <DepositConfirmMobile isOpen={showDepositModal} onClose={onCloseDeposit} />
                ) : ( showDepositCancelModal ? (
                    <DepositCancelMobile isOpen={showDepositCancelModal} onClose={onCloseDepositCancel} />
                ) : (
                    <div className="pt-2 pb-4 px-4">
                        <div className="w-full bg-white rounded">
                            <div className="flex justify-between w-full py-3 px-5 border-b border-black/10">
                                <label className="text-base font-bold">Deposit Fund</label>
                                <ConnectButton />
                            </div>
                            <div className="w-full py-3 px-5">
                                <div className="pt-1 pb-2">
                                    <label className="text-base font-bold">Amount</label>
                                    <div className="w-full relative text-base pt-2">
                                        <span className="absolute left-3 flex items-center justify-center" style={{ height: "52px" }} >{ (paymentMethod === 'PANDAGROWN') ? 'PGA' : '$'}</span>
                                        <input
                                            type="number"
                                            value={fundAmount}
                                            className="text-left pl-7"
                                            style={{ height: "52px", paddingLeft: "3rem" }}
                                            onChange={handleInputChange}
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div className="w-full pt-4 pb-2">
                                    <div className="pb-7 mb-5 border-b border-black/10">
                                        <div className="">
                                            <label className="text-base font-bold">Payment Method</label>
                                        </div>
                                        <div className="">
                                            <Select
                                                className="mt-1 bg-black rounded"
                                                defaultValue={options[0]}
                                                options={options}
                                                isSearchable={false}
                                                onChange={handleSelectPayMethod}
                                            />
                                        </div>
                                    </div>
                                    {
                                        (paymentMethod === 'PANDAGROWN') ? (
                                            <div className="py-3">
                                                <div className="w-full flex font-bold">
                                                    <div className="w-3/4 text-left">
                                                        <label>{paymentMethod} amount to pay</label>
                                                    </div>
                                                    <div className="w-1/4 text-right pr-2">
                                                        <label>{fundAmount} {fundUnit}</label>
                                                    </div>
                                                </div>
                                                <div className="pt-3">
                                                    <p className="text-sm">You will get a 10% bonus if using PGA TOKEN. Don't have a PGA TOKEN?
                                                        <Link to={'https://app.pandagrownswap.io'} className="text-blue-600 pl-2 underline" target={'_blank'}>Click here to buy.</Link></p>
                                                </div>
                                            </div>
                                        ) : (
                                            <></>
                                        )
                                    }
                                    <ButtonWithSpinner isDisabled={isDisabled} isLoading={isLoading} onConfirm={handleConfirm} >Confirm and pay</ButtonWithSpinner>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
                }
            </>
        );
    }

    return (
        <>
            { isTablet ? (
                <></>
            ) : (
                <SidebarWallet />
            )}
            <div  className={`${isTablet? '!ml-0' : ''} page-content relative pb-8`} >
                <div className="w-full pt-12">
                    <label className="text-4xl font-bold">Deposit</label>
                    <div className="w-full mt-8 pt-2 bg-white rounded">
                        <div className="flex justify-between border-b border-black/10 px-7 py-2">
                            <label className="text-xl font-bold">Deposit Fund</label>
                            <ConnectButton />
                        </div>

                        <Scrollbars className="" style={{ width: '100%', height: 'calc(100vh - 269px)' }}>
                            <div className="py-7 pl-6 pr-9 border-b border-black/10">
                                <div className="flex w-full">
                                    <div className="w-1/3 pr-10">
                                        <label className="block font-bold mb-2">Amount</label>
                                        <label>Select the amount of fund <br />you want to add. (USD)</label>
                                    </div>
                                    <div className="w-2/3">
                                        <div className="relative w-full mb-2">
                                            <div
                                                ref={inputRef}
                                                className="absolute top-3 right-12 text-base font-bold "
                                                style={{
                                                    pointerEvents: "none",
                                                    paddingTop: "1px",
                                                }}
                                            >
                                                { (paymentMethod === 'PANDAGROWN') ? 'PGA' : '$'}
                                            </div>
                                            <input
                                                type="number"
                                                className="w-full h-12 py-1 pr-6 rounded-md shadow-sm text-base text-right font-bold"
                                                value={fundAmount}
                                                onChange={handleInputChange}
                                                min={0}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="w-full">
                                            <ul className="grid grid-cols-4 gap-3 list-none">
                                                <li>
                                                    <button
                                                        className="w-full bg-gradient-to-b from-gray/10 to-gray/60 text-base font-bold items-center py-3 px-4 rounded text-center border border-black/10 hover:from-gray/40 hover:to-gray hover:border-black/20"
                                                        onClick={() => selAmount('100')}
                                                    >
                                                        { (paymentMethod === 'PANDAGROWN') ? 'PGA' : '$'} 100
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="w-full bg-gradient-to-b from-gray/10 to-gray/60 text-base font-bold items-center py-3 px-4 rounded text-center border border-black/10 hover:from-gray/40 hover:to-gray hover:border-black/20"
                                                        onClick={() => selAmount('1000')}
                                                    >
                                                        { (paymentMethod === 'PANDAGROWN') ? 'PGA' : '$'} 1000
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="w-full bg-gradient-to-b from-gray/10 to-gray/60 text-base font-bold items-center py-3 px-4 rounded text-center border border-black/10 hover:from-gray/40 hover:to-gray hover:border-black/20"
                                                        onClick={() => selAmount('5000')}
                                                    >
                                                        { (paymentMethod === 'PANDAGROWN') ? 'PGA' : '$'} 5000
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="w-full bg-gradient-to-b from-gray/10 to-gray/60 text-base font-bold items-center py-3 px-4 rounded text-center border border-black/10 hover:from-gray/40 hover:to-gray hover:border-black/20"
                                                        onClick={() => selAmount('10000')}
                                                    >
                                                        { (paymentMethod === 'PANDAGROWN') ? 'PGA' : '$'} 10000
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-full mt-12 pb-6">
                                    <div className="w-1/3 pr-10 ">
                                        <label className="block font-bold mb-2">Payment Method</label>
                                        <label>Please select one of the following methods</label>
                                    </div>
                                    <div className="w-2/3">
                                        <ul className="grid grid-cols-2 gap-3 list-none">
                                            <li>
                                                <button
                                                    className={`${paymentMethod === 'PANDAGROWN' ? 'bg-green/10 border-green/50 ' : 'bg-gradient-to-b from-gray/10 to-gray/60 border-black/10 hover:from-gray/30 hover:to-gray/80 hover:border-black/20'
                                                    } w-full flex justify-center text-base font-bold items-center py-5 px-4 rounded text-center border`}
                                                    onClick={() => setPaymentMethod('PANDAGROWN')}
                                                >
                                                    <img src={panda} className="h-12 pr-3" alt="Panda" />
                                                    PANDAGROWN TOKEN
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className={`${paymentMethod === 'Coinbase' ? 'bg-green/10 border-green/50 ' : 'bg-gradient-to-b from-gray/10 to-gray/60 border-black/10 hover:from-gray/30 hover:to-gray/80 hover:border-black/20'
                                                    } w-full flex justify-center text-base font-bold items-center py-5 px-4 rounded text-center border`}
                                                    onClick={() => setPaymentMethod('Coinbase')}
                                                >
                                                    <img src={coinbase} className="h-12 pr-3" alt="Coinbase" />
                                                    Coinbase Commerce Pay
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex py-7 pl-6 pr-9 ">
                                <div className="w-1/3"></div>
                                {
                                    (paymentMethod === 'PANDAGROWN') ? (
                                            <div className="w-2/3 px-5 py-8 bg-black/5 rounded">
                                                <div className="w-full flex">
                                                    <div className="w-3/4 text-left">
                                                        <label className="text-xl font-bold">{paymentMethod} amount to pay</label>
                                                    </div>
                                                    <div className="w-3/4 text-right">
                                                        <label className="text-xl font-bold">{fundAmount} {fundUnit}</label>
                                                    </div>
                                                </div>
                                                <div className="flex my-5 pl-4 pr-32 py-3 bg-white rounded">
                                                    <MdErrorOutline className="text-4xl pr-3 text-green" />
                                                    <label>
                                                        You will get a 10% bonus if using PGA TOKEN. Don't have a PGA TOKEN?
                                                        <Link to={'https://app.pandagrownswap.io'} className="text-blue-600 underline pl-2" target={'_blank'}>Click here to buy.</Link>
                                                    </label>
                                                </div>
                                                <ButtonWithSpinner isDisabled={isDisabled} isLoading={isLoading} onConfirm={handleConfirm} >Confirm and pay</ButtonWithSpinner>
                                            </div>
                                        )
                                        : (
                                            <div className="w-2/3 px-5 py-8 rounded">
                                                <ButtonWithSpinner isDisabled={isDisabled} isLoading={isLoading} onConfirm={handleConfirm} >Confirm and pay</ButtonWithSpinner>
                                            </div>
                                        )
                                }
                            </div>
                        </Scrollbars>

                    </div>
                </div>

            </div>
            <ModalDepositConfirm isOpen={showDepositModal} onClose={onCloseDeposit} />
            <ModalDepositCancel isOpen={showDepositCancelModal} onClose={onCloseDepositCancel} />
        </>
    );
}

interface ButtonWithSpinnerProps {
    isDisabled: boolean;
    isLoading: boolean;
    onConfirm: () => void;
    children: React.ReactNode;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
                                                                 isDisabled,
                                                                 isLoading,
                                                                 onConfirm,
                                                                 children,
                                                             }) => {
    return (
        <button  disabled={isDisabled || isLoading} className={`${(!isDisabled) ? 'btn-green !bg-green' : 'btn-gray'} w-full text-white text-base font-bold items-center mt-2 mx-auto py-5 px-4 rounded-5`} onClick={onConfirm} >
            {isLoading ? (
                <>
                    <FaSpinner className="spinner m-auto text-xl" />
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Deposit;
