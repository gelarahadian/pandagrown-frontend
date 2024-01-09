import { useState, useEffect } from 'react';

import { MobileContext } from 'context/MobileContext';
import { TabletContext } from 'context/TabletContext';
import { MyAuthContext } from 'context/AuthContext';
import { SettingContext, SettingType, useSettingContext } from 'context/SettingContext';
import { ToastContainer } from 'react-toastify';
import MyRouting from 'Routing';
import { config } from 'config';
import api from 'utils/api';
import 'styles/common.scss';
import {chains, wagmiConfig} from "./utils/wagmi";
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
const maxMobileWidth = 900;
const maxTabletWidth = 1440;

interface SettingItem {
  code: string;
  value: string;
}

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < maxMobileWidth);
  const [isTablet, setIsTablet] = useState(window.innerWidth < maxTabletWidth);
  const [user, setUser] = useState({
    token: localStorage?.getItem('token') || '',
    user_id: localStorage?.getItem('user_id') || '',
    profile_id: localStorage?.getItem('profile_id') || '',
    username: localStorage?.getItem('username') || '',
    profile_avatar: localStorage?.getItem('profile_avatar') || '',
    profile_country: localStorage?.getItem('profile_country') || '',
    balance: localStorage?.getItem('balance') || '',
    pga_balance: localStorage?.getItem('pga_balance') || '',
    noty: localStorage?.getItem('noty') || '',
    plants: localStorage?.getItem('plants') || '',
    harvest: localStorage?.getItem('harvest') || '',
    profit: localStorage?.getItem('profit') || '',
    profit_pga: localStorage?.getItem('profit_pga') || '',
    ticket_status: '0',
    ticket_id: '',
    ticket_type: '',
    botaniPrice: config.pga.botaniPrice,
    rhizoPrice: config.pga.rhizoPrice,
    silicaPrice: config.pga.silicaPrice,
    botaniProfit: config.pga.botaniProfit,
    rhizoProfit: config.pga.rhizoProfit,
    silicaProfit: config.pga.silicaProfit,
    quantity: 0,
    methodBotani: false,
    methodRhizo: false,
    methodSilica: false,
    updateAgent: false,
  });
  const [setting, setSetting] = useState<SettingType>(useSettingContext());

  useEffect(() => {
    api.get<SettingItem[]>(`/base/site_setting/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      setSetting(res.data.reduce((obj, item) => ({
        ...obj,
        [item.code.toLowerCase()]: item.value
      }), {} as SettingType));
    }).catch(err => {
      console.log('get site setting', err);
    });

    if (!user.updateAgent) {
      api.post('user/agent/', {
      }).then((res: any) => {
        const data = res.data;
        console.log(data);
        setUser((prevUser: any) => ({
          ...prevUser,
          updateAgent: true,
        }));
      }).catch(err => {
        console.log(err);
      });
    }
    if (user?.token) {
      setTimeout(() => {
        api.get(`user/${user.user_id}/profile/balance/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => {
          const data = res.data;
          if (data) {
            localStorage.setItem('balance', data.usd); // set token -> this means logged in
            localStorage.setItem('pga_balance', data.pga);
            setUser((prevUser: any) => ({
              ...prevUser,
              balance: data.usd,
              pga_balance: data.pga,
            }));
          }
          // notice
          console.log('get profile data', data);
        }).catch(err => {
          console.log('get profile data error', err);
        });
      }, 200);

    }
    const handleResize = () => {
      // Your resize event handling logic here
      setIsMobile(window.innerWidth < maxMobileWidth);
      setIsTablet(window.innerWidth < maxTabletWidth);
      console.log('isMobile updated : ', window.innerWidth, window.innerWidth < maxMobileWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <MobileContext.Provider value={isMobile}>
            <TabletContext.Provider value={isTablet}>
              <MyAuthContext.Provider value={{ user, setUser }}>
                <SettingContext.Provider value={setting}>
                  <MyRouting user={user} />
                </SettingContext.Provider>
              </MyAuthContext.Provider>
            </TabletContext.Provider>
          </MobileContext.Provider>
          <ToastContainer />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
