import CreateGame from '@/components/CreateGame'
import Hero from '@/components/Hero'
import { NextPage } from 'next'
import Head from 'next/head'

const Page: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Play2Earn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <CreateGame />
    </div>
  )
}

export default Page
