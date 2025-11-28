import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Search, Calendar, CreditCard, Mail } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Connect with <span className="text-red-600 dark:text-red-500">Experts</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Book paid consultations with industry experts on the Avalanche network
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-expert"
              className="px-8 py-3 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold text-lg"
            >
              Find an Expert
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-semibold text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Search className="w-12 h-12 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Find Experts</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Browse through verified expert profiles
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Calendar className="w-12 h-12 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Book Calls</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Schedule 30-minute consultations at your convenience
            </p>
          </div>
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <CreditCard className="w-12 h-12 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pay Securely</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Transactions secured on Avalanche blockchain
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-red-600 dark:text-red-500">Pinnacall</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Mail size={18} />
              <a 
                href="mailto:pinnacall@gmail.com" 
                className="hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                pinnacall@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
