import React from 'react'
import classes from './FriendsListMainRenderProfileModal.module.scss'
import {
  removeUserFromFriendList,
  blockUserHandler,
} from '../FriendsListMainHandlers'
export const FriendsListMainRenderProfileModal = (props) => {
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
            props.friend,
            props.index,
            props.users,
            props.setuser,
            props.setusers,
            props.seterrorState,
            props.user,
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
            props.user,
            props.index,
            props.users,
            props.setuser,
            props.setusers,
            props.seterrorState,
            props.user,
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
