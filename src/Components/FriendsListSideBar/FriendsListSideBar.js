import React, { useState } from 'react'
import classes from './FriendsListSideBar.module.scss'
import { FaUserFriends } from 'react-icons/fa'
import Nitro from '../../utils/imgs/Nitro.js'
import { Link, useLocation } from 'react-router-dom'
import catto from '../../utils/imgs/catto.png'

export const FriendsListSideBar = (props) => {
  const location = useLocation()
  const [statusMessageState, setstatusMessageState] = useState({})
  const [positionState, setpositionState] = useState(0)

  const displayName = (event, user, index) => {
    setstatusMessageState({ [index]: true })
    setpositionState(event.currentTarget.getBoundingClientRect().top + -40)
  }
  const removeName = (event, user, index) => {
    setstatusMessageState({ [index]: false })
    setpositionState(0)
  }

  const renderStatus = (user, index) => {
    if (user.status === 'offline') {
      return (
        <div
          className={classes.offlineStatusIcon}
          onMouseOut={(event) => removeName(event, user, index)}
          onMouseOver={(event) => displayName(event, user, index)}
        >
          <div className={classes.innerCircle}></div>
        </div>
      )
    }
    if (user.status === 'online') {
      return (
        <div
          className={classes.onlineStatusIcon}
          onMouseOut={(event) => removeName(event, user, index)}
          onMouseOver={(event) => displayName(event, user, index)}
        ></div>
      )
    }
    if (user.status === 'busy') {
      return (
        <div
          className={classes.busyStatusIcon}
          onMouseOut={(event) => removeName(event, user, index)}
          onMouseOver={(event) => displayName(event, user, index)}
        >
          <div className={classes.innerLine}></div>
        </div>
      )
    }
  }

  const renderUsers = () => {
    if (props.user.username) {
      return props.user.friends.map((user, index) => (
        <Link to={`${location.pathname}/${user.username}`}>
          <div className={classes.userContainer}>
            {statusMessageState[index] ? (
              <div
                className={classes.displayStatusMessage}
                style={{ top: `${positionState}px` }}
              >
                {user.status}
              </div>
            ) : null}
            <div className={classes.friendListUserAvatar}>
              <img src={catto} alt='' />
              {renderStatus(user, index)}
            </div>
            <div className={classes.friendUsername}>{user.username} </div>
          </div>
        </Link>
      ))
    }
  }
  return (
    <div className={classes.friendListSideContainer}>
      <div className={classes.filterEverything}>
        Find or start a conversation
      </div>
      <div
        style={{ width: '100%', height: '1.5px', backgroundColor: '#202225' }}
      ></div>

      <div className={classes.friendsAndNitroNav}>
        <Link to='/channels/@me'>
          <button
            type='button'
            className={`${classes.displayFriendsBtn} ${
              location.pathname === '/channels/@me' ? classes.active : null
            }`}
          >
            <FaUserFriends
              style={{
                width: '24px',
                height: '24px',
                fill: '#fff',
                marginRight: '20px',
              }}
            />
            Friends
          </button>
        </Link>
        <Link to='/store'>
          <button
            type='button'
            className={`${classes.displayNitroPageBtn} ${
              location.pathname === '/store' ? classes.active : null
            }`}
          >
            <Nitro style={{ display: 'block', marginRight: '20px' }} /> Nitro
          </button>
        </Link>
      </div>
      <div className={classes.DMHeaderContainer}>
        <h2 className={classes.DMHeading}>Direct messages</h2>
        <button className={classes.createDmBtn}>+</button>
      </div>
      <div className={classes.friendsList}>{renderUsers()}</div>
    </div>
  )
}