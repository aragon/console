import agreementAbi from './abi/agreement.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '4',
    {
      TOKEN_ANJ: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
    },
  ],
])

const ABIS = new Map([['AGREEMENT', agreementAbi]])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get('4') || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
