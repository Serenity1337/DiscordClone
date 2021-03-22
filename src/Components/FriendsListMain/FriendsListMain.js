import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classes from './FriendsListMain.module.scss'
import { FaUserFriends } from 'react-icons/fa'
import { CgInbox } from 'react-icons/cg'
import { IoIosHelpCircleOutline } from 'react-icons/io'
import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import { FiMessageSquare } from 'react-icons/fi'
import { TiTick } from 'react-icons/ti'
import { BsX } from 'react-icons/bs'
// import { discordTag } from '../../utils/Functions'
import NewDm from '../../utils/imgs/NewDm'
import catto from '../../utils/imgs/catto.png'
import stringify from 'json-stringify-safe'

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
  // username input handler
  const usernameInputHandler = (event) => {
    setusernameState(event.target.value)
  }
  //--------------------------------------------------------------
  // add a friend submit handler
  const addFriendHandler = (event) => {
    event.preventDefault()

    const loggedInUser = { ...props.user }

    const usernameCopy = usernameState.slice(
      usernameState.length - usernameState.length,
      usernameState.length - 5
    )
    const discordTagCopy = usernameState.slice(
      usernameState.length - 5,
      usernameState.length
    )
    // Checking whether the user actually exists.
    const foundUser = props.users.filter(
      (filteredUser) => filteredUser.username === usernameCopy
    )
    const foundUser2 = props.users.filter(
      (filteredUser) => filteredUser.username === usernameCopy
    )
    if (foundUser.length > 0 && discordTagCopy === foundUser[0].tag) {
      // Checking if the user exists as pending user already.
      const existsPending = props.user.friends.pending.filter(
        (pendingUser) => pendingUser.username === usernameCopy
      )
      // Checking if the user exists as a friend already.
      const existsFriend = props.user.friends.accepted.filter(
        (acceptedUser) => acceptedUser.username === usernameCopy
      )
      if (existsPending.length === 0) {
        if (existsFriend.length === 0) {
          let foundUserCopy = { ...foundUser[0] }
          delete foundUserCopy.friends
          foundUserCopy.status = 'Outgoing friend request'
          loggedInUser.friends.pending = [
            ...loggedInUser.friends.pending,
            foundUserCopy,
          ]
          console.log(props.user)
          const foundUserCopyCopy = { ...foundUser2[0] }
          let loggedInUserCopy = { ...props.user }
          delete loggedInUserCopy.friends
          loggedInUserCopy.status = 'incoming friend request'
          foundUserCopyCopy.friends.pending = [
            ...foundUserCopyCopy.friends.pending,
            loggedInUserCopy,
          ]
          console.log(props.user)
          const loggedInUserIndex = props.users.findIndex(
            (currentUser) => currentUser.username === loggedInUser.username
          )

          const foundUserIndex = props.users.findIndex(
            (friendUser) => friendUser.username === foundUser[0].username
          )

          const usersCopy = [...props.users]
          usersCopy[loggedInUserIndex] = loggedInUser
          usersCopy[foundUserIndex] = foundUserCopyCopy

          fetch(`http://localhost:4000/users/${loggedInUser.id}`, {
            method: 'PUT',
            body: JSON.stringify(loggedInUser),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((header) => {
              return header.json()
            })
            .then((response) => {
              if (response.error) {
                seterrorState(response.msg)
              }
              props.setuser(loggedInUser)
            })

          fetch(`http://localhost:4000/users/${foundUserCopyCopy.id}`, {
            method: 'PUT',
            body: JSON.stringify(foundUserCopyCopy),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((header) => {
              return header.json()
            })
            .then((response) => {
              if (response.error) {
                seterrorState(response.msg)
              }
              props.setusers(usersCopy)
            })
        } else {
          seterrorState(`You're already friends with that user!`)
        }
      } else {
        seterrorState(`You have already sent a friend request to that user.`)
      }
    } else {
      seterrorState(
        `Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct.`
      )
    }
  }
  //--------------------------------------------------------------
  //--------------------------------------------------------------
  // accept or decline friend requests from pending users
  const acceptFriendRequest = (event, user, index) => {
    event.stopPropagation()
    event.preventDefault()

    let loggedInUser = { ...props.user }
    let pendingUser = { ...user }
  }

  const declineFriendRequest = (event, user, index) => {}
  //--------------------------------------------------------------
  // displays the mouseover text on the buttons
  const displayBtnText = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }
  //------------------------------------------------------------
  // Filter handler to filter the users based on the filter
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
      user.status === 'incoming friend request'
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
      if (friendStatusState.all || friendStatusState.online) {
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
      } else {
      }
      // -------------------------------------------------------
      // renders all pending user requests
      if (friendStatusState.pending && filteredFriendsArr.length > 0) {
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
              {user.status === 'incoming friend request' ? (
                <div className={classes.btnContainer}>
                  <div
                    className={classes.msgButton}
                    onClick={(event) => acceptFriendRequest(event)}
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
                    onClick={(event) => declineFriendRequest(event)}
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
                    onClick={(event) => declineFriendRequest(event)}
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
              onSubmit={addFriendHandler}
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
