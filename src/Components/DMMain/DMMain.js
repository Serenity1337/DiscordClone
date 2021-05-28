import React, { useEffect, useState } from 'react'
import classes from './DMMain.module.scss'
import { FiPhoneCall } from 'react-icons/fi'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { AiFillPushpin } from 'react-icons/ai'
import { TiUserAdd } from 'react-icons/ti'
import { MdInbox } from 'react-icons/md'
import { BiHelpCircle } from 'react-icons/bi'
export const DMMain = (props) => {
  const [friend, setFriend] = useState({})
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
    </div>
  )
}
