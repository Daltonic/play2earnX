import { Menu } from '@headlessui/react'
import { MdGames } from 'react-icons/md'
import { BsTrash3 } from 'react-icons/bs'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { FaUsers } from 'react-icons/fa6'
import { TbReportAnalytics } from 'react-icons/tb'
import React from 'react'
import { GameStruct } from '@/utils/type.dt'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { deleteGame } from '@/services/blockchain'
import { useAccount } from 'wagmi'

const GameActions: React.FC<{ game: GameStruct }> = ({ game }) => {
  const { address } = useAccount()
  const handleDelete = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        deleteGame(game.id)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Game deletion successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <Menu as="div" className="inline-block text-left text-gray-300 relative">
      <Menu.Button
        className="inline-flex w-full justify-center
          rounded-md bg-[#010922] bg-opacity-50 p-4 text-sm
          font-medium hover:bg-opacity-30 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-white
          focus-visible:ring-opacity-75"
      >
        <BiDotsVerticalRounded size={17} />
      </Menu.Button>
      <Menu.Items
        className="absolute right-0 w-56 origin-top-right
          divide-y divide-blue-700 rounded-md bg-[#010922] shadow-md 
          ing-1 ring-black ring-opacity-5 focus:outline-none shadow-blue-700 "
      >
        <Menu.Item>
          {({ active }) => (
            <Link
              href={'/gameplay/' + game.id}
              className={`flex justify-start items-center space-x-1 ${
                active ? 'text-blue-700' : ''
              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
            >
              <MdGames size={17} />
              <span>Game Play</span>
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Link
              href={'/invitations/' + game.id}
              className={`flex justify-start items-center space-x-1 ${
                active ? 'text-orange-700' : ''
              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
            >
              <FaUsers size={17} />
              <span>Invitations</span>
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Link
              href={'/results/' + game.id}
              className={`flex justify-start items-center space-x-1 ${
                active ? 'text-green-700' : ''
              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
            >
              <TbReportAnalytics size={17} />
              <span>Result</span>
            </Link>
          )}
        </Menu.Item>

        {address == game.owner && (
          <Menu.Item>
            {({ active }) => (
              <button
                className={`flex justify-start items-center space-x-1 ${
                  active ? 'bg-red-700' : 'text-red-700'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={handleDelete}
              >
                <BsTrash3 size={17} />
                <span>Delete</span>
              </button>
            )}
          </Menu.Item>
        )}
      </Menu.Items>
    </Menu>
  )
}

export default GameActions
