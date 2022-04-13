import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { UpdateUserAction } from '../../Redux/Action-creators/UserActions'
export const SocketIoDmClient = () => {
  const dispatch = useDispatch()
  const reduxState = useSelector((state) => state)
  const { user, users, servers } = reduxState
  const socket = io('http://localhost:8080')
  let location = useLocation()
  const indexOfAtMe = location.pathname.indexOf('@me')
  console.log(
    location.pathname.slice(indexOfAtMe + 4, location.pathname.length - 1)
  )
  useEffect(() => {
    socket.emit('dm room', `${user._id}`)
    console.log('this is coming from dmclientjs but app')
    return () => {
      socket.disconnect()
      console.log('does this work from dmclientjs app?')
    }
  }, [])

  useEffect(() => {
    if (user.DMS) {
      socket.on('receive-message', (dmId, message) => {
        if (message.sender !== user.username) {
          const userClone = { ...user }
          const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
          userClone.DMS[dmIndex].messages = [
            ...userClone.DMS[dmIndex].messages,
            message,
          ]
          dispatch(UpdateUserAction(userClone))
          console.log('im getting the message.', user)
          // props.setuser(userClone)
        }
      })
    }
    // return () => socket.off('receive-message')
  })

  useEffect(() => {
    socket.on('receive-edit-message', (dmId, editMsg, msgIndex) => {
      const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
      if (user.DMS[dmIndex].messages[msgIndex].sender !== user.username) {
        const userClone = { ...user }
        userClone.DMS[dmIndex].messages[msgIndex].msg = editMsg
        dispatch(UpdateUserAction(userClone))
      }
    })
  })

  useEffect(() => {
    socket.on('receive-deleted-message', (dmId, msgObj, msgIndex) => {
      const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
      if (user.DMS[dmIndex].messages[msgIndex].sender !== user.username) {
        const userClone = { ...user }
        const messagesClone = [...userClone.DMS[dmIndex].messages]
        const filteredMsgsClone = messagesClone.filter(
          (currMsgObj) => currMsgObj.id !== msgObj.id
        )
        userClone.DMS[dmIndex].messages = filteredMsgsClone
        dispatch(UpdateUserAction(userClone))
      }
    })
  })
  useEffect(() => {
    socket.on('receive-friend-request', (userId, friend) => {
      // props.setuser((prevState) => {
      const userClone = { ...user }
      const checkIfExists = userClone.friends.pending.filter(
        (frnd) => frnd._id === friend._id
      )
      if (checkIfExists.length > 0) {
        dispatch(UpdateUserAction(userClone))
      } else {
        console.log(userClone)
        const friendClone = { ...friend }
        friendClone.status = 'incoming friend request'
        userClone.friends.pending = [...userClone.friends.pending, friendClone]
        dispatch(UpdateUserAction(userClone))
      }
      // })
    })
  })

  useEffect(() => {
    socket.on('receive-accepted-friend-request', (userId, friend) => {
      // props.setuser((prevState) => {
      const userClone = { ...user }
      const checkIfExists = userClone.friends.accepted.filter(
        (frnd) => frnd._id === friend._id
      )
      if (checkIfExists.length > 0) {
        dispatch(UpdateUserAction(userClone))
      } else {
        const friendClone = { ...friend }
        const foundFriend = users.filter((frnd) => frnd._id === friend._id)
        friendClone.status = foundFriend[0].status
        const pendingClone = userClone.friends.pending.filter(
          (frnd) => frnd._id !== friend._id
        )
        userClone.friends.pending = pendingClone
        userClone.friends.accepted = [
          ...userClone.friends.accepted,
          friendClone,
        ]
        dispatch(UpdateUserAction(userClone))
      }
      // })
    })
  })

  useEffect(() => {
    socket.on('receive-declined-friend-request', (userId, friend) => {
      // props.setuser((prevState) => {
      const userClone = { ...user }

      const pendingClone = userClone.friends.pending.filter(
        (frnd) => frnd._id !== friend._id
      )
      userClone.friends.pending = pendingClone
      dispatch(UpdateUserAction(userClone))
      // })
    })
  })

  useEffect(() => {
    socket.on('receive-block-friend-request', (userId, friend) => {
      // props.setuser((prevState) => {
      const userClone = { ...user }

      const acceptedClone = userClone.friends.accepted.filter(
        (frnd) => frnd._id !== friend._id
      )
      userClone.friends.accepted = acceptedClone

      dispatch(UpdateUserAction(userClone))
      // })
    })
  })

  useEffect(() => {
    socket.on('receive-remove-friend-request', (userId, friend) => {
      // props.setuser((prevState) => {
      const userClone = { ...user }

      const acceptedClone = userClone.friends.accepted.filter(
        (frnd) => frnd._id !== friend._id
      )
      userClone.friends.accepted = acceptedClone

      dispatch(UpdateUserAction(userClone))
      // })
    })
  })
  return <div></div>
}
