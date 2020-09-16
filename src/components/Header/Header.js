import React, { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import 'styled-components/macro'
import { shortenAddress } from '../../lib/web3-utils'

function Header() {
  const wallet = useWallet()

  const handleWalletConnection = useCallback(() => {
    wallet.status === 'connected' ? wallet.reset() : wallet.connect('injected')
  }, [wallet])

  return (
    <header
      css={`
        display: flex;
        width: 100%;
        border: 1px solid whitesmoke;
        padding: 8px;
      `}
    >
      <h1
        css={`
          flex-grow: 1;
          font-weight: bold;
          font-size: 24px;
          text-decoration: underline;
        `}
      >
        Aragon Console
      </h1>
      <button
        onClick={handleWalletConnection}
        css={`
          font-family: 'Overpass Mono', monospace;
          font-size: 12px;
          position: relative;
          background: transparent;
          color: white;
          cursor: pointer;

          &:active {
            top: 1px;
          }
        `}
      >
        {wallet.status === 'connected'
          ? shortenAddress(wallet.account)
          : 'Connect to web3'}
      </button>
    </header>
  )
}

export default Header
