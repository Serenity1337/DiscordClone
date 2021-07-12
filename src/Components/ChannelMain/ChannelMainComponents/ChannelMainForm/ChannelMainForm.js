import React, { useState, useEffect } from 'react'
import classes from './ChannelMainForm.module.scss'
import { FiSmile } from 'react-icons/fi'
import { AiOutlineGift, AiOutlineGif } from 'react-icons/ai'
import dateFormat from 'dateformat'
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client'
export const ChannelMainForm = (props) => {
  const [msg, setMsg] = useState('')

  const socket = io('http://localhost:8080')
  let now = new Date()

  const msgInputHandler = (event) => {
    setMsg(event.target.value)
  }

  const msgFormHandler = (event) => {
    event.preventDefault()

    const msgId = uuidv4()
    const msgObject = {}
    let currDate = dateFormat(now, 'mm/dd/yyyy hh:MM TT')
    msgObject.sentDate = currDate
    msgObject.id = msgId
    msgObject.sender = props.user.username
    msgObject.msg = msg

    let channelClone = { ...props.channel }
    channelClone.messages = [...channelClone.messages, msgObject]
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
            return [...prevState, msgObject]
          })
        }
      })

    socket.emit(
      'send-channel-message',
      props.server._id,
      props.channel._id,
      msgObject
    )
  }

  return (
    <div className={classes.DMMainSendMsgContainer}>
      <form
        className={classes.MsgContainerUploadBtn}
        onSubmit={msgFormHandler}
        autocomplete='off'
      >
        <div className={classes.MsgUploadBtnContainer}>
          <div className={classes.MsgUploadBtn}>+</div>
        </div>
        {/* <input type='file' name='uploadImg' id='uploadImg' /> */}
        <input
          type='text'
          className={classes.MsgContainerMsgInput}
          name='msgInput'
          id='msgInput'
          placeholder={`Message #${props.channel.channelName}`}
          onChange={msgInputHandler}
        />
        <button
          type='submit'
          style={{
            width: '0',
            height: '0',
            margin: '0',
            padding: '0',
            border: '0',
          }}
        ></button>
      </form>

      <div className={classes.MsgContainerExtras}>
        <AiOutlineGift
          fill='#dcddde'
          style={{
            width: '24px',
            height: '20px',
            cursor: 'pointer',
          }}
        />
        <AiOutlineGif
          fill='#40444b'
          style={{
            width: '24px',
            height: '20px',
            backgroundColor: '#dcddde',
            margin: '0px 15px',
            cursor: 'pointer',
          }}
        />
        <FiSmile
          fill='#dcddde'
          style={{
            width: '24px',
            height: '24px',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  )
}
