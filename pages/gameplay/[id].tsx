import GameCard from '@/components/GameCard'
import { generateGameData } from '@/utils/fakeData'
import { GameCardStruct, GameStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  GiAngelWings,
  GiBeech,
  GiBowArrow,
  GiCrossedSwords,
  GiShieldBounces,
  GiSpartanHelmet,
} from 'react-icons/gi'

const uniqueCardElements: GameCardStruct[] = [
  {
    id: 0,
    name: 'Helmet',
    icon: <GiSpartanHelmet size={100} />,
  },
  {
    id: 1,
    name: 'Beech',
    icon: <GiBeech size={100} />,
  },
  {
    id: 2,
    name: 'Shield',
    icon: <GiShieldBounces size={100} />,
  },
  {
    id: 3,
    name: 'Swords',
    icon: <GiCrossedSwords size={100} />,
  },
  {
    id: 4,
    name: 'Wings',
    icon: <GiAngelWings size={100} />,
  },
  {
    id: 5,
    name: 'Arrow',
    icon: <GiBowArrow size={100} />,
  },
]

const shuffleCards = (array: GameCardStruct[]) => {
  const length = array.length
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i)
    const currentIndex = i - 1
    const temp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temp
  }
  return array
}

const Page: NextPage<{ gameData: GameStruct }> = ({ gameData }) => {
  const router = useRouter()
  const { id } = router.query
  const [flipCount, setFlipCount] = useState<number>(0)
  const [openCards, setOpenCards] = useState<GameCardStruct[]>([])

  const [cards, setCards] = useState<GameCardStruct[]>(
    shuffleCards(
      uniqueCardElements.concat(
        uniqueCardElements.map((card, index) => ({
          ...card,
          id: card.id + uniqueCardElements.length,
        }))
      )
    )
  )

  const handleCardClick = (id: number) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === id ? { ...card, isFlipped: !card.isFlipped } : card))
    )
    setFlipCount(flipCount + 1)

    setOpenCards((prevOpenCards) => {
      const newOpenCards = [...prevOpenCards, cards.find((card) => card.id === id)!]

      if (newOpenCards.length === 2) {
        if (newOpenCards[0].name === newOpenCards[1].name) {
          // If the two cards are the same, clear the openCards array
          return []
        } else {
          // If the two cards are not the same, flip them back after a delay
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) =>
                newOpenCards.find((openCard) => openCard.id === card.id)
                  ? { ...card, isFlipped: false }
                  : card
              )
            )
          }, 1000)

          // Clear the openCards array
          return []
        }
      }

      // If there's only one card in openCards, keep it
      return newOpenCards
    })
  }

  const resetGame = () => {
    setCards(
      shuffleCards(
        uniqueCardElements.concat(
          uniqueCardElements.map((card, index) => ({
            ...card,
            id: card.id + uniqueCardElements.length,
          }))
        )
      )
    )
    setOpenCards([])
    setFlipCount(0)
  }

  return (
    <div>
      <Head>
        <title>Play2Earn | GamePlay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col justify-center items-center space-y-8">
        <h4 className="text-4xl font-semibold text-blue-700">
          {flipCount} Flip{flipCount === 1 ? '' : 's'}
        </h4>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card: GameCardStruct, i: number) => (
            <GameCard
              key={i}
              card={card}
              isDisabled={card.isFlipped || false}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            className="bg-transparent border border-blue-700 hover:bg-blue-800
            py-2 px-6 text-blue-700 hover:text-white rounded-full
            transition duration-300 ease-in-out"
            onClick={resetGame}
          >
            Reset Game
          </button>
          <button
            className="bg-transparent border border-blue-700 hover:bg-blue-800
            py-2 px-6 text-blue-700 hover:text-white rounded-full
            transition duration-300 ease-in-out"
          >
            Submit Game
          </button>
          <button
            className="bg-transparent border border-blue-700 hover:bg-blue-800
            py-2 px-6 text-blue-700 hover:text-white rounded-full
            transition duration-300 ease-in-out"
          >
            Check Result
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page

export const getServerSideProps = async () => {
  const gameData: GameStruct = generateGameData(5)[0]
  return {
    props: { gameData: JSON.parse(JSON.stringify(gameData)) },
  }
}
