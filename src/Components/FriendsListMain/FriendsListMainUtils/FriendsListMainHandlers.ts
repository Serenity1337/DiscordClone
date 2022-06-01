import { postRequest } from '../../../utils/Api'
import { UpdateUserAction, UpdateUserActionType } from '../../../Redux/Action-creators/UserActions'
import { UpdateUsersAction, User, Users } from '../../../Redux/Action-creators/UsersActions'
import { Socket } from 'socket.io-client'


//todo: search for dispatch typing
export const addFriendHandler = (
  event:React.SyntheticEvent,
  user: User,
  usernameState:string,
  users:Users,
  seterrorState:Function,
  dispatch:any,
  uuidv4:Function,
  socket:Socket
) => {
  event.preventDefault()
  const DMId = uuidv4()

  const loggedInUser = { ...user }

  const usernameCopy = usernameState.slice(
    usernameState.length - usernameState.length,
    usernameState.length - 5
  )
  const discordTagCopy = usernameState.slice(
    usernameState.length - 5,
    usernameState.length
  )
  // Checking whether the user actually exists.
  const foundUser = users.filter(
    (filteredUser) => filteredUser.username === usernameCopy
  )
  socket.emit('dm room', foundUser[0]._id)
  if (foundUser.length > 0 && discordTagCopy === foundUser[0].tag && user.friends) {
    // Checking if the user exists as pending user already.
    const existsPending = user.friends.pending.filter(
      (pendingUser) => pendingUser.username === usernameCopy
    )
    // Checking if the user exists as a friend already.
    const existsFriend = user.friends.accepted.filter(
      (acceptedUser) => acceptedUser.username === usernameCopy
    )
    const existsBlocked = user.friends.blocked.filter(
      (blockedUser) => blockedUser.userName === usernameCopy
    )
    if (existsPending.length === 0 && loggedInUser.friends) {
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
          if (loggedInUser.DMS) {
            for (let index = 0; index < loggedInUser.DMS.length; index++) {
              const findingDM = loggedInUser.DMS[index].participants.includes(
                foundUserCopy.username
              )
  
              if (findingDM === true) foundDM = true
            }
          }
          

          const foundUserCopyCopy = { ...foundUser[0] } 
          let loggedInUserCopy = { ...user }
          delete loggedInUserCopy.friends
          loggedInUserCopy.status = 'incoming friend request'
          if (foundUserCopyCopy.friends) {
            foundUserCopyCopy.friends.pending = [
              ...foundUserCopyCopy.friends.pending,
              loggedInUserCopy,
            ]
          }
          
          const loggedInUserIndex = users.findIndex(
            (currentUser) => currentUser.username === loggedInUser.username
          )

          const foundUserIndex = users.findIndex(
            (friendUser) => friendUser.username === foundUser[0].username
          )

          const usersCopy = [...users]
          usersCopy[loggedInUserIndex] = loggedInUser
          usersCopy[foundUserIndex] = foundUserCopyCopy

          if (!foundDM && loggedInUser.DMS && foundUserCopyCopy.DMS) {
            loggedInUser.DMS = [...loggedInUser.DMS, DMObj]
            foundUserCopyCopy.DMS = [...foundUserCopyCopy.DMS, DMObj]
          }
          const loggedInUserResponse = postRequest(
            `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
            loggedInUser
          )
          if (loggedInUserResponse.error) {
            seterrorState(loggedInUserResponse.msg)
          } else {
            dispatch(UpdateUserAction(loggedInUser))
          }
          // fetch(
          //   `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
          //   {
          //     method: 'POST',
          //     body: JSON.stringify(loggedInUser),
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //   }
          // )
          //   .then((header) => {
          //     return header.json()
          //   })
          //   .then((response) => {
          //     if (response.error) {
          //       seterrorState(response.msg)
          //     }
          //     setuser(loggedInUser)
          //   })

          const loggedInFriendResponse = postRequest(
            `http://localhost:8000/discord/discord/updateUser/${foundUserCopyCopy._id}`,
            foundUserCopyCopy
          )
          if (loggedInFriendResponse.error) {
            seterrorState(loggedInFriendResponse.msg)
          } else {
            // setuser(foundUserCopyCopy)
            dispatch(UpdateUsersAction(usersCopy))
          }

          // fetch(
          //   `http://localhost:8000/discord/discord/updateUser/${foundUserCopyCopy._id}`,
          //   {
          //     method: 'POST',
          //     body: JSON.stringify(foundUserCopyCopy),
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //   }
          // )
          //   .then((header) => {
          //     return header.json()
          //   })
          //   .then((response) => {
          //     if (response.error) {
          //       seterrorState(response.msg)
          //     }
          //     setusers(usersCopy)
          //   })
          socket.emit('add-friend-request', foundUser[0]._id, loggedInUser)
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
export const acceptFriendRequest = (
  event:React.SyntheticEvent,
  user: User,
  index: number,
  users: Users,
  dispatch:any,
  seterrorState: Function,
  currentUser: User,
  socket: Socket
) => {
  event.stopPropagation()
  event.preventDefault()

  const loggedInUser = { ...currentUser }
  const foundFriend = users.filter(
    (friend) => friend.username === user.username
  )
  socket.emit('dm room', foundFriend[0]._id)
  user.status = foundFriend[0].status
  if (loggedInUser.friends && foundFriend[0].friends) {
    loggedInUser.friends.accepted = [...loggedInUser.friends.accepted, user]
    const filteredPending = loggedInUser.friends.pending.filter(
      (friend) => friend.username !== user.username
    )
    loggedInUser.friends.pending = filteredPending
  
    let foundLoggedInUser = users.filter(
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
  
    const loggedInUserIndex = users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )
  
    const friendIndex = users.findIndex(
      (friendUser) => friendUser.username === foundFriend[0].username
    )
  
    const usersCopy = [...users]
    usersCopy[loggedInUserIndex] = loggedInUser
    usersCopy[index] = foundFriend[0]
  
    const loggedInUserResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
      loggedInUser
    )
  
    if (loggedInUserResponse.error) {
      seterrorState(loggedInUserResponse.msg)
    } else {
      dispatch(UpdateUserAction(loggedInUser))
    }
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(loggedInUser),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setuser(loggedInUser)
    //   })
  
    const loggedInUserFriendResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${foundFriend[0]._id}`,
      foundFriend[0]
    )
  
    if (loggedInUserFriendResponse.error) {
      seterrorState(loggedInUserFriendResponse.msg)
    } else {
      dispatch(UpdateUsersAction(usersCopy))
    }
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${foundFriend[0]._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(foundFriend[0]),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setusers(usersCopy)
    //   })
    socket.emit('accept-friend-request', foundFriend[0]._id, loggedInUser)
  }
  
}

export const unblockUserHandler = (
  event:React.SyntheticEvent,
  user: User,
  index: number,
  users: Users,
  dispatch: any,
  seterrorState: Function,
  currentUser: User
) => {
  event.stopPropagation()
  event.preventDefault()

  const loggedInUser = { ...currentUser }
  const foundFriend = users.filter(
    (friend) => friend.username === user.username
  )
  if (loggedInUser.friends) {
    const filteredBlocked = loggedInUser.friends.blocked.filter(
      (friend) => friend.username !== user.username
    )
    loggedInUser.friends.blocked = filteredBlocked
  
    const loggedInUserIndex = users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )
  
    const usersCopy = [...users]
    usersCopy[loggedInUserIndex] = loggedInUser
  
    const loggedInUserResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
      loggedInUser
    )
  
    if (loggedInUserResponse.error) {
      seterrorState(loggedInUserResponse.msg)
    } else {
      dispatch(UpdateUserAction(loggedInUser))
    }
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(loggedInUser),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setuser(loggedInUser)
    //   })
  }
  
}

export const removeUserFromFriendList = (
  event: React.SyntheticEvent,
  currentUser: User,
  index: number,
  users: Users,
  dispatch: any,
  seterrorState: Function,
  user: User,
  setopenModalProfile: Function,
  socket: Socket
) => {
  event.stopPropagation()
  event.preventDefault()
  const loggedInUser = { ...currentUser }
  const foundFriend = users.filter(
    (friend) => friend.username === user.username
  )
  socket.emit('dm room', foundFriend[0]._id)
  if (loggedInUser.friends && foundFriend[0].friends) {
    const filteredAccepted = loggedInUser.friends.accepted.filter(
      (friend) => friend.username !== user.username
    )
    loggedInUser.friends.accepted = filteredAccepted
  
    let foundLoggedInUser = users.filter(
      (loggedUser) => loggedUser.username === loggedInUser.username
    )
  
    delete foundLoggedInUser[0].friends
  
    const friendFriendsArray = foundFriend[0].friends.accepted.filter(
      (loggedUser) => loggedUser.username !== foundLoggedInUser[0].username
    )
  
    foundFriend[0].friends.accepted = friendFriendsArray
  
    const loggedInUserIndex = users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )
  
    const friendIndex = users.findIndex(
      (friendUser) => friendUser.username === foundFriend[0].username
    )
  
    const usersCopy = [...users]
    usersCopy[loggedInUserIndex] = loggedInUser
    usersCopy[index] = foundFriend[0]
  
    const loggedInUserResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
      loggedInUser
    )
  
    if (loggedInUserResponse.error) {
      seterrorState(loggedInUserResponse.msg)
    } else {
      dispatch(UpdateUserAction(loggedInUser))
    }
  
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(loggedInUser),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setuser(loggedInUser)
    //   })
  
    const loggedInUserFriendResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${foundFriend[0]._id}`,
      foundFriend[0]
    )
  
    if (loggedInUserFriendResponse.error) {
      seterrorState(loggedInUserFriendResponse.msg)
    } else {
      dispatch(UpdateUsersAction(usersCopy))
    }
    setopenModalProfile({})
  
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${foundFriend[0]._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(foundFriend[0]),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setusers(usersCopy)
    //     setopenModalProfile({})
    //   })
  
    socket.emit('remove-friend-request', foundFriend[0]._id, loggedInUser)
  }
  
}

export const blockUserHandler = (
  event: React.SyntheticEvent,
  currentUser: User,
  index: number,
  users: Users,
  dispatch: any,
  seterrorState: Function,
  user: User,
  setopenModalProfile: Function,
  socket: Socket
) => {
  event.stopPropagation()
  event.preventDefault()

  const loggedInUser = { ...currentUser }
  const foundFriend = users.filter(
    (friend) => friend.username === user.username
  )
  socket.emit('dm room', foundFriend[0]._id)
  if (loggedInUser.friends && foundFriend[0].friends) {
    loggedInUser.friends.blocked = [...loggedInUser.friends.blocked, user]
    const filteredAccepted = loggedInUser.friends.accepted.filter(
      (friend) => friend.username !== user.username
    )
    loggedInUser.friends.accepted = filteredAccepted
  
    let foundLoggedInUser = users.filter(
      (loggedUser) => loggedUser.username === loggedInUser.username
    )
  
    delete foundLoggedInUser[0].friends
  
    const friendFriendsArray = foundFriend[0].friends.accepted.filter(
      (loggedUser) => loggedUser._id !== loggedInUser._id
    )
  
    foundFriend[0].friends.accepted = friendFriendsArray
  
    const loggedInUserIndex = users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )
  
    const friendIndex = users.findIndex(
      (friendUser) => friendUser.username === foundFriend[0].username
    )
  
    const usersCopy = [...users]
    usersCopy[loggedInUserIndex] = loggedInUser
    usersCopy[index] = foundFriend[0]
  
    const loggedInUserResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
      loggedInUser
    )
  
    if (loggedInUserResponse.error) {
      seterrorState(loggedInUserResponse.msg)
    } else {
      dispatch(UpdateUserAction(loggedInUser))
    }
  
    const loggedInUserFriendResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${foundFriend[0]._id}`,
      foundFriend[0]
    )
  
    if (loggedInUserFriendResponse.error) {
      seterrorState(loggedInUserFriendResponse.msg)
    } else {
      dispatch(UpdateUsersAction(usersCopy))
    }
    setopenModalProfile({})
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(loggedInUser),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setuser(loggedInUser)
    //   })
  
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${foundFriend[0]._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(foundFriend[0]),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setusers(usersCopy)
    //     setopenModalProfile({})
    //   })
  
    socket.emit('block-friend-request', foundFriend[0]._id, loggedInUser)
  }
  
}

export const declineFriendRequest = (
  event: React.SyntheticEvent,
  user: User,
  index: number,
  currentUser: User,
  users: Users,
  dispatch: any,
  seterrorState: Function,
  socket: Socket
) => {
  event.stopPropagation()
  event.preventDefault()

  const loggedInUser = { ...currentUser }
  const foundFriend = users.filter(
    (friend) => friend.username === user.username
  )
  if (loggedInUser.friends && foundFriend[0].friends) {
    const filteredLoggedInPendingArr = loggedInUser.friends.pending.filter(
      (filteredPendingUser) => filteredPendingUser.username !== user.username
    )
    loggedInUser.friends.pending = filteredLoggedInPendingArr
  
    
  
    socket.emit('dm room', foundFriend[0]._id)
    const filteredFriendPendingArr = foundFriend[0].friends.pending.filter(
      (userCopy) => userCopy.username !== loggedInUser.username
    )
  
    foundFriend[0].friends.pending = filteredFriendPendingArr
  
    const loggedInUserIndex = users.findIndex(
      (currentUser) => currentUser.username === loggedInUser.username
    )
  
    const friendIndex = users.findIndex(
      (friendUser) => friendUser.username === foundFriend[0].username
    )
  
    const usersCopy = [...users]
    usersCopy[loggedInUserIndex] = loggedInUser
    usersCopy[friendIndex] = foundFriend[0]
  
    const loggedInUserResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
      loggedInUser
    )
  
    if (loggedInUserResponse.error) {
      seterrorState(loggedInUserResponse.msg)
    } else {
      dispatch(UpdateUserAction(loggedInUser))
    }
  
    const loggedInUserFriendResponse = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${foundFriend[0]._id}`,
      foundFriend[0]
    )
  
    if (loggedInUserFriendResponse.error) {
      seterrorState(loggedInUserFriendResponse.msg)
    } else {
      dispatch(UpdateUsersAction(usersCopy))
    }
  
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(loggedInUser),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setuser(loggedInUser)
    //   })
  
    // fetch(
    //   `http://localhost:8000/discord/discord/updateUser/${foundFriend[0]._id}`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(foundFriend[0]),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((header) => {
    //     return header.json()
    //   })
    //   .then((response) => {
    //     if (response.error) {
    //       seterrorState(response.msg)
    //     }
    //     setusers(usersCopy)
    //   })
    socket.emit('decline-friend-request', foundFriend[0]._id, loggedInUser)
  }
  
}
// module.exports = {
//   addFriendHandler,
//   acceptFriendRequest,
//   unblockUserHandler,
//   removeUserFromFriendList,
//   blockUserHandler,
//   declineFriendRequest,
// }
