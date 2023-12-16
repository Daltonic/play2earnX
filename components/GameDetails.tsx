import { globalActions } from '@/store/globalSlices'
import { timestampToDate, truncate } from '@/utils/helper'
import { RootState } from '@/utils/type.dt'
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

const GameDetails: React.FC = () => {
  const dispatch = useDispatch()
  const { setResultModal } = globalActions
  const { game, resultModal } = useSelector((states: RootState) => states.globalStates)

  const closeModal = () => {
    dispatch(setResultModal('scale-0'))
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${resultModal}`}
    >
      {game && (
        <div className="bg-[#010922] text-gray-500 shadow-md shadow-blue-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center text-gray-300">
              <p className="font-semibold capitalize">{game.title} (Instructions)</p>
              <button onClick={closeModal} className="border-0 bg-transparent focus:outline-none">
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col justify-center items-start rounded-xl mt-5 space-y-4">
              <ul className="list-disc list-inside text-md">
                <li>
                  Host: {truncate({ text: game.owner, startChars: 4, endChars: 4, maxLength: 11 })}
                </li>
                <li>Participants: {game.participants}</li>
                <li>Acceptees: {game.acceptees}</li>
                <li>Rewards: {(game.stake * game.acceptees).toFixed(2)} ETH</li>
                <li>Number of Winners: {game.numberOfWinners}</li>
                <li>
                  Schedule: {timestampToDate(game.startDate)} - {timestampToDate(game.endDate)}
                </li>
                <li>
                  Payout Status:{' '}
                  {!game.paidOut ? (
                    'Yet to be paid out'
                  ) : (
                    <span className="text-green-600 font-medium">Paid out</span>
                  )}
                </li>
              </ul>
              <p>{game.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameDetails
