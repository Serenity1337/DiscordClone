import React from 'react'
import classes from './DMMainNav.module.scss'
import { FiPhoneCall, FiEdit2 } from 'react-icons/fi'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { AiFillPushpin } from 'react-icons/ai'
import { TiUserAdd, TiDeleteOutline } from 'react-icons/ti'
import { MdInbox } from 'react-icons/md'
import { BiHelpCircle } from 'react-icons/bi'
import { User } from '../../../../Redux/Action-creators/UserActions'

export const DMMainNav = (props:{friend: User | null}) => {
  return (
    <div className={classes.DMMainNav}>
      <div className={classes.DMMainNavUser}>
        <div className={classes.DMMainNavUserContainer}>
          <div className={classes.DMMainNavUserContainerAt}>@</div>
          <div className={classes.DMMainNavUserContainerUsername}>
            {props.friend && props.friend.username ? props.friend.username : null}
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
  )
}
