import React from 'react'
import classes from './ChannelListSidebar.module.scss'
import { FaMicrophone, FaHeadphones } from 'react-icons/fa'
import { MdExpandMore } from 'react-icons/md'
import { BsGearFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import catto from '../../utils/imgs/catto.png'
import { useSelector } from 'react-redux'
import { Server } from '../../Redux/Action-creators/ServersActions'
import { RootState } from '../../Redux/Reducers'
import { User } from '../../Redux/Action-creators/UserActions'

type PropsTypes = {
  server: Server,
  serverIndex: number,
  setaddChannelModalToggle: Function
}

export const ChannelListSidebar = (props:PropsTypes) => {
  const user = useSelector((state:RootState) => state.user) as User

  const toggleModalOn = () => {
    props.setaddChannelModalToggle(true)
  }

  const renderStatus = (user: User) => {
    if (user.status === 'offline') {
      return (
        <div className={classes.offlineStatusIcon}>
          <div className={classes.innerCircle}></div>
        </div>
      )
    }
    if (user.status === 'online') {
      return <div className={classes.onlineStatusIcon}></div>
    }
    if (user.status === 'busy') {
      return (
        <div className={classes.busyStatusIcon}>
          <div className={classes.innerLine}></div>
        </div>
      )
    }
  }

  return (
    <div className={classes.ChannelListSideContainer}>
      <div className={classes.serverHeader}>
        {props.server.serverName}{' '}
        <MdExpandMore
          style={{ height: '24px', width: '24px', cursor: 'pointer' }}
        />{' '}
      </div>
      <div
        style={{ width: '100%', height: '1.5px', backgroundColor: '#202225' }}
      ></div>

      <div className={classes.createChannelContainer}>
        <h2 className={classes.createChannelHeading}>Create new channel</h2>
        <button className={classes.createChannelBtn} onClick={toggleModalOn}>
          +
        </button>
      </div>
      <div className={classes.channelsContainer}>
        {props.server
          ? props.server.channels.map((channel, channelIndex) => (
              <Link
                className={classes.channel}
                to={`/channels/${props.server._id}/${channel._id}`}
                key={channel._id}
              >
                <div className={classes.hashtag}>#</div>
                {channel.channelName}
              </Link>
            ))
          : null}
      </div>

      <div className={classes.meUserContainer}>
        <div className={classes.profileContainer}>
          <div className={classes.imgContainer}>
            <img
              src={catto}
              alt=''
              style={{ width: '32px', height: '32px', borderRadius: '50%' }}
            />
            {renderStatus(user)}
          </div>
          <div className={classes.userNameStatusContainer}>
            {user.username}
            <div style={{ fontSize: '12px', color: '#8e9297' }}>{user.tag}</div>
          </div>
        </div>
        <div className={classes.settingsContainer}>
          <FaMicrophone
            style={{
              fill: '#d9dadb',
              cursor: 'pointer',
              width: '15px',
              height: '15px',
            }}
          />
          <FaHeadphones
            style={{
              fill: '#d9dadb',
              cursor: 'pointer',
              width: '15px',
              height: '15px',
              margin: '0px 15px 0px 15px',
            }}
          />
          <BsGearFill
            style={{
              fill: '#d9dadb',
              cursor: 'pointer',
              width: '15px',
              height: '15px',
            }}
          />
        </div>
      </div>
      {/* {redirected ? <Redirect to={`@me/${redirectionLocation}`} /> : null} */}
    </div>
  )
}
