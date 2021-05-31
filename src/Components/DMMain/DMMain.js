import React, { useEffect, useState } from 'react'
import classes from './DMMain.module.scss'
import { FiPhoneCall, FiSmile } from 'react-icons/fi'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { AiFillPushpin, AiOutlineGift, AiOutlineGif } from 'react-icons/ai'
import { TiUserAdd } from 'react-icons/ti'
import { MdInbox } from 'react-icons/md'
import { BiHelpCircle } from 'react-icons/bi'
import catto from '../../utils/imgs/catto.png'
import dateFormat from 'dateformat'
import { v4 as uuidv4 } from 'uuid'

export const DMMain = (props) => {
  let now = new Date()
  const [friend, setFriend] = useState({})
  const [msg, setMsg] = useState('')
  useEffect(() => {
    if (
      props.dm.participants &&
      props.user.username &&
      props.users.length > 0
    ) {
      const loggedInUserFriendString = props.dm.participants.filter(
        (userFriend) => userFriend !== props.user.username
      )
      const loggedInUserFriend = props.users.filter(
        (friendObject) => friendObject.username === loggedInUserFriendString[0]
      )
      console.log(loggedInUserFriend)
      setFriend(loggedInUserFriend[0])
    }
  }, [props.dm.participants || props.user.username || props.users.length > 0])

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

    const foundLoggedInUserIndex = props.users.findIndex(
      (currUser) => currUser.username === props.user.username
    )

    let loggedInUser = props.user
    loggedInUser.DMS[props.dmIndex] = msgObject
    console.log(props.users)
    console.log(foundLoggedInUserIndex)
    // fetch(`http://localhost:4000/users/${foundUserCopyCopy.id}`, {
    //           method: 'PUT',
    //           body: JSON.stringify(foundUserCopyCopy),
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //         })
    //           .then((header) => {
    //             return header.json()
    //           })
    //           .then((response) => {
    //             if (response) {
    //               props.setusers(usersCopy)
    //             }

    //           })
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
            {/* <span className={classes.DMMainNavUserContainerUsernameStatus}>
              o
            </span> */}
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
      <div className={classes.DMMainChatBoxContainer}>
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

        <div className={classes.DMMainChatBoxContainerMsgContainer}>
          <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
            <img src={catto} alt='' />
            <div className={classes.DMMainChatBoxNameContainer}>
              {props.user.username}
              <span className={classes.DMMsgDate}> 05/28/2021 4:34 PM </span>
              <div className={classes.DMMainChatBoxContainerMsgContainerMsg}>
                asddsa
              </div>
            </div>
          </div>
        </div>

        <div className={classes.DMMainChatBoxContainerMsgContainer}>
          <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
            <img src={catto} alt='' />
            <div className={classes.DMMainChatBoxNameContainer}>
              {props.user.username}
              <span className={classes.DMMsgDate}> 05/28/2021 4:34 PM </span>
              <div className={classes.DMMainChatBoxContainerMsgContainerMsg}>
                asddsa
              </div>
            </div>
          </div>
        </div>

        <div className={classes.DMMainChatBoxContainerMsgContainer}>
          <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
            <img src={catto} alt='' />
            <div className={classes.DMMainChatBoxNameContainer}>
              {props.user.username}
              <span className={classes.DMMsgDate}> 05/28/2021 4:34 PM </span>
              <div className={classes.DMMainChatBoxContainerMsgContainerMsg}>
                asddsa
              </div>
            </div>
          </div>
        </div>

        <div className={classes.DMMainChatBoxContainerMsgContainer}>
          <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
            <img src={catto} alt='' />
            <div className={classes.DMMainChatBoxNameContainer}>
              {props.user.username}
              <span className={classes.DMMsgDate}> 05/28/2021 4:34 PM </span>
              <div className={classes.DMMainChatBoxContainerMsgContainerMsg}>
                asddsa
              </div>
            </div>
          </div>
        </div>

        <div className={classes.DMMainChatBoxContainerMsgContainer}>
          <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
            <img src={catto} alt='' />
            <div className={classes.DMMainChatBoxNameContainer}>
              {props.user.username}
              <span className={classes.DMMsgDate}> 05/28/2021 4:34 PM </span>
              <div className={classes.DMMainChatBoxContainerMsgContainerMsg}>
                asddsa
              </div>
            </div>
          </div>
        </div>

        <div className={classes.DMMainChatBoxContainerMsgContainer}>
          <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
            <img src={catto} alt='' />
            <div className={classes.DMMainChatBoxNameContainer}>
              {props.user.username}
              <span className={classes.DMMsgDate}> 05/28/2021 4:34 PM </span>
              <div className={classes.DMMainChatBoxContainerMsgContainerMsg}>
                asddsa
              </div>
            </div>
          </div>
        </div>

        <div className={classes.DMMainChatBoxContainerMsgContainer}>
          <div className={classes.DMMainChatBoxContainerMsgContainerAvatar}>
            <img src={catto} alt='' />
            <div className={classes.DMMainChatBoxNameContainer}>
              {props.user.username}
              <span className={classes.DMMsgDate}> 05/28/2021 4:34 PM </span>
              <div className={classes.DMMainChatBoxContainerMsgContainerMsg}>
                asddsa
              </div>
            </div>
          </div>
        </div>
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
