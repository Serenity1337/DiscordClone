import React, { useState, useEffect } from 'react'
import classes from './DMMainMessages.module.scss'
import catto from '../../../../utils/imgs/catto.png'
import { TiDeleteOutline } from 'react-icons/ti'
import { FiEdit2 } from 'react-icons/fi'
import DMMainEditForm from '../DMMainEditForm'
import { io } from 'socket.io-client'
import { getLoggedInUser, postRequest } from '../../../../utils/Api'
import { useDispatch } from 'react-redux'
import { UpdateUserAction, User } from '../../../../Redux/Action-creators/UserActions'
type MsgObjTypes = {sentDate: string, id: string, sender: string,msg: string}
  type PropsTypes = {
    friend: User | null,
    messages:MsgObjTypes[] | null,
    setmessages: Function,
    user: User,
    setchatBoxContainer: Function,
    dm: any,
    dmIndex: number
  }

export const DMMainMessages = (props:PropsTypes) => {
  const dispatch = useDispatch()
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
  })
  const chatBoxContainer:React.RefObject<HTMLDivElement> = React.createRef()
  const [editMsgBool, seteditMsgBool] = useState<{[key: string]:boolean}>({})
  const cancelEditForm = (event: KeyboardEvent, index: number) => {
    if (event.key === 'Escape') {
      seteditMsgBool({ ...editMsgBool, [index]: false })
    }
  }
  useEffect(() => {
    props.setchatBoxContainer(chatBoxContainer.current)
    return () => {
      window.removeEventListener('keydown', () => cancelEditForm)
    }
  }, [])

  const editMsgHandler = (index:number) => {
    seteditMsgBool({ ...editMsgBool, [index]: true })
    window.addEventListener('keydown', (event:KeyboardEvent) => cancelEditForm(event, index)) 
  }

  

  const delMsgHandler = (dmObj: any, dmObjIndex: number) => {
    let loggedInUser = { ...props.user }
    const friendClone = { ...props.friend }
    if (props.friend && props.friend.DMS && loggedInUser.DMS && friendClone.DMS) {
      const foundFriendDMIndex = props.friend.DMS.findIndex(
        (DM) => DM._id === props.dm._id
      )
      

    const filteredMsgArr = loggedInUser.DMS[props.dmIndex].messages.filter(
      (msgObj:MsgObjTypes) => msgObj.id !== dmObj.id
    )
    loggedInUser.DMS[props.dmIndex].messages = filteredMsgArr
    
    friendClone.DMS[foundFriendDMIndex].messages = filteredMsgArr

    const response = postRequest(
      `http://localhost:8000/discord/discord/updateUser/${loggedInUser._id}`,
      loggedInUser
    )
    response.then((res:string) => {
      if (res) {
        props.setmessages((prevState:MsgObjTypes[]) => {
          const clonePrevState = prevState.filter(
            (msgObj) => msgObj.id !== dmObj.id
          )
          dispatch(UpdateUserAction(loggedInUser))
          return [...clonePrevState]
        })
      }
    })
    socket.emit(
      'delete-message',
      props.friend._id,
      props.dm._id,
      dmObj,
      dmObjIndex
    )
    }
    

    
  }
  return (
    <div className={classes.DMMainChatBoxContainer} ref={chatBoxContainer}>
      <div className={classes.DMMainChatBoxContainerFriendAvatar}>
        <img src={catto} alt='' />
      </div>
      <div className={classes.DMMainChatBoxContainerFriendName}>
        {' '}
        {props.friend && props.friend.username ? props.friend.username : null}{' '}
      </div>
      <div className={classes.DMMainChatBoxContainerText}>
        This is the beginning of your direct message history with{' '}
        <strong>@{props.friend && props.friend.username ? props.friend.username : null}</strong>
      </div>
      <div className={classes.DMMainChatBoxContainerHorizontalLine}></div>
      {props.messages && props.messages.length > 0
        ? props.messages.map((dmObj, dmObjIndex) => (
            <div
              className={classes.DMMainChatBoxContainerMsgContainer}
              key={dmObj.id}
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
                      margin: '5px 0px 0px 10px',
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
                      margin: '5px 10px 0px 0px',
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
