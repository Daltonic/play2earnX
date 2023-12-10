import CreateGame from '@/components/CreateGame'
import GameDetails from '@/components/GameDetails'
import GameList from '@/components/GameList'
import Hero from '@/components/Hero'
import { generateGameData } from '@/utils/fakeData'
import { GameStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'

const Page: NextPage<{ gamesData: GameStruct[] }> = ({ gamesData }) => {
  return (
    <div>
      <Head>
        <title>Play2Earn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />

      {gamesData.length > 1 && (
        <>
          <GameList games={gamesData} />
          <GameDetails />
        </>
      )}
      <CreateGame />
    </div>
  )
}

export default Page

export const getServerSideProps = async () => {
  const gamesData: GameStruct[] = generateGameData(5)
  return {
    props: { gamesData: JSON.parse(JSON.stringify(gamesData)) },
  }
}
