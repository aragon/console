import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Button, Field, GU, TextInput } from '@aragon/ui'
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
    <Box>
      <Field
        label="Dao Address"
        css={`
          width: 100%;
        `}
      >
        <TextInput
          onChange={handleChangeDaoAddress}
          placeholder="0xbeef..."
          value={daoAddress}
          css={`
            width: 100%;
          `}
        />

        <Button
          label="Go to DAO"
          onClick={handleGoToDao}
          disabled={!daoAddress}
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          Go to DAO
        </Button>
      </Field>
    </Box>
  )
}
