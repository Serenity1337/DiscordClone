import { UPDATE_USER, FETCH_USER } from '../Actions/UserActionTypes'
import { getRequest } from '../../utils/Api'
export const UpdateUserAction = (user) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_USER, payload: user })
  }
}
export const FetchUserAction = (id) => {
  return async (dispatch) => {
    const response = await getRequest(
      `http://localhost:8000/discord/discord/getSingleUser/${id}`
    )
    dispatch({ type: FETCH_USER, payload: response })
  }
}
