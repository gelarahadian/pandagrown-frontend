import { useContext, createContext } from "react";

export type MobileLayoutContext = {
  title: string,
  setTitle: (t: string) => void,
}

const MobileLayoutContext = createContext<MobileLayoutContext>({
  title: '',
  setTitle: (t: string) => { }
});

export const useMobileLayoutContext = useContext(MobileLayoutContext);

export default MobileLayoutContext;
