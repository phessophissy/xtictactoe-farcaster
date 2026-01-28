# Contributing to xTicTacToe Farcaster MiniApp

Thank you for your interest in contributing to xTicTacToe! This document provides guidelines for contributors.

## How to Contribute

### Reporting Issues

- Check existing [issues](https://github.com/phessophissy/xtictactoe-farcaster/issues) first
- Create a new issue with clear title, description, and reproduction steps
- Include browser/OS information for frontend issues
- For contract issues, include transaction hashes or contract addresses

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass: `npm test` (Now available!)
6. Update documentation if needed
7. Commit with clear messages
8. Push to your fork
9. Create a Pull Request

### Development Setup

1. Clone and install:
   ```bash
   git clone https://github.com/phessophissy/xtictactoe-farcaster.git
   cd xtictactoe-farcaster
   npm install
   ```

2. Set up environment:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your REOWN project ID
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. For contract development:
   - Install Hardhat or Foundry
   - Deploy to Base testnet for testing

### Code Style

- Use TypeScript with strict mode
- Follow existing patterns for React components
- Use Tailwind CSS classes consistently
- Write clear, concise function names
- Add JSDoc comments for complex functions
- Keep lines under 100 characters

### Testing

- Write unit tests for utilities and hooks
- Test components with React Testing Library
- Test contract functions with Hardhat
- Ensure contracts are tested on testnets before mainnet

### Smart Contracts

- Follow Solidity best practices
- Use OpenZeppelin contracts where appropriate
- Add comprehensive tests
- Audit contracts before mainnet deployment
- Document all public functions

### Commit Messages

- Use imperative mood: "Add feature" not "Added feature"
- Start with type: feat:, fix:, docs:, refactor:, test:
- Keep first line under 50 characters
- Add body for complex changes

### Documentation

- Update README.md for major changes
- Document new components in docs/
- Update API comments
- Add examples for new features

## Game Features to Contribute

### High Priority
- WebSocket implementation for real-time matchmaking
- Backend API for leaderboard and stats
- Mobile responsiveness improvements
- AI difficulty balancing

### Medium Priority
- Tournament mode
- Custom game boards/themes
- Social features (spectating, challenges)
- Multiplayer variants (Connect 4, etc.)

### Low Priority
- Sound pack options
- Achievement system
- In-game chat
- Replay functionality

## Security

- Never commit private keys or .env files
- Use environment variables for sensitive data
- Audit smart contracts thoroughly
- Follow Web3 security best practices

## License

By contributing, you agree to license your work under the MIT License.