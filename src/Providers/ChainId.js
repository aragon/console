import React, { createContext, useContext, useState, useMemo } from 'react'
import env from '../environment'

const ChainIdContext = createContext()

export function useChainId() {
  const chainIdContext = useContext(ChainIdContext)

  if (!chainIdContext) {
    throw new Error('useChainId can only be used inside a ChainIdProvider')
  }

  return chainIdContext
}

export default function ChainIdProvider({ children }) {
  const [chainId, setChainId] = useState(env('CHAIN_ID'))

  const contextValue = useMemo(
    () => ({
      chainId,
      setChainId,
    }),
    [chainId, setChainId],
  )

  return (
    <ChainIdContext.Provider value={contextValue}>
      {children}
    </ChainIdContext.Provider>
  )
}
