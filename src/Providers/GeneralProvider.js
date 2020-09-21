import React from 'react'
import ChainIdProvider from './ChainId'
import WalletProvider from './Wallet'

export default function GeneralProvider({ children }) {
  return (
    <ChainIdProvider>
      <WalletProvider>{children}</WalletProvider>
    </ChainIdProvider>
  )
}
