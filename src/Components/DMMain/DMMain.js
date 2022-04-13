import React, { useEffect, useState } from 'react'
import classes from './DMMain.module.scss'
import { io } from 'socket.io-client'
import { DMMMainForm } from './DMMainComponents/DMMainForm/DMMMainForm'
import { DMMainMessages } from './DMMainComponents/DMMainMessages/DMMainMessages'
import { DMMainNav } from './DMMainComponents/DMMainNav/DMMainNav'
import { useSelector, useDispatch } from 'react-redux'
import { UpdateUserAction } from '../../Redux/Action-creators/UserActions'
import { postRequest } from '../../utils/Api'
export const DMMain = (props) => {
  const reduxState = useSelector((state) => state)
  const { user, users } = reduxState
  const dispatch = useDispatch()
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
    pingInterval: 1000 * 60 * 5,
    pingTimeout: 1000 * 60 * 3,
  })
  const [friend, setFriend] = useState({})
  const [messages, setmessages] = useState([])
  const [chatBoxContainer, setchatBoxContainer] = useState({})
  useEffect(() => {
    console.log('im coming from dmmain')
    socket.emit('dm room', `${user._id}`)
    setmessages([...user.DMS[props.dmIndex].messages])
    return () => {
      socket.disconnect()
      console.log('does this work from dmmain?')
    }
  }, [])

  useEffect(() => {
    socket.on('receive-message', (dmId, message) => {
      console.log(user, 'layer1 dm')
      if (dmId === props.dm._id) {
        setmessages((prevState) => {
          if (message.sender !== user.username) {
            const userCopy = { ...user }
            const found = userCopy.DMS.findIndex(
              (thisDm) => thisDm._id === dmId
            )
            userCopy.DMS[found].messages = [...prevState, message]

            postRequest(
              `http://localhost:8000/discord/discord/updateUser/${userCopy._id}`,
              userCopy
            )
            dispatch(UpdateUserAction(userCopy))
            return [...prevState, message]
          } else {
            return [...prevState]
          }
        })
      } else {
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
    })
    // return () => socket.off('receive-message')
  })

  useEffect(() => {
    socket.on('receive-edit-message', (dmId, editMsg, msgIndex) => {
      if (dmId === props.dm._id) {
        setmessages((prevState) => {
          console.log(prevState[msgIndex], msgIndex)
          if (prevState[msgIndex].sender !== user.username) {
            prevState[msgIndex].msg = editMsg

            const userCopy = { ...user }
            const found = userCopy.DMS.findIndex(
              (thisDm) => thisDm._id === dmId
            )
            userCopy.DMS[found].messages = [...prevState]

            postRequest(
              `http://localhost:8000/discord/discord/updateUser/${userCopy._id}`,
              userCopy
            )
            dispatch(UpdateUserAction(userCopy))
            return [...prevState]
          } else {
            return [...prevState]
          }
        })
      }
      // }
    })
    // return () => socket.off('receive-edit-message')
  })
  useEffect(() => {
    socket.on('receive-deleted-message', (dmId, msgObj, msgIndex) => {
      if (dmId === props.dm._id) {
        setmessages((prevState) => {
          if (prevState[msgIndex].sender !== user.username) {
            const clonePrevState = prevState.filter(
              (currMsgObj) => currMsgObj.id !== msgObj.id
            )
            const userCopy = { ...user }
            const found = userCopy.DMS.findIndex(
              (thisDm) => thisDm._id === dmId
            )
            userCopy.DMS[found].messages = [...clonePrevState]

            postRequest(
              `http://localhost:8000/discord/discord/updateUser/${userCopy._id}`,
              userCopy
            )
            dispatch(UpdateUserAction(userCopy))
            return [...clonePrevState]
          } else {
            return [...prevState]
          }
        })
      }
    })
    // return () => socket.off('receive-edit-message')
  })
  useEffect(() => {
    console.log(props.dm)
    console.log(props.users)
    const loggedInUserFriendString = props.dm.participants.filter(
      (userFriend) => userFriend !== user.username
    )
    const loggedInUserFriend = users.filter(
      (friendObject) => friendObject.username === loggedInUserFriendString[0]
    )
    setFriend(loggedInUserFriend[0])
    console.log(loggedInUserFriend)
    socket.emit('dm room', `${loggedInUserFriend[0]._id}`)
    return () => {
      socket.disconnect()
      console.log('does this work from dmmain?')
    }
  }, [])

  return (
    <div className={classes.DMMain}>
      <DMMainNav friend={friend} />
      <div className={classes.DMMainHorizontalLine}></div>

      <DMMainMessages
        friend={friend}
        messages={messages}
        setmessages={setmessages}
        user={user}
        setchatBoxContainer={setchatBoxContainer}
        dm={props.dm}
        dmIndex={props.dmIndex}
      />

      <DMMMainForm
        friend={friend}
        dm={props.dm}
        user={user}
        dmIndex={props.dmIndex}
        setmessages={setmessages}
        chatBoxContainer={chatBoxContainer}
      />
    </div>
  )
}
