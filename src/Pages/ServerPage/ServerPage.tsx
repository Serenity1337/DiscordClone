import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ChannelListSidebar from '../../Components/ChannelListSideBar'
import ServersSideBar from '../../Components/ServersSideBar'
import AddChannelModal from '../../Modals/AddChannelModal'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './ServerPage.module.scss'
import { io } from 'socket.io-client'
import { FetchServersAction, Server } from '../../Redux/Action-creators/ServersActions'
import { FetchUserAction } from '../../Redux/Action-creators/UserActions'
import { FetchUsersAction } from '../../Redux/Action-creators/UsersActions'

type PropsTypes = {
  server: Server,
  serverIndex: number
}

export const ServerPage = (props:PropsTypes) => {



  const dispatch = useDispatch()
  const socket = io('ws://localhost:8080', {
    transports: ['websocket'],
    upgrade: false,
  })
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  const [addChannelModalToggle, setaddChannelModalToggle] = useState(false)
  useEffect(() => {
    socket.emit('server room', props.server._id)
    return () => {
      socket.disconnect()
    }
  }, [])
  useEffect(() => {
    dispatch(FetchServersAction())
    dispatch(FetchUsersAction())
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken')|| '{}')
    if (userToken) dispatch(FetchUserAction(userToken.id))
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
