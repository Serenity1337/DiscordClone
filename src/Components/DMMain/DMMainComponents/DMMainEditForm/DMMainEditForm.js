import React, { useState, useEffect } from 'react'
import classes from './DMMainEditForm.module.scss'
import { io } from 'socket.io-client'
export const DMMainEditForm = (props) => {
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
    seteditMsg(props.dmObj.msg)
  }, [])
  const editFormHandler = (event) => {
    event.preventDefault()
    // const foundFriendDMIndex = props.friend.DMS.findIndex(
    //   (DM) => DM._id === props.dm._id
    // )

    let loggedInUser = { ...props.user }

    const foundUserMsgIndex = loggedInUser.DMS[
      props.dmIndex
    ].messages.findIndex((msgObj) => msgObj.id === props.dmObj.id)

    loggedInUser.DMS[props.dmIndex].messages[foundUserMsgIndex].msg = editMsg

    // const friendClone = { ...props.friend }
    // friendClone.DMS[foundFriendDMIndex].messages[foundUserMsgIndex].msg =
    //   editMsg
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
            prevState[foundUserMsgIndex].msg = editMsg
            return [...prevState]
          })
        }
      })

    props.seteditMsgBool({ ...props.editMsgBool, [props.dmObjIndex]: false })

    socket.emit(
      'edit-message',
      props.friend._id,
      props.dm._id,
      editMsg,
      foundUserMsgIndex
    )
  }
  const cancelEditForm = (event) => {
    props.seteditMsgBool({ ...props.editMsgBool, [props.dmObjIndex]: false })
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
