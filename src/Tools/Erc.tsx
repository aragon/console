import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import 'styled-components/macro'
import ercAbi from '../lib/abi/erc20.json'
import { useContract } from '../lib/web3-contracts'

export default function ErcTool() {
  const [tokenAddress, setTokenAddress] = useState('')
  const history = useHistory()
  const tokenContract = useContract(tokenAddress, ercAbi)

  const handleChangeTokenAddress = useCallback(e => {
    setTokenAddress(e.target.value)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => history.goBack()}
        css={`
          margin-top: 8px;
          font-family: 'Overpass Mono', monospace;
          font-size: 16px;
          position: relative;
          background: transparent;
          color: white;
          cursor: pointer;
          border: 0px;
          text-decoration: underline;
        `}
      >
        Back
      </button>
      <div
        css={`
          padding: 8px;
          margin-top: ${1 * 8}px;
          border: 1px solid whitesmoke;
        `}
      >
        <h2>ERC-20 Tool</h2>
        <form
          css={`
            padding: 8px;
          `}
        >
          <label>
            Token Address
            <input
              type="input"
              onChange={handleChangeTokenAddress}
              placeholder="0xcaffelatte..."
              value={tokenAddress}
              css={`
                margin-top: 12px;
                width: 100%;
                color: black;
              `}
            />
          </label>
        </form>
        {tokenAddress &&
          ercAbi.map(
            abiItem =>
              abiItem?.type === 'function' && (
                <div
                  key={abiItem.name}
                  css={`
                    padding: 8px;
                    margin-top: 8px;
                    border: 1px solid whitesmoke;
                  `}
                >
                  <ContractCallHandler
                    constant={abiItem.constant!}
                    ercContract={tokenContract}
                    name={abiItem.name}
                    inputs={abiItem.inputs}
                  />
                </div>
              ),
          )}
      </div>
    </>
  )
}

type Input = {
  name: string | undefined
  type: string | undefined
}

type ContractCallHandlerProps = {
  constant: boolean
  ercContract: any
  name: string
  inputs: Input[] | any[]
}

function ContractCallHandler({
  constant,
  ercContract,
  name,
  inputs,
}: ContractCallHandlerProps) {
  const [result, setResult] = useState('')
  const [values, setValues] = useState(() => {
    if (inputs.length === 0) {
      return null
    }
    // @ts-ignore
    // Sorry but I got very tired of fighting with types
    return inputs.map((input: any) => ({
      name: input.name,
      type: input.type,
      value: '',
    }))
  })

  const updateValue = useCallback(
    (name, updatedValue) => {
      console.log(name, updatedValue)
      if (values) {
        setValues((elements: any) =>
          elements.map((element: any) =>
            element.name === name
              ? { ...element, value: updatedValue }
              : element,
          ),
        )
      }
    },
    [values],
  )

  const handleExecute = useCallback(
    async e => {
      e.preventDefault()
      try {
        if (constant) {
          let res
          if (values) {
            const args = values.map((val: any) => val.value)
            res = await ercContract[name](...args)
            setResult(res.toString())
            return
          } else {
            res = await ercContract[name]()
            setResult(res.toString())
            return
          }
        }
        const args = values.map((val: any) => val.value)
        const res = await ercContract[name](...args)
        setResult(res.hash)
      } catch (e) {
        console.error(e)
      }
    },
    [constant, ercContract, name, values],
  )

  return (
    <>
      <h3>{name}</h3>
      <form
        css={`
          display: flex;
          flex-direction: column;
          max-width: 600px;
        `}
      >
        {values?.map((value: any, i: number) => (
          <div key={value.name}>
            <label>
              {value.name}
              <input
                value={values[i].value}
                onChange={e => updateValue(value.name, e.target.value)}
                css={`
                  margin-top: 12px;
                `}
              />
            </label>
          </div>
        ))}
        <button
          type="submit"
          onClick={handleExecute}
          css={`
            max-width: 100px;
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
          Execute
        </button>
        <span>Result: {result}</span>
      </form>
    </>
  )
}
