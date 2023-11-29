import { faker } from '@faker-js/faker'
import { GameStruct } from './type.dt'

export const generateGameData = (count: number): GameStruct[] => {
  const games: GameStruct[] = []

  for (let i = 0; i < count; i++) {
    const game: GameStruct = {
      id: i + 1,
      title: faker.lorem.words(5),
      description: faker.lorem.paragraph(),
      owner: faker.string.hexadecimal({
        length: { min: 42, max: 42 },
        prefix: '0x',
      }),
      participants: faker.number.int({ min: 20, max: 40 }),
      numberOfWinners: faker.number.int({ min: 1, max: 10 }),
      challenges: faker.number.int({ min: 1, max: 7 }),
      plays: faker.number.int({ min: 1, max: 6 }),
      acceptees: faker.number.int({ min: 1, max: 10 }),
      stake: faker.number.float({ min: 0.01, max: 0.1 }),
      startDate: faker.date.future().getTime(),
      endDate: faker.date.past().getTime(),
      timestamp: faker.date.past().getTime(),
      deleted: faker.datatype.boolean(),
      paidOut: faker.datatype.boolean(),
    }
    games.push(game)
  }

  return games
}
