'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { User, Star, Info } from 'lucide-react';
import { ExpertProfile } from '@/types/profile';

type ExpertCard = ExpertProfile & {
  avatar?: string;
  rating: number;
  reviews: number;
};

const defaultExperts: ExpertCard[] = [
  {
    id: '1',
    name: 'Chain Diva',
    title: 'Blockchain Consultant',
    expertise: 'DeFi, Smart Contracts, Web3',
    rating: 4.9,
    reviews: 127,
    price: 0.5,
    avatar: '👩‍💼',
    bio: '10+ years in blockchain technology and DeFi protocols',
  },
  {
    id: '2',
    name: 'Dev Praise',
    title: 'Web3 Development Expert',
    expertise: 'Coding, React.js, Portfolio Management',
    rating: 4.8,
    reviews: 89,
    price: 0.3,
    avatar: '👨‍💻',
    bio: 'Security expert specializing in smart contract audits',
  },
  {
    id: '3',
    name: 'Cypher Cloak',
    title: 'NFT & Digital Art Specialist',
    expertise: 'NFTs, Digital Art, Metaverse',
    rating: 4.7,
    reviews: 156,
    price: 0.4,
    avatar: '👩‍🎨',
    bio: 'Curator and advisor for NFT projects and digital art',
  },
  {
    id: '4',
    name: 'Feezy',
    title: 'Team1NG Lead',
    expertise: 'Gaming, Leadership, Community',
    rating: 5.0,
    reviews: 203,
    price: 1.0,
    avatar: '👨‍🔬',
    bio: 'Professional trader with expertise in crypto markets',
  },
];

export default function FindExpertPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [expertsList, setExpertsList] = useState<ExpertCard[]>(defaultExperts);
  const [profileReminder, setProfileReminder] = useState<string | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('expertProfile');
    const hasProfileContext =
      localStorage.getItem('userName') || localStorage.getItem('walletAddress');

    if (!storedProfile) {
      setProfileReminder(
        hasProfileContext
          ? 'Complete your Name, Title, Expertise, Price, and Bio in Settings to publish your expert card here.'
          : null,
      );
      setExpertsList(defaultExperts);
      return;
    }

    try {
      const parsed = JSON.parse(storedProfile) as ExpertProfile;
      const isComplete =
        Boolean(parsed.name) &&
        Boolean(parsed.title) &&
        Boolean(parsed.expertise) &&
        typeof parsed.price === 'number' &&
        Boolean(parsed.bio);

      if (!isComplete) {
        setProfileReminder(
          'Your saved expert card is missing details. Update it in Settings to display it here.',
        );
        setExpertsList(defaultExperts);
        return;
      }

      const personalExpert: ExpertCard = {
        ...parsed,
        rating: parsed.rating ?? 5,
        reviews: parsed.reviews ?? 0,
        avatar: parsed.avatar ?? '🧑‍💼',
      };

      setExpertsList([
        personalExpert,
        ...defaultExperts.filter((expert) => expert.id !== personalExpert.id),
      ]);
      setProfileReminder(null);
    } catch (error) {
      console.error('Failed to parse saved expert profile', error);
      setProfileReminder(
        'We could not load your saved expert card. Please re-save it from the Settings page.',
      );
      setExpertsList(defaultExperts);
    }
  }, []);

  const filteredExperts = expertsList.filter((expert) => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.expertise.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExpertise = selectedExpertise === 'all' || 
      expert.expertise.toLowerCase().includes(selectedExpertise.toLowerCase());
    return matchesSearch && matchesExpertise;
  });

  const expertiseOptions = Array.from(
    new Set(expertsList.flatMap((expert) => expert.expertise.split(', '))),
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find an Expert
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse through our verified experts and book a consultation
          </p>
        </div>

        {profileReminder && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p>
              {profileReminder}{' '}
              <Link href="/settings" className="font-semibold underline decoration-dotted">
                Update settings
              </Link>
            </p>
          </div>
        )}

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Expertise</option>
              {expertiseOptions.map((exp) => (
                <option key={exp} value={exp.toLowerCase()}>{exp}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <Link
              key={expert.id}
              href={`/expert/${expert.id}`}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg hover:border-red-500 dark:hover:border-red-500 transition-all flex flex-col"
            >
              {expert.bannerImage && (
                <div
                  className="h-24 rounded-lg mb-4 bg-cover bg-center"
                  style={{ backgroundImage: `url(${expert.bannerImage})` }}
                />
              )}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center">
                  {expert.avatar ? (
                    <span className="text-3xl leading-none">{expert.avatar}</span>
                  ) : (
                    <User className="w-8 h-8 text-red-600 dark:text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {expert.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {expert.title}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {expert.bio}
              </p>
              
              {expert.xAccount && (
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/30 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-4">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
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
                      <div className="w-full h-full flex items-center justify-center bg-black text-white">
                        @
                      </div>
                    )}
                  </div>
                  <span>Connected to @{expert.xAccount.handle}</span>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expertise</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {expert.expertise}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {expert.rating}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({expert.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                    {expert.price} AVAX
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">per 30 min</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No experts found matching your criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

