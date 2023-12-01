import GameInvitations from '@/components/GameInvitations'
import InviteModal from '@/components/InviteModal'
import { generateGameData, generateInvitations } from '@/utils/fakeData'
import { GameStruct, InvitationStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'

interface PageProps {
  gameData: GameStruct
  invitationsData: InvitationStruct[]
}

const Page: NextPage<PageProps> = ({ gameData, invitationsData }) => {
  return (
    <div>
      <Head>
        <title>Play2Earn | Game Invitation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameInvitations game={gameData} invitations={invitationsData} />
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
