import {BigNumber} from "@ethersproject/bignumber";
import { AlphaRouter } from '@uniswap/smart-order-router'
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core'
import {SwapType} from "@uniswap/smart-order-router/build/main/routers/router";
import {ethers, Signer} from 'ethers'
import {hexlify, parseUnits} from "ethers/lib/utils";
import JSBI from 'jsbi'
import ERC20ABI from './abi.json'
import {JsonRpcProvider, JsonRpcSigner} from '@ethersproject/providers';

const V3_SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
const REACT_APP_INFURA_URL_TESTNET = process.env.REACT_APP_INFURA_URL_TESTNET

const chainId = 5


const name0 = 'Wrapped Ether'
const symbol0 = 'WETH'
const decimals0 = 18
const address0 = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

const name1 = 'Uniswap Token'
const symbol1 = 'UNI'
const decimals1 = 18
const address1 = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'


export const getWethContract = (provider: JsonRpcProvider) =>
  new ethers.Contract(address0, ERC20ABI, provider)
export const getUniContract = (provider: JsonRpcProvider) =>
  new ethers.Contract(address1, ERC20ABI, provider)

export const getPrice = async (
  provider: JsonRpcProvider,
  inputAmount: number,
  slippageAmount: string,
  walletAddress: string,
) => {
  try {
    const router = new AlphaRouter({
      chainId: chainId,
      provider,
    })

    const WETH = new Token(chainId, address0, decimals0, symbol0, name0)
    const UNI = new Token(chainId, address1, decimals1, symbol1, name1)

    const percentSlippage = new Percent(slippageAmount, 100)
    const wei = parseUnits(inputAmount.toString(), decimals0)
    let bigIntAmount: JSBI = JSBI.BigInt(wei);
    const currencyAmount = CurrencyAmount.fromRawAmount(WETH, bigIntAmount)

    console.log('currencyAmount', currencyAmount);
    const route = await router.route(currencyAmount, UNI, TradeType.EXACT_INPUT, {
      recipient: walletAddress,
      slippageTolerance: percentSlippage,
      type: SwapType.UNIVERSAL_ROUTER
    })

    console.log('route', route);
    const transaction = {
      data: route!.methodParameters!.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: BigNumber.from(route!.methodParameters!.value),
      from: walletAddress,
      gasPrice: BigNumber.from(route!.gasPriceWei),
      gasLimit: hexlify(1000000),
    }

    const quoteAmountOut = route!.quote.toFixed(6)
    const ratio = (inputAmount / parseFloat(quoteAmountOut)).toFixed(3)

    return [transaction, quoteAmountOut, ratio]
  }catch (e) {
    console.log('error', e);
  }
}

export const runSwap = async (provider: JsonRpcProvider, transaction: any, signer: JsonRpcSigner) => {
  const approvalAmount = parseUnits('10', 18).toString()
  const contract0 = getWethContract(provider)
  await contract0
    .connect(signer)
    .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount)

  signer.sendTransaction(transaction)
}
