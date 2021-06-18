import React, { useEffect, useState, useContext } from 'react'
import { Redirect } from 'react-router'
import { ChannelListSidebar } from '../../Components/ChannelListSideBar/ChannelListSidebar'
import ServersSideBar from '../../Components/ServersSideBar'
import { ServersContext } from '../../Contexts/ServersContext'
import { UserContext } from '../../Contexts/UserContext'
import { UsersContext } from '../../Contexts/UsersContext'
import AddChannelModal from '../../Modals/AddChannelModal'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './ServerPage.module.scss'

export const ServerPage = (props) => {
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
