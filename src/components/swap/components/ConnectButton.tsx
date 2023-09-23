import React from 'react';
import PageButton from './PageButton';

const ConnectButton = (props: any) => {
  const { isConnected, signerAddress, getSigner, provider } = props;
  const displayAddress = `${signerAddress?.substring(0, 10)}...`;

  return (
    <>
      {isConnected() ? (
        <div className="buttonContainer">
          <PageButton name={displayAddress} />
        </div>
      ) : (
        <div
          className="btn connectButton my-2"
          onClick={() => getSigner(provider)}
        >
          Connect Wallet
        </div>
      )}
    </>
  );
};

export default ConnectButton;
