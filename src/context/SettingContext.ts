import { useContext, createContext } from "react";

export interface SettingType {
  copyright?: string
};

const initialSetting = {
  copyright: '',
};

export const SettingContext = createContext<SettingType>(initialSetting);

export const useSettingContext = () => useContext(SettingContext);