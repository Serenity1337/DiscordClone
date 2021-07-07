import React, { useEffect, useState } from 'react'
import classes from './ChannelMain.module.scss'
import { FiSmile } from 'react-icons/fi'
import {
  AiFillPushpin,
  AiOutlineGift,
  AiOutlineGif,
  AiFillBell,
} from 'react-icons/ai'
import { TiUserAdd } from 'react-icons/ti'
import { MdInbox } from 'react-icons/md'
import { BiHelpCircle } from 'react-icons/bi'
import { BsFillPeopleFill } from 'react-icons/bs'
import catto from '../../utils/imgs/catto.png'
import dateFormat from 'dateformat'
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client'

export const ChannelMain = (props) => {
  const socket = io('http://localhost:8080')
  let now = new Date()
  const [friend, setFriend] = useState({})
  const [msg, setMsg] = useState('')
  const [msgs, setMsgs] = useState([])
  const [channel, setChannel] = useState({})

  useEffect(() => {
    socket.emit('channel room', `${props.channel._id}`)
  }, [])

  socket.on('receive-channel-message', (message) => {
    if (channel.messages) {
      let channelCopy = { ...channel }
      let channelCopyMsgArr = [...channelCopy.messages, message]
      channelCopy.messages = channelCopyMsgArr
      setChannel(channelCopy)
    }
  })

  useEffect(() => {
    setChannel(props.channel)
  }, [props.channel])

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

    let loggedInUser = props.user
    let channelClone = { ...channel }
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
          props.servers[props.serverIndex].channels[props.channelIndex] =
            channelClone
          setChannel(channelClone)
        }
      })

    socket.emit('send-channel-message', msgObject, channel._id)
  }
  return (
    <div className={classes.DMMain}>
      <div className={classes.DMMainNav}>
        <div className={classes.DMMainNavUser}>
          <div className={classes.DMMainNavUserContainer}>
            <div className={classes.DMMainNavUserContainerAt}>#</div>
            <div className={classes.DMMainNavUserContainerUsername}>
              {props.channel ? props.channel.channelName : null}
            </div>
            {/* <span className={classes.DMMainNavUserContainerUsernameStatus}>
              o
            </span> */}
          </div>
        </div>
        <div className={classes.DMMainNavIconsContainer}>
          <AiFillBell
            fill='#b9bbbe'
            stroke='#b9bbbe'
            style={{
              width: '20px',
              height: '20px',
              margin: '5px 10px 0px 10px',
            }}
          />
          <AiFillPushpin
            fill='#b9bbbe'
            stroke='#b9bbbe'
            style={{
              width: '20px',
              height: '20px',
              margin: '5px 10px 0px 10px',
            }}
          />
          <BsFillPeopleFill
            fill='#b9bbbe'
            stroke='#b9bbbe'
            style={{
              width: '20px',
              height: '20px',
              margin: '5px 10px 0px 10px',
            }}
          />
          <TiUserAdd
            fill='#b9bbbe'
            stroke='#b9bbbe'
            style={{
              width: '20px',
              height: '20px',
              margin: '5px 10px 0px 10px',
              cursor: 'pointer',
            }}
          />
          <input
            type='text'
            placeholder='Search'
            className={classes.DMMainNavIconsContainerSearch}
          />
          <MdInbox
            fill='#b9bbbe'
            stroke='#b9bbbe'
            style={{
              width: '20px',
              height: '20px',
              margin: '5px 10px 0px 10px',
            }}
          />
          <BiHelpCircle
            fill='#b9bbbe'
            stroke='#b9bbbe'
            style={{
              width: '20px',
              height: '20px',
              margin: '5px 10px 0px 10px',
            }}
          />
        </div>
      </div>
      <div className={classes.DMMainHorizontalLine}></div>
      <div className={classes.DMMainChatBoxContainer}>
        <div className={classes.DMMainChatBoxContainerFriendAvatar}>#</div>
        <div className={classes.DMMainChatBoxContainerFriendName}>
          {' '}
          Welcome to #{props.channel ? props.channel.channelName : null}
        </div>
        <div className={classes.DMMainChatBoxContainerText}>
          This is the start of the #
          <strong>
            {props.channel ? props.channel.channelName : null} channel
          </strong>
        </div>
        <div className={classes.DMMainChatBoxContainerHorizontalLine}></div>
        {channel.messages
          ? channel.messages.map((channelObj, channelObjIndex) => (
              <div className={classes.DMMainChatBoxContainerMsgContainer}>
                <div
                  className={classes.DMMainChatBoxContainerMsgContainerAvatar}
                >
                  <img src={catto} alt='' />
                  <div className={classes.DMMainChatBoxNameContainer}>
                    {channelObj.sender}
                    <span className={classes.DMMsgDate}>
                      {' '}
                      {channelObj.sentDate}{' '}
                    </span>
                    <div
                      className={classes.DMMainChatBoxContainerMsgContainerMsg}
                    >
                      {channelObj.msg}
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
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
            placeholder={`Message #${channel.channelName}`}
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
    </div>
  )
}
