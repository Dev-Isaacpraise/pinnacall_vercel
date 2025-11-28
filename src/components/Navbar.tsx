'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check wallet connection
    const walletAddress = localStorage.getItem('walletAddress');
    if (walletAddress) {
      setIsConnected(true);
      setAddress(walletAddress);
    }
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-1xl font-bold text-[#ff0000]">
            pinnacall
          </span>
        </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link
                href="/find-expert"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/find-expert')
                    ? 'text-[#ff0000]'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#ff0000]'
                }`}
              >
                Find Expert
              </Link>
              {isConnected && (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'text-[#ff0000]'
                        : 'text-gray-700 dark:text-gray-300 hover:text-[#ff0000]'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/settings')
                        ? 'text-[#ff0000]'
                        : 'text-gray-700 dark:text-gray-300 hover:text-[#ff0000]'
                    }`}
                  >
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-950/20 rounded-md">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                </span>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Connect Wallet
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

