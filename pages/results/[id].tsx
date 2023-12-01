import GameResut from '@/components/GameResut'
import InviteModal from '@/components/InviteModal'
import { generateGameData, generateScores } from '@/utils/fakeData'
import { GameStruct, ScoreStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'

interface PageProps {
  gameData: GameStruct
  scoresData: ScoreStruct[]
}

const Page: NextPage<PageProps> = ({ gameData, scoresData }) => {
  return (
    <div>
      <Head>
        <title>Play2Earn | Game Result</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameResut game={gameData} scores={scoresData} />
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
