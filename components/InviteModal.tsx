import { invitePlayer } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { RootState } from '@/utils/type.dt'
import React, { FormEvent, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const InviteModal: React.FC = () => {
  const [player, setPlayer] = useState('')

  const { game, inviteModal } = useSelector((states: RootState) => states.globalStates)

  const dispatch = useDispatch()
  const { setInviteModal } = globalActions

  const sendInvitation = async (e: FormEvent) => {
    e.preventDefault()
    if (!game) return toast.warning('Game data not found')

    await toast.promise(
      new Promise(async (resolve, reject) => {
        invitePlayer(player, game?.id)
          .then((tx) => {
            console.log(tx)
            closeModal()
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Invitation sent successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const closeModal = () => {
    dispatch(setInviteModal('scale-0'))
  }
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${inviteModal}`}
    >
      <div className="bg-[#010922] text-gray-300 shadow-md shadow-blue-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Invite Player</p>
            <button onClick={closeModal} className="border-0 bg-transparent focus:outline-none">
              <FaTimes />
            </button>
          </div>

          <form
            onSubmit={sendInvitation}
            className="flex flex-col justify-center items-start rounded-xl mt-5 mb-5"
          >
            <div className="py-2 w-full border border-[#212D4A] rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm
                border-none focus:outline-none focus:ring-0 py-0"
                name="player"
                type="text"
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
                minLength={42}
                maxLength={42}
                pattern="[A-Za-z0-9]+"
                placeholder="Player ETH Account"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-transparent border border-blue-700 hover:bg-blue-800
              py-2 px-6 text-blue-700 hover:text-white rounded-full
              transition duration-300 ease-in-out mt-5"
            >
              Send Invite
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InviteModal
