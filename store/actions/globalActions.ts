import { GameStruct, GlobalState, InvitationStruct, ScoreStruct } from '@/utils/type.dt'
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {
  setGames: (state: GlobalState, action: PayloadAction<GameStruct[]>) => {
    state.games = action.payload
  },
  setScores: (state: GlobalState, action: PayloadAction<ScoreStruct[]>) => {
    state.scores = action.payload
  },
  setInvitations: (state: GlobalState, action: PayloadAction<InvitationStruct[]>) => {
    state.invitations = action.payload
  },
  setGame: (state: GlobalState, action: PayloadAction<GameStruct | null>) => {
    state.game = action.payload
  },
  setCreateModal: (state: GlobalState, action: PayloadAction<string>) => {
    state.createModal = action.payload
  },
  setResultModal: (state: GlobalState, action: PayloadAction<string>) => {
    state.resultModal = action.payload
  },
  setInviteModal: (state: GlobalState, action: PayloadAction<string>) => {
    state.inviteModal = action.payload
  },
}
