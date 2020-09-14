import env from '../environment'
import { utils as EthersUtils } from 'ethers'
import { solidityKeccak256, id as keccak256 } from 'ethers/utils'
export const soliditySha3 = solidityKeccak256
export const hash256 = keccak256
export const DEFAULT_LOCAL_CHAIN = 'private'
export const ETH_FAKE_ADDRESS = `0x${''.padEnd(40, '0')}`

const ETH_ADDRESS_SPLIT_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g
const ETH_ADDRESS_TEST_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}

export function getFunctionSignature(func) {
  return keccak256(func).slice(0, 10)
}

export function getUseWalletProviders() {
  const providers = [{ id: 'injected' }, { id: 'frame' }]

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    })
  }

  if (env('PORTIS_DAPP_ID')) {
    providers.push({
      id: 'portis',
      useWalletConf: { dAppId: env('PORTIS_DAPP_ID') },
    })
  }

  return providers
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf
    }
    return connectors
  }, {})
}

function toChecksumAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Error(
      'Given address "' + address + '" is not a valid Ethereum address.',
    )
  }

  address = address.toLowerCase().replace(/^0x/i, '')

  const addressHash = keccak256(address).replace(/^0x/i, '')
  let checksumAddress = '0x'

  for (let i = 0; i < address.length; i++) {
    // If ith character is 9 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase()
    } else {
      checksumAddress += address[i]
    }
  }

  return checksumAddress
}

// Check address equality with checksums
export function addressesEqual(first, second) {
  first = first && toChecksumAddress(first)
  second = second && toChecksumAddress(second)
  return first === second
}

export const addressPattern = '(0x)?[0-9a-fA-F]{40}'

/**
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973‚Ä¶1271
 *   shortenAddress('0x19731977931271', 2) // 0x19‚Ä¶71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 *
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }

  return (
    address.slice(0, charsLength + prefixLength) +
    '...' +
    address.slice(-charsLength)
  )
}

export function getNetworkType(chainId = env('CHAIN_ID')) {
  chainId = String(chainId)

  if (chainId === '1') return 'main'
  if (chainId === '3') return 'ropsten'
  if (chainId === '4') return 'rinkeby'

  return DEFAULT_LOCAL_CHAIN
}

export function getNetworkName(chainId = env('CHAIN_ID')) {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '3') return 'Ropsten'
  if (chainId === '4') return 'Rinkeby'

  return 'unknown'
}

export function sanitizeNetworkType(networkType) {
  if (networkType === 'private') {
    return 'localhost'
  } else if (networkType === 'main') {
    return 'mainnet'
  }
  return networkType
}

export function isLocalOrUnknownNetwork(chainId = env('CHAIN_ID')) {
  return getNetworkType(chainId) === DEFAULT_LOCAL_CHAIN
}

export function hexToAscii(hexx) {
  const hex = hexx.toString()
  let str = ''
  for (let i = 0; i < hex.length && hex.substr(i, 2) !== '00'; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}

// Detect Ethereum addresses in a string and transform each part.
//
// `callback` is called on every part with two params:
//   - The string of the current part.
//   - A boolean indicating if it is an address.
//
export function transformAddresses(str, callback) {
  return str
    .split(ETH_ADDRESS_SPLIT_REGEX)
    .map((part, index) =>
      callback(part, ETH_ADDRESS_TEST_REGEX.test(part), index),
    )
}

/**
 * Format an amount of units to be displayed.
 *
 * @param {BigNumber|String} value Amount of units to format.
 * @param {Number} options.digits Amount of digits on the token.
 * @param {Boolean} options.commas Use comma-separated groups.
 * @param {Boolean} options.replaceZeroBy The string to be returned when value is zero.
 * @param {Number} options.truncateToDecimalPlace Number of decimal places to show.
 */
export function formatUnits(
  value,
  {
    digits = 18,
    commas = true,
    replaceZeroBy = '',
    truncateToDecimalPlace,
  } = {},
) {
  if (typeof value === 'string') {
    value = EthersUtils.bigNumberify(value)
  }

  if (value.lt(0) || digits < 0) {
    return ''
  }

  let valueBeforeCommas = EthersUtils.formatUnits(value.toString(), digits)

  // Replace 0 by an empty value
  if (valueBeforeCommas === '0.0') {
    return replaceZeroBy
  }

  // EthersUtils.formatUnits() adds a decimal even when 0, this removes it.
  valueBeforeCommas = valueBeforeCommas.replace(/\.0$/, '')

  if (typeof truncateToDecimalPlace === 'number') {
    const [whole = '', dec = ''] = valueBeforeCommas.split('.')
    if (dec) {
      const truncatedDec = dec
        .slice(0, truncateToDecimalPlace)
        .replace(/0*$/, '')
      valueBeforeCommas = truncatedDec ? `${whole}.${truncatedDec}` : whole
    }
  }

  return commas ? EthersUtils.commify(valueBeforeCommas) : valueBeforeCommas
}
export async function signMessage(wallet, message) {
  let signHash
  let error = false
  let errorMsg

  try {
    signHash = await wallet.ethers.getSigner().signMessage(message)
  } catch (err) {
    error = true
    errorMsg = err
  }

  return { signHash, error, errorMsg }
}
