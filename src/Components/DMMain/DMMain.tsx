import React, { useEffect, useState } from 'react'
import classes from './DMMain.module.scss'
import { io } from 'socket.io-client'
import { DMMMainForm } from './DMMainComponents/DMMainForm/DMMMainForm'
import { DMMainMessages } from './DMMainComponents/DMMainMessages/DMMainMessages'
import { DMMainNav } from './DMMainComponents/DMMainNav/DMMainNav'
import { useSelector, useDispatch } from 'react-redux'
import { UpdateUserAction, User, Users } from '../../Redux/Action-creators/UserActions'
import { postRequest } from '../../utils/Api'
import { RootState } from '../../Redux/Reducers'

  type PropsTypes = {
    dm: any,
    dmIndex: number
  }

  type MsgObjTypes = {sentDate: string, id: string, sender: string,msg: string}

export const DMMain = (props:PropsTypes) => {
  const reduxState = useSelector((state:RootState) => state)
  const user = reduxState.user as User
  const users = reduxState.users as Users
  const dispatch = useDispatch()
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
  })
  const [friend, setFriend] = useState<User | null>(null)
  const [messages, setmessages] = useState<MsgObjTypes[] | null>(null)
  const [chatBoxContainer, setchatBoxContainer] = useState(null)

  const receiveDMMessageHandler = (dmId:string, message:MsgObjTypes) => {
    
    if (dmId === props.dm._id ) {
      setmessages((prevState:MsgObjTypes[] | null) => {
        const userCopy = { ...user }
        if (message.sender !== user.username && prevState !== null && userCopy.DMS) {
          
          
          const found = userCopy.DMS.findIndex((thisDm) => thisDm._id === dmId)
          userCopy.DMS[found].messages = [...prevState, message]

          postRequest(
            `http://localhost:8000/discord/discord/updateUser/${userCopy._id}`,
            userCopy
          )
          dispatch(UpdateUserAction(userCopy))
          return [...prevState, message]
        } else {
           return prevState
          
        }
      })
    } else {
      const userClone = { ...user }
      if (message.sender !== user.username && user.DMS && userClone.DMS) {
        
        const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
        userClone.DMS[dmIndex].messages = [
          ...userClone.DMS[dmIndex].messages,
          message,
        ]
        dispatch(UpdateUserAction(userClone))
      }
    }
  }

  const receiveEditedDMMessage = (dmId:string, editMsg:string, msgIndex:number) => {
    
    if (dmId === props.dm._id) {
      setmessages((prevState) => {
        const userCopy = { ...user }
        if (prevState !== null && prevState[msgIndex].sender !== user.username && userCopy.DMS) {
          prevState[msgIndex].msg = editMsg

          
          const found = userCopy.DMS.findIndex((thisDm) => thisDm._id === dmId)
          userCopy.DMS[found].messages = [...prevState]

          postRequest(
            `http://localhost:8000/discord/discord/updateUser/${userCopy._id}`,
            userCopy
          )
          dispatch(UpdateUserAction(userCopy))
          return [...prevState]
        } else {
          return prevState
        }
      })
    }
  }

  const receiveDMDeletedMessageHandler = (dmId:string, msgObj:MsgObjTypes, msgIndex:number) => {
    if (dmId === props.dm._id) {
      setmessages((prevState) => {
        const userCopy = { ...user }
        if (prevState !== null && prevState[msgIndex].sender !== user.username && userCopy.DMS) {
          const clonePrevState = [...prevState]
          const filteredClonePrevState = clonePrevState.filter(
            (currMsgObj) => currMsgObj.id !== msgObj.id
          )
         
          const found = userCopy.DMS.findIndex((thisDm) => thisDm._id === dmId)
          userCopy.DMS[found].messages = [...filteredClonePrevState]

          postRequest(
            `http://localhost:8000/discord/discord/updateUser/${userCopy._id}`,
            userCopy
          )
          dispatch(UpdateUserAction(userCopy))
          return [...filteredClonePrevState]
        } else {
          return prevState
        }
      })
    }
  }
  useEffect(() => {
    const loggedInUserFriendString = props.dm.participants.filter(
      (userFriend: string) => userFriend !== user.username
    )
    const loggedInUserFriend = users.filter(
      (friendObject) => friendObject.username === loggedInUserFriendString[0]
    )
    setFriend(loggedInUserFriend[0])
    socket.emit('dm room', `${loggedInUserFriend[0]._id}`)
    return () => {
      socket.disconnect()
    }
  }, [])
  useEffect(() => {
    socket.emit('dm room', `${user._id}`)
    if (user.DMS) {
      setmessages([...user.DMS[props.dmIndex].messages])
    }
    

    socket.on('receive-message', (dmId, message) => {
      receiveDMMessageHandler(dmId, message)
    })

    socket.on('receive-edit-message', (dmId, editMsg, msgIndex) => {
      receiveEditedDMMessage(dmId, editMsg, msgIndex)
    })

    socket.on('receive-deleted-message', (dmId, msgObj, msgIndex) => {
      receiveDMDeletedMessageHandler(dmId, msgObj, msgIndex)
    })

    return () => {
      socket.disconnect()
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
