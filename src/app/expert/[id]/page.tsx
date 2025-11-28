'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { User, Star, Twitter } from 'lucide-react';
import { ExpertProfile, XAccountConnection } from '@/types/profile';

type TimeSlot = {
  date: string;
  time: string;
  available: boolean;
};

type ExpertDetail = ExpertProfile & {
  availability: string[];
  timeSlots: TimeSlot[];
};

// Mock expert data
const expertData: Record<string, ExpertDetail> = {
  '1': {
    id: '1',
    name: 'Chain Diva',
    title: 'Blockchain Consultant',
    expertise: 'DeFi, Smart Contracts, Web3',
    rating: 4.9,
    reviews: 127,
    price: 0.5,
    avatar: '👩‍💼',
    bio: '10+ years in blockchain technology and DeFi protocols. Expert in Solidity, smart contract development, and DeFi architecture.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: [
      { date: '2024-01-15', time: '10:00', available: true },
      { date: '2024-01-15', time: '14:00', available: true },
      { date: '2024-01-15', time: '16:00', available: false },
      { date: '2024-01-16', time: '10:00', available: true },
      { date: '2024-01-16', time: '14:00', available: true },
    ],
  },
  '2': {
    id: '2',
    name: 'Dev Praise',
    title: 'Web3 Development Expert',
    expertise: 'Coding, React.js, Portfolio Management',
    rating: 4.8,
    reviews: 89,
    price: 0.3,
    avatar: '👨‍💻',
    bio: 'Security expert specializing in smart contract audits',
    availability: ['Mon', 'Wed', 'Fri'],
    timeSlots: [
      { date: '2024-01-15', time: '09:00', available: true },
      { date: '2024-01-15', time: '11:00', available: true },
      { date: '2024-01-17', time: '09:00', available: true },
    ],
  },
  '3': {
    id: '3',
    name: 'Cypher Cloak',
    title: 'NFT & Digital Art Specialist',
    expertise: 'NFTs, Digital Art, Metaverse',
    rating: 4.7,
    reviews: 156,
    price: 0.4,
    avatar: '👩‍🎨',
    bio: 'Curator and advisor for NFT projects and digital art.',
    availability: ['Tue', 'Thu', 'Sat'],
    timeSlots: [
      { date: '2024-01-16', time: '13:00', available: true },
      { date: '2024-01-16', time: '15:00', available: true },
      { date: '2024-01-18', time: '13:00', available: true },
    ],
  },
  '4': {
    id: '4',
    name: 'Feezy',
    title: 'Team1NG Lead',
    expertise: 'Gaming, Leadership, Community',
    rating: 5.0,
    reviews: 203,
    price: 1.0,
    avatar: '👨‍🔬',
    bio: 'Professional trader with expertise in crypto markets',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: [
      { date: '2024-01-15', time: '10:00', available: true },
      { date: '2024-01-15', time: '14:00', available: true },
      { date: '2024-01-16', time: '10:00', available: true },
    ],
  },
};

