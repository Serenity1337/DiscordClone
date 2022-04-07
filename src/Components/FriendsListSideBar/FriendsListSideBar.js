import React, { useState } from 'react'
import classes from './FriendsListSideBar.module.scss'
import { FaUserFriends, FaMicrophone, FaHeadphones } from 'react-icons/fa'
import { BsGearFill } from 'react-icons/bs'
import Nitro from '../../utils/imgs/Nitro.js'
import { Link, Redirect, useLocation } from 'react-router-dom'
import catto from '../../utils/imgs/catto.png'
import { useSelector } from 'react-redux'

export const FriendsListSideBar = () => {
  const user = useSelector((state) => state.user)
  const location = useLocation()
  const [statusMessageState, setstatusMessageState] = useState({})
  const [positionState, setpositionState] = useState(0)
  const [redirected, setredirected] = useState(false)
  const [redirectionLocation, setredirectionLocation] = useState('')

  // displays the mouseover text on server icons
  const displayName = (event, user, index) => {
    setstatusMessageState({ [index]: true })
    setpositionState(event.currentTarget.getBoundingClientRect().top + -40)
  }
  const removeName = (event, user, index) => {
    setstatusMessageState({ [index]: false })
    setpositionState(0)
  }

  const redirectToADM = (user, index) => {
    const loggedInUser = user
    for (let index = 0; index < loggedInUser.DMS.length; index++) {
      let directMessage = loggedInUser.DMS[index]
      for (
        let participantsIndex = 0;
        participantsIndex < directMessage.participants.length;
        participantsIndex++
      ) {
        if (user.username === directMessage.participants[participantsIndex]) {
          setredirectionLocation(`${directMessage._id}`)
          setredirected(true)
        }
      }
    }
  }
  // renders the status icons on avatars
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

  // renders the user's friendlist
  const renderUsers = () => {
    if (user.username) {
      return user.friends.accepted.map((user, index) => (
        <div
          className={classes.userContainerContainer}
          onClick={() => redirectToADM(user, index)}
          key={index}
        >
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
        </div>
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

      <div className={classes.meUserContainer}>
        <div className={classes.profileContainer}>
          <div className={classes.imgContainer}>
            <img
              src={catto}
              alt=''
              style={{ width: '32px', height: '32px', borderRadius: '50%' }}
            />
            {renderStatus(user)}
          </div>
          <div className={classes.userNameStatusContainer}>
            {user.username}
            <div style={{ fontSize: '12px', color: '#8e9297' }}>{user.tag}</div>
          </div>
        </div>
        <div className={classes.settingsContainer}>
          <FaMicrophone
            style={{
              fill: '#d9dadb',
              cursor: 'pointer',
              width: '15px',
              height: '15px',
            }}
          />
          <FaHeadphones
            style={{
              fill: '#d9dadb',
              cursor: 'pointer',
              width: '15px',
              height: '15px',
              margin: '0px 15px 0px 15px',
            }}
          />
          <BsGearFill
            style={{
              fill: '#d9dadb',
              cursor: 'pointer',
              width: '15px',
              height: '15px',
            }}
          />
        </div>
      </div>
      {redirected ? (
        <Redirect to={`/channels/@me/${redirectionLocation}`} />
      ) : null}
    </div>
  )
}
