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
    socket.emit('dm room', `${props.dm._id}`)
    setmessages([...user.DMS[props.dmIndex].messages])
  }, [])

  useEffect(() => {
    socket.on('receive-message', (message) => {
      if (message.sender !== user.username) {
        console.log(message)
        setmessages((prevState) => {
          return [...prevState, message]
        })
      }
    })
    // return () => socket.off('receive-message')
  })

  useEffect(() => {
    socket.on('receive-edit-message', (editMsg, msgIndex) => {
      console.log(messages[msgIndex])
      if (messages[msgIndex].sender !== user.username) {
        console.log('edited', editMsg)
        setmessages((prevState) => {
          prevState[msgIndex].msg = editMsg
          return [...prevState]
        })
      }
    })
    // return () => socket.off('receive-edit-message')
  })
  useEffect(() => {
    socket.on('receive-deleted-message', (dmObj, dmIndex) => {
      console.log(dmObj, 'dmObject')
      console.log(dmIndex, 'dmIndex')
      console.log(messages[dmIndex], 'testing')
      console.log(messages, 'testing321')
      // if (messages[dmIndex].sender !== user.username) {
      //   setmessages((prevState) => {
      //     const clonePrevState = prevState.filter(
      //       (msgObj) => msgObj.id !== dmObj.id
      //     )
      //     return [...clonePrevState]
      //   })
      // }
    })
    // return () => socket.off('receive-edit-message')
  })
  useEffect(() => {
    if (props.dm.participants && user.username && props.users.length > 0) {
      const loggedInUserFriendString = props.dm.participants.filter(
        (userFriend) => userFriend !== user.username
      )
      const loggedInUserFriend = props.users.filter(
        (friendObject) => friendObject.username === loggedInUserFriendString[0]
      )
      setFriend(loggedInUserFriend[0])
    }
  }, [props.users])

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
