import React, { useEffect, useState, useContext } from 'react'
import { ChannelListSidebar } from '../../Components/ChannelListSideBar/ChannelListSidebar'
import { ChannelMain } from '../../Components/ChannelMain/ChannelMain'
import ServersSideBar from '../../Components/ServersSideBar'
import { ServersContext } from '../../Contexts/ServersContext'
import { UserContext } from '../../Contexts/UserContext'
import { UsersContext } from '../../Contexts/UsersContext'
import AddChannelModal from '../../Modals/AddChannelModal'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './ChannelPage.module.scss'
import { getServers } from '../../utils/Api'
import { io } from 'socket.io-client'
export const ChannelPage = (props) => {
  const socket = io('ws://localhost:8080', {
    transports: ['websocket'],
    upgrade: false,
  })
  const { user, setuser } = useContext(UserContext)
  const { users, setusers } = useContext(UsersContext)
  const { servers, setservers } = useContext(ServersContext)
  const [server, setserver] = useState({})
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  const [addChannelModalToggle, setaddChannelModalToggle] = useState(false)

  useEffect(() => {
    setserver(props.server)
    console.log(props.server)
    console.log(server)
  }, [])
  return (
    <div className={classes.appContainer}>
      <ServersSideBar
        user={user}
        users={users}
        servers={servers}
        setuser={setuser}
        setusers={setusers}
        setservers={setservers}
        setaddServerModalToggle={setaddServerModalToggle}
      />
      <ChannelListSidebar
        server={props.server}
        serverIndex={props.serverIndex}
        user={user}
        setaddChannelModalToggle={setaddChannelModalToggle}
      />
      {addServerModalToggle ? (
        <AddServerModal
          setaddServerModalToggle={setaddServerModalToggle}
          servers={servers}
          setservers={setservers}
          user={user}
        />
      ) : null}
      {addChannelModalToggle ? (
        <AddChannelModal
          setaddChannelModalToggle={setaddChannelModalToggle}
          servers={servers}
          setservers={setservers}
          user={user}
          setuser={setuser}
          server={server}
          serverIndex={props.serverIndex}
        />
      ) : null}
      <ChannelMain
        user={user}
        setuser={setuser}
        users={users}
        server={props.server}
        setserver={setserver}
        channel={props.channel}
        servers={servers}
        serverIndex={props.serverIndex}
        setusers={setusers}
        channelIndex={props.channelIndex}
        setservers={setservers}
      />
    </div>
  )
}
