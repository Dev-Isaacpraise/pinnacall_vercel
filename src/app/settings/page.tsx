'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  User,
  Clock,
  ImageIcon,
  Link2,
  Copy,
  Check,
  Loader2,
  Twitter,
} from 'lucide-react';
import { XAccountConnection } from '@/types/profile';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SettingsPage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [availability, setAvailability] = useState<Record<string, { enabled: boolean; start: string; end: string }>>({});
  const [notifications, setNotifications] = useState({
    email: true,
    booking: true,
    reminders: true,
  });
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [profileCard, setProfileCard] = useState({
    title: '',
    expertise: '',
    price: '',
    bio: '',
  });
  const [profileSlug, setProfileSlug] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [xAccount, setXAccount] = useState<XAccountConnection | null>(null);
  const [xHandleDraft, setXHandleDraft] = useState('');
  const [isXAuthorizing, setIsXAuthorizing] = useState(false);
  const [xAuthorizationReady, setXAuthorizationReady] = useState(false);

  const generateProfileSlug = (name: string, wallet: string | null) => {
    if (wallet) {
      return wallet.toLowerCase();
    }
    if (!name.trim()) {
      return '';
    }
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const buildProfileLink = (slug: string) => {
    if (typeof window === 'undefined' || !slug) {
      return '';
    }
    return `${window.location.origin}/expert/${slug}`;
  };

  useEffect(() => {
    const walletAddress = localStorage.getItem('walletAddress');
    const storedWalletType = localStorage.getItem('walletType');
    const storedName = localStorage.getItem('userName') || '';
    const storedAvailability = localStorage.getItem('availability');
    const storedBanner = localStorage.getItem('userBanner');
    const storedProfileCard = localStorage.getItem('expertProfileCard');
    const storedXAccount = localStorage.getItem('xAccount');
    
    if (walletAddress) {
      setIsConnected(true);
      setAddress(walletAddress);
      setWalletType(storedWalletType);
    }
    
    setUserName(storedName);

    // Initialize availability
    if (storedAvailability) {
      setAvailability(JSON.parse(storedAvailability));
    } else {
      const defaultAvailability: Record<string, { enabled: boolean; start: string; end: string }> = {};
      daysOfWeek.forEach(day => {
        defaultAvailability[day] = { enabled: false, start: '09:00', end: '17:00' };
      });
      setAvailability(defaultAvailability);
    }

    if (storedBanner) {
      setBannerImage(storedBanner);
    }

    if (storedProfileCard) {
      try {
        const parsed = JSON.parse(storedProfileCard);
        setProfileCard(parsed);
      } catch (error) {
        console.error('Failed to parse profile card data', error);
      }
    }

    if (storedXAccount) {
      try {
        const parsed = JSON.parse(storedXAccount);
        setXAccount(parsed);
        setXAuthorizationReady(true);
      } catch (error) {
        console.error('Failed to parse X account data', error);
      }
    }
  }, []);

  useEffect(() => {
    const slugValue = generateProfileSlug(userName, address);
    setProfileSlug(slugValue);
    setProfileLink(buildProfileLink(slugValue));
  }, [userName, address]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isComplete =
      Boolean(userName.trim()) &&
      Boolean(profileCard.title.trim()) &&
      Boolean(profileCard.expertise.trim()) &&
      Boolean(profileCard.price.trim()) &&
      Boolean(profileCard.bio.trim());

    localStorage.setItem('expertProfileCard', JSON.stringify(profileCard));

    if (isComplete && profileSlug) {
      const formattedProfile = {
        id: profileSlug,
        name: userName.trim(),
        title: profileCard.title.trim(),
        expertise: profileCard.expertise.trim(),
        price: Number(parseFloat(profileCard.price)),
        bio: profileCard.bio.trim(),
        bannerImage,
        xAccount,
      };
      localStorage.setItem('expertProfile', JSON.stringify(formattedProfile));
    } else {
      localStorage.removeItem('expertProfile');
    }
  }, [userName, profileCard, profileSlug, bannerImage, xAccount]);

  const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setBannerImage(result);
      localStorage.setItem('userBanner', result);
    };
    reader.readAsDataURL(file);
  };

  const clearBannerImage = () => {
    setBannerImage(null);
    localStorage.removeItem('userBanner');
  };

  const handleProfileCardChange = (
    field: keyof typeof profileCard,
    value: string,
  ) => {
    setProfileCard((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCopyProfileLink = async () => {
    if (!profileLink) return;
    try {
      await navigator.clipboard.writeText(profileLink);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2500);
    } catch (error) {
      console.error('Failed to copy profile link', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2500);
    }
  };

  const beginXAuthorization = () => {
    setIsXAuthorizing(true);
    if (typeof window !== 'undefined') {
      const oauthUrl =
        process.env.NEXT_PUBLIC_X_OAUTH_URL || 'https://twitter.com/i/oauth2/authorize';
      window.open(
        oauthUrl,
        '_blank',
        'noopener,noreferrer,width=600,height=700',
      );
    }
    setTimeout(() => {
      setIsXAuthorizing(false);
      setXAuthorizationReady(true);
    }, 1200);
  };

  const completeXConnection = async () => {
    if (!xHandleDraft.trim()) {
      alert('Enter the handle returned by X after authorizing access.');
      return;
    }

    setIsXAuthorizing(true);
    const normalizedHandle = xHandleDraft.replace('@', '').trim();

    try {
      // Simulate calling our backend to fetch X profile info
      const profile: XAccountConnection = {
        handle: normalizedHandle,
        displayName: normalizedHandle,
        profileImage: `https://unavatar.io/twitter/${normalizedHandle}`,
        profileUrl: `https://x.com/${normalizedHandle}`,
        connectedAt: new Date().toISOString(),
      };
      setXAccount(profile);
      localStorage.setItem('xAccount', JSON.stringify(profile));
      setXHandleDraft('');
    } finally {
      setIsXAuthorizing(false);
    }
  };

  const handleDisconnectX = () => {
    setXAccount(null);
    setXAuthorizationReady(false);
    localStorage.removeItem('xAccount');
  };

  const handleNameChange = (newName: string) => {
    setUserName(newName);
    localStorage.setItem('userName', newName);
  };

  const handleAvailabilityChange = (day: string, field: 'enabled' | 'start' | 'end', value: boolean | string) => {
    const updated = {
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value,
      },
    };
    setAvailability(updated);
    localStorage.setItem('availability', JSON.stringify(updated));
  };

  const handleDisconnect = () => {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
    setIsConnected(false);
    setAddress(null);
    setWalletType(null);
    router.push('/login');
  };

  const profileCardComplete =
    Boolean(userName.trim()) &&
    Boolean(profileCard.title.trim()) &&
    Boolean(profileCard.expertise.trim()) &&
    Boolean(profileCard.price.trim()) &&
    Boolean(profileCard.bio.trim());

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your account preferences
          </p>
        </div>

        {/* Expert Card Details */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Expert Card (Find Experts)
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete every field below to display your card on the Find Experts page.
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                profileCardComplete
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
              }`}
            >
              {profileCardComplete ? 'Ready to publish' : 'Missing details'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={profileCard.title}
                onChange={(e) => handleProfileCardChange('title', e.target.value)}
                placeholder="e.g. Blockchain Consultant"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expertise
              </label>
              <input
                type="text"
                value={profileCard.expertise}
                onChange={(e) => handleProfileCardChange('expertise', e.target.value)}
                placeholder="DeFi, NFTs, Smart Contracts"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price per 30 min (AVAX)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={profileCard.price}
                onChange={(e) => handleProfileCardChange('price', e.target.value)}
                placeholder="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name (from profile section)
              </label>
              <input
                type="text"
                value={userName}
                readOnly
                className="w-full px-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-950/40 text-gray-900 dark:text-gray-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Update your name in the Profile Information card above.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              value={profileCard.bio}
              onChange={(e) => handleProfileCardChange('bio', e.target.value)}
              placeholder="Describe your experience and the value you provide."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Banner
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-950/40">
                {bannerImage ? (
                  <div className="relative">
                    <img
                      src={bannerImage}
                      alt="Profile banner"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={clearBannerImage}
                      className="absolute top-3 right-3 px-3 py-1.5 text-sm font-medium bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white rounded-lg shadow hover:bg-white"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 text-center cursor-pointer py-10">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Upload a banner
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recommended size: 1600x400px
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleBannerChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={userName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Profile Link */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Shareable Profile Link
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Copy your Pinnacall profile so anyone can view and book you.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={profileLink || 'Complete your card to generate a shareable link'}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-950/40 text-gray-900 dark:text-gray-200"
            />
            <button
              onClick={handleCopyProfileLink}
              disabled={!profileLink}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copyStatus === 'copied' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copyStatus === 'copied' ? 'Copied!' : 'Copy link'}
            </button>
          </div>
          {!profileLink && (
            <p className="text-xs text-amber-600 dark:text-amber-300 mt-2">
              Fill out Name, Title, Expertise, Price, and Bio to unlock your public link.
            </p>
          )}
          {copyStatus === 'error' && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              Unable to copy. Please try again or copy manually.
            </p>
          )}
        </div>

        {/* Availability Settings */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Availability Hours
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Set your available hours for each day of the week
          </p>
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={availability[day]?.enabled || false}
                    onChange={(e) => handleAvailabilityChange(day, 'enabled', e.target.checked)}
                    className="w-4 h-4 text-red-600 dark:text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label className="text-sm font-medium text-gray-900 dark:text-white min-w-[100px]">
                    {day}
                  </label>
                </div>
                {availability[day]?.enabled && (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="time"
                      value={availability[day]?.start || '09:00'}
                      onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-gray-600 dark:text-gray-400">to</span>
                    <input
                      type="time"
                      value={availability[day]?.end || '17:00'}
                      onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Settings */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Wallet Connection
          </h2>
          {isConnected ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wallet Type</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {walletType || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</p>
                <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                  {address}
                </p>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No wallet connected
              </p>
              <a
                href="/login"
                className="inline-block px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium"
              >
                Connect Wallet
              </a>
            </div>
          )}
        </div>

        {/* X Account Connection */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Twitter className="w-5 h-5" />
                Connect X Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We only request read access to your public profile so we can show a verified badge on your expert card.
              </p>
            </div>
          </div>
          {xAccount ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={xAccount.profileImage}
                  alt={xAccount.handle}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden';
                  }}
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    @{xAccount.handle}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connected on {new Date(xAccount.connectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={xAccount.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold"
                >
                  <Twitter className="w-4 h-4" />
                  View on X
                </a>
                <button
                  onClick={handleDisconnectX}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click authorize to open the secure X OAuth flow. Once approved, confirm the handle that granted access so we can show your badge.
              </p>
              <div className="flex flex-col lg:flex-row gap-3">
                <button
                  onClick={beginXAuthorization}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-60"
                  disabled={isXAuthorizing}
                >
                  {isXAuthorizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Twitter className="w-4 h-4" />
                      Authorize with X
                    </>
                  )}
                </button>
                <input
                  type="text"
                  placeholder="@handle returned by X"
                  value={xHandleDraft}
                  onChange={(e) => setXHandleDraft(e.target.value)}
                  disabled={!xAuthorizationReady}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50"
                />
                <button
                  onClick={completeXConnection}
                  disabled={!xAuthorizationReady || isXAuthorizing}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white disabled:opacity-50"
                >
                  Finish connection
                </button>
              </div>
              {!xAuthorizationReady && (
                <p className="text-xs text-amber-600 dark:text-amber-300">
                  Start authorization first. The handle field unlocks once X redirects you back.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive updates via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600 dark:peer-checked:bg-red-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Booking Confirmations</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when bookings are confirmed
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.booking}
                  onChange={(e) =>
                    setNotifications({ ...notifications, booking: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600 dark:peer-checked:bg-red-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Reminders</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive reminders before scheduled calls
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminders}
                  onChange={(e) =>
                    setNotifications({ ...notifications, reminders: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600 dark:peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            About Pinnacall
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Pinnacall is a platform for booking paid consultations with experts on the Avalanche blockchain.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Version 1.0.0</p>
            <p className="mt-2">Network: Avalanche C-Chain</p>
          </div>
        </div>
      </main>
    </div>
  );
}

