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

export const ChannelPage = (props) => {
  const { user, setuser } = useContext(UserContext)
  const { users, setusers } = useContext(UsersContext)
  const { servers, setservers } = useContext(ServersContext)
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  const [addChannelModalToggle, setaddChannelModalToggle] = useState(false)
  console.log(props)
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
          server={props.server}
          serverIndex={props.serverIndex}
        />
      ) : null}
      <ChannelMain
        user={user}
        setuser={setuser}
        users={users}
        server={props.server}
        channel={props.channel}
        servers={servers}
        serverIndex={props.serverIndex}
        setusers={setusers}
        channelIndex={props.channelIndex}
      />
    </div>
  )
}
