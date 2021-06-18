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
import { ChannelPage } from './Pages/ChannelPage/ChannelPage'
import { ServerPage } from './Pages/ServerPage/ServerPage'
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
      fetch(
        `http://localhost:8000/discord/discord/getSingleUser/${userToken.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((header) => {
          return header.json()
        })
        .then((response) => {
          console.log(response, 'testinggg')
          setuser(response)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
  const getUsers = () => {
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
    fetch(`http://localhost:8000/discord/discord/getAllUsers`, {
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
    fetch(`http://localhost:8000/discord/discord/getAllServers`, {
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
      getUsers()
      getServers()
      loggedIn()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (user.status) {
      console.log('asd')
      window.addEventListener('beforeunload', (event) => {
        event.preventDefault()
        const userClone = { ...user }
        userClone.status = 'offline'
        fetch(
          `http://localhost:8000/discord/discord/updateUser/${userClone._id}`,
          {
            method: 'POST',
            body: JSON.stringify(userClone),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then((header) => {
            return header.json()
          })
          .then((response) => {
            if (response) {
              console.log(response)
            }
          })
      })
    }
  }, [user])

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
                      render={() => (
                        <DirectMessaging dm={dm} dmIndex={dmIndex} />
                      )}
                      exact={true}
                      label='DirectMessaging'
                    />
                  ))
                : null}
              {servers.length > 0
                ? servers.map((server, serverIndex) => (
                    <>
                      <Route
                        path={`/channels/${server._id}`}
                        render={() => (
                          <ServerPage
                            server={server}
                            serverIndex={serverIndex}
                          />
                        )}
                        exact={true}
                        label='ServerPage'
                      />
                      <Route
                        path={`/${server._id}`}
                        render={() => (
                          <ServerPage
                            server={server}
                            serverIndex={serverIndex}
                          />
                        )}
                        exact={true}
                        label='ServerPage'
                      />
                    </>
                  ))
                : null}

              {servers.length > 0
                ? servers.map((server, serverIndex) =>
                    server.channels.map((channel, channelIndex) => (
                      <Route
                        path={`/channels/${server._id}/${channel._id}`}
                        render={() => (
                          <ChannelPage
                            server={server}
                            serverIndex={serverIndex}
                            channel={channel}
                            channelIndex={channelIndex}
                          />
                        )}
                        exact={true}
                        label='ChannelPage'
                      />
                    ))
                  )
                : null}
            </UserContext.Provider>
          </ServersContext.Provider>
        </UsersContext.Provider>
      </Switch>
    </div>
  )
}

export default App
