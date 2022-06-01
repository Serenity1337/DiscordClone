import {UsersActionTypes} from '../Actions/UsersActionTypes'
import {CreateUserActionType, FetchUsersActionType,UpdateUsersActionType, User,Users} from '../Action-creators/UsersActions'
const initialState:[] = []
export const UsersReducer = (state: Users = initialState , action: CreateUserActionType | FetchUsersActionType | UpdateUsersActionType) => {
  switch (action.type) {
    case UsersActionTypes.CREATE_USER:
      return [...state, action.payload]
    case UsersActionTypes.UPDATE_USERS:
      return action.payload
    case UsersActionTypes.FETCH_USERS:
      console.log(action.payload, 'comes from reducer users', state)
      return action.payload
    default:
      return state
  }
}
