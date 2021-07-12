import React, { useState, useEffect } from 'react'
import classes from './ChannelMainEditForm.module.scss'
import { io } from 'socket.io-client'
export const ChannelMainEditForm = (props) => {
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
    pingInterval: 1000 * 60 * 5,
    pingTimeout: 1000 * 60 * 3,
  })

  const [editMsg, seteditMsg] = useState('')
  useEffect(() => {
    seteditMsg(props.channelObj.msg)
  }, [])

  const editFormHandler = (event) => {
    event.preventDefault()

    let channelClone = { ...props.channel }
    const foundMsgIndex = props.messages.findIndex(
      (msg) => msg.msg === props.channelObj.msg
    )
    channelClone.messages[foundMsgIndex].msg = editMsg
    let serverClone = { ...props.server }
    serverClone.channels[props.channelIndex] = channelClone
    event.target[0].value = ''

    fetch(
      `http://localhost:8000/discord/discord/updateServer/${props.server._id}`,
      {
        method: 'POST',
        body: JSON.stringify(serverClone),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((header) => {
        return header.json()
      })
      .then((response) => {
        if (response) {
          props.setMessages((prevState) => {
            prevState[foundMsgIndex].msg = editMsg
            return [...prevState]
          })
        }
      })

    props.seteditMsgBool({
      ...props.editMsgBool,
      [props.channelObjIndex]: false,
    })

    socket.emit(
      'edit-channel-message',
      props.server._id,
      props.channel._id,
      editMsg,
      foundMsgIndex
    )
  }
  const cancelEditForm = (event) => {
    props.seteditMsgBool({
      ...props.editMsgBool,
      [props.channelObjIndex]: false,
    })
  }
  const editMsgInputHandler = (event) => {
    seteditMsg(event.target.value)
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
