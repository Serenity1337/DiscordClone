import { UserActionTypes } from '../Actions/UserActionTypes'
import { getRequest } from '../../utils/Api'
import { Dispatch } from 'redux'
export type Token = {
  access: string,
  token: string
}
type FriendType = {
  
}
export type User = {
  [key: string]: any,
  birthday: {
    [key: string]: any,
    day: string,
    month: string,
    year: string
  },
  email: string,
  username: string,
  password: string,
  rpassword: string,
  tag?: string | undefined,
  friends?: {
    pending: any[],
    accepted: any[],
    blocked: any[]

  },
  status?: string,
  DMS?: any[],
  tokens?: Token[],
  _id?: string
}
export type Users = User[]

export type UpdateUserActionType = {
  type: UserActionTypes.UPDATE_USER,
  payload: User
}
export type FetchUserActionType = {
  type: UserActionTypes.FETCH_USER,
  payload: User
}

export const UpdateUserAction = (user:User) => {
  return (dispatch:Dispatch) => {
    dispatch<UpdateUserActionType>({ type: UserActionTypes.UPDATE_USER, payload: user })
  }
}
export const FetchUserAction = (id:string) => {
  return async (dispatch:Dispatch) => {
    const response = await getRequest(
      `http://localhost:8000/discord/discord/getSingleUser/${id}`
    )
    dispatch<FetchUserActionType>({ type: UserActionTypes.FETCH_USER, payload: response })
  }
}
