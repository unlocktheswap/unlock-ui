'use client';

import './App.css';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GearFill } from 'react-bootstrap-icons';

import PageButton from './components/PageButton';
import ConnectButton from './components/ConnectButton';
import ConfigModal from './components/ConfigModal';
import CurrencyField from './components/CurrencyField';

import BeatLoader from 'react-spinners/BeatLoader';
import {
  getWethContract,
  getUniContract,
  getPrice,
  runSwap,
} from './AlphaRouterService';

function Swap() {
  const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [signerAddress, setSignerAddress] = useState<string | undefined>(
    undefined,
  );

  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [inputAmount, setInputAmount] = useState<any>(undefined);
  const [outputAmount, setOutputAmount] = useState<any>(undefined);
  const [transaction, setTransaction] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [ratio, setRatio] = useState<any>(undefined);
  const [wethContract, setWethContract] = useState<ethers.Contract | undefined>(
    undefined,
  );
  const [uniContract, setUniContract] = useState<ethers.Contract | undefined>(
    undefined,
  );
  const [wethAmount, setWethAmount] = useState<Number | undefined>(undefined);
  const [uniAmount, setUniAmount] = useState<Number | undefined>(undefined);

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const wethContract = getWethContract();
      setWethContract(wethContract);

      const uniContract = getUniContract();
      setUniContract(uniContract);
    };
    onLoad();
  }, []);

  const getSigner = async (provider: Web3Provider) => {
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

  const getSwapPrice = (inputAmount: string) => {
    setLoading(true);
    setInputAmount(inputAmount);

    const swap = getPrice(
      inputAmount || 2,
      slippageAmount,
      Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
      signerAddress,
    ).then((data) => {
      setTransaction(data?.[0]);
      setOutputAmount(data?.[1]);
      setRatio(data?.[2]);
      setLoading(false);
    });
  };

  return (
    <div className="App">
      <div className="fixed right-2 top-16">
        <div className="buttonContainer buttonContainerTop my-2"></div>

        <div className="rightNav">
          <div className="connectButtonContainer">
            <ConnectButton
              provider={provider}
              isConnected={isConnected}
              signerAddress={signerAddress}
              getSigner={getSigner}
            />
          </div>
          <div className="buttonContainer my-2">
            <PageButton name={'...'} isBold={true} />
          </div>
        </div>
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
            <CurrencyField
              field="input"
              tokenName="WETH"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={wethAmount}
            />
            <CurrencyField
              field="output"
              tokenName="UNI"
              value={outputAmount}
              signer={signer}
              balance={uniAmount}
              spinner={BeatLoader}
              loading={loading}
            />
          </div>

          <div className="ratioContainer">
            {ratio && <>{`1 UNI = ${ratio} WETH`}</>}
          </div>

          <div className="swapButtonContainer">
            {isConnected() ? (
              <div
                onClick={() => runSwap(transaction, signer)}
                className="swapButton"
              >
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
    </div>
  );
}

export default Swap;
