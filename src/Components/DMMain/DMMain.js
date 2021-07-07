import React, { useEffect, useState, useContext } from 'react'
import classes from './DMMain.module.scss'
import { FiPhoneCall, FiSmile, FiEdit2 } from 'react-icons/fi'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { AiFillPushpin, AiOutlineGift, AiOutlineGif } from 'react-icons/ai'
import { TiUserAdd, TiDeleteOutline } from 'react-icons/ti'
import { MdInbox } from 'react-icons/md'
import { BiHelpCircle } from 'react-icons/bi'
import catto from '../../utils/imgs/catto.png'
import dateFormat from 'dateformat'
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client'
import { UserContext } from '../../Contexts/UserContext'

export const DMMain = (props) => {
  const chatBoxContainer = React.createRef()
  const socket = io('localhost:8080', {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    upgrade: false,
    pingInterval: 1000 * 60 * 5,
    pingTimeout: 1000 * 60 * 3,
  })
  let now = new Date()
  const [friend, setFriend] = useState({})
  const [msg, setMsg] = useState('')
  const { user, setuser } = useContext(UserContext)
  const [messages, setmessages] = useState([])
  const [editMsgBool, seteditMsgBool] = useState({})
  const [editMsg, seteditMsg] = useState('')
  useEffect(() => {
    socket.emit('dm room', `${props.dm._id}`)
    setmessages([...user.DMS[props.dmIndex].messages])
    return () => {
      window.removeEventListener('keydown', cancelEditForm)
    }
  }, [])

  useEffect(() => {
    socket.on('receive-message', (message) => {
      if (message.sender !== user.username) {
        setmessages((prevState) => {
          return [...prevState, message]
        })
      }
    })
    return () => socket.off('receive-message')
  })
  useEffect(() => {
    if (props.dm.participants && user.username && props.users.length > 0) {
      const loggedInUserFriendString = props.dm.participants.filter(
        (userFriend) => userFriend !== user.username
      )
      const loggedInUserFriend = props.users.filter(
        (friendObject) => friendObject.username === loggedInUserFriendString[0]
      )
      setFriend(loggedInUserFriend[0])
    }
  }, [props.users])

  const msgInputHandler = (event) => {
    setMsg(event.target.value)
  }
  const cancelEditForm = (event, index) => {
    if (event.key === 'Escape') {
      // console.log('testing')
      // console.log(event.key)
      // console.log(index)
      seteditMsgBool({ ...editMsgBool, [index]: false })
    }
  }
  const editFormHandler = (event) => {
    event.preventDefault()
  }
  const editMsgHandler = (index) => {
    seteditMsgBool({ ...editMsgBool, [index]: true })
    setMsg(messages[index].msg)
    window.addEventListener('keydown', (event) => cancelEditForm(event, index))
  }

  const msgFormHandler = (event) => {
    event.preventDefault()
    const foundFriendDMIndex = friend.DMS.findIndex(
      (DM) => DM._id === props.dm._id
    )
    const msgId = uuidv4()
    const msgObject = {}
    let currDate = dateFormat(now, 'mm/dd/yyyy hh:MM TT')
    msgObject.sentDate = currDate
    msgObject.id = msgId
    msgObject.sender = user.username
    msgObject.msg = msg

    let loggedInUser = { ...user }

    loggedInUser.DMS[props.dmIndex].messages = [
      ...loggedInUser.DMS[props.dmIndex].messages,
      msgObject,
    ]

    friend.DMS[foundFriendDMIndex].messages = [
      ...friend.DMS[foundFriendDMIndex].messages,
      msgObject,
    ]
    let DMClone = { ...props.dm }
    DMClone.messages = [...DMClone.messages, msgObject]

    event.target[0].value = ''

    // console.log(foundLoggedInUserIndex)
    fetch(`http://localhost:8000/discord/discord/updateUser/${friend._id}`, {
      method: 'POST',
      body: JSON.stringify(friend),
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
          setmessages((prevState) => {
            return [...prevState, msgObject]
          })
        }
      })

    chatBoxContainer.current.scrollTo(
      0,
      chatBoxContainer.current.scrollHeight + 42
    )

    socket.emit('send-message', msgObject, props.dm._id)
  }
  return (
    <div className={classes.DMMain}>
      <div className={classes.DMMainNav}>
        <div className={classes.DMMainNavUser}>
          <div className={classes.DMMainNavUserContainer}>
            <div className={classes.DMMainNavUserContainerAt}>@</div>
            <div className={classes.DMMainNavUserContainerUsername}>
              {friend.username ? friend.username : null}
            </div>
          </div>
        </div>
        <div className={classes.DMMainNavIconsContainer}>
          <FiPhoneCall
            fill='#b9bbbe'
            stroke='#b9bbbe'
            style={{
              width: '20px',
              height: '20px',
              margin: '5px 10px 0px 10px',
            }}
          />
          <BsFillCameraVideoFill
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
          <TiUserAdd
            fill='#b9bbbe'
            stroke='#b9bbbe'
            style={{
              width: '20px',
              height: '20px',
              margin: '5px 10px 0px 10px',
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
      <div className={classes.DMMainChatBoxContainer} ref={chatBoxContainer}>
        <div className={classes.DMMainChatBoxContainerFriendAvatar}>
          <img src={catto} alt='' />
        </div>
        <div className={classes.DMMainChatBoxContainerFriendName}>
          {' '}
          {friend.username ? friend.username : null}{' '}
        </div>
        <div className={classes.DMMainChatBoxContainerText}>
          This is the beginning of your direct message history with{' '}
          <strong>@{friend.username ? friend.username : null}</strong>
        </div>
        <div className={classes.DMMainChatBoxContainerHorizontalLine}></div>
        {messages.length > 0
          ? messages.map((dmObj, dmObjIndex) => (
              <div className={classes.DMMainChatBoxContainerMsgContainer}>
                <div
                  className={classes.DMMainChatBoxContainerMsgContainerAvatar}
                >
                  <img src={catto} alt='' />
                  <div className={classes.DMMainChatBoxNameContainer}>
                    {dmObj.sender}
                    <span className={classes.DMMsgDate}>
                      {' '}
                      {dmObj.sentDate}{' '}
                    </span>

                    {editMsgBool[dmObjIndex] ? (
                      <form
                        className={classes.editMsgForm}
                        onSubmit={editFormHandler}
                      >
                        <input
                          type='text'
                          className={classes.editMsgInput}
                          value={msg}
                          onChange={msgInputHandler}
                        />
                        <input type='submit' />
                      </form>
                    ) : (
                      <div
                        className={
                          classes.DMMainChatBoxContainerMsgContainerMsg
                        }
                      >
                        {dmObj.msg}
                      </div>
                    )}
                  </div>
                </div>
                {dmObj.sender === user.username && !editMsgBool[dmObjIndex] ? (
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
                    />
                  </div>
                ) : null}
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
            placeholder='Message @123'
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
