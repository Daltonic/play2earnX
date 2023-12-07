import GameResult from '@/components/GameResult'
import InviteModal from '@/components/InviteModal'
import { getGame, getScores } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { GameStruct, RootState, ScoreStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface PageProps {
  gameData: GameStruct
  scoresData: ScoreStruct[]
}

const Page: NextPage<PageProps> = ({ gameData, scoresData }) => {
  const dispatch = useDispatch()
  const { setGame, setScores } = globalActions
  const { game, scores } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setGame(gameData))
    dispatch(setScores(scoresData))
  }, [dispatch, setGame, gameData, setScores, scoresData])

  return (
    <div>
      <Head>
        <title>Play2Earn | Game Result</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {game && <GameResult game={game} scores={scores} />}
      <InviteModal />
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
