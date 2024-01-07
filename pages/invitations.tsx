import GameInvitations from '@/components/GameInvitations'
import InviteModal from '@/components/InviteModal'
import { getMyInvitations } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { generateInvitations } from '@/utils/fakeData'
import { InvitationStruct, RootState } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Page: NextPage = () => {
  const dispatch = useDispatch()
  const { setInvitations } = globalActions
  const { invitations } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    const fetchData = async () => {
      const invitationsData: InvitationStruct[] = await getMyInvitations()
      dispatch(setInvitations(invitationsData))
    }

    fetchData()
  }, [dispatch, setInvitations])

  return (
    <div>
      <Head>
        <title>Play2Earn | My Invitation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {invitations && <GameInvitations invitations={invitations} label />}
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
