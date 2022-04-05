import React, { useEffect, useState, useContext } from 'react'
import FriendsListMain from '../../Components/FriendsListMain'
import FriendsListSideBar from '../../Components/FriendsListSideBar'
import ServersSideBar from '../../Components/ServersSideBar'
import { ServersContext } from '../../Contexts/ServersContext'
import { UserContext } from '../../Contexts/UserContext'
import { UsersContext } from '../../Contexts/UsersContext'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './Channels.module.scss'
import { io } from 'socket.io-client'

export const Channels = () => {
  const socket = io('http://localhost:8080')

  // getting the state
  const { user, setuser } = useContext(UserContext)
  const { users, setusers } = useContext(UsersContext)
  const { servers, setservers } = useContext(ServersContext)
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  useEffect(() => {
    socket.emit('dm room', `${user._id}`)
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
      <FriendsListSideBar user={user} setuser={setuser} />
      {addServerModalToggle ? (
        <AddServerModal
          setaddServerModalToggle={setaddServerModalToggle}
          servers={servers}
          setservers={setservers}
          user={user}
        />
      ) : null}
      <FriendsListMain
        user={user}
        setuser={setuser}
        users={users}
        setusers={setusers}
      />
    </div>
  )
}
