import React, { useEffect, useState } from 'react'
import classes from './ChannelMain.module.scss'
import { io } from 'socket.io-client'
import { ChannelMainNav } from './ChannelMainComponents/ChannelMainNav/ChannelMainNav'
import { ChannelMainMessages } from './ChannelMainComponents/ChannelMainMessages/ChannelMainMessages'
import { ChannelMainForm } from './ChannelMainComponents/ChannelMainForm/ChannelMainForm'
import { useSelector, useDispatch } from 'react-redux'
import { ChannelType, MessageType, Server } from '../../Redux/Action-creators/ServersActions'
import { RootState } from '../../Redux/Reducers'
import { User } from '../../Redux/Action-creators/UserActions'

type PropsTypes = {
  server: Server,
  setserver: Function,
  channel: ChannelType,
  serverIndex: number,
  channelIndex: number
}

type receiveMessage = {
  channelId: string,
  message: MessageType
}
type receiveEditedMessage = {
  channelId: string,
  editMsg: string,
  msgIndex: number
}
type ReceiveDeletedMessage = {
  channelId: string,
  messageObj: MessageType
}
export const ChannelMain = (props:PropsTypes) => {
  const socket = io('ws://localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
  })
  const dispatch = useDispatch()
  const user = useSelector((state:RootState) => state.user) as User
  
  const [messages, setMessages] = useState<MessageType[]>([])
  const [receiveMessage, setReceiveMessage] = useState<receiveMessage | null>(null)
  const [receiveEditedMessage, setReceiveEditedMessage] = useState<receiveEditedMessage | null>(null)
  const [receiveDeletedMessage, setReceiveDeletedMessage] = useState<ReceiveDeletedMessage | null>(null)

  const receiveMessageHandler = () => {
    if (receiveMessage) {
      if (receiveMessage.channelId === props.channel._id) {
        setMessages((prevState) => {
          if (receiveMessage.message.sender !== user.username) {
            return [...prevState, receiveMessage.message]
          } else {
            return [...prevState]
          }
        })
      } else {
        const serverClone = { ...props.server }
        const found = props.server.channels.findIndex(
          (currChannel) => currChannel._id === receiveMessage.channelId
        )
        serverClone.channels[found].messages = [
          ...serverClone.channels[found].messages,
          receiveMessage.message,
        ]
        props.setserver(serverClone)
      }
    }
  }
  const receiveEditedMessageHandler = () => {
    if (receiveEditedMessage) {
      if (receiveEditedMessage.channelId === props.channel._id) {
        setMessages((prevState) => {
          if (
            prevState[receiveEditedMessage.msgIndex].sender !== user.username
          ) {
            prevState[receiveEditedMessage.msgIndex].msg =
              receiveEditedMessage.editMsg
            return [...prevState]
          } else {
            return [...prevState]
          }
        })
      } else {
        const msgsClone = [...messages]
        msgsClone[receiveEditedMessage.msgIndex].msg =
          receiveEditedMessage.editMsg
        const serverClone = { ...props.server }
        serverClone.channels[props.channelIndex].messages = msgsClone
        props.setserver(serverClone)
      }
    }
  }
  const receiveDeletedMessageHandler = () => {
    if (receiveEditedMessage) {
      if (receiveDeletedMessage && receiveDeletedMessage.channelId === props.channel._id) {
        setMessages((prevState) => {
          if (receiveDeletedMessage.messageObj.sender !== user.username) {
            const clonePrevState = prevState.filter(
              (msgObj) => msgObj.id !== receiveDeletedMessage.messageObj.id
            )
            return [...clonePrevState]
          } else {
            return [...prevState]
          }
        })
      } else {
        if (receiveDeletedMessage) {
          const filteredMessages = messages.filter(
            (msgObj) => msgObj.id !== receiveDeletedMessage.messageObj.id
          )
          const serverClone = { ...props.server }
        serverClone.channels[props.channelIndex].messages = filteredMessages
        props.setserver(serverClone)
        }
        
        
      }
    }
  }
  useEffect(() => {
    socket.emit('server room', props.server._id)
    setMessages(props.channel.messages)

    socket.on('receive-channel-message', (channelId, message) => {
      setReceiveMessage({ channelId, message })
    })
    socket.on(
      'receive-edited-channel-message',
      (channelId, editMsg, msgIndex) => {
        setReceiveEditedMessage({ channelId, editMsg, msgIndex })
      }
    )
    socket.on(
      'receive-deleted-channel-message',
      (channelId, messageObj, msgIndex) => {
        setReceiveDeletedMessage({ channelId, messageObj })
      }
    )
    return () => {
      socket.disconnect()
    }
  }, [])
  useEffect(() => {
    receiveMessageHandler()
  }, [receiveMessage])
  useEffect(() => {
    receiveEditedMessageHandler()
  }, [receiveEditedMessage])
  useEffect(() => {
    receiveDeletedMessageHandler()
  }, [receiveDeletedMessage])
  return (
    <div className={classes.DMMain}>
      <ChannelMainNav channel={props.channel} />
      <div className={classes.DMMainHorizontalLine}></div>
      <ChannelMainMessages
        messages={messages}
        setMessages={setMessages}
        channel={props.channel}
        server={props.server}
        channelIndex={props.channelIndex}
      />
      <ChannelMainForm
        setMessages={setMessages}
        server={props.server}
        channel={props.channel}
        channelIndex={props.channelIndex}
      />
    </div>
  )
}
