import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FriendsListMain from '../../Components/FriendsListMain'
import FriendsListSideBar from '../../Components/FriendsListSideBar'
import ServersSideBar from '../../Components/ServersSideBar'
import AddServerModal from '../../Modals/AddServerModal'
import classes from './Channels.module.scss'

export const Channels = () => {
  const [addServerModalToggle, setaddServerModalToggle] = useState(false)

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