export default function ExpertProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [expert, setExpert] = useState<ExpertDetail | null>(null);
  const [isLoadingExpert, setIsLoadingExpert] = useState(true);
  const [isCustomExpert, setIsCustomExpert] = useState(false);

  useEffect(() => {
    const walletAddress = localStorage.getItem('walletAddress');
    setIsConnected(!!walletAddress);
  }, []);

  useEffect(() => {
    const paramId = params.id as string;
    setIsLoadingExpert(true);

    try {
      const storedProfile = localStorage.getItem('expertProfile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile) as ExpertProfile;
        if (parsed.id === paramId) {
          const profileDetail: ExpertDetail = {
            ...parsed,
            rating: parsed.rating ?? 5,
            reviews: parsed.reviews ?? 0,
            availability: [],
            timeSlots: [],
            bannerImage: parsed.bannerImage ?? null,
            xAccount: parsed.xAccount ?? null,
          };
          setExpert(profileDetail);
          setIsCustomExpert(true);
          setIsLoadingExpert(false);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load custom expert profile', error);
    }

    const fallback = expertData[paramId] ?? null;
    setExpert(fallback);
    setIsCustomExpert(false);
    setIsLoadingExpert(false);
  }, [params.id]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [expert?.id]);

  if (isLoadingExpert) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading expert profile...</p>
        </main>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-gray-600 dark:text-gray-400">Expert not found</p>
        </main>
      </div>
    );
  }

  const handleBook = async () => {
    if (!isConnected) {
      router.push('/login');
      return;
    }

    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    setIsBooking(true);
    
    try {
      // Simulate wallet transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would:
      // 1. Connect to wallet
      // 2. Send transaction to smart contract
      // 3. Wait for confirmation
      // 4. Handle success/failure
      
      alert('Booking successful! You will receive a confirmation email.');
      router.push('/dashboard');
    } catch (error) {
      alert('Booking failed. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleViewXProfile = (account: XAccountConnection) => {
    if (typeof window === 'undefined') return;
    window.open(account.profileUrl, '_blank', 'noopener,noreferrer');
  };

  const hasAvailability = expert.availability && expert.availability.length > 0;
  const hasSlots = expert.timeSlots && expert.timeSlots.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {expert.bannerImage && (
          <div
            className="h-48 rounded-2xl mb-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${expert.bannerImage})` }}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expert Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sticky top-24 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center mx-auto mb-4 text-4xl">
                  {expert.avatar ? (
                    <span role="img" aria-label="Expert avatar">
                      {expert.avatar}
                    </span>
                  ) : (
                    <User className="w-12 h-12 text-red-600 dark:text-red-500" />
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {expert.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {expert.title}
                </p>
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {expert.rating}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({expert.reviews} reviews)
                  </span>
                </div>
              </div>

              {expert.xAccount && (
                <button
                  type="button"
                  onClick={() => handleViewXProfile(expert.xAccount!)}
                  className="w-full flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/30 px-3 py-2 text-left hover:border-red-300 dark:hover:border-red-600 transition"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-black text-white flex items-center justify-center">
                    {expert.xAccount.profileImage ? (
                      <img
                        src={expert.xAccount.profileImage}
                        alt={expert.xAccount.handle}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.visibility = 'hidden';
                        }}
                      />
                    ) : (
                      <span>@</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Connected to @{expert.xAccount.handle}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      View profile on X
                    </p>
                  </div>
                  <Twitter className="w-4 h-4 text-black dark:text-white ml-auto" />
                </button>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Expertise</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {expert.expertise}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">About</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {expert.bio}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-500 mb-1">
                    {expert.price} AVAX
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    per 30-minute call
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Book a Call
              </h2>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {hasAvailability
                    ? `Available Days: ${expert.availability.join(', ')}`
                    : 'Availability not provided yet'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {hasSlots
                    ? 'Select a time slot for your 30-minute consultation'
                    : isCustomExpert
                    ? 'Add availability from the Settings page so people can book you.'
                    : 'This expert has not published their slots yet.'}
                </p>

                {hasSlots ? (
                  <div className="space-y-3">
                    {expert.timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && setSelectedSlot(`${slot.date} ${slot.time}`)}
                        disabled={!slot.available}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          selectedSlot === `${slot.date} ${slot.time}`
                            ? 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/20'
                            : slot.available
                            ? 'border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700'
                            : 'border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(slot.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {slot.time}
                            </p>
                          </div>
                          {!slot.available && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Booked
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/30 p-4 text-sm text-gray-700 dark:text-gray-300">
                    {isCustomExpert
                      ? 'Add at least one availability slot from your Settings page to start receiving bookings.'
                      : 'This expert has not released their calendar slots yet.'}
                  </div>
                )}
              </div>

              {selectedSlot && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Selected: <span className="font-semibold">{selectedSlot}</span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Total: <span className="font-bold text-red-600 dark:text-red-500">
                      {expert.price} AVAX
                    </span>
                  </p>
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={!selectedSlot || isBooking || !isConnected}
                className="w-full py-3 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isConnected
                  ? 'Connect Wallet to Book'
                  : isBooking
                  ? 'Processing...'
                  : `Book Call - ${expert.price} AVAX`}
              </button>

              {!isConnected && (
                <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                  <a href="/login" className="text-red-600 dark:text-red-500 hover:underline">
                    Connect your wallet
                  </a>{' '}
                  to book a call
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

