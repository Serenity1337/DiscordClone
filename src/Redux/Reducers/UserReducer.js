import { UPDATE_USER, FETCH_USER } from '../Actions/UserActionTypes'

const initialState = {}
export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return action.payload
    case FETCH_USER:
      return action.payload
    default:
      return state
  }
}
