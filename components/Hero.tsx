import { globalActions } from '@/store/globalSlices'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'

const Hero: React.FC = () => {
  const dispatch = useDispatch()
  const { setCreateModal } = globalActions

  return (
    <section className="py-32">
      <main
        className="lg:w-2/3 w-full mx-auto flex flex-col justify-center
        items-center h-full text-gray-300"
      >
        <h2 className="text-4xl">
          Welcome to Play2<span className="text-blue-700">Earn</span>, Where Fun Meets Fortune!
        </h2>

        <p className="text-center my-4 ">
          Get Ready to Unleash Your Inner Hero and Make Gaming Pay!
        </p>

        <div className="flex space-x-3 my-3">
          <button
            className="bg-blue-700 border-[1px] py-3 px-5 duration-200
            transition-all hover:bg-blue-600"
            onClick={() => dispatch(setCreateModal('scale-100'))}
          >
            Create Game
          </button>

          <Link
            href="/games"
            className="border-[1px] border-blue-700 text-blue-700 py-3 px-5
            duration-200 transition-all hover:bg-blue-700 hover:text-gray-300"
          >
            My Games
          </Link>
        </div>
      </main>
    </section>
  )
}

export default Hero
