import React from 'react'
import { GameStruct, InvitationStruct } from '@/utils/type.dt'
import { truncate } from '@/utils/helper'
import Identicon from 'react-identicons'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { respondToInvite } from '@/services/blockchain'
import Link from 'next/link'

interface ComponentProps {
  game?: GameStruct
  invitations: InvitationStruct[]
  label?: boolean
}

const GameInvitations: React.FC<ComponentProps> = ({ invitations, game, label }) => {
  const { address } = useAccount()

  const handleResponse = async (accept: boolean, invitation: InvitationStruct, index: number) => {
    if (!address) return toast.warning('Connect wallet first!')
    index = label ? invitation.id : index

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        respondToInvite(accept, invitation, index)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Responded successfully successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div className="flex flex-col items-center justify-center pt-32 pb-5 text-gray-500">
      <h1 className="text-4xl text-gray-300 capitalize font-bold mb-10">
        {game ? `${game.title} Invitations` : 'Invitations'}
      </h1>
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
                  string={label ? invitation.sender : invitation.receiver}
                />
                <div>
                  {label ? (
                    <Link
                      href={'/gameplay/' + invitation.gameId}
                      className="font-medium capitalize"
                    >
                      {invitation.title}
                    </Link>
                  ) : (
                    <Link
                      href={'/gameplay/' + invitation.gameId}
                      className="font-medium capitalize"
                    >
                      {truncate({
                        text: label ? invitation.sender : invitation.receiver,
                        startChars: 4,
                        endChars: 4,
                        maxLength: 11,
                      })}
                    </Link>
                  )}
                  <p>{invitation.stake.toFixed(2)} ETH</p>
                </div>
              </div>
            </div>

            {invitation.responded && (
              <div
                className={`font-bold text-lg ${
                  invitation.accepted ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {invitation.accepted ? 'Accepted' : 'Rejected'}
              </div>
            )}

            {label && !invitation.responded && (
              <div className="flex space-x-2">
                <button
                  className="bg-transparent border border-blue-700 hover:bg-blue-800
                py-2 px-6 text-blue-700 hover:text-gray-300 rounded-full
                transition duration-300 ease-in-out"
                  onClick={() => handleResponse(true, invitation, index)}
                >
                  Accept
                </button>
                <button
                  className="bg-transparent border border-red-700 hover:bg-red-800
                py-2 px-6 text-red-700 hover:text-gray-300 rounded-full
                transition duration-300 ease-in-out"
                  onClick={() => handleResponse(false, invitation, index)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameInvitations
