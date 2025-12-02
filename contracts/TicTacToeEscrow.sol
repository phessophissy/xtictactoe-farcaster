// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract TicTacToeEscrow {
    address public constant CREATOR = 0xb3A25a477C97F8Ae2d9C52B7acfbe2C8E259d5d9;
    address public immutable USDC; // Base USDC
    uint256 public constant ENTRY_FEE = 1e6; // 1 USDC
    uint256 public constant CREATOR_FEE = 3e5; // 0.30 USDC
    uint256 public constant WINNER_PAYOUT = 17e5; // 1.70 USDC
    
    address public immutable PAYMASTER; // Gas sponsor
    
    struct Game {
        address player1;
        address player2;
        uint256 pot;
        bool active;
        bool completed;
    }
    
    mapping(uint256 => Game) public games;
    mapping(address => uint256) public wins;
    mapping(address => uint256) public losses;
    mapping(address => uint256) public totalGames;
    
    uint256 public gameCounter;
    
    event GameCreated(uint256 indexed gameId, address indexed player1, address indexed player2);
    event GameJoined(uint256 indexed gameId, address indexed player2);
    event GameCompleted(uint256 indexed gameId, address indexed winner, uint256 payout);
    event SponsoredEntry(uint256 indexed gameId, address indexed player);
    
    constructor(address _paymaster, address _usdc) {
        PAYMASTER = _paymaster;
        USDC = _usdc;
    }
    
    // Create open game (matchmaking) - anyone can join
    function createGame(address opponent) external returns (uint256) {
        IERC20(USDC).transferFrom(msg.sender, address(this), ENTRY_FEE);
        
        uint256 gameId = ++gameCounter;
        games[gameId] = Game({
            player1: msg.sender,
            player2: opponent, // address(0) for open lobby
            pot: ENTRY_FEE,
            active: true,
            completed: false
        });
        
        emit GameCreated(gameId, msg.sender, opponent);
        return gameId;
    }
    
    function createGameSponsored(address player1, address opponent) external returns (uint256) {
        require(msg.sender == PAYMASTER, "Only paymaster");
        require(opponent != address(0), "Invalid opponent");
        require(opponent != player1, "Cannot play yourself");
        
        IERC20(USDC).transferFrom(PAYMASTER, address(this), ENTRY_FEE);
        
        uint256 gameId = ++gameCounter;
        games[gameId] = Game({
            player1: player1,
            player2: opponent,
            pot: ENTRY_FEE,
            active: true,
            completed: false
        });
        
        emit GameCreated(gameId, player1, opponent);
        emit SponsoredEntry(gameId, player1);
        return gameId;
    }
    
    function joinGame(uint256 gameId) external {
        Game storage game = games[gameId];
        require(game.active, "Game not active");
        require(!game.completed, "Game completed");
        require(game.player2 == address(0) || msg.sender == game.player2, "Game full or not invited");
        require(msg.sender != game.player1, "Cannot play yourself");
        
        IERC20(USDC).transferFrom(msg.sender, address(this), ENTRY_FEE);
        
        game.player2 = msg.sender; // Assign player2
        game.pot += ENTRY_FEE;
        
        emit GameJoined(gameId, msg.sender);
    }
    
    function joinGameSponsored(uint256 gameId, address player2) external {
        require(msg.sender == PAYMASTER, "Only paymaster");
        Game storage game = games[gameId];
        require(game.active, "Game not active");
        require(!game.completed, "Game completed");
        require(player2 == game.player2, "Not invited");
        
        IERC20(USDC).transferFrom(PAYMASTER, address(this), ENTRY_FEE);
        
        game.pot += ENTRY_FEE;
        
        emit GameJoined(gameId, player2);
        emit SponsoredEntry(gameId, player2);
    }
    
    function payout(uint256 gameId, address winner) external {
        Game storage game = games[gameId];
        require(game.active, "Game not active");
        require(!game.completed, "Already completed");
        require(game.pot == ENTRY_FEE * 2, "Incomplete pot");
        require(winner == game.player1 || winner == game.player2, "Invalid winner");
        require(msg.sender == game.player1 || msg.sender == game.player2 || msg.sender == CREATOR, "Unauthorized");
        
        game.active = false;
        game.completed = true;
        
        // Update stats
        wins[winner]++;
        totalGames[winner]++;
        
        address loser = winner == game.player1 ? game.player2 : game.player1;
        losses[loser]++;
        totalGames[loser]++;
        
        // Transfer payouts
        IERC20(USDC).transfer(CREATOR, CREATOR_FEE);
        IERC20(USDC).transfer(winner, WINNER_PAYOUT);
        
        emit GameCompleted(gameId, winner, WINNER_PAYOUT);
    }
    
    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }
    
    function getPlayerStats(address player) external view returns (uint256 _wins, uint256 _losses, uint256 _total) {
        return (wins[player], losses[player], totalGames[player]);
    }
    
    function getLeaderboard(uint256 limit) external pure returns (address[] memory, uint256[] memory) {
        address[] memory players = new address[](limit);
        uint256[] memory playerWins = new uint256[](limit);
        return (players, playerWins);
    }
}
