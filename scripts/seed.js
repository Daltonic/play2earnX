const { faker } = require('@faker-js/faker')
const { ethers } = require('hardhat')
const fs = require('fs')

const toWei = (num) => ethers.parseEther(num.toString())
const dataCount = 5

const generateGameData = (count) => {
  const games = []

  for (let i = 0; i < count; i++) {
    const game = {
      id: i + 1,
      title: faker.lorem.words(5),
      description: faker.lorem.paragraph(),
      owner: faker.string.hexadecimal({
        length: { min: 42, max: 42 },
        prefix: '0x',
      }),
      participants: 2,
      winners: 1,
      acceptees: faker.number.int({ min: 1, max: 2 }),
      stake: faker.number.float({ min: 0.01, max: 0.1 }),
      starts: faker.date.past().getTime(),
      ends: faker.date.future().getTime(),
      timestamp: faker.date.past().getTime(),
      deleted: faker.datatype.boolean(),
      paidOut: faker.datatype.boolean(),
    }
    games.push(game)
  }

  return games
}

const generateInvitations = async (count) => {
  ;[deployer, owner, player1, player2] = await ethers.getSigners()
  const invitations = []

  for (let i = 0; i < count; i++) {
    const game = {
      gameId: i + 1,
      account: Math.random() < 0.5 ? player1 : player2,
      stake: faker.number.float({ min: 0.01, max: 0.1 }),
      responded: faker.datatype.boolean(),
      accepted: faker.datatype.boolean(),
    }
    invitations.push(game)
  }

  return invitations
}

async function createGame(contract, game) {
  const tx = await contract.createGame(
    game.title,
    game.description,
    game.participants,
    game.winners,
    game.starts,
    game.ends,
    { value: toWei(game.stake) }
  )
  await tx.wait()
}

async function sendInvitation(contract, player) {
  const tx = await contract.invitePlayer(player.account, player.gameId)
  await tx.wait()
}

async function getGames(contract) {
  const result = await contract.getGames()
  console.log('Games:', result)
}

async function getInvitations(contract, gameId) {
  const result = await contract.getInvitations(gameId)
  console.log('Invitations:', result)
}

async function getMyInvitations(contract) {
  const result = await contract.getMyInvitations()
  console.log('Invitations:', result)
}

async function main() {
  let playToEarnXContract

  try {
    const contractAddresses = fs.readFileSync('./contracts/contractAddress.json', 'utf8')
    const { playToEarnXContract: playToEarnXAddress } = JSON.parse(contractAddresses)

    playToEarnXContract = await ethers.getContractAt('PlayToEarnX', playToEarnXAddress)

    // generateGameData(dataCount).forEach(async (game) => {
    //   await createGame(playToEarnXContract, game)
    // })

    // Array(dataCount)
    //   .fill()
    //   .forEach(async (charity, i) => {
    //     const randomCount = faker.number.int({ min: 1, max: 4 })
    //     const invitations = await generateInvitations(randomCount)

    //     invitations.forEach(async (player, i) => {
    //       await sendInvitation(playToEarnXContract, player)
    //     })
    //   })

    // await getGames(playToEarnXContract)
    // await getInvitations(playToEarnXContract, 1)
    // await getMyInvitations(playToEarnXContract)
  } catch (error) {
    console.error('Unhandled error:', error)
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exitCode = 1
})
