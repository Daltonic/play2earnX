import Link from 'next/link'
import React from 'react'
import ConnectBtn from './ConnectBtn'

const Header: React.FC = () => {
  return (
    <header className="shadow-sm shadow-blue-900 py-4 text-blue-700">
      <main className="lg:w-2/3 w-full mx-auto flex justify-between items-center flex-wrap">
        <Link href={'/'} className="text-2xl mb-2">
          <span className="text-gray-300">Play2</span>
          <span>Earn</span>
        </Link>

        <div className="flex justify-end items-center space-x-2 md:space-x-4 mt-2 md:mt-0">
          <Link href={'/games'} className="text-md">
            My Games
          </Link>

          <ConnectBtn />
        </div>
      </main>
    </header>
  )
}

export default Header
