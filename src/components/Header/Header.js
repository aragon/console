import React from 'react'
import { GU } from '@aragon/ui'
import AccountModule from '../Account/AccountModule'
import 'styled-components/macro'

const Header = React.memo(function Header() {
  return (
    <header
      css={`
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        height: ${8 * GU}px;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: ${2 * GU}px;
        padding-right: ${2 * GU}px;
        min-width: 100vw;
      `}
    >
      <div
        css={`
          flex-grow: 1;
        `}
      >
        Console
      </div>
      <div
        css={`
          flex-grow: 0;
          display: flex;
          height: 100%;
        `}
      >
        <div
          css={`
            display: flex;
            height: 100%;
          `}
        >
          <AccountModule />
        </div>
      </div>
    </header>
  )
})

export default Header
