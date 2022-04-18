import React, { useState, useEffect } from 'react'
import classes from './ChannelMainMessages.module.scss'
import catto from '../../../../utils/imgs/catto.png'
import { TiDeleteOutline } from 'react-icons/ti'
import { FiEdit2 } from 'react-icons/fi'
import { io } from 'socket.io-client'
import { ChannelMainEditForm } from '../ChannelMainEditForm/ChannelMainEditForm'
import { useSelector } from 'react-redux'
import { postRequest } from '../../../../utils/Api'
export const ChannelMainMessages = (props) => {
  const user = useSelector((state) => state.user)
  const socket = io('ws://localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
    pingInterval: 1000 * 60 * 5,
    pingTimeout: 1000 * 60 * 3,
  })

  const [editMsgBool, seteditMsgBool] = useState({})

  useEffect(() => {
    return () => {
      window.removeEventListener('keydown', cancelEditForm)
    }
  }, [])

  const editMsgHandler = (index) => {
    seteditMsgBool({ ...editMsgBool, [index]: true })
    window.addEventListener('keydown', (event) => cancelEditForm(event, index))
  }

  const cancelEditForm = (event, index) => {
    if (event.key === 'Escape') {
      seteditMsgBool({ ...editMsgBool, [index]: false })
    }
  }

  const delMsgHandler = (channelObj, channelObjIndex) => {
    const filteredMsgArr = props.messages.filter(
      (msgObj) => msgObj.id !== channelObj.id
    )

    let channelClone = { ...props.channel }
    channelClone.messages = filteredMsgArr
    let serverClone = { ...props.server }
    serverClone.channels[props.channelIndex] = channelClone

    const serverResponse = postRequest(
      `http://localhost:8000/discord/discord/updateServer/${props.server._id}`,
      serverClone
    )

    if (serverResponse) {
      props.setMessages((prevState) => {
        const clonePrevState = prevState.filter(
          (msgObj) => msgObj.id !== channelObj.id
        )
        return [...clonePrevState]
      })
    }

    socket.emit(
      'delete-channel-message',
      props.server._id,
      props.channel._id,
      channelObj,
      channelObjIndex
    )
  }
  return (
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
      {props.messages
        ? props.messages.map((channelObj, channelObjIndex) => (
            <div
              className={classes.DMMainChatBoxContainerMsgContainer}
              key={channelObjIndex}
            >
              <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
                <img src={catto} alt='' />
                <div className={classes.DMMainChatBoxNameContainer}>
                  {channelObj.sender}
                  <span className={classes.DMMsgDate}>
                    {' '}
                    {channelObj.sentDate}{' '}
                  </span>
                  {editMsgBool[channelObjIndex] ? (
                    <ChannelMainEditForm
                      channelObjIndex={channelObjIndex}
                      channelObj={channelObj}
                      editMsgBool={editMsgBool}
                      seteditMsgBool={seteditMsgBool}
                      messages={props.messages}
                      setMessages={props.setMessages}
                      channel={props.channel}
                      channelIndex={props.channelIndex}
                      server={props.server}
                    />
                  ) : (
                    <div
                      className={classes.DMMainChatBoxContainerMsgContainerMsg}
                    >
                      {channelObj.msg}
                    </div>
                  )}
                </div>
              </div>
              {channelObj.sender === user.username &&
              !editMsgBool[channelObjIndex] ? (
                <div className={classes.msgIcons}>
                  <FiEdit2
                    fill='#b9bbbe'
                    stroke='#b9bbbe'
                    style={{
                      width: '20px',
                      height: '20px',
                      margin: '5px 10px 0px 10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => editMsgHandler(channelObjIndex)}
                  />{' '}
                  <TiDeleteOutline
                    fill='#b9bbbe'
                    stroke='#b9bbbe'
                    style={{
                      width: '20px',
                      height: '20px',
                      margin: '5px 10px 0px 10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => delMsgHandler(channelObj, channelObjIndex)}
                  />
                </div>
              ) : null}
            </div>
          ))
        : null}
    </div>
  )
}
