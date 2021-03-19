import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classes from './FriendsListMain.module.scss'
import { FaUserFriends } from 'react-icons/fa'
import { CgInbox } from 'react-icons/cg'
import { IoIosHelpCircleOutline } from 'react-icons/io'
import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import { FiMessageSquare } from 'react-icons/fi'
import NewDm from '../../utils/imgs/NewDm'
import catto from '../../utils/imgs/catto.png'
export const FriendsListMain = (props) => {
  let location = useLocation()

  const [friendStatusState, setfriendStatusState] = useState({
    online: false,
    all: true,
    pending: false,
    blocked: false,
  })
  const [filteredFriendsArr, setfilteredFriendsArr] = useState([])
  useEffect(() => {
    if (props.user.username) {
      if (friendStatusState.online === true) {
        let arrCopy = [...props.user.friends.accepted]
        let filteredArr = arrCopy.filter(
          (user, index) => user.status !== 'offline'
        )
        setfilteredFriendsArr(filteredArr)
      }
      if (friendStatusState.all === true) {
        let arrCopy = [...props.user.friends.accepted]
        setfilteredFriendsArr(arrCopy)
      }
      if (friendStatusState.pending === true) {
        let arrCopy = [...props.user.friends.pending]
        setfilteredFriendsArr(arrCopy)
      }
      if (friendStatusState.blocked === true) {
        let arrCopy = [...props.user.friends.blocked]
        setfilteredFriendsArr(arrCopy)
      }
    }
  }, [friendStatusState, props.user])

  const displayBtnText = (event) => {
    event.stopPropagation()
    event.preventDefault()
    console.log('test')
  }
  const filterHandler = (event) => {
    console.log(event.target)
  }

  const renderStatus = (user, index) => {
    if (user.status === 'offline') {
      return (
        <div className={classes.offlineStatusIcon}>
          <div className={classes.innerCircle}></div>
        </div>
      )
    }
    if (user.status === 'online') {
      return <div className={classes.onlineStatusIcon}></div>
    }
    if (user.status === 'busy') {
      return (
        <div className={classes.busyStatusIcon}>
          <div className={classes.innerLine}></div>
        </div>
      )
    }
  }
  const renderUsers = () => {
    if (props.user.username) {
      return filteredFriendsArr.map((user, index) => (
        <Link to={`${location.pathname}/${user.username}`}>
          <div className={classes.userContainer}>
            <div className={classes.userProfile}>
              <div className={classes.friendListUserAvatar}>
                <img src={catto} alt='' />
                {renderStatus(user, index)}
              </div>
              <div className={classes.friendUsername}>{user.username} </div>
            </div>
            <div className={classes.btnContainer}>
              <div className={classes.msgButton}>
                <FiMessageSquare
                  style={{
                    width: '20px',
                    height: '20px',
                    fill: '#b9bbbe',
                    stroke: 'none',
                  }}
                />
              </div>
              <div
                className={classes.optionsBtn}
                onClick={(event) => displayBtnText(event)}
              >
                <IoEllipsisVerticalSharp
                  style={{
                    width: '20px',
                    height: '20px',
                    fill: '#b9bbbe',
                    stroke: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </Link>
      ))
    }
  }
  const renderHeading = () => {
    if (friendStatusState.online === true) {
      return (
        <div className={classes.friendsHeading}>
          online <div className={classes.horizontalLine}></div>
          {filteredFriendsArr.length}
        </div>
      )
    }

    if (friendStatusState.all === true) {
      return (
        <div className={classes.friendsHeading}>
          all friends <div className={classes.horizontalLine}></div>
          {filteredFriendsArr.length}
        </div>
      )
    }
  }

  return (
    <div className={classes.friendsListMainContainer}>
      <div className={classes.friendsListMainNavContainer}>
        <ul className={classes.friendsListMainNavigation}>
          <h1 className={classes.friendsListMainHeading}>
            <FaUserFriends
              style={{
                width: '24px',
                height: '24px',
                margin: '0px 10px 0px 25px',
                fill: '#72767d',
              }}
            />
            Friends
            <div className={classes.verticalLine}></div>
          </h1>
          <li onClick={(event) => filterHandler(event)}>Online</li>
          <li onClick={(event) => filterHandler(event)}>All</li>
          <li onClick={(event) => filterHandler(event)}>Pending</li>
          <li onClick={(event) => filterHandler(event)}>Blocked</li>
          <li className={classes.addAFriendBtn}>Add Friend</li>
        </ul>
        <div className={classes.friendsListMainSecondaryNavigation}>
          <NewDm className={classes.navIcon} />
          <div className={classes.verticalLine}></div>
          <CgInbox className={classes.navIcon} />
          <IoIosHelpCircleOutline className={classes.navIcon} />
        </div>
      </div>
      <div
        className={classes.verticalLine}
        style={{
          width: '100%',
          height: '1.5px',
          backgroundColor: 'rgb(32, 34, 37)',
        }}
      ></div>
      {renderHeading()}
      <div className={classes.friendsList}>{renderUsers()}</div>
    </div>
  )
}
