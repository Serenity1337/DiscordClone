import {
  CREATE_USER,
  UPDATE_USERS,
  FETCH_USERS,
} from '../Actions/UsersActionTypes'

const initialState = []
export const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER:
      return [...state, action.payload]
    case UPDATE_USERS:
      return [...action.payload]
    case FETCH_USERS:
      return action.payload
    default:
      return state
  }
}
