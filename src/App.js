import './App.css'
import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  FetchServersAction,
  CreateServerAction,
} from './Redux/Action-creators/ServersActions'
import { FetchUserAction } from './Redux/Action-creators/UserActions'
import { FetchUsersAction } from './Redux/Action-creators/UsersActions'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Channels from './Pages/Channels'
import { UsersContext } from './Contexts/UsersContext'
import { UserContext } from './Contexts/UserContext'
import { ServersContext } from './Contexts/ServersContext'
import DirectMessaging from './Pages/DirectMessaging'
import { ChannelPage } from './Pages/ChannelPage/ChannelPage'
import { ServerPage } from './Pages/ServerPage/ServerPage'
import { getLoggedInUser, getUsers, getServers, loggedIn } from './utils/Api'
import SocketIoDmClient from './Components/SocketIoClientComponent'
import { SocketIoChannelClient } from './Components/SocketIoChannelsClient/SocketIoChannelClient'
function App() {
  const [user, setuser] = useState({})
  const [users, setusers] = useState([])
  const [servers, setservers] = useState([])
  const dispatch = useDispatch()
  const state = useSelector((state) => state)
  const userValue = useMemo(() => ({ user, setuser }), [user, setuser])
  const usersValue = useMemo(() => ({ users, setusers }), [users, setusers])
  const ServersValue = useMemo(
    () => ({ servers, setservers }),
    [servers, setservers]
  )

  useEffect(() => {
    dispatch(FetchServersAction())
    dispatch(FetchUsersAction())
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
    if (userToken) dispatch(FetchUserAction(userToken.id))
    if (getLoggedInUser()) {
      getLoggedInUser().then((response) => {
        if (response) {
          setuser(response)
        }
      })
    }

    getUsers().then((response) => {
      if (response) setusers(response)
    })
    getServers().then((response) => {
      if (response) setservers(response)
    })
    loggedIn()
  }, [])
  console.log(state, 'test')

  return (
    <div className='app'>
      <Switch>
        <UsersContext.Provider value={usersValue}>
          <ServersContext.Provider value={ServersValue}>
            <UserContext.Provider value={userValue}>
              <Redirect from='*' to='/login' />
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
              {user.DMS ? (
                <>
                  <Redirect from='*' to='/channels/@me' />
                  <Route
                    path='/channels/@me'
                    component={Channels}
                    exact={true}
                    label='Channels'
                  />
                </>
              ) : null}
              {user.DMS && users.length > 0
                ? user.DMS.map((dm, dmIndex) => (
                    <Route
                      path={`/channels/@me/${dm._id}`}
                      render={() => (
                        <DirectMessaging dm={dm} dmIndex={dmIndex} />
                      )}
                      exact={true}
                      label='DirectMessaging'
                      key={dm._id}
                    />
                  ))
                : null}
              {servers.length > 0
                ? servers.map((server, serverIndex) => (
                    <div key={server._id}>
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
                    </div>
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
                        key={channel._id}
                      />
                    ))
                  )
                : null}
              {user.DMS && users.length > 0 ? (
                <SocketIoDmClient
                  user={user}
                  setuser={setuser}
                  users={users}
                  setusers={setusers}
                />
              ) : null}
              {servers.length > 0 && user.DMS ? (
                <SocketIoChannelClient
                  servers={servers}
                  setservers={setservers}
                  user={user}
                  setuser={setuser}
                />
              ) : null}
            </UserContext.Provider>
          </ServersContext.Provider>
        </UsersContext.Provider>
      </Switch>
    </div>
  )
}

export default App
