import {
  UsersActionTypes
} from '../Actions/UsersActionTypes'
import { getRequest } from '../../utils/Api'
import { Dispatch } from 'redux'
export type Token = {
  access: string,
  token: string
}
type test = {

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

export type CreateUserActionType = {
  type: UsersActionTypes.CREATE_USER,
  payload: User
}

export type UpdateUsersActionType = {
  type: UsersActionTypes.UPDATE_USERS,
  payload: Users
}
export type FetchUsersActionType = {
  type: UsersActionTypes.FETCH_USERS,
  payload: User
}

export const CreateUserAction = (user: User) => {
  return (dispatch: Dispatch) => {
    dispatch<CreateUserActionType>({ type: UsersActionTypes.CREATE_USER, payload: user })
  }
}

export const UpdateUsersAction = (users: Users) => {
  return (dispatch:Dispatch) => {
    dispatch<UpdateUsersActionType>({ type: UsersActionTypes.UPDATE_USERS, payload: users })
  }
}

export const FetchUsersAction = () => {
  return async (dispatch: Dispatch) => {
    const response = await getRequest(
      `http://localhost:8000/discord/discord/getAllUsers`
    )
    console.log(response, 'comes from users actions')
    dispatch<FetchUsersActionType>({ type: UsersActionTypes.FETCH_USERS, payload: response })
  }
}
