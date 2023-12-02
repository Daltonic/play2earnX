import GameResut from '@/components/GameResut'
import InviteModal from '@/components/InviteModal'
import { globalActions } from '@/store/globalSlices'
import { generateGameData, generateScores } from '@/utils/fakeData'
import { GameStruct, RootState, ScoreStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
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
      {game && <GameResut game={game} scores={scores} />}
      <InviteModal />
    </div>
  )
}

export default Page

export const getServerSideProps = async () => {
  const gameData: GameStruct = generateGameData(1)[0]
  const scoresData: ScoreStruct[] = generateScores(8)
  return {
    props: {
      gameData: JSON.parse(JSON.stringify(gameData)),
      scoresData: JSON.parse(JSON.stringify(scoresData)),
    },
  }
}
