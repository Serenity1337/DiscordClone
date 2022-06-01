import { UserActionTypes } from '../Actions/UserActionTypes'
import {FetchUserActionType, UpdateUserActionType, User} from '../Action-creators/UserActions'
const initialState = {} as User
export const UserReducer = (state: {} | User = initialState, action: FetchUserActionType | UpdateUserActionType ) => {
  switch (action.type) {
    case UserActionTypes.UPDATE_USER:
      return action.payload
    case UserActionTypes.FETCH_USER:
      return action.payload
    default:
      return state
  }
}
