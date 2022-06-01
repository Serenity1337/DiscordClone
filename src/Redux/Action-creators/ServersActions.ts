import {
  ServerActionTypes
} from '../Actions/ServersActionTypes'
import { getRequest } from '../../utils/Api'
import { Dispatch } from 'redux'

export type MessageType = {
  [key:string|number]:any,
  sentDate: string,
  id: string,
  msg: string,
  sender: string
}

export type ChannelType = {
    channelName: string,
    channelDescription: string,
    messages: MessageType[],
    nsfw: boolean,
    _id?: string,
    id?: string
}

export type Server = {
  serverName: string,
  avatar: string,
  owner: string,
  members: [],
  channels: ChannelType[],
  _id?: string
}
export type Servers = Server[]

export type CreateServerActionType = {
  type: ServerActionTypes.CREATE_SERVER,
  payload: Server
}

export type UpdateServersActionType = {
  type: ServerActionTypes.UPDATE_SERVERS,
  payload: Servers
}
export type FetchServersActionType = {
  type: ServerActionTypes.FETCH_SERVERS,
  payload: Servers
}

export const CreateServerAction = (server: Server) => {
  return (dispatch: Dispatch) => {
    dispatch<CreateServerActionType>({ type: ServerActionTypes.CREATE_SERVER, payload: server })
  }
}
export const UpdateServersAction = (servers: Servers) => {
  return (dispatch:Dispatch) => {
    dispatch<UpdateServersActionType>({ type: ServerActionTypes.UPDATE_SERVERS, payload: servers })
  }
}
export const FetchServersAction = () => {
  return async (dispatch:Dispatch) => {
    const response = await getRequest(
      `http://localhost:8000/discord/discord/getAllServers`
    )
    console.log(response, 'comes from serversActions')
    dispatch<FetchServersActionType>({ type: ServerActionTypes.FETCH_SERVERS, payload: response })
  }
}
