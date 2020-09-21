import React, { useContext, useMemo } from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet } from 'use-wallet'
import { useChainId } from './ChainId'
import { getUseWalletConnectors } from '../lib/web3-utils'

/* eslint-disable react/prop-types */
const WalletAugmentedContext = React.createContext()

function useWalletAugmented() {
  return useContext(WalletAugmentedContext)
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }) {
  const wallet = useWallet()
  const { ethereum } = wallet

  const ethers = useMemo(
    () => (ethereum ? new EthersProviders.Web3Provider(ethereum) : null),
    [ethereum],
  )

  const contextValue = useMemo(() => ({ ...wallet, ethers }), [wallet, ethers])

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

export default function WalletProvider({ children }) {
  const { chainId } = useChainId()

  return (
    <UseWalletProvider chainId={chainId} connectors={getUseWalletConnectors()}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}
/* eslint-disable react/prop-types */

export { useWalletAugmented as useWallet }
