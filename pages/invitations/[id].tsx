import GameInvitations from '@/components/GameInvitations'
import InviteModal from '@/components/InviteModal'
import { globalActions } from '@/store/globalSlices'
import { generateGameData, generateInvitations } from '@/utils/fakeData'
import { GameStruct, InvitationStruct, RootState } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface PageProps {
  gameData: GameStruct
  invitationsData: InvitationStruct[]
}

const Page: NextPage<PageProps> = ({ gameData, invitationsData }) => {
  const dispatch = useDispatch()
  const { setGame, setInvitations } = globalActions
  const { game, invitations } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setGame(gameData))
    dispatch(setInvitations(invitationsData))
  }, [dispatch, setGame, gameData, setInvitations, invitationsData])

  return (
    <div>
      <Head>
        <title>Play2Earn | Game Invitation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {game && <GameInvitations game={game} invitations={invitations} />}
      <InviteModal />
    </div>
  )
}

export default Page

export const getServerSideProps = async () => {
  const gameData: GameStruct = generateGameData(1)[0]
  const invitationsData: InvitationStruct[] = generateInvitations(8)
  return {
    props: {
      gameData: JSON.parse(JSON.stringify(gameData)),
      invitationsData: JSON.parse(JSON.stringify(invitationsData)),
    },
  }
}
