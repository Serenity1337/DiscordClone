import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classes from './FriendsListMain.module.scss'
import { FaUserFriends, FaUserTimes } from 'react-icons/fa'
import { CgInbox } from 'react-icons/cg'
import { IoIosHelpCircleOutline } from 'react-icons/io'
import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import { FiMessageSquare, FiUserX } from 'react-icons/fi'
import { TiTick } from 'react-icons/ti'
import { BsX } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'
// import { discordTag } from '../../utils/Functions'
import NewDm from '../../utils/imgs/NewDm'
import catto from '../../utils/imgs/catto.png'

import {
  addFriendHandler,
  acceptFriendRequest,
  unblockUserHandler,
  removeUserFromFriendList,
  blockUserHandler,
  declineFriendRequest,
} from './FriendsListMainUtils/FriendsListMainHandlers'

export const FriendsListMain = (props) => {
  let location = useLocation()
  // State to filter out online,all,pending or blocked users
  const [friendStatusState, setfriendStatusState] = useState({
    online: false,
    all: true,
    pending: false,
    blocked: false,
  })
  const [filteredFriendsArr, setfilteredFriendsArr] = useState([])
  const [errorState, seterrorState] = useState('')
  const [usernameState, setusernameState] = useState('')
  const [openModalProfile, setopenModalProfile] = useState({})
  const [mouseCoordX, setmouseCoordX] = useState(0)
  const [mouseCoordY, setmouseCoordY] = useState(0)
  const [modalProfileIndex, setmodalProfileIndex] = useState(0)
  // This useEffect filters online/blocked/all/pending users based on filter

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
  useEffect(() => {
    if (openModalProfile[modalProfileIndex] === true) {
      document.addEventListener('click', closeModalProfileHandler)
    } else {
      document.removeEventListener('click', closeModalProfileHandler)
    }
  }, [openModalProfile])
  // username input handler
  const usernameInputHandler = (event) => {
    setusernameState(event.target.value)
  }
  //--------------------------------------------------------------
  // opens the profile modal
  const openModalProfileHandler = (event, user, index) => {
    event.preventDefault()
    if (event.button === 2) {
      const modalProfile = { [index]: true }
      console.log(user)
      setopenModalProfile(modalProfile)
      setmodalProfileIndex(index)
      setmouseCoordX(event.clientX)
      setmouseCoordY(event.clientY)

      return false
    }
    return false
  }
  const closeModalProfileHandler = (event) => {
    setopenModalProfile(false)
  }

  //--------------------------------------------------------------
  // render the profile modal

  const renderProfileModal = (user, index) => {
    console.log(user)
    return (
      <div
        className={classes.profileModalContainer}
        style={{
          padding: `6px 8px`,
          backgroundColor: '#18191c',
          position: 'absolute',
          top: `${mouseCoordY}px`,
          left: `${mouseCoordX}px`,
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
              index,
              props.users,
              props.setuser,
              props.setusers,
              seterrorState,
              props.user,
              setopenModalProfile
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
              index,
              props.users,
              props.setuser,
              props.setusers,
              seterrorState,
              props.user,
              setopenModalProfile
            )
          }
        >
          Block
        </div>
      </div>
    )
  }

  //--------------------------------------------------------------
  // displays the mouseover text on the buttons
  const displayBtnText = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }
  //------------------------------------------------------------
  // Filter handler to filter the users based on this filter
  const filterHandler = (event) => {
    seterrorState('')
    if (event.target.textContent === 'Add Friend') {
      let obj = {}
      let key = 'addFriend'
      obj[key] = true
      setfriendStatusState(obj)
    } else {
      let obj = {}
      let key = event.target.textContent.toLowerCase()
      obj[key] = true
      setfriendStatusState(obj)
    }
  }
  //-------------------------------------------------------------
  // function to return status icons based on the conditions
  const renderStatus = (user, index) => {
    if (
      user.status === 'offline' ||
      user.status === 'outgoing friend request' ||
      user.status === 'incoming friend request' ||
      user.status === 'blocked'
    ) {
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
  //--------------------------------------------------------------
  // renders the online/all/blocked/pending users based on filters
  const renderUsers = () => {
    if (props.user.username) {
      // renders all friends regardless of the status
      if (friendStatusState.all || friendStatusState.online) {
        return filteredFriendsArr.map((user, index) => (
          <Link to={`${location.pathname}`}>
            <div
              className={classes.userContainer}
              onContextMenu={(event) =>
                openModalProfileHandler(event, user, index)
              }
            >
              {openModalProfile[index] ? renderProfileModal(user, index) : null}
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

      if (friendStatusState.blocked) {
        return filteredFriendsArr.map((user, index) => (
          <Link to={`${location.pathname}`}>
            <div className={classes.userContainer}>
              <div className={classes.userProfile}>
                <div className={classes.friendListUserAvatar}>
                  <img src={catto} alt='' />
                  {renderStatus(user, index)}
                </div>
                <div className={classes.friendUsername}>
                  {user.username}
                  <div className={classes.blockedStatus}>{user.status}</div>
                </div>
              </div>
              <div className={classes.btnContainer}>
                <div
                  className={classes.optionsBtn}
                  onClick={(event) =>
                    unblockUserHandler(
                      event,
                      user,
                      index,
                      props.users,
                      props.setuser,
                      seterrorState,
                      props.user
                    )
                  }
                >
                  <FaUserTimes
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
      // -------------------------------------------------------
      // renders all pending user requests
      if (friendStatusState.pending && filteredFriendsArr.length > 0) {
        return filteredFriendsArr.map((user, index) => (
          <Link to={`${location.pathname}`}>
            <div className={classes.userContainer}>
              <div className={classes.userProfile}>
                <div className={classes.friendListUserAvatar}>
                  <img src={catto} alt='' />
                  {renderStatus(user, index)}
                </div>
                <div className={classes.friendUsername}>{user.username} </div>
              </div>
              {user.status === 'incoming friend request' ? (
                <div className={classes.btnContainer}>
                  <div
                    className={classes.msgButton}
                    onClick={(event) =>
                      acceptFriendRequest(
                        event,
                        user,
                        index,
                        props.users,
                        props.setuser,
                        props.setusers,
                        seterrorState,
                        props.user
                      )
                    }
                  >
                    <TiTick
                      className={classes.pendingAcceptBtn}
                      style={{
                        width: '20px',
                        height: '20px',
                        stroke: 'none',
                      }}
                    />
                  </div>
                  <div
                    className={classes.optionsBtn}
                    onClick={(event) =>
                      declineFriendRequest(
                        event,
                        user,
                        index,
                        props.user,
                        props.users,
                        props.setuser,
                        props.setusers,
                        seterrorState
                      )
                    }
                  >
                    <BsX
                      className={classes.pendingCancelBtn}
                      style={{
                        width: '20px',
                        height: '20px',
                        stroke: 'none',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className={classes.btnContainer}>
                  <div
                    className={classes.optionsBtn}
                    onClick={(event) =>
                      declineFriendRequest(event, user, index)
                    }
                  >
                    <BsX
                      className={classes.pendingCancelBtn}
                      style={{
                        width: '20px',
                        height: '20px',
                        stroke: 'none',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))
      } else {
      }
      //---------------------------------------------------------
      // renders add friend UI
      if (friendStatusState.addFriend) {
        return (
          <div className={classes.addFriendContainer}>
            <div className={classes.addFriendHeading}>add friend</div>
            {!errorState ? (
              <div className={classes.addFriendSubHeading}>
                You can add a friend with their Discord Tag. It is cAsE
                sEnSiTiVe
              </div>
            ) : (
              <div className={classes.addFriendError}>{errorState}</div>
            )}
            <form
              action=''
              className={classes.submitAddFriend}
              onSubmit={(event) =>
                addFriendHandler(
                  event,
                  props.user,
                  usernameState,
                  props.users,
                  seterrorState,
                  props.setusers,
                  props.setuser,
                  uuidv4
                )
              }
            >
              <input
                type='text'
                name='username'
                id='username'
                className={classes.username}
                placeholder='Enter a username#0000'
                onChange={usernameInputHandler}
              />

              <button
                type='submit'
                disabled={usernameState.length > 0 ? false : true}
                className={
                  usernameState.length > 0
                    ? classes.addFriendSubmitBtn
                    : classes.addFriendSubmitBtnDisabled
                }
              >
                Send Friend Request
              </button>
            </form>
            <div className={classes.horizontalLine}></div>
          </div>
        )
      }
      //---------------------------------------------------------
    }
  }
  // renders the header text for example "pending -- x" based on condition
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
    if (friendStatusState.pending === true) {
      return (
        <div className={classes.friendsHeading}>
          pending <div className={classes.horizontalLine}></div>
          {filteredFriendsArr.length}
        </div>
      )
    }
    if (friendStatusState.blocked === true) {
      return (
        <div className={classes.friendsHeading}>
          blocked <div className={classes.horizontalLine}></div>
          {filteredFriendsArr.length}
        </div>
      )
    }
  }
  // -------------------------------------------------------------
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
          <li
            onClick={(event) => filterHandler(event)}
            className={classes.addAFriendBtn}
          >
            Add Friend
          </li>
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
