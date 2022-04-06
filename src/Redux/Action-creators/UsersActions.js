import {
  CREATE_USER,
  UPDATE_USERS,
  FETCH_USERS,
} from '../Actions/UsersActionTypes'
import { getRequest } from '../../utils/Api'
export const CreateUserAction = (user) => {
  return (dispatch) => {
    dispatch({ type: CREATE_USER, payload: user })
  }
}

export const UpdateUsersAction = (users) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_USERS, payload: users })
  }
}

export const FetchUsersAction = () => {
  return async (dispatch) => {
    const response = await getRequest(
      `http://localhost:8000/discord/discord/getAllUsers`
    )
    dispatch({ type: FETCH_USERS, payload: response })
  }
}
