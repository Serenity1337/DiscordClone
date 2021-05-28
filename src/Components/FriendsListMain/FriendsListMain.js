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
  // add a friend submit handler
  const addFriendHandler = (event) => {
    event.preventDefault()
    const DMId = uuidv4()

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
    if (foundUser.length > 0 && discordTagCopy === foundUser[0].tag) {
      // Checking if the user exists as pending user already.
      const existsPending = props.user.friends.pending.filter(
        (pendingUser) => pendingUser.username === usernameCopy
      )
      // Checking if the user exists as a friend already.
      const existsFriend = props.user.friends.accepted.filter(
        (acceptedUser) => acceptedUser.username === usernameCopy
      )
      const existsBlocked = props.user.friends.blocked.filter(
        (blockedUser) => blockedUser.userName === usernameCopy
      )
      if (existsPending.length === 0) {
        if (existsFriend.length === 0) {
          if (existsBlocked.length === 0) {
            let foundUserCopy = { ...foundUser[0] }
            delete foundUserCopy.friends
            foundUserCopy.status = 'Outgoing friend request'
            loggedInUser.friends.pending = [
              ...loggedInUser.friends.pending,
              foundUserCopy,
            ]
            const DMObj = {
              participants: [
                `${loggedInUser.username}`,
                `${foundUserCopy.username}`,
              ],
              _id: `${DMId}`,
              messages: [],
            }
            let foundDM = false
            for (let index = 0; index < loggedInUser.DMS.length; index++) {
              const findingDM = loggedInUser.DMS[index].participants.includes(
                foundUserCopy.username
              )

              if (findingDM === true) foundDM = true

              console.log('inside loop foundDM', foundDM)
              // loggedInUser.DMS[index].participants.map((currUser) => {
              //   if (currUser === foundUserCopy.username) {
              //     console.log('testing')
              //   }
              // })
            }
            console.log('outside loop foundDM', foundDM)
            console.log('test')

            const foundUserCopyCopy = { ...foundUser[0] }
            let loggedInUserCopy = { ...props.user }
            delete loggedInUserCopy.friends
            loggedInUserCopy.status = 'incoming friend request'
            foundUserCopyCopy.friends.pending = [
              ...foundUserCopyCopy.friends.pending,
              loggedInUserCopy,
            ]
            const loggedInUserIndex = props.users.findIndex(
              (currentUser) => currentUser.username === loggedInUser.username
            )

            const foundUserIndex = props.users.findIndex(
              (friendUser) => friendUser.username === foundUser[0].username
            )

            const usersCopy = [...props.users]
            usersCopy[loggedInUserIndex] = loggedInUser
            usersCopy[foundUserIndex] = foundUserCopyCopy

            if (!foundDM) {
              loggedInUser.DMS = [...loggedInUser.DMS, DMObj]
              foundUserCopyCopy.DMS = [...foundUserCopyCopy.DMS, DMObj]
            }
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
            seterrorState('You have already blocked this user.')
          }
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
          onClick={(event) => removeUserFromFriendList(event, user, index)}
        >
          Remove Friend
        </div>
        <div
          className={classes.profileModalChoice}
          onClick={(event) => blockUserHandler(event, user, index)}
        >
          Block
        </div>
      </div>
    )
  }

  //--------------------------------------------------------------
  // accept or decline friend requests from pending users
  const acceptFriendRequest = (event, user, index) => {
    event.stopPropagation()
    event.preventDefault()

    const loggedInUser = { ...props.user }
    const foundFriend = props.users.filter(
      (friend) => friend.username === user.username
    )
    user.status = foundFriend[0].status
    loggedInUser.friends.accepted = [...loggedInUser.friends.accepted, user]
    const filteredPending = loggedInUser.friends.pending.filter(
      (friend) => friend.username !== user.username
    )
    loggedInUser.friends.pending = filteredPending

    let foundLoggedInUser = props.users.filter(
      (loggedUser) => loggedUser.username === loggedInUser.username
    )

    delete foundLoggedInUser[0].friends

    foundFriend[0].friends.accepted = [
      ...foundFriend[0].friends.accepted,
      foundLoggedInUser[0],
    ]
    const filteredFriendPending = foundFriend[0].friends.pending.filter(
      (friend) => friend.username !== loggedInUser.username
    )
    foundFriend[0].friends.pending = filteredFriendPending

    const loggedInUserIndex = props.users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )

    const friendIndex = props.users.findIndex(
      (friendUser) => friendUser.username === foundFriend[0].username
    )

    const usersCopy = [...props.users]
    usersCopy[loggedInUserIndex] = loggedInUser
    usersCopy[index] = foundFriend[0]

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

    fetch(`http://localhost:4000/users/${foundFriend[0].id}`, {
      method: 'PUT',
      body: JSON.stringify(foundFriend[0]),
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
  }

  const unblockUserHandler = (event, user, index) => {
    event.stopPropagation()
    event.preventDefault()

    const loggedInUser = { ...props.user }
    const foundFriend = props.users.filter(
      (friend) => friend.username === user.username
    )
    const filteredBlocked = loggedInUser.friends.blocked.filter(
      (friend) => friend.username !== user.username
    )
    loggedInUser.friends.blocked = filteredBlocked

    const loggedInUserIndex = props.users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )

    const usersCopy = [...props.users]
    usersCopy[loggedInUserIndex] = loggedInUser

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
  }

  const removeUserFromFriendList = (event, user, index) => {
    event.stopPropagation()
    event.preventDefault()

    const loggedInUser = { ...props.user }
    const foundFriend = props.users.filter(
      (friend) => friend.username === user.username
    )
    const filteredAccepted = loggedInUser.friends.accepted.filter(
      (friend) => friend.username !== user.username
    )
    loggedInUser.friends.accepted = filteredAccepted

    let foundLoggedInUser = props.users.filter(
      (loggedUser) => loggedUser.username === loggedInUser.username
    )

    delete foundLoggedInUser[0].friends

    const friendFriendsArray = foundFriend[0].friends.accepted.filter(
      (loggedUser) => loggedUser.username !== foundLoggedInUser[0].username
    )

    foundFriend[0].friends.accepted = friendFriendsArray

    const loggedInUserIndex = props.users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )

    const friendIndex = props.users.findIndex(
      (friendUser) => friendUser.username === foundFriend[0].username
    )

    const usersCopy = [...props.users]
    usersCopy[loggedInUserIndex] = loggedInUser
    usersCopy[index] = foundFriend[0]

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

    fetch(`http://localhost:4000/users/${foundFriend[0].id}`, {
      method: 'PUT',
      body: JSON.stringify(foundFriend[0]),
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
        setopenModalProfile({})
      })
  }
  const blockUserHandler = (event, user, index) => {
    event.stopPropagation()
    event.preventDefault()

    const loggedInUser = { ...props.user }
    const foundFriend = props.users.filter(
      (friend) => friend.username === user.username
    )

    loggedInUser.friends.blocked = [...loggedInUser.friends.blocked, user]
    const filteredAccepted = loggedInUser.friends.accepted.filter(
      (friend) => friend.username !== user.username
    )
    loggedInUser.friends.accepted = filteredAccepted

    let foundLoggedInUser = props.users.filter(
      (loggedUser) => loggedUser.username === loggedInUser.username
    )

    delete foundLoggedInUser[0].friends

    const friendFriendsArray = foundFriend[0].friends.accepted.filter(
      (loggedUser) => loggedUser.username !== foundLoggedInUser[0].username
    )

    foundFriend[0].friends.accepted = friendFriendsArray

    const loggedInUserIndex = props.users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )

    const friendIndex = props.users.findIndex(
      (friendUser) => friendUser.username === foundFriend[0].username
    )

    const usersCopy = [...props.users]
    usersCopy[loggedInUserIndex] = loggedInUser
    usersCopy[index] = foundFriend[0]

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

    fetch(`http://localhost:4000/users/${foundFriend[0].id}`, {
      method: 'PUT',
      body: JSON.stringify(foundFriend[0]),
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
        setopenModalProfile({})
      })
  }

  const declineFriendRequest = (event, user, index) => {
    event.stopPropagation()
    event.preventDefault()

    const loggedInUser = { ...props.user }
    const filteredLoggedInPendingArr = loggedInUser.friends.pending.filter(
      (filteredPendingUser) => filteredPendingUser.username !== user.username
    )
    loggedInUser.friends.pending = filteredLoggedInPendingArr

    const foundFriend = props.users.filter(
      (friend) => friend.username === user.username
    )

    const filteredFriendPendingArr = foundFriend[0].friends.pending.filter(
      (userCopy) => userCopy.username !== loggedInUser.username
    )

    foundFriend[0].friends.pending = filteredFriendPendingArr

    const loggedInUserIndex = props.users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )

    const friendIndex = props.users.findIndex(
      (friendUser) => friendUser.username === foundFriend[0].username
    )

    const usersCopy = [...props.users]
    usersCopy[loggedInUserIndex] = loggedInUser
    usersCopy[friendIndex] = foundFriend[0]
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

    fetch(`http://localhost:4000/users/${foundFriend[0].id}`, {
      method: 'PUT',
      body: JSON.stringify(foundFriend[0]),
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
  const testing = (event) => {
    event.stopPropagation()
    event.preventDefault()
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
                  onClick={(event) => unblockUserHandler(event, user, index)}
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
                    onClick={(event) => acceptFriendRequest(event, user, index)}
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
