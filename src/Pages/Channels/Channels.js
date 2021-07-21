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
    socket.emit('dm room', `${user._id}`)
  }, [])
  // useEffect(() => {
  //   socket.on('receive-message', (dmId, message) => {
  //     console.log('receiving')

  //     if (message.sender !== user.username) {
  //       const userClone = { ...user }
  //       const dmIndex = user.DMS.findIndex((thisDm) => thisDm._id === dmId)
  //       userClone.DMS[dmIndex].messages = [
  //         ...userClone.DMS[dmIndex].messages,
  //         message,
  //       ]
  //       setuser(userClone)
  //     }
  //   })
  //   // return () => socket.off('receive-message')
  // })

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
