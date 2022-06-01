import React, { useState, useEffect } from 'react'
import classes from './DMMainEditForm.module.scss'
import { io } from 'socket.io-client'
import { User } from '../../../../Redux/Action-creators/UserActions'

type PropsTypes = {
  dmObjIndex: number,
  dmObj: any,
  editMsgBool: EditMsgBool,
  seteditMsgBool: Function,
  friend: User | null,
  user: User,
  setmessages: Function,
  dm: any,
  dmIndex: number
}
type MsgObjTypes = {sentDate: string, id: string, sender: string,msg: string}
type EditMsgBool = {
  [key:string]: boolean
}

export const DMMainEditForm = (props:PropsTypes) => {
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
  })

  const [editMsg, seteditMsg] = useState('')
  useEffect(() => {
    seteditMsg(props.dmObj.msg)
  }, [])
  const editFormHandler = (event:React.SyntheticEvent) => {
    event.preventDefault()
    // const foundFriendDMIndex = props.friend.DMS.findIndex(
    //   (DM) => DM._id === props.dm._id
    // )

    let loggedInUser = { ...props.user }

    if (loggedInUser.DMS) {
      const foundUserMsgIndex = loggedInUser.DMS[
        props.dmIndex
      ].messages.findIndex((msgObj:MsgObjTypes) => msgObj.id === props.dmObj.id)
  
      loggedInUser.DMS[props.dmIndex].messages[foundUserMsgIndex].msg = editMsg
  
      // const friendClone = { ...props.friend }
      // friendClone.DMS[foundFriendDMIndex].messages[foundUserMsgIndex].msg =
      //   editMsg
      const formElement = event.target as HTMLFormElement 
      const inputElement = formElement[0] as HTMLInputElement
      inputElement.value = ''
      
  
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
            props.setmessages((prevState:MsgObjTypes[]) => {
              prevState[foundUserMsgIndex].msg = editMsg
              return [...prevState]
            })
          }
        })
  
      props.seteditMsgBool({ ...props.editMsgBool, [props.dmObjIndex]: false })
        if (props.friend) {
          socket.emit(
            'edit-message',
            props.friend._id,
            props.dm._id,
            editMsg,
            foundUserMsgIndex
          )
        }
      
    }


  }
  const cancelEditForm = () => {
    props.seteditMsgBool({ ...props.editMsgBool, [props.dmObjIndex]: false })
  }
  const editMsgInputHandler = (event:React.SyntheticEvent) => {
    const element = event.target as HTMLInputElement
    seteditMsg(element.value)
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
