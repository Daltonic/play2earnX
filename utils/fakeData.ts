import { faker } from '@faker-js/faker'
import { GameStruct, InvitationStruct, ScoreStruct } from './type.dt'

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

export const generateInvitations = (count: number): InvitationStruct[] => {
  const invitations: InvitationStruct[] = []

  for (let i = 0; i < count; i++) {
    const invitation: InvitationStruct = {
      id: i,
      gameId: faker.number.int({ min: 1, max: 50 }),
      title: faker.lorem.words(5),
      sender: faker.string.hexadecimal({
        length: { min: 42, max: 42 },
        prefix: '0x',
      }),
      receiver: faker.string.hexadecimal({
        length: { min: 42, max: 42 },
        prefix: '0x',
      }),
      stake: faker.number.float({ min: 0.01, max: 0.1 }),
      responded: faker.datatype.boolean(),
      accepted: faker.datatype.boolean(),
      timestamp: faker.date.past().getTime(),
    }
    invitations.push(invitation)
  }

  return invitations
}

export const generateScores = (count: number): ScoreStruct[] => {
  const scores: ScoreStruct[] = []

  for (let i = 0; i < count; i++) {
    const game: ScoreStruct = {
      id: i,
      gameId: i + 1,
      player: faker.string.hexadecimal({
        length: { min: 42, max: 42 },
        prefix: '0x',
      }),
      prize: faker.number.float({ min: 0.01, max: 0.1 }),
      score: faker.number.int({ min: 12, max: 30 }),
      played: faker.datatype.boolean(),
    }
    scores.push(game)
  }

  return scores
}
