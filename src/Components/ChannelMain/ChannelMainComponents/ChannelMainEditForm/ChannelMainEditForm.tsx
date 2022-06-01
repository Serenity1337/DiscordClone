import React, { useState, useEffect } from 'react'
import classes from './ChannelMainEditForm.module.scss'
import { io } from 'socket.io-client'
import { postRequest } from '../../../../utils/Api'
import { ChannelType, MessageType, Server } from '../../../../Redux/Action-creators/ServersActions'

  type PropsTypes = {
    channelObjIndex: number,
    channelObj: MessageType,
    editMsgBool: EditMsgBoolType,
    seteditMsgBool: Function,
    messages: MessageType[],
    setMessages: Function,
    channel: ChannelType,
    channelIndex: number,
    server: Server
  }

  type EditMsgBoolType = {
    [key: string]: boolean
  }

export const ChannelMainEditForm = (props:PropsTypes) => {
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
  })

  const [editMsg, seteditMsg] = useState('')
  useEffect(() => {
    seteditMsg(props.channelObj.msg)
  }, [])

  const editFormHandler = (event: React.SyntheticEvent) => {
    event.preventDefault()

    let channelClone = { ...props.channel }
    const foundMsgIndex = props.messages.findIndex(
      (msg) => msg.msg === props.channelObj.msg
    )
    const messagesClone = [...props.messages]
    messagesClone[foundMsgIndex].msg = editMsg
    channelClone.messages = messagesClone
    let serverClone = { ...props.server }
    serverClone.channels[props.channelIndex] = channelClone
    
      const formElement = event.target as HTMLFormElement
      const inputElement = formElement[0] as HTMLInputElement

      inputElement.value = ''
    const serverResponse = postRequest(
      `http://localhost:8000/discord/discord/updateServer/${props.server._id}`,
      serverClone
    )
    serverResponse.then((res:string) => {
      if (res) {
        props.setMessages((prevState:MessageType[]) => {
          prevState[foundMsgIndex].msg = editMsg
          return [...prevState]
        })
      }
    })

    props.seteditMsgBool((prevState: EditMsgBoolType | null) => {
      
      const prevStateClone = {...prevState,[`${props.channelObjIndex}`]: false}
      return prevStateClone
    })

    socket.emit(
      'edit-channel-message',
      props.server._id,
      props.channel._id,
      editMsg,
      foundMsgIndex
    )
  }
  const cancelEditForm = () => {
    

    props.seteditMsgBool((prevState: EditMsgBoolType | null) => {
      
      const prevStateClone = {...prevState,[`${props.channelObjIndex}`]: false}
      return prevStateClone
    })
  }
  const editMsgInputHandler = (event: React.SyntheticEvent) => {
    const element = event.target as HTMLInputElement
    seteditMsg(element.value)
  }
  return (
    <form className={classes.editMsgForm} onSubmit={editFormHandler}>
      <input
        type='text'
        className={classes.editMsgInput}
        onChange={editMsgInputHandler}
        value={editMsg}
      />

      <p className={classes.saveOrCancelBtns}>
        escape to{' '}
        <span className={classes.cancelEditFormBtn} onClick={cancelEditForm}>
          cancel
        </span>
        enter to
        <input type='submit' value='save' className={classes.saveEditFormBtn} />
      </p>
    </form>
  )
}
