import GameDetails from '@/components/GameDetails'
import GameList from '@/components/GameList'
import InviteModal from '@/components/InviteModal'
import { globalActions } from '@/store/globalSlices'
import { generateGameData } from '@/utils/fakeData'
import { GameStruct, RootState } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Page: NextPage<{ gamesData: GameStruct[] }> = ({ gamesData }) => {
  const dispatch = useDispatch()
  const { setGames } = globalActions
  const { games } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setGames(gamesData))
  }, [dispatch, setGames, gamesData])

  return (
    <div>
      <Head>
        <title>Play2Earn | Game List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {games.length > 1 && (
        <>
          <GameList games={games} />
          <GameDetails game={games[0]} />
        </>
      )}
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
