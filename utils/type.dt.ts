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
  id: number
  gameId: number
  player: string
  score: number
  prize: number
  played: boolean
}

export interface InvitationStruct {
  id: number
  gameId: number
  title: string
  sender: string
  receiver: string
  responded: boolean
  accepted: boolean
  stake: number
  timestamp: number
}

export interface GameParams {
  id?: number
  title: string
  participants: string
  numberOfWinners: string
  startDate: string | number
  endDate: string | number
  description: string
  stake: string | number
}

export interface GameStruct {
  id: number
  title: string
  description: string
  owner: string
  participants: number
  numberOfWinners: number
  acceptees: number
  stake: number
  startDate: number
  endDate: number
  timestamp: number
  deleted: boolean
  paidOut: boolean
}

export interface GlobalState {
  games: GameStruct[]
  game: GameStruct | null
  scores: ScoreStruct[]
  invitations: InvitationStruct[]
  createModal: string
  resultModal: string
  inviteModal: string
}

export interface RootState {
  globalStates: GlobalState
}
