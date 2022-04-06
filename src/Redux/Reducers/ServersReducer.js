import {
  CREATE_SERVER,
  UPDATE_SERVERS,
  FETCH_SERVERS,
} from '../Actions/ServersActionTypes'
const initialState = []

export const ServersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SERVER:
      return [...state, action.payload]
    case UPDATE_SERVERS:
      return [...action.payload]
    case FETCH_SERVERS:
      return action.payload
    default:
      return state
  }
}
