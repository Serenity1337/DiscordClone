import React from 'react'
import { User } from '../../../../Redux/Action-creators/UserActions'
import classes from './FriendListMainRenderStatus.module.scss'
export const FriendListMainRenderStatus = (props:{user:User}) => {
  const renderStatus = () => {
    if (
      props.user.status === 'offline' ||
      props.user.status === 'outgoing friend request' ||
      props.user.status === 'incoming friend request' ||
      props.user.status === 'blocked'
    ) {
      return (
        <div className={classes.offlineStatusIcon}>
          <div className={classes.innerCircle}></div>
        </div>
      )
    }
    if (props.user.status === 'online') {
      return <div className={classes.onlineStatusIcon}></div>
    }
    if (props.user.status === 'busy') {
      return (
        <div className={classes.busyStatusIcon}>
          <div className={classes.innerLine}></div>
        </div>
      )
    }
  }
  return <>{renderStatus()}</>
}
