import React, { useState, useEffect } from 'react'
import classes from './DMMainMessages.module.scss'
import catto from '../../../../utils/imgs/catto.png'
import { TiDeleteOutline } from 'react-icons/ti'
import { FiEdit2 } from 'react-icons/fi'
import DMMainEditForm from '../DMMainEditForm'
import { io } from 'socket.io-client'
export const DMMainMessages = (props) => {
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
    pingInterval: 1000 * 60 * 5,
    pingTimeout: 1000 * 60 * 3,
  })
  const chatBoxContainer = React.createRef()
  const [editMsgBool, seteditMsgBool] = useState({})

  useEffect(() => {
    props.setchatBoxContainer(chatBoxContainer.current)
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

  const delMsgHandler = (dmObj, dmObjIndex) => {
    const foundFriendDMIndex = props.friend.DMS.findIndex(
      (DM) => DM._id === props.dm._id
    )

    let loggedInUser = { ...props.user }

    const filteredMsgArr = loggedInUser.DMS[props.dmIndex].messages.filter(
      (msgObj) => msgObj.id !== dmObj.id
    )
    loggedInUser.DMS[props.dmIndex].messages = filteredMsgArr
    const friendClone = { ...props.friend }
    friendClone.DMS[foundFriendDMIndex].messages = filteredMsgArr

    fetch(
      `http://localhost:8000/discord/discord/updateUser/${props.friend._id}`,
      {
        method: 'POST',
        body: JSON.stringify(friendClone),
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
        }
      })

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
            const clonePrevState = prevState.filter(
              (msgObj) => msgObj.id !== dmObj.id
            )
            return [...clonePrevState]
          })
        }
      })
    socket.emit('delete-message', dmObj, dmObjIndex, props.dm._id)
  }
  return (
    <div className={classes.DMMainChatBoxContainer} ref={chatBoxContainer}>
      <div className={classes.DMMainChatBoxContainerFriendAvatar}>
        <img src={catto} alt='' />
      </div>
      <div className={classes.DMMainChatBoxContainerFriendName}>
        {' '}
        {props.friend.username ? props.friend.username : null}{' '}
      </div>
      <div className={classes.DMMainChatBoxContainerText}>
        This is the beginning of your direct message history with{' '}
        <strong>@{props.friend.username ? props.friend.username : null}</strong>
      </div>
      <div className={classes.DMMainChatBoxContainerHorizontalLine}></div>
      {props.messages.length > 0
        ? props.messages.map((dmObj, dmObjIndex) => (
            <div
              className={classes.DMMainChatBoxContainerMsgContainer}
              key={dmObj._id}
            >
              <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
                <img src={catto} alt='' />
                <div className={classes.DMMainChatBoxNameContainer}>
                  {dmObj.sender}
                  <span className={classes.DMMsgDate}> {dmObj.sentDate} </span>

                  {editMsgBool[dmObjIndex] ? (
                    <DMMainEditForm
                      dmObjIndex={dmObjIndex}
                      dmObj={dmObj}
                      editMsgBool={editMsgBool}
                      seteditMsgBool={seteditMsgBool}
                      friend={props.friend}
                      user={props.user}
                      setmessages={props.setmessages}
                      dm={props.dm}
                      dmIndex={props.dmIndex}
                    />
                  ) : (
                    <div
                      className={classes.DMMainChatBoxContainerMsgContainerMsg}
                    >
                      {dmObj.msg}
                    </div>
                  )}
                </div>
              </div>
              {dmObj.sender === props.user.username &&
              !editMsgBool[dmObjIndex] ? (
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
                    onClick={() => editMsgHandler(dmObjIndex)}
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
                    onClick={() => delMsgHandler(dmObj, dmObjIndex)}
                  />
                </div>
              ) : null}
            </div>
          ))
        : null}
    </div>
  )
}
