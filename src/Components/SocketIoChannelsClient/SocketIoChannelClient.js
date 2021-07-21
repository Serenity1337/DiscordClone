import React, { useEffect } from 'react'
import { io } from 'socket.io-client'

export const SocketIoChannelClient = (props) => {
  const socket = io('http://localhost:8080')
  useEffect(() => {
    props.servers.map((server) => {
      socket.emit('server room', server._id)
    })
  }, [])

  socket.on('receive-channel-message', (channelId, message, serverId) => {
    if (props.user.username !== message.sender) {
      const serversClone = [...props.servers]
      const serverClone = serversClone.filter((srv) => srv._id === serverId)
      const channelIndex = serverClone[0].channels.findIndex(
        (chanl) => chanl._id === channelId
      )
      serverClone[0].channels[channelIndex].messages = [
        ...serverClone[0].channels[channelIndex].messages,
        message,
      ]

      serversClone[props.serverIndex] = serverClone[0]
      props.setservers(serversClone)
    }
  })

  useEffect(() => {
    socket.on(
      'receive-edited-channel-message',
      (channelId, editMsg, msgIndex, serverId) => {
        const serversClone = [...props.servers]
        const serverClone = serversClone.filter((srv) => srv._id === serverId)
        const channelIndex = serverClone[0].channels.findIndex(
          (chanl) => chanl._id === channelId
        )
        serverClone[0].channels[channelIndex].messages[msgIndex].msg = editMsg
        if (
          props.user.username !==
          serverClone[0].channels[channelIndex].messages[msgIndex].sender
        ) {
          serversClone[props.serverIndex] = serverClone[0]
          props.setservers(serversClone)
        }
      }
      // }
    )
    // return () => socket.off('receive-edit-message')
  })
  useEffect(() => {
    socket.on(
      'receive-deleted-channel-message',
      (channelId, messageObj, msgIndex, serverId) => {
        if (props.user.username !== messageObj.sender) {
          const serversClone = [...props.servers]
          const serverClone = serversClone.filter((srv) => srv._id === serverId)
          const channelIndex = serverClone[0].channels.findIndex(
            (chanl) => chanl._id === channelId
          )
          const filteredMsgArr = serverClone[0].channels[
            channelIndex
          ].messages.filter((msgObj) => msgObj.id !== messageObj.id)
          serverClone[0].channels[channelIndex].messages = filteredMsgArr
          serversClone[props.serverIndex] = serverClone[0]
          props.setservers(serversClone)
        }
      }
    )
    // return () => socket.off('receive-edit-message')
  })

  return <div></div>
}
