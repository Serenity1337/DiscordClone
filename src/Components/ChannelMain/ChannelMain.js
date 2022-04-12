import React, { useEffect, useState } from 'react'
import classes from './ChannelMain.module.scss'
import { io } from 'socket.io-client'
import { ChannelMainNav } from './ChannelMainComponents/ChannelMainNav/ChannelMainNav'
import { ChannelMainMessages } from './ChannelMainComponents/ChannelMainMessages/ChannelMainMessages'
import { ChannelMainForm } from './ChannelMainComponents/ChannelMainForm/ChannelMainForm'
import { useSelector } from 'react-redux'
export const ChannelMain = (props) => {
  const reduxState = useSelector((state) => state)
  const { user, users } = reduxState
  const socket = io('ws://localhost:8080', {
    transports: ['websocket'],
    upgrade: false,
  })
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.emit('server room', props.server._id)
    setMessages(props.channel.messages)
    return () => {
      socket.disconnect()
    }
  }, [])
  useEffect(() => {
    socket.on('receive-channel-message', (channelId, message) => {
      if (channelId === props.channel._id) {
        setMessages((prevState) => {
          if (message.sender !== user.username) {
            console.log('coming from here?')
            console.log(user, message)
            return [...prevState, message]
          } else {
            return [...prevState]
          }
        })
      }
    })
  })
  useEffect(() => {
    socket.on(
      'receive-edited-channel-message',
      (channelId, editMsg, msgIndex) => {
        if (channelId === props.channel._id) {
          setMessages((prevState) => {
            if (prevState[msgIndex].sender !== user.username) {
              prevState[msgIndex].msg = editMsg
              return [...prevState]
            } else {
              return [...prevState]
            }
          })
        }
      }
    )
  })
  useEffect(() => {
    socket.on(
      'receive-deleted-channel-message',
      (channelId, messageObj, msgIndex) => {
        if (channelId === props.channel._id) {
          setMessages((prevState) => {
            if (channelId === props.channel._id) {
              const clonePrevState = prevState.filter(
                (msgObj) => msgObj.id !== messageObj.id
              )
              return [...clonePrevState]
            } else {
              return [...prevState]
            }
          })
        }
      }
    )
  })
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
