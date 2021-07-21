import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
export const SocketIoDmClient = (props) => {
  const socket = io('http://localhost:8080')
  let location = useLocation()
  const indexOfAtMe = location.pathname.indexOf('@me')
  console.log(
    location.pathname.slice(indexOfAtMe + 4, location.pathname.length - 1)
  )
  useEffect(() => {
    socket.emit('dm room', `${props.user._id}`)
  }, [])

  useEffect(() => {
    if (props.user.DMS) {
      socket.on('receive-message', (dmId, message) => {
        if (message.sender !== props.user.username) {
          const userClone = { ...props.user }
          const dmIndex = props.user.DMS.findIndex(
            (thisDm) => thisDm._id === dmId
          )
          userClone.DMS[dmIndex].messages = [
            ...userClone.DMS[dmIndex].messages,
            message,
          ]
          props.setuser(userClone)
        }
      })
    }
    // return () => socket.off('receive-message')
  })

  useEffect(() => {
    socket.on('receive-edit-message', (dmId, editMsg, msgIndex) => {
      const dmIndex = props.user.DMS.findIndex((thisDm) => thisDm._id === dmId)
      if (
        props.user.DMS[dmIndex].messages[msgIndex].sender !==
        props.user.username
      ) {
        const userClone = { ...props.user }
        userClone.DMS[dmIndex].messages[msgIndex].msg = editMsg
        props.setuser(userClone)
      }
    })
  })

  useEffect(() => {
    socket.on('receive-deleted-message', (dmId, msgObj, msgIndex) => {
      const dmIndex = props.user.DMS.findIndex((thisDm) => thisDm._id === dmId)
      if (
        props.user.DMS[dmIndex].messages[msgIndex].sender !==
        props.user.username
      ) {
        const userClone = { ...props.user }
        const messagesClone = [...userClone.DMS[dmIndex].messages]
        const filteredMsgsClone = messagesClone.filter(
          (currMsgObj) => currMsgObj.id !== msgObj.id
        )
        userClone.DMS[dmIndex].messages = filteredMsgsClone
        props.setuser(userClone)
      }
    })
  })
  useEffect(() => {
    socket.on('receive-friend-request', (userId, friend) => {
      props.setuser((prevState) => {
        const userClone = { ...prevState }
        const checkIfExists = userClone.friends.pending.filter(
          (frnd) => frnd._id === friend._id
        )
        if (checkIfExists.length > 0) {
          return { ...prevState }
        } else {
          console.log(userClone)
          const friendClone = { ...friend }
          friendClone.status = 'incoming friend request'
          userClone.friends.pending = [
            ...userClone.friends.pending,
            friendClone,
          ]
          return { ...userClone }
        }
      })
    })
  })

  useEffect(() => {
    socket.on('receive-accepted-friend-request', (userId, friend) => {
      props.setuser((prevState) => {
        const userClone = { ...prevState }
        const checkIfExists = userClone.friends.accepted.filter(
          (frnd) => frnd._id === friend._id
        )
        if (checkIfExists.length > 0) {
          return { ...prevState }
        } else {
          const friendClone = { ...friend }
          const foundFriend = props.users.filter(
            (frnd) => frnd._id === friend._id
          )
          friendClone.status = foundFriend[0].status
          const pendingClone = userClone.friends.pending.filter(
            (frnd) => frnd._id !== friend._id
          )
          userClone.friends.pending = pendingClone
          userClone.friends.accepted = [
            ...userClone.friends.accepted,
            friendClone,
          ]
          return { ...userClone }
        }
      })
    })
  })

  useEffect(() => {
    socket.on('receive-declined-friend-request', (userId, friend) => {
      props.setuser((prevState) => {
        const userClone = { ...prevState }

        const pendingClone = userClone.friends.pending.filter(
          (frnd) => frnd._id !== friend._id
        )
        userClone.friends.pending = pendingClone
        return { ...userClone }
      })
    })
  })

  useEffect(() => {
    socket.on('receive-block-friend-request', (userId, friend) => {
      props.setuser((prevState) => {
        const userClone = { ...prevState }

        const acceptedClone = userClone.friends.accepted.filter(
          (frnd) => frnd._id !== friend._id
        )
        userClone.friends.accepted = acceptedClone

        return { ...userClone }
      })
    })
  })
  return <div></div>
}
