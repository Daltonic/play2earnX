import React from 'react'
import { GameStruct } from '@/utils/type.dt'
import { formatDate, truncate } from '@/utils/helper'
import Link from 'next/link'

const GameList: React.FC<{ games: GameStruct[] }> = ({ games }) => {
  const handleInviteClick = (game: GameStruct) => {
    // setGlobalState('game', game)
    // setGlobalState('inviteModal', 'scale-100')
  }

  return (
    <div className="lg:w-2/3 w-full mx-auto my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.length < 1 && <div className="text-lg font-semibold">No games yet</div>}

        {games.map((game: GameStruct, i: number) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 capitalize">{game.title}</h3>
            <p className="text-gray-600 mb-2">
              {truncate({
                text: game.description,
                startChars: 100,
                endChars: 0,
                maxLength: 103,
              })}
            </p>

            <div className="flex justify-between items-center text-gray-600 font-medium">
              <p>
                {truncate({
                  text: game.owner,
                  startChars: 4,
                  endChars: 4,
                  maxLength: 11,
                })}
              </p>

              <p>Starts {formatDate(game.startDate)}</p>
            </div>
            <div className="flex justify-start items-center space-x-2 mt-3">
              <Link
                href={'/gameplay/' + game.id}
                className="bg-red-700 text-white py-2 px-5 rounded-full
                  hover:bg-red-600 duration-200 transition-all"
              >
                View
              </Link>
              <button
                onClick={() => handleInviteClick(game)}
                className="bg-blue-700 text-white py-2 px-5 rounded-full
                  hover:bg-blue-600 duration-200 transition-all"
              >
                Invite
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameList
