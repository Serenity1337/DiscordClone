import React from 'react'
import classes from './ChannelMainNav.module.scss'
import { TiUserAdd } from 'react-icons/ti'
import { MdInbox } from 'react-icons/md'
import { BiHelpCircle } from 'react-icons/bi'
import { BsFillPeopleFill } from 'react-icons/bs'
import { AiFillPushpin, AiFillBell } from 'react-icons/ai'
import { ChannelType } from '../../../../Redux/Action-creators/ServersActions'

  type PropsTypes = {
    channel: ChannelType
  }

export const ChannelMainNav = (props:PropsTypes) => {
  return (
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
  )
}
