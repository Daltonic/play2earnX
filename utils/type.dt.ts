export interface TruncateParams {
  text: string
  startChars: number
  endChars: number
  maxLength: number
}

export interface GameCardStruct {
  id: number
  name: string
  icon: JSX.Element
  isFlipped?: boolean
}

export interface ScoreStruct {
  gameId: number
  player: string
  score: number
  prize: number
  played: boolean
}

export interface InvitationStruct {
  gameId: number
  account: string
  responded: boolean
  accepted: boolean
  stake: number
}

export interface GameParams {
  id?: number
  title: string
  participants: string
  winners: string
  challenges: string
  starts: string | number
  ends: string | number
  description: string
  stake: string
}

export interface GameStruct {
  id: number
  title: string
  description: string
  owner: string
  participants: number
  numberOfWinners: number
  challenges: number
  plays: number
  acceptees: number
  stake: number
  startDate: number
  endDate: number
  timestamp: number
  deleted: boolean
  paidOut: boolean
}
