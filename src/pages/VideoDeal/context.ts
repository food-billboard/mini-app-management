import { createContext } from 'react'

export type DealContextType = {
  onChange: (tabKey: string, extra: any) => void 
  videoList: string[]
}

export const DealContext = createContext<DealContextType>({
  onChange: () => {},
  videoList: []
})