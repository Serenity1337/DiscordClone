import {
  CREATE_SERVER,
  UPDATE_SERVERS,
  FETCH_SERVERS,
} from '../Actions/ServersActionTypes'
import { getRequest } from '../../utils/Api'

export const CreateServerAction = (server) => {
  return (dispatch) => {
    dispatch({ type: CREATE_SERVER, payload: server })
  }
}
export const UpdateServersAction = (servers) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_SERVERS, payload: servers })
  }
}
export const FetchServersAction = () => {
  return async (dispatch) => {
    const response = await getRequest(
      `http://localhost:8000/discord/discord/getAllServers`
    )
    dispatch({ type: FETCH_SERVERS, payload: response })
  }
}
