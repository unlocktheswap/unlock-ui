'use client';

import './App.css';
import Button from '@/components/core/buttons/Button';
import BuyMembershipModal from '@/components/swap/BuyMembershipModal';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GearFill } from 'react-bootstrap-icons';

import PageButton from './components/PageButton';
import ConnectButton from './components/ConnectButton';
import ConfigModal from './components/ConfigModal';
import CurrencyField from './components/CurrencyField';

import BeatLoader from 'react-spinners/BeatLoader';
import { getWethContract, getUniContract, getPrice, runSwap } from './AlphaRouterService';

function Swap() {
  const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [signerAddress, setSignerAddress] = useState<string | undefined>(undefined);

  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [inputAmount, setInputAmount] = useState<any>(undefined);
  const [outputAmount, setOutputAmount] = useState<any>(undefined);
  const [transaction, setTransaction] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [ratio, setRatio] = useState<any>(undefined);
  const [wethContract, setWethContract] = useState<ethers.Contract | undefined>(undefined);
  const [uniContract, setUniContract] = useState<ethers.Contract | undefined>(undefined);
  const [wethAmount, setWethAmount] = useState<Number | undefined>(undefined);
  const [uniAmount, setUniAmount] = useState<Number | undefined>(undefined);

  const [showBuyModal, setShowBuyModal] = useState<boolean>(false);
  useEffect(() => {
    const onLoad = async () => {
      const provider = await new Web3Provider(window.ethereum, 5);
      console.log('provider', provider);
      setProvider(provider);

      let signer1 = provider.getSigner();
      console.log('signer1', signer1);
      setSigner(signer1);

      const wethContract = getWethContract(provider);
      console.log('wethContract', wethContract);

      setWethContract(wethContract);

      const uniContract = getUniContract(provider);
      console.log('uniContract', uniContract);
      setUniContract(uniContract);
    };
    onLoad();
  }, []);

  const getSigner = async (provider: Web3Provider) => {
    console.log('getSigner', provider);
    if (provider.provider && 'request' in provider.provider) {
      try {
        await provider.provider.request?.({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        setSigner(signer);
      } catch (error) {
        console.error('User rejected account access', error);
      }
    }
  };
  const isConnected = () => signer !== undefined;
  const getWalletAddress = () => {
    signer?.getAddress().then((address: string) => {
      setSignerAddress(address);

      // todo: connect weth and uni contracts
      wethContract?.balanceOf(address).then((res: string) => {
        setWethAmount(Number(ethers.utils.formatEther(res)));
      });
      uniContract?.balanceOf(address).then((res: string) => {
        setUniAmount(Number(ethers.utils.formatEther(res)));
      });
    });
  };

  if (signer !== undefined) {
    getWalletAddress();
  }

  const getSwapPrice = async (inputAmount: string) => {
    setLoading(true);
    setInputAmount(inputAmount);

    let priceData = await getPrice(provider!, 100, '4', signerAddress!);

    console.log('priceData', priceData);
    setTransaction(priceData?.[0]);
    setOutputAmount(priceData?.[1]);
    setRatio(priceData?.[2]);
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="w-full flex justify-end">
        <div className="flex flex-col">
          <Button primary variant={'contained'} onClick={() => setShowBuyModal(true)}>
            Buy Membership
          </Button>
          <div className="text-xs mt-4">Buy subscription to make it free to swap</div>
        </div>
      </div>
      <div className="fixed right-8 top-16">
        <div className="buttonContainer buttonContainerTop my-2"></div>

        {/*<div className="rightNav">
          <div className="connectButtonContainer">
            <ConnectButton
              provider={provider}
              isConnected={isConnected}
              signerAddress={signerAddress}
              getSigner={getSigner}
            />
          </div>
          <div className="buttonContainer my-2">
            <PageButton name={'...'} isBold={true}/>
          </div>
        </div>*/}
      </div>

      <div className="appBody">
        <div className="swapContainer">
          <div className="swapHeader">
            <span className="swapText">Swap</span>
            <span className="gearContainer" onClick={() => setShowModal(true)}>
              <GearFill />
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount}
              />
            )}
          </div>

          <div className="swapBody">
            <CurrencyField field="input" tokenName="WETH" getSwapPrice={getSwapPrice} signer={signer} balance={wethAmount} />
            <CurrencyField field="output" tokenName="UNI" value={outputAmount} signer={signer} balance={uniAmount} spinner={BeatLoader} loading={loading} />
          </div>

          <div className="ratioContainer">{ratio && <>{`1 UNI = ${ratio} WETH`}</>}</div>

          <div className="swapButtonContainer">
            {isConnected() ? (
              <div onClick={() => runSwap(provider!, transaction, signer!)} className="swapButton">
                Swap
              </div>
            ) : (
              <div onClick={() => getSigner(provider!)} className="swapButton">
                Connect Wallet
              </div>
            )}
          </div>
        </div>
      </div>
      <BuyMembershipModal open={showBuyModal} onClose={() => setShowBuyModal(false)} />
    </div>
  );
}

export default Swap;
