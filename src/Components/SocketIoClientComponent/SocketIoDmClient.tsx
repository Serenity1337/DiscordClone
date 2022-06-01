import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { UpdateUserAction } from '../../Redux/Action-creators/UserActions'
import {RootState} from '../../Redux/Reducers'
import { User, Users } from '../../Redux/Action-creators/UsersActions'
export const SocketIoDmClient = () => {
  const dispatch = useDispatch()
  const user = useSelector((state:RootState) => state.user) as User
  const users = useSelector((state: RootState) => state.users) as Users
  const socket = io('http://localhost:8080')
  let location = useLocation()
  const indexOfAtMe = location.pathname.indexOf('@me')

  type MessageType = {
    sentDate: string,
    id: string,
    sender: string,
    msg: string
  }

  const receiveDMMessageHandler = (dmId: string, message: MessageType) => {
    if (message.sender !== user.username) {
      const userClone = { ...user }
      if (user.DMS && userClone.DMS) {
        const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
        userClone.DMS[dmIndex].messages = [
          ...userClone.DMS[dmIndex].messages,
          message,
        ]
        dispatch(UpdateUserAction(userClone))
      }
      
      
    }
  }

  const receiveDMEditMessageHandler = (dmId:string, editMsg:string, msgIndex:number) => {
    if (user.DMS) {
      const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
      const userClone = { ...user }
      if (user.DMS[dmIndex].messages[msgIndex].sender !== user.username && userClone.DMS) {
        
        userClone.DMS[dmIndex].messages[msgIndex].msg = editMsg
        dispatch(UpdateUserAction(userClone))
      }
    }
    
  }
  const receiveDMDeletedMessageHandler = (dmId:string, msgObj:MessageType, msgIndex:number) => {
    if (user.DMS) {
      const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
      const userClone = { ...user }
      if (user.DMS[dmIndex].messages[msgIndex].sender !== user.username && userClone.DMS) {
        
        const messagesClone = [...userClone.DMS[dmIndex].messages]
        const filteredMsgsClone = messagesClone.filter(
          (currMsgObj) => currMsgObj.id !== msgObj.id
        )
        userClone.DMS[dmIndex].messages = filteredMsgsClone
        dispatch(UpdateUserAction(userClone))
      }
    }
    
  }
  const receiveFriendRequestHandler = (userId:string, friend:User) => {
    const userClone = { ...user }
    if (userClone.friends) {
      const checkIfExists = userClone.friends.pending.filter(
        (frnd:User) => frnd._id === friend._id
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
    
  }
  const receiveAcceptedFriendRequestHandler = (userId: string, friend: User) => {
    const userClone = { ...user }
    if (userClone.friends) {
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
    
  }
  const receiveBlockFriendRequestHandler = (userId: string, friend: User) => {
    const userClone = { ...user }
    if (userClone.friends) {
      const acceptedClone = userClone.friends.accepted.filter(
        (frnd) => frnd._id !== friend._id
      )
      userClone.friends.accepted = acceptedClone
  
      dispatch(UpdateUserAction(userClone))
    }
    
  }
  const receiveDeclinedFriendRequestHandler = (userId: string, friend: User) => {
    const userClone = { ...user }
    if (userClone.friends) {
      const pendingClone = userClone.friends.pending.filter(
        (frnd) => frnd._id !== friend._id
      )
      userClone.friends.pending = pendingClone
      dispatch(UpdateUserAction(userClone))
    }
    
  }
  const receiveRemoveFriendRequestHandler = (userId: string, friend: User) => {
    const userClone = { ...user }
    if (userClone.friends) {
      const acceptedClone = userClone.friends.accepted.filter(
        (frnd) => frnd._id !== friend._id
      )
      userClone.friends.accepted = acceptedClone
  
      dispatch(UpdateUserAction(userClone))
    }
    
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
