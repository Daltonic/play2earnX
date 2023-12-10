import GameInvitations from '@/components/GameInvitations'
import InviteModal from '@/components/InviteModal'
import { generateGameData, generateInvitations } from '@/utils/fakeData'
import { GameStruct, InvitationStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useAccount } from 'wagmi'

interface PageProps {
  gameData: GameStruct
  invitationsData: InvitationStruct[]
}

const Page: NextPage<PageProps> = ({ gameData, invitationsData }) => {
  const { address } = useAccount()

  return (
    <div>
      <Head>
        <title>Play2Earn | Game Invitation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {gameData && <GameInvitations game={gameData} invitations={invitationsData} />}

      <div className="flex justify-center space-x-2">
        {address === gameData?.owner && (
          <button
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
  const gameData: GameStruct = generateGameData(Number(id))[0]
  const invitationsData: InvitationStruct[] = generateInvitations(5)
  return {
    props: {
      gameData: JSON.parse(JSON.stringify(gameData)),
      invitationsData: JSON.parse(JSON.stringify(invitationsData)),
    },
  }
}
