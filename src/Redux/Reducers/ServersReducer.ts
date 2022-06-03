import {
  ServerActionTypes
} from '../Actions/ServersActionTypes'
import {CreateServerActionType,FetchServersActionType,UpdateServersActionType,Server,Servers} from '../Action-creators/ServersActions'
const initialState:[] = []

export const ServersReducer = (state: Servers = initialState, action: CreateServerActionType | FetchServersActionType | UpdateServersActionType) => {
  switch (action.type) {
    case ServerActionTypes.CREATE_SERVER:
      return [...state, action.payload]
    case ServerActionTypes.UPDATE_SERVERS:
      return action.payload
    case ServerActionTypes.FETCH_SERVERS:
      return action.payload
    default:
      return state
  }
}
