//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract PlayToEarnX is Ownable, ReentrancyGuard, ERC20 {
  using Counters for Counters.Counter;
  using SafeMath for uint256;

  Counters.Counter private _totalGames;
  Counters.Counter private _totalPlayers;
  Counters.Counter private _totalInvitations;

  struct GameStruct {
    uint256 id;
    string title;
    string description;
    address owner;
    uint256 participants;
    uint256 numberOfWinners;
    uint256 acceptees;
    uint256 stake;
    uint256 startDate;
    uint256 endDate;
    uint256 timestamp;
    bool deleted;
    bool paidOut;
  }

  struct PlayerStruct {
    uint id;
    uint gameId;
    address account;
  }

  struct InvitationStruct {
    uint256 id;
    string title;
    uint256 gameId;
    address receiver;
    address sender;
    bool responded;
    bool accepted;
    uint256 stake;
    uint256 timestamp;
  }

  struct ScoreStruct {
    uint id;
    uint gameId;
    address player;
    uint score;
    uint prize;
    bool played;
  }

  uint256 private totalBalance;
  uint256 public servicePct;

  mapping(uint => bool) gameExists;
  mapping(uint256 => GameStruct) games;
  mapping(uint256 => PlayerStruct[]) players;
  mapping(uint256 => ScoreStruct[]) scores;
  mapping(uint256 => mapping(address => bool)) isListed;
  mapping(uint256 => mapping(address => bool)) isInvited;
  mapping(uint256 => InvitationStruct[]) invitationsOf;

  constructor(uint256 _pct) ERC20('Play2Earn', 'P2E') {
    servicePct = _pct;
  }

  function createGame(
    string memory title,
    string memory description,
    uint256 participants,
    uint256 numberOfWinners,
    uint256 startDate,
    uint256 endDate
  ) public payable {
    require(msg.value > 0 ether, 'Stake must be greater than zero');
    require(participants > 1, 'Participants must be greater than one');
    require(bytes(title).length > 0, 'Title cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(startDate > 0, 'Start date must be greater than zero');
    require(endDate > startDate, 'End date must be greater than start date');
    require(numberOfWinners > 0, 'Number Of winners cannot be zero');

    _totalGames.increment();
    GameStruct memory game;

    game.id = _totalGames.current();
    game.title = title;
    game.description = description;
    game.participants = participants;
    game.numberOfWinners = numberOfWinners;
    game.startDate = startDate;
    game.endDate = endDate;
    game.stake = msg.value;
    game.owner = msg.sender;
    game.timestamp = currentTime();

    games[game.id] = game;
    gameExists[game.id] = true;

    require(playerCreated(game.id), 'Failed to create player');
    require(scoreCreated(game.id), 'Failed to create score');
  }

  function playerCreated(uint gameId) internal returns (bool) {
    _totalPlayers.increment();

    PlayerStruct memory player;
    player.id = _totalPlayers.current();
    player.gameId = gameId;
    player.account = msg.sender;
    players[gameId].push(player);

    isListed[gameId][msg.sender] = true;
    games[gameId].acceptees++;

    totalBalance += msg.value;
    return true;
  }

  function scoreCreated(uint gameId) internal returns (bool) {
    ScoreStruct memory score;
    score.id = scores[gameId].length;
    score.gameId = gameId;
    score.player = msg.sender;
    scores[gameId].push(score);
    return true;
  }

  function deleteGame(uint256 gameId) public {
    require(gameExists[gameId], 'Game not found');
    require(games[gameId].owner == msg.sender, 'Unauthorized entity');
    require(games[gameId].acceptees == 1, 'Participants already in game');

    players[gameId].pop();
    scores[gameId].pop();

    isListed[gameId][msg.sender] = false;
    payTo(msg.sender, games[gameId].stake);

    games[gameId].acceptees = 0;
    games[gameId].deleted = true;
  }

  function invitePlayer(uint256 gameId, address receiver) public {
    require(gameExists[gameId], 'Game not found');
    require(games[gameId].acceptees < games[gameId].participants, 'Out of capacity');
    require(!isListed[gameId][receiver], 'Player already accepted');

    _totalInvitations.increment();
    InvitationStruct memory invitation;

    invitation.id = _totalInvitations.current();
    invitation.gameId = gameId;
    invitation.title = games[gameId].title;
    invitation.receiver = receiver;
    invitation.sender = msg.sender;
    invitation.timestamp = currentTime();
    invitation.stake = games[gameId].stake;

    isInvited[gameId][receiver] = true;
    invitationsOf[gameId].push(invitation);
  }

  function acceptInvitation(uint256 gameId, uint256 index) public payable {
    require(gameExists[gameId], 'Game not found');
    require(msg.value >= games[gameId].stake, 'Insuffcient amount');
    require(invitationsOf[gameId][index].receiver == msg.sender, 'Unauthorized entity');

    require(playerCreated(gameId), 'Failed to create player');
    require(scoreCreated(gameId), 'Failed to create score');

    invitationsOf[gameId][index].responded = true;
    invitationsOf[gameId][index].accepted = true;
  }

  function rejectInvitation(uint256 gameId, uint256 index) public {
    require(gameExists[gameId], 'Game not found');
    require(invitationsOf[gameId][index].receiver == msg.sender, 'Unauthorized entity');

    invitationsOf[gameId][index].responded = true;
  }

  function playGame(uint256 gameId, uint256 index, uint256 score) public {
    require(gameExists[gameId], 'Game not found');
    require(games[gameId].acceptees > games[gameId].numberOfWinners, 'Not enough players yet');
    require(scores[gameId][index].player == msg.sender, 'Unauthorized entity');
    require(!scores[gameId][index].played, 'Score already recorded');
    require(
      currentTime() > games[gameId].startDate && currentTime() < games[gameId].endDate,
      'Game play must be in session'
    );

    scores[gameId][index].score = score;
    scores[gameId][index].played = true;
  }

  function payout(uint256 gameId) public nonReentrant {
    require(gameExists[gameId], 'Game does not exist');
    require(currentTime() > games[gameId].endDate, 'Game still in session'); // disable on test
    require(!games[gameId].paidOut, 'Game already paid out');

    GameStruct memory game = games[gameId];

    uint256 totalStakes = game.stake.mul(game.acceptees);
    uint256 platformFee = (totalStakes.mul(servicePct)).div(100);
    uint256 creatorFee = platformFee.div(2);
    uint256 gameRevenue = totalStakes.sub(platformFee).sub(creatorFee);

    payTo(owner(), platformFee);
    payTo(game.owner, creatorFee);

    ScoreStruct[] memory Results = new ScoreStruct[](scores[gameId].length);
    Results = sortResult(scores[gameId]);

    for (uint i = 0; i < game.numberOfWinners; i++) {
      uint256 payoutAmount = gameRevenue.div(game.numberOfWinners);
      payTo(Results[i].player, payoutAmount);
      _mint(Results[i].player, payoutAmount);

      for (uint j = 0; j < scores[gameId].length; j++) {
        if (Results[i].player == scores[gameId][j].player) {
          scores[gameId][j].prize = payoutAmount;
        }
      }
    }

    games[gameId].paidOut = true;
  }

  function sortResult(
    ScoreStruct[] memory resultSheet
  ) internal pure returns (ScoreStruct[] memory) {
    uint256 counter = resultSheet.length;

    for (uint i = 0; i < counter - 1; i++) {
      for (uint j = 0; j < counter - j - 1; j++) {
        // Check if the players played before comparing their scores
        if (resultSheet[j].played && resultSheet[j + 1].played) {
          if (resultSheet[j].score > resultSheet[j + 1].score) {
            // Swap the elements
            ScoreStruct memory temp = resultSheet[j];
            resultSheet[j] = resultSheet[j + 1];
            resultSheet[j + 1] = temp;
          }
        } else if (!resultSheet[j].played && resultSheet[j + 1].played) {
          // Sort players who didn't play below players who played
          // Swap the elements
          ScoreStruct memory temp = resultSheet[j];
          resultSheet[j] = resultSheet[j + 1];
          resultSheet[j + 1] = temp;
        }
      }
    }

    return resultSheet;
  }

  function setFeePercent(uint256 _pct) public onlyOwner {
    require(_pct > 0 && _pct <= 10, 'Fee percent must be in the range of (1 - 10)');
    servicePct = _pct;
  }

  function getGames() public view returns (GameStruct[] memory Games) {
    uint256 available;
    for (uint i = 1; i <= _totalGames.current(); i++) {
      if (!games[i].deleted && !games[i].paidOut) {
        available++;
      }
    }

    Games = new GameStruct[](available);

    uint256 index;
    for (uint i = 1; i <= _totalGames.current(); i++) {
      if (!games[i].deleted && !games[i].paidOut) {
        Games[index++] = games[i];
      }
    }
  }

  function getPaidOutGames() public view returns (GameStruct[] memory Games) {
    uint256 available;
    for (uint i = 1; i <= _totalGames.current(); i++) {
      if (!games[i].deleted && games[i].paidOut) {
        available++;
      }
    }

    Games = new GameStruct[](available);

    uint256 index;
    for (uint i = 1; i <= _totalGames.current(); i++) {
      if (!games[i].deleted && games[i].paidOut) {
        Games[index++] = games[i];
      }
    }
  }

  function getMyGames() public view returns (GameStruct[] memory Games) {
    uint256 available;
    for (uint i = 1; i <= _totalGames.current(); i++) {
      if (!games[i].deleted && games[i].owner == msg.sender) {
        available++;
      }
    }

    Games = new GameStruct[](available);

    uint256 index;
    for (uint i = 1; i <= _totalGames.current(); i++) {
      if (!games[i].deleted && games[i].owner == msg.sender) {
        Games[index++] = games[i];
      }
    }
  }

  function getGame(uint256 gameId) public view returns (GameStruct memory) {
    return games[gameId];
  }

  function getScores(uint256 gameId) public view returns (ScoreStruct[] memory) {
    return scores[gameId];
  }

  function getInvitations(uint256 gameId) public view returns (InvitationStruct[] memory) {
    return invitationsOf[gameId];
  }

  function getMyInvitations() public view returns (InvitationStruct[] memory Invitations) {
    uint256 available;
    for (uint i = 1; i <= _totalGames.current(); i++) {
      if (isInvited[i][msg.sender]) {
        available++;
      }
    }

    Invitations = new InvitationStruct[](available);

    uint256 index;
    for (uint i = 1; i <= _totalGames.current(); i++) {
      if (isInvited[i][msg.sender]) {
        for (uint j = 0; j < invitationsOf[i].length; j++) {
          Invitations[index] = invitationsOf[i][j];
          Invitations[index].id = j;
        }
        index++;
      }
    }
  }

  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }

  function payTo(address to, uint256 amount) internal {
    (bool success, ) = payable(to).call{ value: amount }('');
    require(success);
  }
}
