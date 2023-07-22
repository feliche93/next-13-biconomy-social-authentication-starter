'use client';

import { useState, useEffect, useRef } from 'react';
import SocialLogin from '@biconomy/web3-auth';
import { ChainId } from '@biconomy/core-types';
import { ethers } from 'ethers';
import { BiconomySmartAccount } from '@biconomy/account';
import { Web3Provider } from '@ethersproject/providers';

export default function Auth() {
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccount | null>(
    null
  );
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef<SocialLogin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let configureLogin: any;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin();
      const signature1 = await socialLoginSDK.whitelistUrl(
        'https://biconomy-social-auth.vercel.app'
      );
      await socialLoginSDK.init({
        chainId: ethers.toQuantity(ChainId.POLYGON_MAINNET),
        whitelistUrls: {
          'https://biconomy-social-auth.vercel.app': signature1,
        },
      });
      sdkRef.current = socialLoginSDK;
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet();
      enableInterval(true);
    } else {
      setupSmartAccount();
    }
  }

  async function setupSmartAccount() {
    console.log('sdkRef.current.provider', sdkRef?.current?.provider);
    if (!sdkRef?.current?.provider) return;
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new Web3Provider(sdkRef.current.provider);
    const signer = await web3Provider.getSigner();

    try {
      const smartAccount = new BiconomySmartAccount({
        signer: signer,
        chainId: ChainId.POLYGON_MUMBAI,
      });
      const initializedSmartAccount = await smartAccount.init();
      setSmartAccount(initializedSmartAccount);
      setLoading(false);
    } catch (err) {
      console.log('error setting up smart account... ', err);
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error('Web3Modal not initialized.');
      return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    setSmartAccount(null);
    enableInterval(false);
  };

  return (
    <div className='w-full max-w-screen-lg mx-auto flex flex-col items-center pt-24'>
      <h1 className='text-4xl'>BICONOMY AUTH</h1>
      {!smartAccount && !loading && (
        <button
          className='p-4 w-72 border-0 cursor-pointer rounded-full mt-5 transition-all hover:bg-black hover:bg-opacity-20'
          onClick={login}
        >
          Login
        </button>
      )}
      {loading && <p>Loading account details...</p>}
      {!!smartAccount && (
        <div className='mt-2'>
          <h3>Smart account address:</h3>
          <p>{smartAccount.owner}</p>
          <button
            className='p-4 w-72 border-0 cursor-pointer rounded-full mt-5 transition-all hover:bg-black hover:bg-opacity-20'
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
