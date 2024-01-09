import { useContext, createContext } from "react";

export const MobileContext = createContext(false);

export const useMobileContext = () => useContext(MobileContext);