import GameInvitations from '@/components/GameInvitations'
import InviteModal from '@/components/InviteModal'
import { getGame, getInvitations } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { GameStruct, InvitationStruct, RootState } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'

interface PageProps {
  gameData: GameStruct
  invitationsData: InvitationStruct[]
}

const Page: NextPage<PageProps> = ({ gameData, invitationsData }) => {
  const { address } = useAccount()
  const dispatch = useDispatch()
  const { setGame, setInvitations, setInviteModal } = globalActions
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

      <div className="flex justify-center space-x-2">
        {address === game?.owner && (
          <button
            onClick={() => dispatch(setInviteModal('scale-100'))}
            className="bg-transparent border border-orange-700 hover:bg-orange-800
            py-2 px-6 text-orange-700 hover:text-white rounded-full
            transition duration-300 ease-in-out"
          >
            Invite Players
          </button>
        )}
      </div>
      <InviteModal />
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const gameData: GameStruct = await getGame(Number(id))
  const invitationsData: InvitationStruct[] = await getInvitations(Number(id))
  return {
    props: {
      gameData: JSON.parse(JSON.stringify(gameData)),
      invitationsData: JSON.parse(JSON.stringify(invitationsData)),
    },
  }
}
