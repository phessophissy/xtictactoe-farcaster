# xTicTacToe Farcaster MiniApp

A production-ready xTicTacToe game built as a Farcaster MiniApp with blockchain integration on Base.

## Features

### Game Modes
- **AI Mode (Free)**: Practice against AI with adjustable difficulty (Easy, Medium, Hard)
- **PvP Mode ($1 USDC)**: Compete against other players for real money

### Advanced Features
- 🎮 **Matchmaking Lobby**: Find opponents in real-time
- 🏆 **Ranked Leaderboard**: Track your wins and climb the rankings
- ✨ **Animated UI**: Winning cells glow with smooth animations
- 🔊 **Sound Effects**: Audio feedback for moves, wins, and matches
- 📳 **Haptic Feedback**: Vibration support for mobile devices
- 🎚️ **AI Difficulty Slider**: Easy, Medium, or Hard opponent
- ⚡ **Gas-Sponsored Entry**: Optional free gas for PvP matches

### Tech Stack
- **Next.js 14** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Carton theme)
- **REOWN AppKit** (Wallet connection)
- **Wagmi + Viem** (Ethereum interaction)
- **Base Chain** (USDC payments)
- **Solidity** (Smart contract escrow)

## Project Structure

```
tictactoe-farcaster/
├── contracts/
│   └── TicTacToeEscrow.sol          # Solidity escrow contract
├── public/
│   └── farcaster.json               # Farcaster manifest
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Main app page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── GameBoard.tsx            # xTicTacToe board
│   │   ├── ModeSelector.tsx         # Game mode selection
│   │   ├── MatchmakingLobby.tsx     # Player matchmaking
│   │   ├── WaitingRoom.tsx          # Pre-game setup
│   │   └── Leaderboard.tsx          # Rankings display
│   ├── config/
│   │   ├── appkit.tsx               # REOWN AppKit setup
│   │   └── contracts.ts             # Contract addresses & ABIs
│   ├── hooks/
│   │   └── useContract.ts           # Contract interaction hooks
│   └── utils/
│       ├── game.ts                  # Game logic & AI
│       └── sound.ts                 # Audio & haptics
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

## Smart Contract

### TicTacToeEscrow.sol

**Features:**
- USDC-based escrow on Base
- Gas-sponsored entry option
- Stats tracking (wins/losses)
- Leaderboard support

**Key Functions:**
- `createGame(opponent)` - Create new game with USDC
- `createGameSponsored(player1, opponent)` - Gas-sponsored creation
- `joinGame(gameId)` - Join existing game
- `joinGameSponsored(gameId, player2)` - Gas-sponsored join
- `payout(gameId, winner)` - Distribute winnings
- `getPlayerStats(address)` - Get win/loss record

**Economics:**
- Entry fee: 1 USDC per player
- Total pot: 2 USDC
- Winner receives: 1.70 USDC
- Creator fee: 0.30 USDC

## Setup Instructions

### 1. Install Dependencies

```bash
cd tictactoe-farcaster
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
```

Get your REOWN Project ID from: https://cloud.reown.com

### 3. Deploy Smart Contract

```bash
# Install Hardhat/Foundry
# Deploy to Base
# Update CONTRACT_ADDRESS in src/config/contracts.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Update Farcaster Config

Edit `public/farcaster.json` with your deployed URLs:
- `homeUrl`: Your app URL
- `iconUrl`: App icon (512x512 PNG)
- `imageUrl`: Preview image (1200x630 PNG)
- `splashImageUrl`: Splash screen

## Contract Deployment

### Using Hardhat

```javascript
// hardhat.config.js
module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

```bash
npx hardhat run scripts/deploy.js --network base
```

### Using Foundry

```bash
forge create TicTacToeEscrow \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args $PAYMASTER_ADDRESS
```

## Configuration

### Contract Addresses

Update `src/config/contracts.ts`:
```typescript
export const CONTRACT_ADDRESS = '0x...'; // Your deployed contract
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base USDC
```

### Theme Customization

Edit `tailwind.config.js` to customize the carton theme colors.

## Game Flow

### AI Mode
1. Select "AI Mode"
2. Adjust difficulty slider
3. Play immediately (free)

### PvP Mode
1. Select "PvP Mode"
2. Enter matchmaking lobby
3. Quick match or challenge specific player
4. Approve USDC (or use gas-sponsored)
5. Create/join game
6. Play match
7. Winner receives payout automatically

## API Integration

### Matchmaking (To Implement)

Use WebSocket or Server-Sent Events for real-time matchmaking:

```typescript
// Example WebSocket integration
const ws = new WebSocket('wss://your-api.com/matchmaking');
ws.send(JSON.stringify({ action: 'findMatch', userId }));
```

### Leaderboard (To Implement)

Fetch from subgraph or backend API:

```typescript
const response = await fetch('/api/leaderboard?limit=10');
const data = await response.json();
```

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers with Web3 wallet support

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

For coverage report:

```bash
npm run test:coverage
```

## License

MIT

## Security

- Never commit `.env.local`
- Audit smart contracts before mainnet deployment
- Use hardware wallet for contract deployment
- Enable two-factor authentication on Vercel/hosting

## Support

For issues or questions, please open a GitHub issue.
