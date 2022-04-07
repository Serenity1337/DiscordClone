import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FriendsListMain from '../../Components/FriendsListMain'
import FriendsListSideBar from '../../Components/FriendsListSideBar'
import ServersSideBar from '../../Components/ServersSideBar'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './Channels.module.scss'
import { io } from 'socket.io-client'

export const Channels = () => {
  const socket = io('http://localhost:8080')

  // getting the state
  const user = useSelector((state) => state.user)
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)
  useEffect(() => {
    socket.emit('dm room', `${user._id}`)
  }, [])

  return (
    <div className={classes.appContainer}>
      <ServersSideBar setaddServerModalToggle={setaddServerModalToggle} />
      <FriendsListSideBar />
      {addServerModalToggle ? (
        <AddServerModal setaddServerModalToggle={setaddServerModalToggle} />
      ) : null}
      <FriendsListMain />
    </div>
  )
}
