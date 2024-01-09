import { createContext, useContext } from "react"

export type AuthContent = {
  user: any,
  setUser: (c: any) => void
}

export const MyAuthContext = createContext<AuthContent>({
  user: null, // set a default value
  setUser: () => { },
})

export const useAuthContext = () => useContext(MyAuthContext)