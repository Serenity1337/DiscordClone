import React from 'react'
import classes from './FriendsListMainRenderProfileModal.module.scss'
import {
  removeUserFromFriendList,
  blockUserHandler,
} from '../FriendsListMainHandlers'
import { useDispatch, useSelector } from 'react-redux'
export const FriendsListMainRenderProfileModal = (props) => {
  const dispatch = useDispatch()
  const reduxState = useSelector((state) => state)
  const { user, users } = reduxState
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
