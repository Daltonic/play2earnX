import React from 'react'
import { GameStruct, InvitationStruct } from '@/utils/type.dt'
import { truncate } from '@/utils/helper'
import Identicon from 'react-identicons'

interface ComponentProps {
  game: GameStruct
  invitations: InvitationStruct[]
}

const GameInvitations: React.FC<ComponentProps> = ({ invitations, game }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
      <h1 className="text-4xl text-gray-300 capitalize font-bold mb-10">{game.title} Invitations</h1>
      <div className="w-full max-w-2xl mx-auto">
        {invitations.map((invitation, index) => (
          <div
            key={index}
            className="flex items-center shadow-md my-2
          border border-blue-900 p-6 rounded-lg"
          >
            <div className="flex-grow">
              <div className="flex justify-start items-center space-x-2">
                <Identicon
                  className="rounded-full overflow-hidden shadow-md"
                  size={30}
                  string={invitation.account}
                />
                <div>
                  <p className="font-medium">
                    {truncate({
                      text: invitation.account,
                      startChars: 4,
                      endChars: 4,
                      maxLength: 11,
                    })}
                  </p>
                  <p>{invitation.stake.toFixed(2)} ETH</p>
                </div>
              </div>
            </div>
            {/* <div
              className={`font-bold text-lg ${
                invitation.accepted ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {invitation.accepted ? 'Accepted' : 'Not Accepted'}
            </div> */}

            <div className='flex space-x-2'>
              <button
                className="bg-transparent border border-blue-700 hover:bg-blue-800
                py-2 px-6 text-blue-700 hover:text-gray-300 rounded-full
                transition duration-300 ease-in-out"
              >
                Accept
              </button>
              <button
                className="bg-transparent border border-red-700 hover:bg-red-800
                py-2 px-6 text-red-700 hover:text-gray-300 rounded-full
                transition duration-300 ease-in-out"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameInvitations
