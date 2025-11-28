'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
    avalanche?: any;
    trustwallet?: any;
  }
}

export default function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const connectWallet = async (walletType: 'metamask' | 'core' | 'trustwallet') => {
    setIsConnecting(true);
    setError(null);

    try {
      let provider;
      
      if (walletType === 'metamask') {
        if (!window.ethereum) {
          throw new Error('MetaMask is not installed. Please install MetaMask extension.');
        }
        provider = window.ethereum;
      } else if (walletType === 'core') {
        if (!window.avalanche) {
          throw new Error('Core Wallet is not installed. Please install Core extension.');
        }
        provider = window.avalanche;
      } else if (walletType === 'trustwallet') {
        if (!window.trustwallet) {
          throw new Error('TrustWallet is not installed. Please install TrustWallet extension.');
        }
        provider = window.trustwallet;
      }

      // Request account access
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        
        // Switch to Avalanche C-Chain (Chain ID: 43114)
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xA86A' }], // 43114 in hex
          });
        } catch (switchError: any) {
          // If chain doesn't exist, add it
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xA86A',
                  chainName: 'Avalanche C-Chain',
                  nativeCurrency: {
                    name: 'AVAX',
                    symbol: 'AVAX',
                    decimals: 18,
                  },
                  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                  blockExplorerUrls: ['https://snowtrace.io'],
                },
              ],
            });
          }
        }

        // Store connection
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletType', walletType);
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => connectWallet('metamask')}
          disabled={isConnecting}
          className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-600 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-12 h-12 mb-2 text-gray-700 dark:text-gray-300" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">MetaMask</span>
        </button>

        <button
          onClick={() => connectWallet('core')}
          disabled={isConnecting}
          className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-600 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-12 h-12 mb-2 text-gray-700 dark:text-gray-300" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">Core Wallet</span>
        </button>

        <button
          onClick={() => connectWallet('trustwallet')}
          disabled={isConnecting}
          className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-600 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-12 h-12 mb-2 text-gray-700 dark:text-gray-300" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">TrustWallet</span>
        </button>
      </div>

      {isConnecting && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          Connecting to wallet...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

