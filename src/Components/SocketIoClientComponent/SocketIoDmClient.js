import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { UpdateUserAction } from '../../Redux/Action-creators/UserActions'
export const SocketIoDmClient = () => {
  const dispatch = useDispatch()
  const reduxState = useSelector((state) => state)
  const { user, users } = reduxState
  const socket = io('http://localhost:8080')
  let location = useLocation()
  const indexOfAtMe = location.pathname.indexOf('@me')

  const receiveDMMessageHandler = (dmId, message) => {
    if (message.sender !== user.username) {
      const userClone = { ...user }
      const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
      userClone.DMS[dmIndex].messages = [
        ...userClone.DMS[dmIndex].messages,
        message,
      ]
      dispatch(UpdateUserAction(userClone))
    }
  }

  const receiveDMEditMessageHandler = (dmId, editMsg, msgIndex) => {
    const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
    if (user.DMS[dmIndex].messages[msgIndex].sender !== user.username) {
      const userClone = { ...user }
      userClone.DMS[dmIndex].messages[msgIndex].msg = editMsg
      dispatch(UpdateUserAction(userClone))
    }
  }
  const receiveDMDeletedMessageHandler = (dmId, msgObj, msgIndex) => {
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
  }
  const receiveFriendRequestHandler = (userId, friend) => {
    const userClone = { ...user }
    const checkIfExists = userClone.friends.pending.filter(
      (frnd) => frnd._id === friend._id
    )
    if (checkIfExists.length > 0) {
      dispatch(UpdateUserAction(userClone))
    } else {
      const friendClone = { ...friend }
      friendClone.status = 'incoming friend request'
      userClone.friends.pending = [...userClone.friends.pending, friendClone]
      dispatch(UpdateUserAction(userClone))
    }
  }
  const receiveAcceptedFriendRequestHandler = (userId, friend) => {
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
      userClone.friends.accepted = [...userClone.friends.accepted, friendClone]
      dispatch(UpdateUserAction(userClone))
    }
  }
  const receiveBlockFriendRequestHandler = (userId, friend) => {
    const userClone = { ...user }

    const acceptedClone = userClone.friends.accepted.filter(
      (frnd) => frnd._id !== friend._id
    )
    userClone.friends.accepted = acceptedClone

    dispatch(UpdateUserAction(userClone))
  }
  const receiveDeclinedFriendRequestHandler = (userId, friend) => {
    const userClone = { ...user }
    const pendingClone = userClone.friends.pending.filter(
      (frnd) => frnd._id !== friend._id
    )
    userClone.friends.pending = pendingClone
    dispatch(UpdateUserAction(userClone))
  }
  const receiveRemoveFriendRequestHandler = (userId, friend) => {
    const userClone = { ...user }

    const acceptedClone = userClone.friends.accepted.filter(
      (frnd) => frnd._id !== friend._id
    )
    userClone.friends.accepted = acceptedClone

    dispatch(UpdateUserAction(userClone))
  }
  useEffect(() => {
    socket.emit('dm room', `${user._id}`)

    socket.on('receive-message', (dmId, message) => {
      receiveDMMessageHandler(dmId, message)
    })

    socket.on('receive-edit-message', (dmId, editMsg, msgIndex) => {
      receiveDMEditMessageHandler(dmId, editMsg, msgIndex)
    })

    socket.on('receive-deleted-message', (dmId, msgObj, msgIndex) => {
      receiveDMDeletedMessageHandler(dmId, msgObj, msgIndex)
    })

    socket.on('receive-friend-request', (userId, friend) => {
      receiveFriendRequestHandler(userId, friend)
    })

    socket.on('receive-accepted-friend-request', (userId, friend) => {
      receiveAcceptedFriendRequestHandler(userId, friend)
    })

    socket.on('receive-declined-friend-request', (userId, friend) => {
      receiveDeclinedFriendRequestHandler(userId, friend)
    })

    socket.on('receive-block-friend-request', (userId, friend) => {
      receiveBlockFriendRequestHandler(userId, friend)
    })

    socket.on('receive-remove-friend-request', (userId, friend) => {
      receiveRemoveFriendRequestHandler(userId, friend)
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  return <div></div>
}
