import Link from 'next/link'
import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="h-[60vh]">
      <main className="lg:w-2/3 w-full mx-auto flex flex-col justify-center items-center h-full text-gray-300">
        <h2 className="text-4xl">
          Welcome to Play2<span className="text-blue-700">Earn</span>, Where Fun Meets Fortune!
        </h2>
        <p className="text-center my-4 ">
          Get Ready to Unleash Your Inner Hero and Make Gaming Pay!
        </p>
        <div className="flex space-x-3 my-3">
          <button className="bg-blue-700 border-[1px] text-white py-3 px-5 duration-200 transition-all  hover:bg-blue-600">
            Create Game
          </button>
          <Link
            href="/games"
            className="border-[1px] border-blue-700 text-blue-700 py-3 px-5 duration-200 transition-all hover:bg-blue-700 hover:text-white"
          >
            My Games
          </Link>
        </div>
      </main>
    </section>
  )
}

export default Hero
