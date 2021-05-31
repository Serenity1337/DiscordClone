import './App.css'
import React, { useEffect, useState, useMemo } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Channels from './Pages/Channels'
import { UsersContext } from './Contexts/UsersContext'
import { UserContext } from './Contexts/UserContext'
import { ServersContext } from './Contexts/ServersContext'
import DirectMessaging from './Pages/DirectMessaging'
function App() {
  const [user, setuser] = useState({})
  const [users, setusers] = useState([])
  const [servers, setservers] = useState([])
  const userValue = useMemo(() => ({ user, setuser }), [user, setuser])
  const usersValue = useMemo(() => ({ users, setusers }), [users, setusers])
  const ServersValue = useMemo(
    () => ({ servers, setservers }),
    [servers, setservers]
  )

  // check if logged in
  const loggedIn = () => {
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
    if (!userToken) {
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
      getUsers()
      getServers()
    }, 10000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className='app'>
      <Switch>
        <UsersContext.Provider value={usersValue}>
          <ServersContext.Provider value={ServersValue}>
            <UserContext.Provider value={userValue}>
              <Route
                path='/register'
                component={Register}
                exact={true}
                label='Register'
              />
              <Route
                path='/login'
                component={Login}
                exact={true}
                label='Login'
              />
              <Route
                path='/channels/@me'
                component={Channels}
                exact={true}
                label='Channels'
              />
              {user.DMS
                ? user.DMS.map((dm, dmIndex) => (
                    <Route
                      path={`/channels/@me/${dm._id}`}
                      render={() => <DirectMessaging dm={(dm, dmIndex)} />}
                      exact={true}
                      label='DirectMessaging'
                    />
                  ))
                : null}
            </UserContext.Provider>
          </ServersContext.Provider>
        </UsersContext.Provider>
      </Switch>
    </div>
  )
}

export default App
