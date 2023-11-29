import { truncate } from '@/utils/helper'
import { GameStruct, ScoreStruct } from '@/utils/type.dt'
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import Identicon from 'react-identicons'

interface ComponentProps {
  game: GameStruct
  scores: ScoreStruct[]
}

const GameResult: React.FC<ComponentProps> = ({ game, scores }) => {
  const resultModal = 'scale-0'

  const closeModal = () => {}

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${resultModal}`}
    >
      <div className="bg-[#010922] text-gray-300 shadow-md shadow-blue-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Player Scores</p>
            <button onClick={closeModal} className="border-0 bg-transparent focus:outline-none">
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col justify-center items-start rounded-xl mt-5 space-y-4">
            {scores.map((score, i) => (
              <div key={i} className="flex justify-between border-b p-4 w-full">
                <div className="flex justify-start items-center space-x-2">
                  <Identicon string={score.player} size={25} className="rounded-full shadow-md" />
                  <strong>
                    {truncate({ text: score.player, startChars: 4, endChars: 4, maxLength: 11 })}
                  </strong>
                </div>
                {i + 1 <= game.numberOfWinners ? (
                  <span className="text-blue-700">Finished at {score.score} sec.</span>
                ) : (
                  <span className="text-red-600">
                    {score.played ? `Finished at ${score.score} sec.` : `Absent`}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameResult
