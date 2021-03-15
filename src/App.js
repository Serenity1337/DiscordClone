import './App.css'
import React, { useEffect, useState, useMemo } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import HomeApp from './Pages/HomeApp'
import { UsersContext } from './Contexts/UsersContext'
import { UserContext } from './Contexts/UserContext'
import { ServersContext } from './Contexts/ServersContext'
function App() {
  const [user, setuser] = useState({})
  const [users, setusers] = useState([])
  const [servers, setservers] = useState([])
  const userValue = useMemo(() => ({ user, setuser }), [user, setuser])
  const usersValue = useMemo(() => ({ users, setusers }), [users, setusers])
  const ServersValue = useMemo(() => ({ servers, setservers }), [
    servers,
    setservers,
  ])
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
              <Route path='/app' component={HomeApp} exact={true} label='App' />
            </UserContext.Provider>
          </ServersContext.Provider>
        </UsersContext.Provider>
      </Switch>
    </div>
  )
}

export default App
