import React, { useEffect, useState, useContext } from 'react'
import classes from './DMMain.module.scss'
import { io } from 'socket.io-client'
import { UserContext } from '../../Contexts/UserContext'
import { DMMMainForm } from './DMMainComponents/DMMainForm/DMMMainForm'
import { DMMainMessages } from './DMMainComponents/DMMainMessages/DMMainMessages'
import { DMMainNav } from './DMMainComponents/DMMainNav/DMMainNav'

export const DMMain = (props) => {
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
    pingInterval: 1000 * 60 * 5,
    pingTimeout: 1000 * 60 * 3,
  })
  const [friend, setFriend] = useState({})
  const { user, setuser } = useContext(UserContext)
  const [messages, setmessages] = useState([])
  const [chatBoxContainer, setchatBoxContainer] = useState({})
  useEffect(() => {
    socket.emit('dm room', `${user._id}`)
    setmessages([...user.DMS[props.dmIndex].messages])
  }, [])

  useEffect(() => {
    socket.on('receive-message', (dmId, message) => {
      console.log('receiving')
      if (dmId === props.dm.id) {
        setmessages((prevState) => {
          if (message.sender !== user.username) {
            return [...prevState, message]
          }
        })
      } else {
        console.log('im receiving')
        if (message.sender !== user.username) {
          const userClone = { ...user }
          const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
          userClone.DMS[dmIndex].messages = [
            ...userClone.DMS[dmIndex].messages,
            message,
          ]
          setuser(userClone)
        }
      }
    })
    // return () => socket.off('receive-message')
  })

  useEffect(() => {
    socket.on('receive-edit-message', (editMsg, msgIndex) => {
      setmessages((prevState) => {
        if (prevState[msgIndex].sender !== user.username) {
          prevState[msgIndex].msg = editMsg
          return [...prevState]
        } else {
          return [...prevState]
        }
      })
      // }
    })
    // return () => socket.off('receive-edit-message')
  })
  useEffect(() => {
    socket.on('receive-deleted-message', (dmObj, dmIndex) => {
      setmessages((prevState) => {
        if (prevState[dmIndex].sender !== user.username) {
          const clonePrevState = prevState.filter(
            (msgObj) => msgObj.id !== dmObj.id
          )
          return [...clonePrevState]
        } else {
          return [...prevState]
        }
      })
    })
    // return () => socket.off('receive-edit-message')
  })
  useEffect(() => {
    console.log(props.dm)
    console.log(props.users)
    const loggedInUserFriendString = props.dm.participants.filter(
      (userFriend) => userFriend !== user.username
    )
    const loggedInUserFriend = props.users.filter(
      (friendObject) => friendObject.username === loggedInUserFriendString[0]
    )
    setFriend(loggedInUserFriend[0])
    console.log(loggedInUserFriend)
    socket.emit('dm room', `${loggedInUserFriend[0]._id}`)
  }, [])

  return (
    <div className={classes.DMMain}>
      <DMMainNav friend={friend} />
      <div className={classes.DMMainHorizontalLine}></div>

      <DMMainMessages
        friend={friend}
        messages={messages}
        setmessages={setmessages}
        user={props.user}
        setchatBoxContainer={setchatBoxContainer}
        dm={props.dm}
        dmIndex={props.dmIndex}
      />

      <DMMMainForm
        friend={friend}
        dm={props.dm}
        user={props.user}
        dmIndex={props.dmIndex}
        setmessages={setmessages}
        chatBoxContainer={chatBoxContainer}
      />
    </div>
  )
}
