'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import WalletConnect from '@/components/WalletConnect';
import RegisterForm from '@/components/RegisterForm';

export default function LoginPage() {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already registered
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
      setShowWalletConnect(true);
    }
  }, []);

  const handleRegistrationComplete = (name: string, profession: string) => {
    setUserName(name);
    setShowWalletConnect(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {!showWalletConnect ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Get Started
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Register your account to start booking expert calls
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg">
              <RegisterForm onComplete={handleRegistrationComplete} />
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Connect Your Wallet
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Welcome, {userName}! Connect your wallet to start booking expert calls on Avalanche C-Chain
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg">
              <WalletConnect />
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Supported networks: Avalanche C-Chain</p>
              <p className="mt-2">Make sure you have one of the supported wallets installed</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

