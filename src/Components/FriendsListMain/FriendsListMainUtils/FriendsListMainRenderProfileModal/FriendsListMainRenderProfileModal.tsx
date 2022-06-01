import React from 'react'
import classes from './FriendsListMainRenderProfileModal.module.scss'
import {
  removeUserFromFriendList,
  blockUserHandler,
} from '../FriendsListMainHandlers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../Redux/Reducers'
import { User, Users } from '../../../../Redux/Action-creators/UsersActions'
import { Socket } from 'socket.io-client'


  type SocketTypes = {
    on: {
      event: string,
      callback: (data: any) => void

    },
    emit: {
      event: string,
      data: any
    }
  }

  type PropTypes = {
    mouseCoordY: number,
    mouseCoordX: number,
    friend: User,
    index: number,
    seterrorState: Function,
    setopenModalProfile: Function,
    socket: Socket
  }

export const FriendsListMainRenderProfileModal = (props:PropTypes) => {
  const dispatch = useDispatch()
  const user = useSelector((state:RootState) => state.user) as User
  const users = useSelector((state:RootState) => state.users) as Users
  return (
    <div
      className={classes.profileModalContainer}
      style={{
        padding: `6px 8px`,
        backgroundColor: '#18191c',
        position: 'absolute',
        top: `${props.mouseCoordY}px`,
        left: `${props.mouseCoordX}px`,
      }}
    >
      <div className={classes.profileModalChoice}>Profile</div>
      <div className={classes.profileModalChoice}>Message</div>
      <div className={classes.profileModalChoice}>Call</div>
      <div className={classes.profileModalChoice}>Add Note</div>
      <div
        className={classes.profileModalChoice}
        onClick={(event) =>
          removeUserFromFriendList(
            event,
            user,
            props.index,
            users,
            dispatch,
            props.seterrorState,
            props.friend,
            props.setopenModalProfile,
            props.socket
          )
        }
      >
        Remove Friend
      </div>
      <div
        className={classes.profileModalChoice}
        onClick={(event) =>
          blockUserHandler(
            event,
            user,
            props.index,
            users,
            dispatch,
            props.seterrorState,
            props.friend,
            props.setopenModalProfile,
            props.socket
          )
        }
      >
        Block
      </div>
    </div>
  )
}
