import React, { useEffect, useState, useContext } from 'react'
import DMMain from '../../Components/DMMain'
import FriendsListSideBar from '../../Components/FriendsListSideBar'
import ServersSideBar from '../../Components/ServersSideBar'
import { ServersContext } from '../../Contexts/ServersContext'
import { UserContext } from '../../Contexts/UserContext'
import { UsersContext } from '../../Contexts/UsersContext'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './DirectMessaging.module.scss'
import { getLoggedInUser } from '../../utils/Api'
import { io } from 'socket.io-client'

export const DirectMessaging = (props) => {
  const socket = io('http://localhost:8080')
  const { user, setuser } = useContext(UserContext)
  const { users, setusers } = useContext(UsersContext)
  const { servers, setservers } = useContext(ServersContext)
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  // useEffect(() => {
  //   getLoggedInUser().then((response) => {
  //     if (response) setuser(response)
  //   })
  // }, [])
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
      <FriendsListSideBar user={user} setuser={setuser} />
      {addServerModalToggle ? (
        <AddServerModal
          setaddServerModalToggle={setaddServerModalToggle}
          servers={servers}
          setservers={setservers}
          user={user}
        />
      ) : null}
      <DMMain
        user={user}
        setuser={setuser}
        users={users}
        dm={props.dm}
        setusers={setusers}
        dmIndex={props.dmIndex}
      />
    </div>
  )
}
