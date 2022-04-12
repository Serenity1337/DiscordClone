import './App.css'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FetchServersAction } from './Redux/Action-creators/ServersActions'
import { FetchUserAction } from './Redux/Action-creators/UserActions'
import { FetchUsersAction } from './Redux/Action-creators/UsersActions'
import { Switch, Route, Redirect } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Channels from './Pages/Channels'
import DirectMessaging from './Pages/DirectMessaging'
import { ChannelPage } from './Pages/ChannelPage/ChannelPage'
import { ServerPage } from './Pages/ServerPage/ServerPage'
import SocketIoDmClient from './Components/SocketIoClientComponent'
import { SocketIoChannelClient } from './Components/SocketIoChannelsClient/SocketIoChannelClient'
import { io } from 'socket.io-client'
function App() {
  const dispatch = useDispatch()
  const reduxState = useSelector((state) => state)
  const { users, user, servers } = reduxState
  const socket = io('http://localhost:8080')

  useEffect(() => {
    dispatch(FetchServersAction())
    dispatch(FetchUsersAction())
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken'))
    if (userToken) dispatch(FetchUserAction(userToken.id))
  }, [])
  return (
    <div className='app'>
      <Switch>
        <Route
          path='/register'
          component={Register}
          exact={true}
          label='Register'
        />
        <Route path='/login' component={Login} exact={true} label='Login' />
        <Route
          path='/channels/@me'
          component={Channels}
          exact={true}
          label='Channels'
        />

        {user.DMS && users.length > 0
          ? user.DMS.map((dm, dmIndex) => (
              <Route
                path={`/channels/@me/${dm._id}`}
                render={() => <DirectMessaging dm={dm} dmIndex={dmIndex} />}
                exact={true}
                label='DirectMessaging'
                key={dm._id}
              />
            ))
          : null}
        {servers.length > 0
          ? servers.map((server, serverIndex) => (
              <Route
                path={`/channels/${server._id}`}
                render={() => (
                  <ServerPage server={server} serverIndex={serverIndex} />
                )}
                exact={true}
                label='ServerPage'
              />
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
      </Switch>
      {user.username && users.length > 0 ? <SocketIoDmClient /> : null}
      {/* {servers.length > 0 && user.DMS ? <SocketIoChannelClient /> : null}  */}
    </div>
  )
}

export default App
