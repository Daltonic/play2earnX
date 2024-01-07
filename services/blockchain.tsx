import { ethers } from 'ethers'
import address from '@/contracts/contractAddress.json'
import abi from '@/artifacts/contracts/Play2EarnX.sol/PlayToEarnX.json'
import { GameParams, GameStruct, InvitationStruct, ScoreStruct } from '@/utils/type.dt'
import { globalActions } from '@/store/globalSlices'
import { store } from '@/store'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = window.ethereum
const { setGames, setInvitations } = globalActions

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(address.playToEarnXContract, abi.abi, signer)
    return contract
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contract = new ethers.Contract(address.playToEarnXContract, abi.abi, signer)
    return contract
  }
}

const getGames = async (): Promise<GameStruct[]> => {
  const contract = await getEthereumContracts()
  const games = await contract.getGames()
  return structuredGames(games)
}

const getMyGames = async (): Promise<GameStruct[]> => {
  const contract = await getEthereumContracts()
  const games = await contract.getMyGames()
  return structuredGames(games)
}

const getGame = async (gameId: number): Promise<GameStruct> => {
  const contract = await getEthereumContracts()
  const game = await contract.getGame(gameId)
  return structuredGames([game])[0]
}

const getInvitations = async (gameId: number): Promise<InvitationStruct[]> => {
  const contract = await getEthereumContracts()
  const invitations = await contract.getInvitations(gameId)
  return structuredInvitations(invitations)
}

const getMyInvitations = async (): Promise<InvitationStruct[]> => {
  const contract = await getEthereumContracts()
  const invitations = await contract.getMyInvitations()
  return structuredInvitations(invitations)
}

const getScores = async (gameId: number): Promise<ScoreStruct[]> => {
  const contract = await getEthereumContracts()
  const scores = await contract.getScores(gameId)
  return structuredScores(scores)
}

const createGame = async (game: GameParams) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Brower provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.createGame(
      game.title,
      game.description,
      game.participants,
      game.numberOfWinners,
      game.startDate,
      game.endDate,
      { value: toWei(Number(game.stake)) }
    )

    await tx.wait()

    const games: GameStruct[] = await getGames()
    store.dispatch(setGames(games))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const deleteGame = async (gameId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Brower provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.deleteGame(gameId)
    await tx.wait()

    const games: GameStruct[] = await getGames()
    store.dispatch(setGames(games))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const invitePlayer = async (gameId: number, receiver: string): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Brower provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.invitePlayer(gameId, receiver)
    await tx.wait()

    const invitations: InvitationStruct[] = await getInvitations(gameId)
    store.dispatch(setInvitations(invitations))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const respondToInvite = async (
  accepted: boolean,
  invitation: InvitationStruct,
  index: number
): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Brower provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    if (accepted) {
      tx = await contract.acceptInvitation(invitation.gameId, index, {
        value: toWei(invitation.stake),
      })
    } else {
      tx = await contract.rejectInvitation(invitation.gameId, index)
    }

    await tx.wait()

    const invitations: InvitationStruct[] = await getMyInvitations()
    store.dispatch(setInvitations(invitations))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const structuredGames = (games: GameStruct[]): GameStruct[] =>
  games
    .map((game) => ({
      id: Number(game.id),
      title: game.title,
      participants: Number(game.participants),
      numberOfWinners: Number(game.numberOfWinners),
      acceptees: Number(game.acceptees),
      stake: parseFloat(fromWei(game.stake)),
      owner: game.owner,
      description: game.description,
      startDate: Number(game.startDate),
      endDate: Number(game.endDate),
      timestamp: Number(game.timestamp),
      deleted: game.deleted,
      paidOut: game.paidOut,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredInvitations = (invitations: InvitationStruct[]): InvitationStruct[] =>
  invitations
    .map((invitation) => ({
      id: Number(invitation.id),
      gameId: Number(invitation.gameId),
      title: invitation.title,
      sender: invitation.sender,
      receiver: invitation.receiver,
      stake: parseFloat(fromWei(invitation.stake)),
      accepted: invitation.accepted,
      responded: invitation.responded,
      timestamp: Number(invitation.timestamp),
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredScores = (scores: ScoreStruct[]): ScoreStruct[] =>
  scores
    .map((score) => ({
      id: Number(score.id),
      gameId: Number(score.gameId),
      player: score.player,
      prize: parseFloat(fromWei(score.prize)),
      score: Number(score.score),
      played: score.played,
    }))
    .sort((a, b) => a.score - b.score)

export {
  getGames,
  getMyGames,
  getGame,
  getInvitations,
  getScores,
  createGame,
  deleteGame,
  invitePlayer,
  getMyInvitations,
  respondToInvite,
}
