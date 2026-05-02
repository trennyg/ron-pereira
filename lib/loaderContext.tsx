'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

const LoaderContext = createContext<{ loaded: boolean; setLoaded: (v: boolean) => void }>({
  loaded: false,
  setLoaded: () => {},
})

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  return <LoaderContext.Provider value={{ loaded, setLoaded }}>{children}</LoaderContext.Provider>
}

export const useLoader = () => useContext(LoaderContext)
