import React, { useEffect, useState, useContext } from 'react'
import { Redirect } from 'react-router'
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

  // check if logged in
  const loggedIn = () => {
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
    if (!userToken) {
      setredirected(true)
    } else {
      return
    }
  }
  const getUser = () => {
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
    if (userToken) {
      fetch(`http://localhost:4000/users/${userToken.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((header) => {
          return header.json()
        })
        .then((response) => {
          setuser(response)
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      setuser({})
    }
  }
  const getUsers = () => {
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
    fetch(`http://localhost:4000/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        return header.json()
      })
      .then((response) => {
        setusers(response)
      })
      .catch((e) => {
        console.log(e)
      })
  }
  const getServers = () => {
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
    fetch(`http://localhost:4000/servers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        return header.json()
      })
      .then((response) => {
        setservers(response)
      })
      .catch((e) => {
        console.log(e)
      })
  }
  useEffect(() => {
    getUser()
    getUsers()
    getServers()
    loggedIn()
    const interval = setInterval(() => {
      getUser()
      loggedIn()
    }, 10000)
    return () => clearInterval(interval)
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
      {addServerModalToggle ? (
        <AddServerModal
          setaddServerModalToggle={setaddServerModalToggle}
          servers={servers}
          setservers={setservers}
          user={user}
        />
      ) : null}
      <div>asdasd</div>
      {redirected ? <Redirect to='/login' /> : null}
    </div>
  )
}
