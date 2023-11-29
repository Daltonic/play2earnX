import GameList from '@/components/GameList'
import InviteModal from '@/components/InviteModal'
import { generateGameData } from '@/utils/fakeData'
import { GameStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'

const Page: NextPage<{ gamesData: GameStruct[] }> = ({ gamesData }) => {
  return (
    <div>
      <Head>
        <title>Play2Earn | Game List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameList games={gamesData} />
      <InviteModal />
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
