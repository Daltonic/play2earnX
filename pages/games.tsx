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

const Page: NextPage = () => {
  const dispatch = useDispatch()
  const { setGames } = globalActions
  const { games } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    const fetchGame = async () => {
      const gamesData: GameStruct[] = generateGameData(3)

      dispatch(setGames(gamesData))
    }

    fetchGame()
  }, [dispatch, setGames])

  return (
    <div>
      <Head>
        <title>Play2Earn | Game List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameList games={games} />
      <GameDetails />
      <InviteModal />
    </div>
  )
}

export default Page
