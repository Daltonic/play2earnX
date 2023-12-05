import { ethers } from 'ethers'
import address from '@/contracts/contractAddress.json'
import p2eAbi from '@/artifacts/contracts/Play2EarnX.sol/PlayToEarnX.json'
import { GameStruct } from '@/utils/type.dt'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = (window as any).ethereum

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address.playToEarnXContract, p2eAbi.abi, signer)

    return contracts
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contracts = new ethers.Contract(address.playToEarnXContract, p2eAbi.abi, signer)

    return contracts
  }
}

const getOwner = async (): Promise<string> => {
  const contract = await getEthereumContracts()
  const owner = await contract.owner()
  return owner
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

export { getOwner, getGames, getMyGames, getGame }
