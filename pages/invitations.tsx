import GameInvitations from '@/components/GameInvitations'
import InviteModal from '@/components/InviteModal'
import { generateInvitations } from '@/utils/fakeData'
import { InvitationStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'

const Page: NextPage<{ invitationsData: InvitationStruct[] }> = ({ invitationsData }) => {
  return (
    <div>
      <Head>
        <title>Play2Earn | My Invitation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {invitationsData && <GameInvitations invitations={invitationsData} label />}
      <InviteModal />
    </div>
  )
}

export default Page

export const getServerSideProps = async () => {
  const invitationsData: InvitationStruct[] = generateInvitations(5)
  return {
    props: { invitationsData: JSON.parse(JSON.stringify(invitationsData)) },
  }
}
