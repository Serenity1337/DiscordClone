import React, { useEffect, useState, useContext } from 'react'
import { Redirect } from 'react-router'
import DMMain from '../../Components/DMMain'
import FriendsListMain from '../../Components/FriendsListMain'
import FriendsListSideBar from '../../Components/FriendsListSideBar'
import ServersSideBar from '../../Components/ServersSideBar'
import { ServersContext } from '../../Contexts/ServersContext'
import { UserContext } from '../../Contexts/UserContext'
import { UsersContext } from '../../Contexts/UsersContext'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './DirectMessaging.module.scss'
import { getLoggedInUser } from '../../utils/Api'
export const DirectMessaging = (props) => {
  const { user, setuser } = useContext(UserContext)
  const { users, setusers } = useContext(UsersContext)
  const { servers, setservers } = useContext(ServersContext)
  const [redirected, setredirected] = useState(false)
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  useEffect(() => {
    getLoggedInUser().then((response) => {
      if (response) setuser(response)
      console.log(response)
    })
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
