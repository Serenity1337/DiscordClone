import React, { useEffect, useState } from 'react'
import classes from './ChannelMain.module.scss'
import { io } from 'socket.io-client'
import { ChannelMainNav } from './ChannelMainComponents/ChannelMainNav/ChannelMainNav'
import { ChannelMainMessages } from './ChannelMainComponents/ChannelMainMessages/ChannelMainMessages'
import { ChannelMainForm } from './ChannelMainComponents/ChannelMainForm/ChannelMainForm'

export const ChannelMain = (props) => {
  const socket = io('ws://localhost:8080', {
    transports: ['websocket'],
    upgrade: false,
  })
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages(props.channel.messages)
    socket.emit('server room', props.server._id)
  }, [])

  socket.on('receive-channel-message', (channelId, message) => {
    console.log('asd')
    if (channelId === props.channel._id) {
      setMessages((prevState) => {
        if (props.user.username !== message.sender) {
          return [...prevState, message]
        } else {
          return [...prevState]
        }
      })
    } else {
      if (props.user.username !== message.sender) {
        const serversClone = [...props.servers]
        const serverClone = { ...props.server }
        const channelIndex = serverClone.channels.findIndex(
          (chanl) => chanl._id === channelId
        )
        serverClone.channels[channelIndex].messages = [
          ...serverClone.channels[channelIndex].messages,
          message,
        ]

        serversClone[props.serverIndex] = serverClone
        console.log(serversClone)
        props.setservers(serversClone)
      }
    }
  })

  useEffect(() => {
    socket.on(
      'receive-edited-channel-message',
      (channelId, editMsg, msgIndex) => {
        setMessages((prevState) => {
          if (
            prevState[msgIndex].sender !== props.user.username &&
            channelId === props.channel._id
          ) {
            prevState[msgIndex].msg = editMsg
            return [...prevState]
          } else {
            return [...prevState]
          }
        })
        // }
      }
    )
    // return () => socket.off('receive-edit-message')
  })
  useEffect(() => {
    socket.on(
      'receive-deleted-channel-message',
      (channelId, channelObj, channelIndex) => {
        setMessages((prevState) => {
          if (channelId === props.channel._id) {
            const clonePrevState = prevState.filter(
              (msgObj) => msgObj.id !== channelObj.id
            )
            return [...clonePrevState]
          } else {
            return [...prevState]
          }
        })
      }
    )
    // return () => socket.off('receive-edit-message')
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
        user={props.user}
      />
      <ChannelMainForm
        user={props.user}
        setMessages={setMessages}
        server={props.server}
        channel={props.channel}
        channelIndex={props.channelIndex}
      />
    </div>
  )
}
