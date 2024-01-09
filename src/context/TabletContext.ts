import { useContext, createContext } from "react";

export const TabletContext = createContext(false);

export const useTabletContext = () => useContext(TabletContext);