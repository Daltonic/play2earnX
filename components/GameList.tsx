import React from 'react'
import { GameStruct } from '@/utils/type.dt'
import { formatDate, truncate } from '@/utils/helper'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { globalActions } from '@/store/globalSlices'
import GameActions from './GameActions'

const GameList: React.FC<{ games: GameStruct[] }> = ({ games }) => {
  const dispatch = useDispatch()
  const { setGame, setResultModal } = globalActions

  const openModal = (game: GameStruct) => {
    dispatch(setGame(game))
    dispatch(setResultModal('scale-100'))
  }

  return (
    <div className="lg:w-2/3 w-full mx-auto my-10 text-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.length < 1 && <div className="text-lg font-semibold">No games yet</div>}

        {games.map((game: GameStruct, i: number) => (
          <div key={i} className="border border-blue-900 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <h3
                onClick={() => openModal(game)}
                className="text-lg font-semibold mb-2 capitalize cursor-pointer"
              >
                {game.title}
              </h3>
              <GameActions game={game} />
            </div>
            <p className="text-gray-500 mb-2">
              {truncate({
                text: game.description,
                startChars: 100,
                endChars: 0,
                maxLength: 103,
              })}
            </p>

            <p className="text-sm">Starts {formatDate(game.startDate)}</p>
            <p className="text-blue-700 mt-2">
              {truncate({
                text: game.owner,
                startChars: 4,
                endChars: 4,
                maxLength: 11,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameList
