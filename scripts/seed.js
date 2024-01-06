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
      participants: faker.number.int({ min: 20, max: 40 }),
      numberOfWinners: faker.number.int({ min: 1, max: 10 }),
      acceptees: faker.number.int({ min: 1, max: 10 }),
      stake: faker.number.float({ min: 0.01, max: 0.1 }),
      startDate: faker.date.past().getTime(),
      endDate: faker.date.future().getTime(),
      timestamp: Date.now(),
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
      account: Math.random() < 0.5 ? player1.address : player2.address,
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
    game.numberOfWinners,
    game.startDate,
    game.endDate,
    { value: toWei(game.stake) }
  )

  await tx.wait()
}

async function sendInvitation(contract, player) {
  const tx = await contract.invitePlayer(player.gameId, player.account)
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  let contract
  try {
    const contractAddress = fs.readFileSync('./contracts/contractAddress.json', 'utf8')
    const { playToEarnXContract: playToEarnXAddress } = JSON.parse(contractAddress)

    contract = await ethers.getContractAt('PlayToEarnX', playToEarnXAddress)

    // console.log(playToEarnXAddress);

    // Process #1
    await Promise.all(
      generateGameData(dataCount).map(async (game) => {
        await createGame(contract, game)
      })
    )

    await delay(2500) // waits for 2.5 seconds

    // Process #2
    await Promise.all(
      Array(dataCount)
        .fill()
        .map(async (_, i) => {
          const randomCount = faker.number.int({ min: 1, max: 2 })
          const invitations = await generateInvitations(randomCount)

          await Promise.all(
            invitations.map(async (player) => {
              await sendInvitation(contract, player)
            })
          )
        })
    )

    await delay(2500) // waits for 2.5 seconds

    // Process #3
    await getGames(contract)
    await getInvitations(contract, 1)
    await getMyInvitations(contract)
  } catch (error) {
    console.error('Unhandled error:', error)
    throw error
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exitCode = 1
})
