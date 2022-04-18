import React, { useState } from 'react'
import classes from './DMMainForm.module.scss'
import { FiSmile } from 'react-icons/fi'
import { AiOutlineGift, AiOutlineGif } from 'react-icons/ai'
import dateFormat from 'dateformat'
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client'

export const DMMMainForm = (props) => {
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
    pingInterval: 1000 * 60 * 5,
    pingTimeout: 1000 * 60 * 3,
  })
  let now = new Date()
  const [msg, setMsg] = useState('')

  const msgInputHandler = (event) => {
    setMsg(event.target.value)
  }

  const msgFormHandler = (event) => {
    event.preventDefault()
    const foundFriendDMIndex = props.friend.DMS.findIndex(
      (DM) => DM._id === props.dm._id
    )
    const msgId = uuidv4()
    const msgObject = {}
    let currDate = dateFormat(now, 'mm/dd/yyyy hh:MM TT')
    msgObject.sentDate = currDate
    msgObject.id = msgId
    msgObject.sender = props.user.username
    msgObject.msg = msg

    let loggedInUser = { ...props.user }

    loggedInUser.DMS[props.dmIndex].messages = [
      ...loggedInUser.DMS[props.dmIndex].messages,
      msgObject,
    ]

    props.friend.DMS[foundFriendDMIndex].messages = [
      ...props.friend.DMS[foundFriendDMIndex].messages,
      msgObject,
    ]
    let DMClone = { ...props.dm }
    DMClone.messages = [...DMClone.messages, msgObject]

    event.target[0].value = ''

    fetch(
      `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
      {
        method: 'POST',
        body: JSON.stringify(loggedInUser),
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
          props.setmessages((prevState) => {
            return [...prevState, msgObject]
          })
        }
      })

    props.chatBoxContainer.scrollTo(0, props.chatBoxContainer.scrollHeight + 42)

    socket.emit('send-message', props.friend._id, props.dm._id, msgObject)
  }

  return (
    <div className={classes.DMMainSendMsgContainer}>
      <form
        className={classes.MsgContainerUploadBtn}
        onSubmit={msgFormHandler}
        autoComplete='off'
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
          placeholder='Message @123'
          onChange={msgInputHandler}
          // ref={msgInput}
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
