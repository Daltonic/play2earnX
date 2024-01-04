import { GameStruct, GlobalState, InvitationStruct, ScoreStruct } from '@/utils/type.dt'
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {
  setGames: (states: GlobalState, action: PayloadAction<GameStruct[]>) => {
    states.games = action.payload
  },
  setScores: (states: GlobalState, action: PayloadAction<ScoreStruct[]>) => {
    states.scores = action.payload
  },
  setInvitations: (states: GlobalState, action: PayloadAction<InvitationStruct[]>) => {
    states.invitations = action.payload
  },
  setGame: (states: GlobalState, action: PayloadAction<GameStruct | null>) => {
    states.game = action.payload
  },
  setCreateModal: (states: GlobalState, action: PayloadAction<string>) => {
    states.createModal = action.payload
  },
  setDetailsModal: (states: GlobalState, action: PayloadAction<string>) => {
    states.detailsModal = action.payload
  },
  setInviteModal: (state: GlobalState, action: PayloadAction<string>) => {
    state.inviteModal = action.payload
  },
}
