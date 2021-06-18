import React, { useEffect, useState, useContext } from 'react'
import { Redirect } from 'react-router'
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
  const [redirected, setredirected] = useState(false)
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  useEffect(() => {
    if (user.status === 'offline') {
      console.log(user, 'testing')
      socket.emit('online', user)
      socket.on('receive-user-status', (receivedUser) => {
        delete receivedUser.tokens
        delete receivedUser.password
        delete receivedUser.__v
        fetch(`http://localhost:8000/discord/discord/updateUser/${user._id}`, {
          method: 'POST',
          body: JSON.stringify(receivedUser),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((header) => {
            return header.json()
          })
          .then((response) => {
            if (response) {
              setuser(receivedUser)
            }
          })
      })
    }
  }, [user])
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
