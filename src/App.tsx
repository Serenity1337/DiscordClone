import './App.css'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FetchServersAction, Servers } from './Redux/Action-creators/ServersActions'
import { FetchUserAction } from './Redux/Action-creators/UserActions'
import { FetchUsersAction, User, Users } from './Redux/Action-creators/UsersActions'
import { Switch, Route, Redirect } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import {RootState} from './Redux/Reducers'
import Channels from './Pages/Channels'
import DirectMessaging from './Pages/DirectMessaging'
import { ChannelPage } from './Pages/ChannelPage/ChannelPage'
import ServerPage from './Pages/ServerPage'
import SocketIoDmClient from './Components/SocketIoClientComponent'
function App() {
  const dispatch = useDispatch()
  const state = useSelector((state:RootState) => state)
  const users = state.users as Users
  const user = state.user as User
  const servers = state.servers as Servers
  // const user = useSelector((state:RootState) => state.user) as User
  // const servers = useSelector((state:RootState) => state.servers) as Servers
  useEffect(() => {
    dispatch(FetchServersAction())
    dispatch(FetchUsersAction())
    const userToken = JSON.parse(localStorage.getItem('cordCopyToken') || '{}')
    if (userToken ) {
      if (userToken.id)
      dispatch(FetchUserAction(userToken.id))
    }
  }, [])
  return (
    <div className='app'>
      <Switch>
        <Route
          path='/register'
          component={Register}
          exact={true}

        />
        <Route path='/login' component={Login} exact={true} /> 
        <Route
          path='/channels/@me'
          component={Channels}
          exact={true}
        />

        {user.DMS && users.length > 0
          ? user.DMS.map((dm:any, dmIndex:number) => (
              <Route
                path={`/channels/@me/${dm._id}`}
                render={() => <DirectMessaging dm={dm} dmIndex={dmIndex} />}
                exact={true}
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
                key={server._id}
                exact={true}
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
                  key={channel._id}
                />
              ))
            )
          : null}
          {user ? <Redirect from="*" to="/channels/@me" /> : <Redirect from='*' to='/login' />}
      </Switch>
      {user.username && users.length > 0 ? <SocketIoDmClient /> : null}
    </div>
  )
}

export default App
