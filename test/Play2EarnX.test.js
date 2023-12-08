const { expect } = require('chai')
const { ethers } = require('hardhat')

const toWei = (num) => ethers.parseEther(num.toString())
const fromWei = (num) => ethers.formatEther(num)

describe('Contracts', () => {
  let contract, result
  const taxPct = 5

  const description = 'showcase your speed in a game'
  const title = 'Game title'
  const participants = 2
  const winners = 1
  const starts = Date.now() - 10 * 60 * 1000
  const ends = Date.now() + 10 * 60 * 1000
  const stake = 0.5
  const gameId = 1

  beforeEach(async () => {
    ;[deployer, owner, player1, player2] = await ethers.getSigners()
    contract = await ethers.deployContract('PlayToEarnX', [taxPct])
    await contract.waitForDeployment()
  })

  describe('Games Management', () => {
    beforeEach(async () => {
      await contract
        .connect(owner)
        .createGame(title, description, participants, winners, starts, ends, {
          value: toWei(stake),
        })
    })

    it('should confirm games creation', async () => {
      result = await contract.getGames()
      expect(result).to.have.lengthOf(1)

      result = await contract.connect(owner).getMyGames()
      expect(result).to.have.lengthOf(1)
    })

    it('should confirm games deletion', async () => {
      result = await contract.getGames()
      expect(result).to.have.lengthOf(1)

      result = await contract.getGame(gameId)
      expect(result.deleted).to.be.equal(false)

      await contract.connect(owner).deleteGame(gameId)

      result = await contract.getGames()
      expect(result).to.have.lengthOf(0)

      result = await contract.getGame(gameId)
      expect(result.deleted).to.be.equal(true)
    })
  })

  describe('Invitation Management', () => {
    beforeEach(async () => {
      await contract
        .connect(owner)
        .createGame(title, description, participants, winners, starts, ends, {
          value: toWei(stake),
        })

      await contract.invitePlayer(player1, gameId)
    })

    it('should confirm game invite', async () => {
      result = await contract.getInvitations(gameId)
      expect(result).to.have.lengthOf(1)

      result = await contract.connect(player1).getMyInvitations()
      expect(result).to.have.lengthOf(1)

      await contract.invitePlayer(player2, gameId)

      result = await contract.getInvitations(gameId)
      expect(result).to.have.lengthOf(2)

      result = await contract.connect(player2).getMyInvitations()
      expect(result).to.have.lengthOf(1)
    })

    it('should confirm invite acceptence', async () => {
      result = await contract.getInvitations(gameId)
      result = result[0]
      expect(result.responded).to.be.equal(false)
      expect(result.accepted).to.be.equal(false)

      const index = 0
      await contract.connect(player1).acceptInvitation(gameId, index, { value: toWei(stake) })

      result = await contract.getInvitations(gameId)
      result = result[0]
      expect(result.responded).to.be.equal(true)
      expect(result.accepted).to.be.equal(true)
    })

    it('should confirm invite rejection', async () => {
      result = await contract.getInvitations(gameId)
      result = result[0]
      expect(result.responded).to.be.equal(false)
      expect(result.accepted).to.be.equal(false)

      const index = 0
      await contract.connect(player1).rejectInvitation(gameId, index)

      result = await contract.getInvitations(gameId)
      result = result[0]
      expect(result.responded).to.be.equal(true)
      expect(result.accepted).to.be.equal(false)
    })
  })

  describe('Player Management', () => {
    const index = 0
    beforeEach(async () => {
      await contract
        .connect(owner)
        .createGame(title, description, participants, winners, starts, ends, {
          value: toWei(stake),
        })

      await contract.invitePlayer(player1, gameId)
      await contract.connect(player1).acceptInvitation(gameId, index, { value: toWei(stake) })
    })

    it('should confirm scoring and payout', async () => {
      result = await contract.getScores(gameId)
      expect(result).to.have.lengthOf(2)
      expect(result[index].played).to.be.equal(false)

      await contract.connect(owner).saveScore(gameId, index, 18)
      await contract.connect(player1).saveScore(gameId, index + 1, 15)

      result = await contract.getScores(gameId)
      expect(result[index].played).to.be.equal(true)

      result = await contract.getGames()
      expect(result).to.have.lengthOf(1)
      
      result = await contract.getPaidOutGames()
      expect(result).to.have.lengthOf(0)

      await contract.payout(gameId)

      result = await contract.getGames()
      expect(result).to.have.lengthOf(0)

      result = await contract.getPaidOutGames()
      expect(result).to.have.lengthOf(1)

      result = await contract.getGame(gameId)
      expect(result.paidOut).to.be.equal(true)
    })
  })
})
