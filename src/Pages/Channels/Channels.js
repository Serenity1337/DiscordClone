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

export const Channels = () => {
  // getting the state
  const { user, setuser } = useContext(UserContext)
  const { users, setusers } = useContext(UsersContext)
  const { servers, setservers } = useContext(ServersContext)
  const [redirected, setredirected] = useState(false)
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  useEffect(() => {
    console.log('asd')
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
