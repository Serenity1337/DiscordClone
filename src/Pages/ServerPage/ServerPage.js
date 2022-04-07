import React, { useEffect, useState } from 'react'
import { ChannelListSidebar } from '../../Components/ChannelListSideBar/ChannelListSidebar'
import ServersSideBar from '../../Components/ServersSideBar'
import AddChannelModal from '../../Modals/AddChannelModal'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './ServerPage.module.scss'
import { io } from 'socket.io-client'
export const ServerPage = (props) => {
  const socket = io('ws://localhost:8080', {
    transports: ['websocket'],
    upgrade: false,
  })
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  const [addChannelModalToggle, setaddChannelModalToggle] = useState(false)
  useEffect(() => {
    socket.emit('server room', props.server._id)
  }, [])
  return (
    <div className={classes.appContainer}>
      <ServersSideBar setaddServerModalToggle={setaddServerModalToggle} />
      <ChannelListSidebar
        server={props.server}
        serverIndex={props.serverIndex}
        setaddChannelModalToggle={setaddChannelModalToggle}
      />
      {addServerModalToggle ? (
        <AddServerModal setaddServerModalToggle={setaddServerModalToggle} />
      ) : null}
      {addChannelModalToggle ? (
        <AddChannelModal
          setaddChannelModalToggle={setaddChannelModalToggle}
          server={props.server}
          serverIndex={props.serverIndex}
        />
      ) : null}
      <div className={classes.serverPageMain}>
        Welcome to
        <div className={classes.serverName}>{props.server.serverName}</div>
        <div className={classes.welcomeText}>
          This is {props.server.owner}'s server,
          <br />
          feel free to check out the existing channels
        </div>
      </div>
    </div>
  )
}
