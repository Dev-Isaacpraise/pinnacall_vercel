# Pinnacall Frontend

A platform for booking paid consultations with experts on the Avalanche C-Chain blockchain.

## Features

- **Landing Page**: Minimal, clean introduction to the platform
- **Wallet Connection**: Support for MetaMask, Core Wallet, and TrustWallet on Avalanche C-Chain
- **Find Experts**: Browse and search through verified expert profiles
- **Expert Profiles**: View expert details, availability, and book 30-minute calls
- **Dashboard**: Manage your bookings and view call history
- **Settings**: Configure wallet, theme, and notification preferences

## Design

- **Light Theme**: Red and white color scheme
- **Dark Theme**: Red and black color scheme
- Clean, modern UI with smooth transitions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A package manager (npm, yarn, pnpm, or bun)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pinacall/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/
│   │   │   └── page.tsx          # Login/Wallet connection
│   │   ├── find-expert/
│   │   │   └── page.tsx          # Expert search and listing
│   │   ├── expert/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Expert profile and booking
│   │   ├── dashboard/
│   │   │   └── page.tsx          # User dashboard
│   │   ├── settings/
│   │   │   └── page.tsx          # Settings page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   └── components/
│       ├── Navbar.tsx            # Navigation component
│       └── WalletConnect.tsx    # Wallet connection component
```

## Wallet Integration

The platform supports connecting wallets on Avalanche C-Chain:
- **MetaMask**: Standard MetaMask extension
- **Core Wallet**: Avalanche's official wallet
- **TrustWallet**: TrustWallet browser extension

When connecting, the app will automatically:
1. Request account access
2. Switch to Avalanche C-Chain (Chain ID: 43114)
3. Add the network if not already present

## Technologies

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Ethers.js**: Ethereum/Avalanche blockchain interaction

## Notes

- Currently uses mock data for experts and bookings
- Wallet connection stores data in localStorage
- Theme preference is saved in localStorage
- Booking functionality simulates transactions (ready for smart contract integration)

## Future Enhancements

- Smart contract integration for actual payments
- Google/Apple Calendar sync for expert availability
- Real-time booking updates
- Video call integration
- Expert registration and profile management
- Payment history and receipts
