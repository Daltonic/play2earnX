import { GameCardStruct } from '@/utils/type.dt'
import { FaQuestion } from 'react-icons/fa'

interface ComponentProps {
  card: GameCardStruct
  isDisabled: boolean
  onClick: (card: GameCardStruct) => void
}

const GameCard: React.FC<ComponentProps> = ({ onClick, card, isDisabled }) => {
  const handleClick = () => {
    !isDisabled && onClick(card)
  }

  return (
    <div
      className={`w-40 h-40 bg-[#010922] border border-blue-900
      text-blue-900 transition-all flex items-center justify-center
      duration-300 cursor-pointer hover:shadow-md hover:shadow-blue-500
      rounded-lg hover:text-blue-500 
      ${card.isFlipped && 'shadow-md shadow-blue-500 text-blue-500'}`}
      onClick={handleClick}
    >
      {card.isFlipped && <span>{card.icon}</span>}
      {!card.isFlipped && <FaQuestion size={100} />}
    </div>
  )
}

export default GameCard
