import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import 'styled-components/macro'

export default function DaoSelector() {
  const [daoAddress, setDaoAddress] = useState('')
  const history = useHistory()

  const handleChangeDaoAddress = useCallback(e => {
    setDaoAddress(e.target.value)
  }, [])
  const handleGoToDao = useCallback(() => {
    history.push(`/${daoAddress}`)
  }, [daoAddress, history])

  return (
    <form
      css={`
        padding: 8px;
        margin-top: ${4 * 8}px;
        border: 1px solid whitesmoke;
      `}
    >
      <label>
        Enter DAO address
        <input
          type="input"
          onChange={handleChangeDaoAddress}
          placeholder="0xbeef..."
          value={daoAddress}
          css={`
            margin-top: 12px;
            width: 100%;
            color: black;
          `}
        />
      </label>
      <button
        label="Go to DAO"
        onClick={handleGoToDao}
        disabled={!daoAddress}
        css={`
          margin-top: 16px;
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
        Go to DAO
      </button>
    </form>
  )
}
