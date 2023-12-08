import GameResult from '@/components/GameResult'
import { getGame, getScores, payout } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { GameStruct, RootState, ScoreStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

interface PageProps {
  gameData: GameStruct
  scoresData: ScoreStruct[]
}

const Page: NextPage<PageProps> = ({ gameData, scoresData }) => {
  const dispatch = useDispatch()
  const { address } = useAccount()
  const { setGame, setScores } = globalActions
  const { game, scores } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setGame(gameData))
    dispatch(setScores(scoresData))
  }, [dispatch, setGame, gameData, setScores, scoresData])

  const handlePayout = async () => {
    if (!address) return toast.warning('Connect wallet first!')
    if (!game) return toast.warning('Game data not found')

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        payout(game.id)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Score saved successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div>
      <Head>
        <title>Play2Earn | Game Result</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {game && <GameResult game={game} scores={scores} />}

      <div className="flex justify-center space-x-2">
        <button
          className="bg-transparent border border-orange-700 hover:bg-orange-800
          py-2 px-6 text-orange-700 hover:text-white rounded-full
          transition duration-300 ease-in-out"
          onClick={handlePayout}
        >
          Payout
        </button>
      </div>
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const gameData: GameStruct = await getGame(Number(id))
  const scoresData: ScoreStruct[] = await getScores(Number(id))

  return {
    props: {
      gameData: JSON.parse(JSON.stringify(gameData)),
      scoresData: JSON.parse(JSON.stringify(scoresData)),
    },
  }
}
